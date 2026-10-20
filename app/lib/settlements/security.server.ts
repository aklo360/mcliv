import {createRemoteJWKSet, jwtVerify} from 'jose';

export const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};
export function privatePath(path: string) {
  return /^\/(artists|admin)\/settlements(?:[/.]|$)/.test(path);
}
export function db(env: Env) {
  if (env.ARTIST_SETTLEMENTS_ENABLED !== 'true' || !env.ARTIST_SUBMISSIONS_DB)
    throw new Response(
      'Artist payments are not available yet. Contact info@mcliv.studio for help.',
      {status: 503, headers: PRIVATE_HEADERS},
    );
  return env.ARTIST_SUBMISSIONS_DB;
}
export function sameOrigin(request: Request) {
  if (request.headers.get('Origin') !== new URL(request.url).origin)
    throw new Response('Request rejected.', {status: 403});
  if (
    !request.headers
      .get('Content-Type')
      ?.startsWith('application/x-www-form-urlencoded')
  )
    throw new Response('Unsupported request.', {status: 415});
}
export async function readForm(request: Request) {
  sameOrigin(request);
  const raw = await request.text();
  if (raw.length > 65000)
    throw new Response('Form is too large.', {status: 413});
  return new URLSearchParams(raw);
}
export async function sha256(value: string | Uint8Array) {
  const bytes =
    typeof value === 'string' ? new TextEncoder().encode(value) : value;
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new Uint8Array(bytes).buffer),
    ),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
export function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function requireAdmin(request: Request, env: Env) {
  const issuer = env.SETTLEMENT_ACCESS_ISSUER;
  const audience = env.SETTLEMENT_ACCESS_AUDIENCE;
  const allowed = env.SETTLEMENT_ADMIN_EMAILS?.split(',').map((s) =>
    s.trim().toLowerCase(),
  );
  if (
    !issuer ||
    !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer) ||
    !audience ||
    !allowed?.length
  )
    throw new Response('Admin access is not configured.', {status: 503});
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token)
    throw new Response('Sign in through MCLIV admin access.', {status: 401});
  try {
    if (!keySets.has(issuer))
      keySets.set(
        issuer,
        createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`)),
      );
    const {payload} = await jwtVerify(token, keySets.get(issuer)!, {
      issuer,
      audience,
      algorithms: ['RS256'],
      requiredClaims: ['exp', 'iat', 'sub', 'email'],
    });
    if (
      typeof payload.email !== 'string' ||
      !allowed.includes(payload.email.toLowerCase())
    )
      throw new Error('Denied');
    return payload.email.toLowerCase();
  } catch {
    throw new Response('Admin access denied.', {status: 403});
  }
}
export function approvedPayoutUrl(url: string, env: Env) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Use a valid hosted payout URL.');
  }
  const hosts =
    env.SETTLEMENT_PAYOUT_HOSTS?.split(',').map((s) => s.trim()) || [];
  if (
    parsed.protocol !== 'https:' ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    !hosts.includes(parsed.hostname)
  )
    throw new Error('The payout link must use an approved provider host.');
  return parsed.href;
}
export async function artistSession(request: Request, env: Env, id: string) {
  const token = request.headers
    .get('Cookie')
    ?.split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`__Secure-mcliv-settlement-${id}=`))
    ?.split('=')[1];
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return db(env)
    .prepare(
      `SELECT i.revision FROM settlement_invites i JOIN settlements s ON s.id=i.settlementId AND s.revision=i.revision WHERE i.sessionHash=? AND i.settlementId=? AND i.consumed=1 AND i.revoked=0 AND i.sessionExpiresAt>?`,
    )
    .bind(await sha256(token), id, new Date().toISOString())
    .first<{revision: number}>();
}
export async function exchangeInvite(
  request: Request,
  env: Env,
  id: string,
  token: string,
) {
  if (!/^[a-f0-9]{64}$/.test(token))
    throw new Error(
      'This invitation is invalid or expired. Contact MCLIV for a new link.',
    );
  const session = randomToken();
  const row = await db(env)
    .prepare(
      `UPDATE settlement_invites SET consumed=1, sessionHash=?, sessionExpiresAt=? WHERE tokenHash=? AND settlementId=? AND consumed=0 AND revoked=0 AND expiresAt>? AND revision=(SELECT revision FROM settlements WHERE id=?) RETURNING revision`,
    )
    .bind(
      await sha256(session),
      new Date(Date.now() + 7 * 86400000).toISOString(),
      await sha256(token),
      id,
      new Date().toISOString(),
      id,
    )
    .first();
  if (!row)
    throw new Error(
      'This invitation is invalid, already opened, or expired. Contact MCLIV for a new link.',
    );
  // React Router also requests /:id.data. A Path ending at /:id excludes
  // that URL. Keep record isolation in the cookie name and database lookup.
  return `__Secure-mcliv-settlement-${id}=${session}; HttpOnly; Secure; SameSite=Strict; Path=/artists/settlements; Max-Age=604800`;
}
