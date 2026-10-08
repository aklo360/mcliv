import {readFile, writeFile, mkdir, access} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';

// Reviewed matches. Test records and superseded submissions are excluded.
// AKLO confirmed the otherwise unnamed $888 submission on September 14, 2026.
const submissions = {
  Madsteez: '750bad18-3b5b-4147-a07c-e8610f5d9eff',
  Hoxxoh: '807cc59c-d707-4b53-9177-4b093114b730',
  Smurfo: 'd36c2b2c-ea53-4f49-ad30-3df33d588e11',
  'Gazoo ToTheMoon': '4c996fba-d4fe-43c5-8732-06979df9a184',
  'Jerami Dean Goodwin': '068bfdd6-8837-4967-a2a0-ea6ae34e7676',
  'Cavier Coleman': '152bcf38-8d9d-4cc6-9883-7b80c55258fb',
  'Gianni Lee': '807c2ea7-257e-4d35-be15-849618a5ed9d',
  'Steph Costello': '829d897f-530d-4c95-adb8-fdbfb63aa0e3',
  'John Black': 'ad0f9548-330c-4bfc-a174-1e4c7709807c',
  'Jason Rohlf': 'f781799e-bca5-4df4-a8e0-df293d04f26a',
  'King Saladeen': '4495e1fa-e35b-4f25-a11b-18714e3b6763',
  AKLO: '51420581-deac-4d91-8bcf-c1154e9215f0',
  'Lola Jiblazee': '4d79eb6f-f194-4d75-82b5-6498cf6459e8',
  NotYourMuse: '761de563-6654-46e7-8acf-26ad7a053ed2',
  'Keya Tama': '2cce9e66-4b6e-4d38-86cb-46ad4d0a2ce6',
  'Kevin Cincotta': '9998b92d-cce7-4b13-9b26-f36f252a7b63',
  Esteban: '30cd3b7d-092f-4a4f-8d6f-c0a085c37efd',
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Gallery sources stay out of Git; upload new files to R2 mcliv-media/images/1620/ (served by server.ts).
const GALLERY = 'assets/1620/r2-gallery';
const input = process.argv[process.argv.indexOf('--submissions') + 1];
if (!process.argv.includes('--submissions') || !input) {
  throw new Error('Pass --submissions <D1 query JSON> [--download-images].');
}
const records = JSON.parse(await readFile(input, 'utf8'))[0].results;
const imageEdits = JSON.parse(await readFile(resolve(root, 'assets/1620/artwork-image-edits.json'), 'utf8'));
const biographyEdits = JSON.parse(await readFile(resolve(root, 'assets/1620/artist-bios.json'), 'utf8'));
const source = await readFile(resolve(root, 'assets/1620/proposal/content.js'), 'utf8');
const assignment = source.match(/window\.EVENT_1620\s*=\s*Object\.freeze\((\{[\s\S]*?\})\);/);
if (!assignment) throw new Error('Missing canonical exhibition details.');
const event = vm.runInNewContext(`(${assignment[1]})`, Object.create(null), {timeout: 1000});
if (event.artists.length !== 18) throw new Error('Expected exactly 18 artists.');

const pendingBio = 'Artist biography forthcoming.';
// Approved price revisions. Keep the original submission prices for provenance.
// Trouble Andrew has no submission record; AKLO set the price on September 16, 2026.
const approvedPrices = {AKLO: '1111.00', Smurfo: '2000.00', 'John Black': '1500.00', 'Trouble Andrew': '6000.00'};
const downloads = [];
const artists = event.artists.map((name, index) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const record = submissions[name] ? records.find((row) => row.id === submissions[name]) : null;
  if (submissions[name] && !record) throw new Error(`Missing selected submission: ${name}`);
  const rawPrice = record?.price.trim() ?? null;
  const normalized = approvedPrices[name] ?? rawPrice?.replace(/^\$/, '').replace(/[\s,]+/g, '');
  if (record && !/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error(`Review price for ${name}`);
  const priceAmount = normalized ? Number(normalized).toFixed(2) : null;
  if (priceAmount && Number(priceAmount) <= 0) throw new Error(`Invalid price for ${name}`);
  const hasSubmittedBio = Boolean(record && /[a-z]{2}/i.test(record.artist_bio) && !/file:\/\//i.test(record.artist_bio));
  const supplementaryBio = biographyEdits.bios[slug];
  const hasBio = hasSubmittedBio || Boolean(supplementaryBio?.text);
  let bio = (hasSubmittedBio ? record.artist_bio : supplementaryBio?.text ?? pendingBio).replace(/\r\n?/g, '\n').replace(/[\u2028\u2029]/g, '\n\n');
  for (const edit of biographyEdits.formatting[slug] ?? []) bio = bio.replace(edit.from, edit.to);
  const artistBio = bio.trim().split(/\n\s*\n/).map((paragraph) => paragraph.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n\n');
  let image = null;
  if (record?.image_key) {
    const extension = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}[record.image_content_type];
    if (!extension) throw new Error(`Unexpected image type for ${name}`);
    image = `/images/1620/${slug}-${record.id.slice(0, 8)}.${extension}`;
    downloads.push({name, key: record.image_key, path: resolve(root, GALLERY, image.slice('/images/1620/'.length))});
  }
  const imageEdit = imageEdits.images.find((edit) => edit.slug === slug);
  if (imageEdit) {
    // Matted works ship as transparent WebP (PNG master alongside); everything else as JPEG.
    const corrected = `/images/1620/${slug}-corrected-v${imageEdit.version ?? imageEdits.version}.${imageEdit.matte ? 'webp' : 'jpg'}`;
    if (existsSync(resolve(root, GALLERY, corrected.slice('/images/1620/'.length)))) image = corrected;
  }
  return {
    number: index + 1, name, slug: slug === 'gazoo-tothemoon' ? 'gazoo' : slug, productHandle: `1620-${slug}`,
    artworkName: record?.artwork_name ?? 'Untitled',
    materialMedia: record?.material_media ?? 'Details forthcoming.',
    artistBio,
    submittedPrice: rawPrice, priceAmount, currency: 'USD', image,
    missingSubmission: !record, missingBio: !hasBio,
  };
});
if (new Set(artists.map((artist) => artist.slug)).size !== 18) throw new Error('Duplicate artist URLs.');

if (process.argv.includes('--download-images')) {
  const downloadEnv = {...process.env};
  for (const name of ['CF_API_KEY', 'CF_API_EMAIL', 'CLOUDFLARE_API_KEY', 'CLOUDFLARE_EMAIL']) delete downloadEnv[name];
  for (const download of downloads) {
    await mkdir(dirname(download.path), {recursive: true});
    try { await access(download.path); continue; } catch { /* Preserve existing exports. */ }
    execFileSync('wrangler', ['r2', 'object', 'get', `mcliv-artist-submission-images/${download.key}`, '--remote', '--file', download.path], {
      cwd: root, env: downloadEnv, timeout: 60000, stdio: 'pipe',
    });
    process.stdout.write(`Retrieved artwork: ${download.name}\n`);
  }
}

const details = {...event};
delete details.artists;
await writeFile(resolve(root, 'app/lib/exhibition-1620.generated.json'), `${JSON.stringify({
  source: 'Generated by scripts/export-1620-catalog.mjs from the canonical event and reviewed submissions.',
  event: details, artists,
}, null, 2)}\n`);
process.stdout.write(`Catalogue: ${artists.length} artists, ${artists.filter((artist) => !artist.missingSubmission).length} submissions, ${artists.filter((artist) => artist.image).length} images.\n`);
