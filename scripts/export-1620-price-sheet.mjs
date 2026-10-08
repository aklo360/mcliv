import {existsSync} from 'node:fs';
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

// Two-sided US Letter catalogue and price list for the 1620 exhibition.
// Usage: node scripts/export-1620-price-sheet.mjs v1
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2];
if (!/^v\d+$/.test(version ?? '')) throw new Error('Usage: node scripts/export-1620-price-sheet.mjs v1');
const html = resolve(root, `output/1620-price-sheet-${version}.html`);
const scratch = await mkdtemp(join(tmpdir(), 'mcliv-price-sheet-'));
const draft = join(scratch, 'price-sheet.html');
const pdf = resolve(root, `output/1620-price-sheet-${version}.pdf`);
for (const path of [html, pdf]) if (existsSync(path)) throw new Error(`Refusing to overwrite ${path}`);

const {event, artists} = JSON.parse(await readFile(resolve(root, 'app/lib/exhibition-1620.generated.json'), 'utf8'));
if (artists.length !== 18) throw new Error('Expected 18 artists');
const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const price = (artist) => artist.priceAmount
  ? new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: Number(artist.priceAmount) % 1 ? 2 : 0}).format(Number(artist.priceAmount))
  : 'Inquire within';
const work = (artist) => `
  <li class="work">
    <figure class="art">${artist.image
      ? `<img src="../public${artist.image}" alt="${escape(artist.artworkName)} by ${escape(artist.name)}" />`
      : `<div class="pending"><span>Image to come</span></div>`}</figure>
    <div class="caption">
      <span class="index">${String(artist.number).padStart(2, '0')}</span>
      <h3>${escape(artist.name)}</h3>
      <p class="title">${escape(artist.artworkName)}</p>
      <p class="media">${escape(artist.materialMedia)}</p>
      <p class="price">${escape(price(artist))}</p>
    </div>
  </li>`;
const page = (works, index, total, head) => `
  <section class="page" aria-label="Catalogue page ${index}">
    ${head}
    <ol class="grid">${works.map(work).join('')}</ol>
    <footer class="foot">
      <span>${escape(event.workFormat)} · Prices in USD</span>
      <span>mcliv.studio/1620 · info@mcliv.studio</span>
      <span class="folio">${String(index).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
    </footer>
  </section>`;
const front = `
    <header class="masthead">
      <img class="mark" src="../public/icons/logo.svg" alt="MCLIV" />
      <span class="label">Group Exhibition · Catalogue &amp; Price List</span>
      <span class="label">${escape(event.venueDetail)}</span>
    </header>
    <div class="lede">
      <h1>${escape(event.title)}</h1>
      <div class="lede-copy">
        <p class="subtitle">${escape(event.subtitle)}</p>
        <p class="label">${escape(event.date)} · ${escape(event.time)} · ${escape(event.venueAddress)} · ${escape(event.venueFloor)}</p>
      </div>
    </div>`;
const back = `
    <header class="masthead running">
      <img class="mark" src="../public/icons/logo.svg" alt="MCLIV" />
      <span class="label">${escape(event.title)} · Group Exhibition · Catalogue &amp; Price List</span>
      <span class="label">${escape(event.date)} · ${escape(event.time)}</span>
    </header>`;
