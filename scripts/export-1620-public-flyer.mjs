import {existsSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const proposalRoot = resolve(projectRoot, "assets/1620/proposal");
const input = resolve(proposalRoot, "public-flyer-v16.html");
const output = resolve(proposalRoot, "exports/1620-public-flyer-v20.png");
const finalFlag = process.argv.indexOf("--final");
const finalVersion = finalFlag < 0 ? null : process.argv[finalFlag + 1];
if (finalFlag >= 0 && !/^[1-9]\d*$/.test(finalVersion ?? "")) {
  throw new Error("Usage: node scripts/export-1620-public-flyer.mjs --final <version>");
}
const finalFormats = [
  {name: "square", width: 1080, height: 1080},
  {name: "portrait", width: 1080, height: 1920},
];
const finalOutput = (format, extension) =>
  resolve(proposalRoot, `exports/1620-final-flyer-${format}-v${finalVersion}.${extension}`);

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

const plannedOutputs = finalVersion
  ? finalFormats.flatMap(({name}) => [finalOutput(name, "png"), finalOutput(name, "jpg")])
  : [output];
for (const path of plannedOutputs) {
  if (existsSync(path)) throw new Error(`Refusing to overwrite ${path}`);
}

const {chromium} = await import(pathToFileURL(playwrightModule).href);
const browser = await chromium.launch({channel: "chrome", headless: true});

try {
  if (finalVersion) await exportFinalFlyers(browser);
  else await exportPublicFlyer(browser);
} finally {
  await browser.close();
}

async function exportPublicFlyer(browser) {
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
}

async function exportFinalFlyers(browser) {
  const source = resolve(proposalRoot, "public-flyer-final-v3.html");
  const reference = await browser.newPage({viewport: {width: 1080, height: 1440}});
  await reference.goto(pathToFileURL(input).href, {waitUntil: "load"});
  const referenceStyles = await reference.evaluate(campaignStyles);
  await reference.close();
  for (const format of finalFormats) {
    const page = await browser.newPage({
      viewport: {width: format.width, height: format.height},
      deviceScaleFactor: 1,
    });
    page.setDefaultTimeout(15_000);
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    // Export only local source files; no tracking or external font requests.
    await page.route(/^https?:\/\//, (route) => route.abort());
    try {
      await page.goto(pathToFileURL(source).href, {waitUntil: "load"});
      await page.evaluate(() => globalThis.document.fonts.ready);
      await page.waitForFunction(() => document.documentElement.dataset.finalFlyerReady === "true");
      await page.waitForFunction(() =>
        [...globalThis.document.images].every((image) => image.complete && image.naturalWidth > 0),
      );
      const checks = await page.evaluate(() => {
        const flyer = document.querySelector(".flyer");
        const bounds = flyer.getBoundingClientRect();
        const text = document.body.innerText.replace(/\s+/g, " ").trim();
        const rect = (selector) => {
          const box = document.querySelector(selector).getBoundingClientRect();
          return {top: box.top, bottom: box.bottom, left: box.left, right: box.right};
        };
        const overflow = [...flyer.querySelectorAll("*")].filter((node) => {
          const box = node.getBoundingClientRect();
          return box.width > 0 && (box.left < 57 || box.right > 1017 || box.top < 0 || box.bottom > bounds.bottom);
        }).map((node) => node.className || node.tagName);
        return {
          width: bounds.width,
          height: bounds.height,
          scrollWidth: flyer.scrollWidth,
          scrollHeight: flyer.scrollHeight,
          text,
          title: document.querySelector("h1").textContent,
          afterPartyTime: document.querySelector('[data-event="afterPartyTime"]').textContent,
          openingTime: document.querySelector('.date-time .time').textContent,
          emptyFields: [...document.querySelectorAll("[data-event]")].filter((node) => !node.textContent.trim()).length,
          overflow,
          header: rect(".flyer-header"),
          titleBounds: rect("h1"),
          titleGroup: rect(".cover-caption"),
          titleSize: getComputedStyle(document.querySelector("h1")).fontSize,
          dateSize: getComputedStyle(document.querySelector(".opening-time h2")).fontSize,
          dateTimeInkHeights: [".date-time h2", ".date-time .time"].map((selector) => {
            const node = document.querySelector(selector);
            const style = getComputedStyle(node);
            const context = document.createElement("canvas").getContext("2d");
            context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const metrics = context.measureText(node.textContent.trim());
            return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
          }),
          exhibitionLabel: rect(".exhibition-category"),
          exhibitionLabelCount: document.querySelectorAll(".exhibition-category").length,
          exhibitionLabelText: document.querySelector(".exhibition-category").textContent.trim(),
          headerHasCategory: /Group Exhibition/i.test(document.querySelector(".flyer-header").textContent),
          when: rect(".opening-time"),
          date: rect(".date-time h2"),
          time: rect(".date-time .time"),
          location: rect(".opening-location"),
          venueHeading: rect(".venue-heading"),
          address: rect(".event-address"),
          footer: rect(".afterparty-strip"),
          lockup: rect(".afterparty-lockup"),
          afterPartyLabel: rect(".band-label"),
          afterPartyLocation: rect(".afterparty-location"),
          hasExtraFooter: Boolean(document.querySelector("footer, .flyer-footer")),
          gridColumns: getComputedStyle(flyer).gridTemplateColumns.split(" ").length,
          margin: getComputedStyle(flyer).paddingLeft,
          gutter: getComputedStyle(flyer).columnGap,
          contentTextAlign: getComputedStyle(document.querySelector(".flyer-content")).textAlign,
          categoryTransform: getComputedStyle(document.querySelector(".exhibition-category")).textTransform,
          transformedType: [...document.querySelectorAll("h1, h2, h3, p, span")].some((node) => {
            for (let parent = node; parent; parent = parent.parentElement) {
              const style = getComputedStyle(parent);
              if (style.transform !== "none" || !["1", "normal"].includes(style.zoom)) return true;
            }
            return false;
          }),
          monoAvailable: document.fonts.check('20px "JetBrains Mono"'),
          background: getComputedStyle(flyer).backgroundColor,
          fieldLines: [...document.querySelectorAll("[data-event]")].map((node) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            return {field: node.dataset.event, lines: range.getClientRects().length};
          }),
        };
      });
      const renderedStyles = await page.evaluate(campaignStyles);
      for (const selector of Object.keys(referenceStyles)) {
        for (const [property, value] of Object.entries(referenceStyles[selector])) {
          // AKLO requested a new title scale and spacing for the reminder.
          const resizedTitle = selector === ".cover-caption h1" && ["fontSize", "lineHeight", "letterSpacing"].includes(property);
          if (resizedTitle) continue;
          if (renderedStyles[selector][property] !== value) {
            throw new Error(`Brand mismatch: ${selector} ${property}: ${renderedStyles[selector][property]} instead of ${value}`);
          }
        }
      }
      const stacks = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return {sans: style.getPropertyValue("--sans").trim(), mono: style.getPropertyValue("--mono").trim()};
      });
      if (stacks.sans !== '"Helvetica Neue", "Inter", Helvetica, Arial, sans-serif' || stacks.mono !== '"JetBrains Mono", "Helvetica Neue", Helvetica, Arial, sans-serif') {
        throw new Error("Font stacks differ from BRAND.md");
      }
      if (pageErrors.length) throw new Error(`Flyer script failed: ${pageErrors.join("; ")}`);
      if (checks.width !== format.width || checks.height !== format.height || checks.scrollWidth !== format.width || checks.scrollHeight !== format.height) {
        throw new Error(`Incorrect ${format.name} dimensions: ${JSON.stringify(checks)}`);
      }
      if (checks.overflow.length || checks.emptyFields || checks.fieldLines.some(({lines}) => lines !== 1)) {
        throw new Error(`Flyer clipping, wrapping, or missing copy: ${JSON.stringify(checks)}`);
      }
      if (checks.title !== "1620" || checks.openingTime !== "6PM" || checks.afterPartyTime !== "9PM" || /10PM|Lyft|to be announced/i.test(checks.text)) {
        throw new Error("The final flyer contains incorrect title, time, or withdrawn copy");
      }
      for (const required of ["SEP 16", "6PM", "FREE + OPEN TO THE PUBLIC", "NYC Culture Club", "PORT AUTHORITY", "SOUTH WING · MAIN FLOOR", "625 8TH AVE & W40TH ST.", "Shinsen", "44 BOWERY · NEW YORK, NY 10013"]) {
        if (!checks.text.includes(required)) throw new Error(`Missing final-flyer detail: ${required}`);
      }
      if (checks.headerHasCategory || checks.exhibitionLabelCount !== 1 || checks.exhibitionLabelText !== "Group Exhibition" || checks.categoryTransform !== "uppercase" || Math.abs(checks.exhibitionLabel.top - checks.titleBounds.bottom - 24) > 1) {
        throw new Error("The exhibition category must appear once beneath 1620");
      }
      const expectedTitleSize = format.name === "square" ? "192px" : "228px";
      const expectedDateSize = format.name === "square" ? "92px" : "112px";
      if (checks.titleSize !== expectedTitleSize || checks.dateSize !== expectedDateSize) throw new Error("The title must remain the dominant element");
      if (Math.abs(checks.dateTimeInkHeights[0] - checks.dateTimeInkHeights[1]) > 0.1) {
        throw new Error("The time must match the date's visible letter height");
      }
      if (checks.time.left - checks.date.right < 31 || checks.time.top >= checks.date.bottom || checks.date.top >= checks.time.bottom) {
        throw new Error("The date and time must share one line with a clear gap");
      }
      const clearances = [
        checks.titleGroup.top - checks.header.bottom,
        checks.when.top - checks.titleGroup.bottom,
        checks.location.top - checks.when.bottom,
        checks.footer.top - checks.location.bottom,
      ];
      const minimumClearance = format.name === "square" ? 44 : 150;
      if (clearances.some((gap) => gap < minimumClearance) || Math.max(...clearances) - Math.min(...clearances) > 1) {
        throw new Error(`Uneven or crowded information groups: ${JSON.stringify(clearances)}`);
      }
      if (checks.contentTextAlign !== "center" || [checks.titleGroup, checks.when, checks.location].some((box) => Math.abs((box.left + box.right) / 2 - 540) > 1)) {
        throw new Error("The title, opening, and venue must share the center axis");
      }
      if (!checks.monoAvailable || checks.background !== "rgb(10, 10, 10)") {
        throw new Error("The canonical font or black ground is missing");
      }
      if (checks.transformedType || checks.hasExtraFooter || checks.gridColumns !== 12 || checks.margin !== "64px" || checks.gutter !== "28px" || Math.abs((checks.lockup.left + checks.lockup.right) / 2 - 540) > 1 || Math.abs((checks.afterPartyLabel.top + checks.afterPartyLabel.bottom) / 2 - (checks.afterPartyLocation.top + checks.afterPartyLocation.bottom) / 2) > 1 || Math.abs(checks.afterPartyLocation.left - checks.afterPartyLabel.right - 48) > 1) {
        throw new Error(`The campaign grid or horizontal after-party lockup differs from the approved reference: ${JSON.stringify(checks)}`);
      }
      const client = await page.context().newCDPSession(page);
      await client.send("DOM.enable");
      await client.send("CSS.enable");
      const {root} = await client.send("DOM.getDocument");
      const fonts = {};
      for (const selector of ["h1", ".band-label", ".exhibition-category"]) {
        const {nodeId} = await client.send("DOM.querySelector", {nodeId: root.nodeId, selector});
        const result = await client.send("CSS.getPlatformFontsForNode", {nodeId});
        fonts[selector] = result.fonts.filter(({glyphCount}) => glyphCount > 0).map(({familyName}) => familyName);
      }
      await client.detach();
      if (!fonts.h1.includes("Helvetica Neue") || !fonts[".band-label"].includes("JetBrains Mono") || !fonts[".exhibition-category"].includes("JetBrains Mono")) {
        throw new Error(`A primary brand font was substituted: ${JSON.stringify(fonts)}`);
      }
      const flyer = page.locator(".flyer");
      await flyer.screenshot({path: finalOutput(format.name, "png")});
      await flyer.screenshot({path: finalOutput(format.name, "jpg"), type: "jpeg", quality: 95});
      process.stdout.write(`${format.name}: ${checks.width}x${checks.height}; reference styles, actual fonts, copy, images, and layout passed\n`);
      process.stdout.write(`${finalOutput(format.name, "png")}\n${finalOutput(format.name, "jpg")}\n`);
    } finally {
      await page.close();
    }
  }
}

function campaignStyles() {
  const properties = ["fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "color"];
  const selectors = {
    ".eyebrow": properties,
    ".band-label": properties,
    ".afterparty-location h2": properties,
    ".afterparty-location p": properties,
    ".cover-caption h1": properties,
    ".mcliv-mark": ["height", "filter"],
    ".venue-mark": ["height", "filter"],
    ".afterparty-lockup": ["display", "flexDirection", "alignItems", "justifyContent", "gap"],
    ".afterparty-strip": ["flexDirection", "textAlign", "backgroundColor"],
  };
  return Object.fromEntries(Object.entries(selectors).map(([selector, fields]) => {
    const node = document.querySelector(selector);
    const style = getComputedStyle(node);
    return [selector, Object.fromEntries(fields.map((property) => [property, style[property]]))];
  }));
}
