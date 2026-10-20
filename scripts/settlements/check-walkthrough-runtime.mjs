import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {api, env as fixtureEnv, form, dir} from './fixture.mjs';

globalThis.caches = {
  open: async () => ({match: async () => undefined, put: async () => {}}),
};
globalThis.fetch = async () => {
  throw new Error('Unexpected external request in settlement runtime check');
};
const {default: worker} = await import('../../dist/server/index.js');
const env = {
  SESSION_SECRET: 'synthetic-runtime-secret-not-used-in-production',
  PUBLIC_STORE_DOMAIN: 'test-1620.myshopify.com',
  PUBLIC_STOREFRONT_API_TOKEN: 'synthetic-test-token',
  PUBLIC_STOREFRONT_ID: 'synthetic-test-store',
  PUBLIC_CHECKOUT_DOMAIN: 'checkout.example.test',
  ARTIST_SETTLEMENTS_ENABLED: 'false',
  ARTIST_SUBMISSIONS_DB: new Proxy(
    {},
    {
      get() {
        throw new Error('Public walkthrough must not touch D1');
      },
    },
  ),
};
let cookie;
async function request(path, post, bindings = env) {
  const url = new URL(path, 'https://mcliv.example.test');
  const headers = new Headers();
  headers.set('Host', url.host);
  if (
    cookie &&
    (url.pathname === cookie.path || url.pathname.startsWith(`${cookie.path}/`))
  )
    headers.set('Cookie', cookie.value);
  if (post) {
    headers.set('Origin', url.origin);
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
  }
  const response = await worker.fetch(
    new Request(url, {
      method: post ? 'POST' : 'GET',
      headers,
      ...(post ? {body: new URLSearchParams(post)} : {}),
    }),
    bindings,
    {waitUntil: () => {}},
  );
  const setCookie = response.headers.get('Set-Cookie');
  if (setCookie)
    cookie = {
      value: setCookie.split(';')[0],
      path: setCookie.match(/; Path=([^;]+)/i)?.[1] || '/',
    };
  assert.match(response.headers.get('Cache-Control') || '', /no-store/);
  assert.match(response.headers.get('X-Robots-Tag') || '', /noindex/);
  return response;
}
const path = '/artists/settlements/preview/aklo';
let response = await request(path);
assert.equal(response.status, 200);
assert.match(await response.text(), /Congrats, your art sold/);
response = await request(`${path}.data`, {
  intent: 'exchange',
  token: 'preview',
});
assert.equal(response.status, 200);
response = await request(`${path}.data`);
assert.equal(response.status, 200);
const agreement = await response.text();
assert.match(agreement, /TEST WALKTHROUGH/);
assert.match(agreement, /Ugly Piece/);
assert.doesNotMatch(agreement, /Invitation opened/);
response = await request(`${path}.data`, {
  intent: 'sign',
  artistSigner: 'AKLO',
  documentHash: 'aklo-test-walkthrough-v1',
  consent: 'on',
  destinationComplete: 'on',
});
assert.equal(response.status, 200);
response = await request(`${path}.data`);
assert.match(await response.text(), /signedAt/);
response = await request(`${path}/agreement.pdf`);
assert.equal(response.status, 200);
assert.equal(response.headers.get('Content-Type'), 'application/pdf');
writeFileSync(
  join(dir, 'aklo-test-walkthrough.pdf'),
  new Uint8Array(await response.arrayBuffer()),
);

// Regression: a real invite's cookie must reach React Router's .data request.
cookie = undefined;
const privateEnv = {...env, ...fixtureEnv};
const id = await api.createAgreement(fixtureEnv, form, 'operator@example.com');
const invite = await api.issueInvite(
  fixtureEnv,
  id,
  'operator@example.com',
  'https://mcliv.example.test',
);
const token = new URLSearchParams(new URL(invite.link).hash.slice(1)).get(
  'invite',
);
const privatePath = `/artists/settlements/${id}`;
response = await request(
  `${privatePath}.data`,
  {intent: 'exchange', token},
  privateEnv,
);
assert.equal(response.status, 200);
response = await request(`${privatePath}.data`, undefined, privateEnv);
assert.equal(response.status, 200);
const privateData = await response.text();
assert.match(privateData, /documentHash/);
assert.match(privateData, /Example Artist/);
response = await request(
  '/artists/settlements/wrong-artist.data',
  undefined,
  privateEnv,
);
assert.doesNotMatch(await response.text(), /Example Artist/);
process.stdout.write(
  `Passed: AKLO start, agreement, test signature and PDF; no D1/network writes in public walkthrough; private invitation .data cookie regression and cross-artist isolation.\nTest PDF: ${join(dir, 'aklo-test-walkthrough.pdf')}\n`,
);
