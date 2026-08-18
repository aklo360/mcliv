import {existsSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const proposalRoot = resolve(projectRoot, "EVENT-GALLERIES/1620/proposal");
const input = resolve(proposalRoot, "public-flyer-v16.html");
const output = resolve(proposalRoot, "exports/1620-public-flyer-v20.png");

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

if (existsSync(output)) {
  throw new Error(`Refusing to overwrite ${output}`);
}

const {chromium} = await import(pathToFileURL(playwrightModule).href);
const browser = await chromium.launch({channel: "chrome", headless: true});

try {
  const page = await browser.newPage({
    viewport: {width: 1080, height: 1440},
    deviceScaleFactor: 1,
  });
  await page.goto(pathToFileURL(input).href, {waitUntil: "load"});
  await page.evaluate(async () => {
    await globalThis.document.fonts.ready;
  });
  await page.waitForFunction(() =>
    [...globalThis.document.images].every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );

  const checks = await page.evaluate(() => {
    const flyer = globalThis.document.querySelector(".flyer");
    const bounds = flyer?.getBoundingClientRect();
    const artists = [
      ...globalThis.document.querySelectorAll(".artist-roster li"),
    ].map((artist) => artist.textContent?.trim());

    return {
      width: bounds?.width,
      height: bounds?.height,
      artistCount: artists.length,
      artists,
      text: globalThis.document.body.innerText,
      scrollWidth: flyer?.scrollWidth,
      scrollHeight: flyer?.scrollHeight,
      flyerBackground: globalThis.getComputedStyle(flyer).backgroundColor,
      afterPartyBackground: globalThis.getComputedStyle(
        globalThis.document.querySelector(".afterparty-strip"),
      ).backgroundColor,
      monoFontFamily: globalThis.getComputedStyle(
        globalThis.document.querySelector(".kicker"),
      ).fontFamily,
      jetBrainsAvailable: globalThis.document.fonts.check(
        '12px "JetBrains Mono"',
      ),
      venueLogoHeight: globalThis.document
        .querySelector(".venue-mark")
        ?.getBoundingClientRect().height,
      formatDetailText: globalThis.document
        .querySelector(".format-detail")
        ?.innerText.trim(),
      formatMarkWidth: globalThis.document
        .querySelector(".statement-canvas")
        ?.getBoundingClientRect().width,
      formatMarkHeight: globalThis.document
        .querySelector(".statement-canvas")
        ?.getBoundingClientRect().height,
      hasFooter: globalThis.document.querySelector(".flyer-footer") !== null,
      afterPartyLabel: globalThis.document
        .querySelector(".afterparty-strip .band-label")
        ?.textContent?.trim(),
      afterPartyLabelBounds: (() => {
        const bounds = globalThis.document
          .querySelector(".afterparty-strip .band-label")
          ?.getBoundingClientRect();
        return bounds
          ? {left: bounds.left, width: bounds.width}
          : undefined;
      })(),
      afterPartyLocationBounds: (() => {
        const bounds = globalThis.document
          .querySelector(".afterparty-location")
          ?.getBoundingClientRect();
        return bounds
          ? {left: bounds.left, width: bounds.width}
          : undefined;
      })(),
      afterPartyLockupBounds: (() => {
        const bounds = globalThis.document
          .querySelector(".afterparty-lockup")
          ?.getBoundingClientRect();
        return bounds
          ? {left: bounds.left, width: bounds.width}
          : undefined;
      })(),
      afterPartyLocationLineCount: globalThis.document
        .querySelector(".afterparty-location")
        ?.innerText.trim()
        .split("\n")
        .filter((line) => line.trim().length > 0).length,
      afterPartyTextAlign: globalThis.getComputedStyle(
        globalThis.document.querySelector(".afterparty-strip"),
      ).textAlign,
      rosterLabel: globalThis.document
        .querySelector(".roster-section .section-label")
        ?.innerText.trim(),
      locationDetail: globalThis.document
        .querySelector(".location-detail p")
        ?.innerText.trim(),
      formatBackground: globalThis.getComputedStyle(
        globalThis.document.querySelector(".format-detail"),
      ).backgroundColor,
      formatColor: globalThis.getComputedStyle(
        globalThis.document.querySelector(".format-detail"),
      ).color,
      statementBorderColor: globalThis.getComputedStyle(
        globalThis.document.querySelector(".statement-canvas"),
      ).borderTopColor,
      statementLabelColor: globalThis.getComputedStyle(
        globalThis.document.querySelector(".statement-canvas span"),
      ).color,
      finePrintSizes: [
        ".flyer-header > span",
        ".kicker",
        ".eyebrow",
        ".event-details dt",
        ".event-details p",
        ".section-label",
        ".band-label",
        ".afterparty-location p",
        ".artist-roster li span",
        ".statement-canvas span",
      ].map((selector) => ({
        selector,
        size: Number.parseFloat(
          globalThis.getComputedStyle(
            globalThis.document.querySelector(selector),
          ).fontSize,
        ),
      })),
      gridColumnCount: globalThis.getComputedStyle(
        globalThis.document.querySelector(".exhibition"),
      ).gridTemplateColumns.split(" ").length,
      rosterGridColumnCount: globalThis.getComputedStyle(
        globalThis.document.querySelector(".artist-roster"),
      ).gridTemplateColumns.split(" ").length,
      afterPartyHeight: globalThis.document
        .querySelector(".afterparty-strip")
        ?.getBoundingClientRect().height,
      afterPartyTop: globalThis.document
        .querySelector(".afterparty-strip")
        ?.getBoundingClientRect().top,
      imageHeroHeight: globalThis.document
        .querySelector(".image-hero")
        ?.getBoundingClientRect().height,
      imageHeroTop: globalThis.document
        .querySelector(".image-hero")
        ?.getBoundingClientRect().top,
      coverTitleSize: Number.parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector(".cover-caption h1"),
        ).fontSize,
      ),
      venueStudyLoaded:
        globalThis.document.querySelector(".venue-study")?.naturalWidth > 0,
      venueStudyFilter: globalThis.getComputedStyle(
        globalThis.document.querySelector(".venue-study"),
      ).filter,
    };
  });

  if (checks.width !== 1080 || checks.height !== 1440) {
    throw new Error(
      `Expected a 1080x1440 flyer, found ${checks.width}x${checks.height}`,
    );
  }
  if (checks.scrollWidth !== 1080 || checks.scrollHeight !== 1440) {
    throw new Error(
      `Flyer overflow detected: ${checks.scrollWidth}x${checks.scrollHeight}`,
    );
  }
  if (checks.artistCount !== 18 || !checks.artists.includes("12AKLO")) {
    throw new Error("Final 18-artist roster or uppercase AKLO is missing");
  }
  if (!/Shinsen/i.test(checks.text) || /Free Lyft rides/i.test(checks.text)) {
    throw new Error("After-party information is missing or the withdrawn Lyft claim remains");
  }
  if (!/ARTISTS/.test(checks.text) || /FINAL ARTIST ROSTER/i.test(checks.text)) {
    throw new Error("Public roster heading is not the approved Artists label");
  }
  if (checks.rosterLabel !== "ARTISTS") {
    throw new Error(`Roster label is ${checks.rosterLabel}`);
  }
  if (
    checks.locationDetail !==
    "PORT AUTHORITY\nSOUTH WING · MAIN FLOOR\n625 8TH AVE & W40TH ST."
  ) {
    throw new Error(`Location detail is ${checks.locationDetail}`);
  }
  if (
    checks.formatDetailText?.includes("18 artists") ||
    !checks.formatDetailText?.includes("16 × 20 IN.") ||
    checks.formatMarkWidth !== 88 ||
    checks.formatMarkHeight !== 110
  ) {
    throw new Error(
      `Format cell is incorrect: ${checks.formatDetailText}, ${checks.formatMarkWidth}x${checks.formatMarkHeight}`,
    );
  }
  if (
    checks.flyerBackground !== "rgb(10, 10, 10)" ||
    checks.afterPartyBackground !== "rgb(10, 10, 10)"
  ) {
    throw new Error("Flyer is not using the approved black-and-white palette");
  }
  if (
    !checks.jetBrainsAvailable ||
    !checks.monoFontFamily.includes("JetBrains Mono")
  ) {
    throw new Error("JetBrains Mono is unavailable or not applied");
  }
  if (checks.venueLogoHeight !== 46) {
    throw new Error(`NYC Culture Club logo height is ${checks.venueLogoHeight}px`);
  }
  if (checks.gridColumnCount !== 12 || checks.rosterGridColumnCount !== 12) {
    throw new Error(
      `Expected 12 grid columns, found ${checks.gridColumnCount} and ${checks.rosterGridColumnCount}`,
    );
  }
  if (checks.imageHeroTop !== 0 || checks.imageHeroHeight !== 480) {
    throw new Error(
      `Top image is ${checks.imageHeroHeight}px tall at y=${checks.imageHeroTop}`,
    );
  }
  if (checks.afterPartyHeight !== 136 || checks.afterPartyTop < 1200) {
    throw new Error(
      `After-party strip is ${checks.afterPartyHeight}px tall at y=${checks.afterPartyTop}`,
    );
  }
  if (checks.coverTitleSize !== 142) {
    throw new Error(
      `Cover title is ${checks.coverTitleSize}px instead of the one-sheet scale`,
    );
  }
  if (!checks.venueStudyLoaded || !checks.venueStudyFilter.includes("grayscale(1)")) {
    throw new Error("The grayscale installation study is missing");
  }
  if (/to be announced|not for release|forthcoming/i.test(checks.text)) {
    throw new Error("Draft-only language remains in the public flyer");
  }
  if (/proposed installation study/i.test(checks.text)) {
    throw new Error("Removed installation-study caption is still visible");
  }
  if (!/Group Exhibition/i.test(checks.text) || /Exhibition \/ Public Opening/i.test(checks.text)) {
    throw new Error("Flyer header does not use the approved Group Exhibition label");
  }
  if (checks.hasFooter) {
    throw new Error("Superfluous footer is still present");
  }
  if (checks.afterPartyLabel !== "After-party · 10PM") {
    throw new Error(`After-party label is ${checks.afterPartyLabel}`);
  }
  const afterPartyLockupCenter = checks.afterPartyLockupBounds
    ? checks.afterPartyLockupBounds.left + checks.afterPartyLockupBounds.width / 2
    : Number.NaN;
  if (
    checks.afterPartyTextAlign !== "left" ||
    Math.abs(afterPartyLockupCenter - 540) > 1 ||
    checks.afterPartyLocationLineCount !== 2
  ) {
    throw new Error(
      `After-party footer is incorrect: center=${afterPartyLockupCenter}, lines=${checks.afterPartyLocationLineCount}, align=${checks.afterPartyTextAlign}`,
    );
  }
  if (
    checks.formatBackground !== "rgb(10, 10, 10)" ||
    checks.formatColor !== "rgb(255, 255, 255)" ||
    checks.statementBorderColor !== "rgb(255, 255, 255)" ||
    checks.statementLabelColor !== "rgb(255, 255, 255)"
  ) {
    throw new Error("Format diagram is not white on black");
  }
  const undersizedFinePrint = checks.finePrintSizes.filter(
    ({size}) => size < 13,
  );
  if (undersizedFinePrint.length > 0) {
    throw new Error(
      `Fine print is undersized: ${JSON.stringify(undersizedFinePrint)}`,
    );
  }

  await page.locator(".flyer").screenshot({path: output});
  await page.close();
  process.stdout.write(`Wrote ${output}\n`);
} finally {
  await browser.close();
}