const document = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>1620 · Catalogue &amp; Price List · MCLIV</title>
<style>
  @page { size: Letter; margin: 0; }
  :root { --ink: #0a0a0a; --paper: #ffffff; --graphite: #3a3a3a; --hairline: rgba(10, 10, 10, 0.24); }
  * { box-sizing: border-box; margin: 0; }
  html, body { background: var(--paper); color: var(--ink); font-family: 'Helvetica Neue', Inter, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { width: 8.5in; height: 11in; padding: 0.5in 0.5in 0.42in; display: grid; grid-template-rows: auto auto 1fr auto; page-break-after: always; break-after: page; overflow: hidden; }
  .page:last-child { page-break-after: auto; break-after: auto; }
  .label, .index, .price, .foot { font-family: 'JetBrains Mono', 'JetBrainsMono Nerd Font', 'JetBrainsMono NF', 'Helvetica Neue', Helvetica, Arial, monospace; font-size: 7.5pt; letter-spacing: 0.08em; text-transform: uppercase; color: var(--graphite); }
  .masthead { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; column-gap: 0.25in; padding-bottom: 0.14in; border-bottom: 1px solid var(--ink); }
  .masthead .label:last-child { text-align: right; }
  .mark { height: 0.2in; width: auto; display: block; }
  .running { padding-bottom: 0.1in; }
  .lede { display: grid; grid-template-columns: auto 1fr; align-items: end; column-gap: 0.4in; padding: 0.16in 0 0.15in; border-bottom: 1px solid var(--hairline); }
  h1 { font-size: 40pt; font-weight: 500; letter-spacing: -0.03em; line-height: 0.9; }
  .subtitle { font-size: 11pt; font-weight: 500; letter-spacing: -0.01em; margin-bottom: 0.06in; }
  .running + .grid { padding-top: 0.24in; }
  .grid { list-style: none; padding: 0.16in 0 0; display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: auto; column-gap: 0.28in; row-gap: 0.12in; align-content: start; min-height: 0; }
  .work { display: grid; grid-template-rows: 1.8in auto; row-gap: 0.08in; min-height: 0; }
  .art { height: 1.8in; width: 100%; display: flex; align-items: flex-end; justify-content: flex-start; overflow: hidden; }
  .art img { height: 1.8in; width: auto; max-width: 100%; object-fit: contain; display: block; }
  .pending { width: 1.44in; height: 100%; border: 1px solid var(--hairline); display: grid; place-items: center; }
  .pending span { font-family: 'JetBrains Mono', 'JetBrainsMono Nerd Font', 'Helvetica Neue', monospace; font-size: 7pt; letter-spacing: 0.08em; text-transform: uppercase; color: var(--graphite); }
  .caption { display: grid; grid-template-columns: auto 1fr; column-gap: 0.1in; align-content: start; border-top: 1px solid var(--hairline); padding-top: 0.07in; }
  .caption .index { grid-row: 1 / span 4; padding-top: 0.02in; }
  .caption h3 { font-size: 9.5pt; font-weight: 500; letter-spacing: -0.01em; line-height: 1.2; }
  .caption .title { font-size: 8.5pt; color: var(--ink); line-height: 1.25; }
  .caption .media { font-size: 7.5pt; color: var(--graphite); line-height: 1.3; margin-top: 0.02in; }
  .caption .price { margin-top: 0.05in; color: var(--ink); }
  .foot { display: grid; grid-template-columns: 1fr auto 1fr; column-gap: 0.25in; padding-top: 0.12in; border-top: 1px solid var(--ink); align-self: end; }
  .foot .folio { text-align: right; }
</style>
</head>
<body>
${page(artists.slice(0, 9), 1, 2, front)}
${page(artists.slice(9), 2, 2, back)}
</body>
</html>
`;
await mkdir(dirname(html), {recursive: true});
// Print-sized copies (1200 px tall, ~650 dpi at the printed size) keep the PDF small; the page HTML keeps the full exports.
const printable = join(scratch, 'images'); await mkdir(printable);
let draftDocument = document.replaceAll('src="../public/icons/', `src="${pathToFileURL(root).href}/public/icons/`);
for (const artist of artists) {
  if (!artist.image) continue;
  const copy = join(printable, artist.image.split('/').pop());
  execFileSync('magick', [resolve(root, 'public', artist.image.slice(1)), '-resize', 'x1200', '-quality', '90', copy], {timeout: 60000});
  draftDocument = draftDocument.replaceAll(`src="../public${artist.image}"`, `src="${pathToFileURL(copy).href}"`);
}
await writeFile(draft, draftDocument, {flag: 'wx'});

const candidates = [process.env.PLAYWRIGHT_TEST_MODULE, process.env.NVM_BIN ? resolve(process.env.NVM_BIN, '../lib/node_modules/@playwright/test/index.mjs') : undefined,
  resolve(process.env.HOME ?? '', '.nvm/versions/node/v22.17.1/lib/node_modules/@playwright/test/index.mjs')].filter(Boolean);
const playwrightModule = candidates.find((candidate) => existsSync(candidate));
if (!playwrightModule) throw new Error('Playwright is unavailable. Set PLAYWRIGHT_TEST_MODULE to @playwright/test/index.mjs.');
const {chromium} = await import(pathToFileURL(playwrightModule).href);
const browser = await chromium.launch({channel: 'chrome', headless: true});
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(draft).href, {waitUntil: 'load'});
  await page.evaluate(async () => { await globalThis.document.fonts.ready; });
  await page.waitForFunction(() => [...globalThis.document.images].every((image) => image.complete && image.naturalWidth > 0));
  const checks = await page.evaluate(() => ({
    pages: globalThis.document.querySelectorAll('.page').length,
    works: globalThis.document.querySelectorAll('.work').length,
    images: globalThis.document.querySelectorAll('.art img').length,
    overflow: [...globalThis.document.querySelectorAll('.page')].map((p) => p.scrollHeight - p.clientHeight),
    overlaps: [...globalThis.document.querySelectorAll('.work')].filter((w) => w.querySelector('.art').getBoundingClientRect().bottom > w.querySelector('.caption').getBoundingClientRect().top + 0.5).length,
    beyondFooter: [...globalThis.document.querySelectorAll('.page')].filter((p) => [...p.querySelectorAll('.work')].some((w) => w.getBoundingClientRect().bottom > p.querySelector('.foot').getBoundingClientRect().top + 0.5)).length,
  }));
  if (checks.pages !== 2 || checks.works !== 18) throw new Error(`Unexpected layout: ${JSON.stringify(checks)}`);
  if (checks.overflow.some((value) => value > 0) || checks.overlaps || checks.beyondFooter) throw new Error(`Page content overflows: ${JSON.stringify(checks)}`);
  await page.pdf({path: pdf, printBackground: true, preferCSSPageSize: true, tagged: true});
  await writeFile(html, document, {flag: 'wx'});
  process.stdout.write(`Wrote ${pdf} (${checks.works} works, ${checks.images} images, 2 pages)\n`);
} finally {
  await browser.close();
  await rm(scratch, {recursive: true, force: true});
}
