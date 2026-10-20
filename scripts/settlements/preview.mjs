import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {generateKeyPair, exportJWK, SignJWT} from 'jose';
import {api, env, form} from './fixture.mjs';

// LOCAL SYNTHETIC PREVIEW ONLY. No real identities, funds, credentials or network APIs.
const admin = 'operator@example.com';
const issuer = 'https://test-team.cloudflareaccess.com';
const {privateKey, publicKey} = await generateKeyPair('RS256', {
  extractable: true,
});
const jwk = {...(await exportJWK(publicKey)), kid: 'preview-key', alg: 'RS256'};
const makeJwt = () =>
  new SignJWT({email: admin})
    .setProtectedHeader({alg: 'RS256', kid: jwk.kid})
    .setIssuer(issuer)
    .setAudience('preview-audience')
    .setSubject('preview-admin')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);
globalThis.caches = {
  open: async () => ({match: async () => undefined, put: async () => {}}),
};
globalThis.fetch = async (url, options) => {
  const target = new URL(typeof url === 'string' ? url : (url.url ?? url));
  if (target.href === `${issuer}/cdn-cgi/access/certs`)
    return Response.json({keys: [jwk]});
  if (target.hostname === 'test-1620.myshopify.com') {
    const {query} = JSON.parse(options?.body ?? '{}');
    if (query?.includes('query Header'))
      return Response.json({
        data: {
          shop: {
            id: 'gid://shopify/Shop/test',
            name: 'MCLIV',
            primaryDomain: {url: 'https://test-1620.myshopify.com'},
          },
          menu: null,
        },
      });
    if (query?.includes('query Footer'))
      return Response.json({data: {menu: null}});
    if (query?.includes('ProductByHandle'))
      return Response.json({data: {product: null}});
    if (query?.includes('redirects'))
      return Response.json({data: {urlRedirects: {edges: []}}});
  }
  throw new Error(
    'External network calls are disabled in the synthetic preview.',
  );
};
const runtimeEnv = {
  ...env,
  SESSION_SECRET: 'synthetic-preview-session-secret-not-for-production',
  PUBLIC_STORE_DOMAIN: 'test-1620.myshopify.com',
  PUBLIC_STOREFRONT_API_TOKEN: 'synthetic-test-token',
  PUBLIC_STOREFRONT_ID: 'synthetic-test-store',
  PUBLIC_CHECKOUT_DOMAIN: 'checkout.example.test',
  SETTLEMENT_ACCESS_ISSUER: issuer,
  SETTLEMENT_ACCESS_AUDIENCE: 'preview-audience',
  SETTLEMENT_ADMIN_EMAILS: admin,
};
const {default: worker} = await import('../../dist/server/index.js');
const id = await api.createAgreement(env, form, admin);
const origin = 'http://127.0.0.1:4179';
const staticRoot = resolve('dist/client');
const mime = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, origin);
    if (url.pathname === '/preview') {
      const invite = await api.issueInvite(env, id, admin, origin);
      res.writeHead(302, {Location: invite.link, 'Cache-Control': 'no-store'});
      res.end();
      return;
    }
    if (
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/images/') ||
      url.pathname.startsWith('/fonts/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname === '/icon.svg'
    ) {
      const path = resolve(staticRoot, `.${url.pathname}`);
      if (!path.startsWith(`${staticRoot}/`)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const body = await readFile(path);
      res.writeHead(200, {
        'Content-Type': mime[extname(path)] || 'application/octet-stream',
      });
      res.end(body);
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers))
      if (typeof value === 'string') headers.set(key, value);
    if (url.pathname.startsWith('/admin/settlements'))
      headers.set('Cf-Access-Jwt-Assertion', await makeJwt());
    const request = new Request(url, {
      method: req.method,
      headers,
      ...(req.method !== 'GET' && req.method !== 'HEAD'
        ? {body: Buffer.concat(chunks)}
        : {}),
    });
    const response = await worker.fetch(request, runtimeEnv, {
      waitUntil: () => {},
    });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.writeHead(500);
    res.end('Synthetic preview error.');
  }
});
server.listen(4179, '127.0.0.1', () =>
  process.stdout.write(
    `Synthetic artist preview: ${origin}/preview\nSynthetic admin preview: ${origin}/admin/settlements\n`,
  ),
);
process.on('SIGINT', () => server.close(() => process.exit(0)));
