import {existsSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const proposalRoot = resolve(
  projectRoot,
  "EVENT-GALLERIES/1620/proposal",
);

const playwrightCandidates = [
  process.env.PLAYWRIGHT_TEST_MODULE,
  process.env.NVM_BIN
    ? resolve(
        process.env.NVM_BIN,
        "../lib/node_modules/@playwright/test/index.mjs",
      )
    : undefined,
].filter(Boolean);

const playwrightModule = playwrightCandidates.find((candidate) =>
  existsSync(candidate),
);

if (!playwrightModule) {
  throw new Error(
    "Playwright is unavailable. Set PLAYWRIGHT_TEST_MODULE to @playwright/test/index.mjs.",
  );
}

const {chromium} = await import(pathToFileURL(playwrightModule).href);

const allDocuments = [
  {
    label: "deck",
    input: resolve(proposalRoot, "deck.html"),
    output: resolve(proposalRoot, "exports/1620-website-deck-v14.pdf"),
    pageSelector: ".slide",
    expectedPages: 6,
    artistSelector: ".artist-list li",
  },
  {
    label: "one-sheet",
    input: resolve(proposalRoot, "mobile-onesheet.html"),
    output: resolve(
      proposalRoot,
      "exports/1620-mobile-onesheet-v9.pdf",
    ),
    pageSelector: ".sheet",
    expectedPages: 2,
    artistSelector: ".artist-roster li",
  },
];

const requestedLabels = new Set(process.argv.slice(2));
const documents = allDocuments.filter(
  (document) =>
    requestedLabels.size === 0 || requestedLabels.has(document.label),
);

if (documents.length === 0) {
  throw new Error("No matching document requested. Use deck or one-sheet.");
}

const browser = await chromium.launch({channel: "chrome", headless: true});

try {
  for (const document of documents) {
    if (existsSync(document.output)) {
      throw new Error(`Refusing to overwrite ${document.output}`);
    }

    const page = await browser.newPage();
    await page.goto(pathToFileURL(document.input).href, {waitUntil: "load"});
    await page.evaluate(async () => {
      await globalThis.document.fonts.ready;
    });
    await page.waitForFunction(() =>
      [...globalThis.document.images].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );

    const checks = await page.evaluate(
      ({pageSelector, artistSelector}) => ({
        pageCount: globalThis.document.querySelectorAll(pageSelector).length,
        artistCount:
          globalThis.document.querySelectorAll(artistSelector).length,
        text: globalThis.document.body.innerText,
      }),
      {
        pageSelector: document.pageSelector,
        artistSelector: document.artistSelector,
      },
    );

    if (checks.pageCount !== document.expectedPages) {
      throw new Error(
        `${document.label}: expected ${document.expectedPages} pages, found ${checks.pageCount}`,
      );
    }
    if (checks.artistCount !== 18) {
      throw new Error(
        `${document.label}: expected 18 artists, found ${checks.artistCount}`,
      );
    }
    if (/to be announced|working roster/i.test(checks.text)) {
      throw new Error(`${document.label}: stale roster language remains`);
    }

    await page.pdf({
      path: document.output,
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
    });
    await page.close();
    process.stdout.write(`Wrote ${document.output}\n`);
  }
} finally {
  await browser.close();
}
