import {readFile, writeFile} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const {artists, event} = JSON.parse(await readFile(resolve(root, 'app/lib/exhibition-1620.generated.json'), 'utf8'));
const version = process.argv[2];
if (!/^v\d+$/.test(version ?? '')) throw new Error('Usage: node scripts/export-1620-products.mjs v1');
const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
const products = artists.map((artist) => ({
  handle: artist.productHandle,
  title: `${artist.artworkName} · ${artist.name}`,
  vendor: artist.name,
  productType: 'Original artwork',
  status: 'DRAFT',
  ...(artist.image ? {files: [{
    originalSource: new URL(artist.image, 'https://mcliv.studio').href,
    contentType: 'IMAGE',
    alt: `${artist.artworkName} by ${artist.name}`,
  }]} : {}),
  tags: ['1620', 'MCLIV Exhibition', ...(artist.missingSubmission ? ['Submission Pending'] : []), ...(artist.priceAmount ? [] : ['Price Pending'])],
  descriptionHtml: `<p>${escapeHtml(artist.materialMedia)}</p><p>${escapeHtml(event.workFormat)}</p><h2>About the artist</h2>${artist.artistBio.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`).join('')}`,
  productOptions: [{name: 'Title', values: [{name: 'Default Title'}]}],
  variants: [{
    optionValues: [{optionName: 'Title', name: 'Default Title'}],
    ...(artist.priceAmount ? {price: artist.priceAmount} : {}),
    inventoryPolicy: 'DENY',
    inventoryItem: {sku: `MCLIV-${artist.productHandle.toUpperCase()}`, tracked: true, requiresShipping: true},
  }],
}));

// Shopify creates a zero-price default for missing prices. All records
// stay DRAFT with tracked zero stock. The website also rejects missing prices.
// Inventory location, quantity, shipping and publication require separate review.
// CSV reference: https://help.shopify.com/en/manual/products/import-export/using-csv
const headers = ['Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published', 'Status', 'Option1 Name', 'Option1 Value', 'Variant SKU', 'Variant Price', 'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Requires Shipping', 'Image Src', 'Image Alt Text'];
const rows = products.map((product) => [product.handle, product.title, product.descriptionHtml, product.vendor, product.productType, product.tags.join(', '), 'FALSE', 'draft', 'Title', 'Default Title', product.variants[0].inventoryItem.sku, product.variants[0].price ?? '', 'shopify', '0', 'deny', 'manual', 'TRUE', product.files?.[0]?.originalSource ?? '', product.files?.[0]?.alt ?? '']);
const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n') + '\n';
const base = resolve(root, `output/1620-shopify-products-${version}`);
await writeFile(`${base}.json`, JSON.stringify(products, null, 2) + '\n', {flag: 'wx'});
await writeFile(`${base}.csv`, csv, {flag: 'wx'});
process.stdout.write(`Prepared ${products.length} draft products: ${artists.filter((artist) => artist.priceAmount).length} confirmed prices, ${artists.filter((artist) => !artist.priceAmount).length} pending prices.\n`);
