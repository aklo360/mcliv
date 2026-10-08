import {readFile} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadEnv} from 'vite';

// Explicitly create drafts only. Never publish, reset inventory, overwrite an
// existing product, change credentials, or retry an uncertain write.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];
const version = process.argv[3] ?? 'v6';
if (!['--check', '--apply'].includes(mode) || !/^v\d+$/.test(version)) {
  throw new Error('Usage: node scripts/create-1620-products.mjs --check|--apply [v6]');
}
const settings = {...loadEnv('development', root, ''), ...process.env};
const token = settings.SHOPIFY_ADMIN_TOKEN;
if (!token) throw new Error('SHOPIFY_ADMIN_TOKEN is not configured. No Shopify changes made.');
// Canonical domain and immutable shop ID verified through the live Admin API.
const domain = 'g8x5xa-r0.myshopify.com';
const shopId = 'gid://shopify/Shop/78018445562';
const endpoint = `https://${domain}/admin/api/2026-07/graphql.json`;
const products = JSON.parse(await readFile(resolve(root, `output/1620-shopify-products-${version}.json`), 'utf8'));
if (products.length !== 18 || products.some((product) => product.status !== 'DRAFT' || !product.handle.startsWith('1620-'))) {
  throw new Error('Expected 18 draft exhibition products.');
}

async function graphql(query, variables = {}) {
  let response;
  try {
    const options = {
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(30000),
      headers: {'Content-Type': 'application/json', 'X-Shopify-Access-Token': token},
      body: JSON.stringify({query, variables}),
    };
    response = await fetch(endpoint, options);
    if ([301, 302, 307, 308].includes(response.status)) {
      const next = new URL(response.headers.get('location'), endpoint);
      if (next.protocol !== 'https:' || ![domain, 'studiomcliv.myshopify.com'].includes(next.hostname) ||
        next.pathname !== new URL(endpoint).pathname || next.port || next.username || next.password || next.search) {
        throw new Error('Unexpected Shopify redirect');
      }
      response = await fetch(next, options);
    }
  } catch {
    throw new Error('Shopify request failed. Verify the store and any partial results before retrying.');
  }
  if (!response.ok) throw new Error(`Shopify returned HTTP ${response.status}. No automatic retry.`);
  const result = await response.json();
  if (result.errors?.length) throw new Error('Shopify rejected the GraphQL request. Check API permissions and schema.');
  return result.data;
}

const account = await graphql(`query ExhibitionAccount {
  shop { id name myshopifyDomain currencyCode }
  currentAppInstallation { accessScopes { handle } }
}`);
if (account.shop.id !== shopId || account.shop.myshopifyDomain !== domain || account.shop.currencyCode !== 'USD') {
  throw new Error('Store domain or currency differs from the reviewed MCLIV target. No changes made.');
}
if (!account.currentAppInstallation.accessScopes.some((scope) => scope.handle === 'write_products')) {
  throw new Error('The Shopify app needs write_products access. No changes made.');
}
process.stdout.write(`Verified ${account.shop.name} · ${domain} · USD.\n`);

const fields = `id handle title vendor status tags variants(first: 2) {
  nodes { id price inventoryPolicy inventoryItem { tracked sku } }
}`;
const pending = [];
// Complete the whole preflight before the first mutation.
for (const product of products) {
  const found = await graphql(`query ExistingExhibitionProduct($query: String!) {
    products(first: 2, query: $query) { nodes { ${fields} } }
  }`, {query: `handle:${product.handle}`});
  const existing = found.products.nodes.find((node) => node.handle === product.handle);
  if (existing) {
    const expected = product.variants[0];
    const actual = existing.variants.nodes[0];
    if (existing.vendor !== product.vendor || existing.title !== product.title || !existing.tags.includes('1620') ||
      existing.variants.nodes.length !== 1 || !actual || Number(actual.price) !== Number(expected.price ?? '0') ||
      actual.inventoryPolicy !== 'DENY' || !actual.inventoryItem.tracked || actual.inventoryItem.sku !== expected.inventoryItem.sku) {
      throw new Error(`Existing product needs review: ${product.handle}. No product overwritten.`);
    }
    process.stdout.write(`Already exists: ${product.handle}\n`);
  } else pending.push(product);
}
process.stdout.write(`${pending.length} new draft products ready; existing products will be preserved.\n`);
if (mode === '--apply') {
  for (const product of pending) {
    // No identifier is supplied: this is creation, never an upsert by handle.
    const result = await graphql(`mutation CreateExhibitionDraft($input: ProductSetInput!) {
      productSet(input: $input, synchronous: true) {
        product { ${fields} }
        userErrors { field code }
      }
    }`, {input: product});
    const created = result.productSet.product;
    if (result.productSet.userErrors.length || !created || created.handle !== product.handle || created.status !== 'DRAFT' ||
      created.variants.nodes.length !== 1 || Number(created.variants.nodes[0].price) !== Number(product.variants[0].price ?? '0')) {
      throw new Error(`Draft creation needs review: ${product.handle}. Stopped without retry.`);
    }
    process.stdout.write(`Created draft: ${created.handle} · ${created.id}\n`);
  }
  process.stdout.write('Drafts created. Product images, inventory location, shipping and sales-channel publication still require review.\n');
}
