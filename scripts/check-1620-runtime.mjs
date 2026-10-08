import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Exercise the production Worker with synthetic Shopify responses. No network,
// credentials, real customer carts or production data mutations are permitted.
const {artists} = JSON.parse(await readFile(new URL('../app/lib/exhibition-1620.generated.json', import.meta.url), 'utf8'));
let stock = 'unavailable';
let cartWrites = 0;
globalThis.caches = {open: async () => ({match: async () => undefined, put: async () => {}})};
globalThis.fetch = async (url, options) => {
  const target = new URL(typeof url === 'string' ? url : url.url ?? url);
  assert.equal(target.hostname, 'test-1620.myshopify.com', 'Unexpected external request');
  const body = JSON.parse(options.body);
  if (body.query.includes('ExhibitionProduct')) {
    const artist = artists.find((item) => item.productHandle === body.variables.handle);
    return Response.json({data: {product: stock === 'unavailable' ? null : {
      handle: artist.productHandle,
      variants: {nodes: [{id: 'gid://shopify/ProductVariant/1620', availableForSale: stock !== 'sold-out', currentlyNotInStock: false,
        price: {amount: stock === 'wrong-price' ? '0.01' : artist.priceAmount, currencyCode: 'USD'}}]},
    }}});
  }
  if (body.query.includes('cartCreate')) {
    cartWrites++;
    assert.deepEqual(body.variables.input.lines, [{merchandiseId: 'gid://shopify/ProductVariant/1620', quantity: 1}]);
    return Response.json({data: {cartCreate: {cart: {id: 'gid://shopify/Cart/synthetic', checkoutUrl: 'https://checkout.example.test/1620'}, userErrors: [], warnings: []}}});
  }
  if (body.query.includes('redirects')) return Response.json({data: {urlRedirects: {edges: []}}});
  throw new Error('Unexpected Shopify query in isolated exhibition check');
};
const {default: worker} = await import('../dist/server/index.js');
const env = {
  SESSION_SECRET: 'synthetic-test-session-secret-at-least-32-characters',
  PUBLIC_STORE_DOMAIN: 'test-1620.myshopify.com',
  PUBLIC_STOREFRONT_API_TOKEN: 'synthetic-test-token',
  PUBLIC_STOREFRONT_ID: 'synthetic-test-store',
  PUBLIC_CHECKOUT_DOMAIN: 'checkout.example.test',
};
const context = {waitUntil: () => {}};
const request = (path, options) => worker.fetch(new Request(`https://mcliv.example.test${path}`, options), env, context);
let response = await request('/1620');
assert.equal(response.status, 200);
const group = await response.text();
for (const artist of artists) assert.ok(group.includes(`href="/1620/${artist.slug}"`), artist.slug);
for (const artist of artists) {
  response = await request(`/1620/${artist.slug}`);
  assert.equal(response.status, 200, artist.slug);
  const html = await response.text();
  assert.ok(html.includes(artist.name), artist.slug);
  const content = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  assert.equal((content.match(/16 × 20/g) ?? []).length, 1, `${artist.slug}: dimensions appear once`);
  assert.match(html, /<button[^>]*disabled/);
}
response = await request('/1620/aclo');
assert.equal(response.status, 301);
assert.equal(response.headers.get('Location'), '/1620/aklo');
const buy = () => request('/1620/aklo', {method: 'POST', body: new URLSearchParams({intent: 'buy', price: '0.01', quantity: '99', variantId: 'untrusted-id'})});
stock = 'wrong-price';
response = await buy();
assert.equal(response.status, 409);
assert.equal(cartWrites, 0);
stock = 'sold-out';
response = await buy();
assert.equal(response.status, 409);
assert.equal(cartWrites, 0);
stock = 'available';
response = await buy();
assert.equal(response.status, 303);
assert.equal(response.headers.get('Location'), 'https://checkout.example.test/1620');
assert.ok(response.headers.get('Set-Cookie'));
assert.equal(cartWrites, 1);
process.stdout.write('Passed: production Worker renders all 19 pages; alias redirect; unavailable buttons; stale price and stock blocked; trusted one-item checkout and cart cookie. No live Shopify calls.\n');
