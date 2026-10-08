import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const {artists} = JSON.parse(await readFile(resolve(root, 'app/lib/exhibition-1620.generated.json'), 'utf8'));
assert.equal(artists.length, 18);
assert.equal(new Set(artists.map((artist) => artist.slug)).size, 18);
assert.equal(artists.filter((artist) => artist.priceAmount !== null).length, 18);
assert.equal(artists.find((artist) => artist.slug === 'trouble-andrew').priceAmount, '6000.00');
assert.equal(artists.find((artist) => artist.slug === 'hoxxoh').priceAmount, '1200.00');
assert.equal(artists.find((artist) => artist.slug === 'smurfo').priceAmount, '2000.00');
assert.equal(artists.find((artist) => artist.slug === 'gazoo').priceAmount, '1620.00');
assert.equal(artists.find((artist) => artist.slug === 'aklo').priceAmount, '1111.00');
assert.equal(artists.find((artist) => artist.slug === 'madsteez').priceAmount, '4444.44');
assert.equal(artists.find((artist) => artist.slug === 'john-black').artworkName, 'Nexus');
assert.equal(artists.find((artist) => artist.slug === 'john-black').priceAmount, '1500.00');
assert.equal(artists.find((artist) => artist.slug === 'king-saladeen').priceAmount, '8500.00');
for (const artist of artists) {
  assert.doesNotMatch(JSON.stringify(artist), /file:\/\/|\/Users\/|\/var\/mobile/);
  if (artist.image) await access(resolve(root, 'public', artist.image.slice(1)));
}

const helper = await readFile(resolve(root, 'app/lib/exhibition-commerce.server.ts'), 'utf8');
const compiled = ts.transpileModule(helper, {compilerOptions: {module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022}}).outputText;
const {getExhibitionOffer} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const artwork = artists.find((artist) => artist.slug === 'aklo');
const variant = {id: 'gid://shopify/ProductVariant/test', availableForSale: true, currentlyNotInStock: false, price: {amount: '1111.0', currencyCode: 'USD'}};
const product = {handle: artwork.productHandle, variants: {nodes: [variant]}};
assert.equal(getExhibitionOffer(artwork, product).variantId, variant.id);
assert.equal(getExhibitionOffer({...artwork, priceAmount: null}, product).status, 'pending');
assert.equal(getExhibitionOffer({...artwork, priceAmount: '0.00'}, product).status, 'pending');
assert.equal(getExhibitionOffer(artwork, null).status, 'unavailable');
assert.equal(getExhibitionOffer(artwork, undefined).status, 'unavailable');
assert.equal(getExhibitionOffer(artwork, {...product, handle: 'wrong-work'}).status, 'unavailable');
assert.equal(getExhibitionOffer(artwork, {...product, variants: {nodes: []}}).status, 'unavailable');
assert.equal(getExhibitionOffer(artwork, {...product, variants: {nodes: [variant, variant]}}).status, 'unavailable');
for (const changed of [
  {...variant, price: {amount: '888.00', currencyCode: 'USD'}},
  {...variant, price: {amount: '1111.00', currencyCode: 'EUR'}},
]) assert.equal(getExhibitionOffer(artwork, {...product, variants: {nodes: [changed]}}).status, 'unavailable');
for (const changed of [{...variant, availableForSale: false}, {...variant, currentlyNotInStock: true}]) {
  assert.equal(getExhibitionOffer(artwork, {...product, variants: {nodes: [changed]}}).status, 'sold-out');
}
process.stdout.write(`Passed: 18 artists, reviewed submissions, ${artists.filter((artist) => artist.image).length} images, price/currency/identity/stock purchase guards.\n`);
