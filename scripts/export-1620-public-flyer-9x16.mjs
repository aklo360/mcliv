import {existsSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const proposalRoot = resolve(projectRoot, 'EVENT-GALLERIES/1620/proposal');
const input = resolve(proposalRoot, 'public-flyer-9x16-v1.html');
const output = resolve(proposalRoot, 'exports/1620-public-flyer-9x16-v9.png');

const playwrightCandidates = [
  process.env.PLAYWRIGHT_TEST_MODULE,
  process.env.NVM_BIN
    ? resolve(
        process.env.NVM_BIN,
        '../lib/node_modules/@playwright/test/index.mjs',
      )
    : undefined,
].filter(Boolean);

const playwrightModule = playwrightCandidates.find((candidate) =>
  existsSync(candidate),
);

if (!playwrightModule) {
  throw new Error(
    'Playwright is unavailable. Set PLAYWRIGHT_TEST_MODULE to @playwright/test/index.mjs.',
  );
}

if (existsSync(output)) {
  throw new Error(`Refusing to overwrite ${output}`);
}

const {chromium} = await import(pathToFileURL(playwrightModule).href);
const browser = await chromium.launch({channel: 'chrome', headless: true});

try {
  const page = await browser.newPage({
    viewport: {width: 1080, height: 1920},
    deviceScaleFactor: 1,
  });
  await page.goto(pathToFileURL(input).href, {waitUntil: 'load'});
  await page.evaluate(async () => {
    await globalThis.document.fonts.ready;
  });
  await page.waitForFunction(() =>
    [...globalThis.document.images].every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );

  const checks = await page.evaluate(() => {
    const flyer = globalThis.document.querySelector('.flyer');
    const bounds = flyer?.getBoundingClientRect();
    const artists = [
      ...globalThis.document.querySelectorAll('.artist-roster li'),
    ].map((artist) => artist.textContent?.trim());
    const visibleOverflow = [...flyer.querySelectorAll('*')]
      .filter((node) => globalThis.getComputedStyle(node).display !== 'none')
      .filter((node) => {
        const nodeBounds = node.getBoundingClientRect();
        return (
          nodeBounds.left < bounds.left - 0.5 ||
          nodeBounds.top < bounds.top - 0.5 ||
          nodeBounds.right > bounds.right + 0.5 ||
          nodeBounds.bottom > bounds.bottom + 0.5
        );
      })
      .map((node) => node.className || node.tagName);

    return {
      width: bounds?.width,
      height: bounds?.height,
      scrollWidth: flyer?.scrollWidth,
      scrollHeight: flyer?.scrollHeight,
      artists,
      text: globalThis.document.body.innerText.replace(/\s+/g, ' '),
      visibleOverflow,
      heroHeight: globalThis.document
        .querySelector('.image-hero')
        ?.getBoundingClientRect().height,
      exhibitionHeight: globalThis.document
        .querySelector('.exhibition')
        ?.getBoundingClientRect().height,
      rosterHeight: globalThis.document
        .querySelector('.roster-section')
        ?.getBoundingClientRect().height,
      afterPartyHeight: globalThis.document
        .querySelector('.afterparty-strip')
        ?.getBoundingClientRect().height,
      titleSize: Number.parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector('.cover-caption h1'),
        ).fontSize,
      ),
      premiseSize: Number.parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector('.premise h2'),
        ).fontSize,
      ),
      artistSize: Number.parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector('.artist-roster li'),
        ).fontSize,
      ),
      rideSize: Number.parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector('.ride-offer'),
        ).fontSize,
      ),
      footerLabelSize: Number.parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector('.band-label'),
        ).fontSize,
      ),
      footerVenueSize: Number.parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector('.afterparty-location h2'),
        ).fontSize,
      ),
      footerAddressSize: Number.parseFloat(
        globalThis.getComputedStyle(
          globalThis.document.querySelector('.afterparty-location p'),
        ).fontSize,
      ),
      venueLogoHeight: globalThis.document
        .querySelector('.venue-mark')
        ?.getBoundingClientRect().height,
      canvasBounds: (() => {
        const canvas = globalThis.document
          .querySelector('.statement-canvas')
          ?.getBoundingClientRect();
        return canvas
          ? {width: canvas.width, height: canvas.height}
          : undefined;
      })(),
      locationDetail: globalThis.document
        .querySelector('.location-detail p')
        ?.innerText.trim(),
      locationSpanLineCounts: [
        ...globalThis.document.querySelectorAll('.location-detail p span'),
      ].map((span) => {
        const range = globalThis.document.createRange();
        range.selectNodeContents(span);
        return range.getClientRects().length;
      }),
      rideLineCount: (() => {
        return [
          ...globalThis.document.querySelectorAll('.ride-offer span'),
        ].reduce((lineCount, line) => {
          const range = globalThis.document.createRange();
          range.selectNodeContents(line);
          return lineCount + range.getClientRects().length;
        }, 0);
      })(),
      rideLines: [
        ...globalThis.document.querySelectorAll('.ride-offer span'),
      ].map((line) => line.textContent.trim()),
      footerLineCounts: (() => {
        const countLines = (selector) => {
          const range = globalThis.document.createRange();
          range.selectNodeContents(globalThis.document.querySelector(selector));
          return range.getClientRects().length;
        };
        return {
          label: countLines('.band-label'),
          address: countLines('.afterparty-location p'),
        };
      })(),
      footerClearances: (() => {
        const label = globalThis.document.querySelector('.band-label');
        const location = globalThis.document.querySelector(
          '.afterparty-location',
        );
        const address = globalThis.document.querySelector(
          '.afterparty-location p',
        );
        const ride = globalThis.document.querySelector('.ride-offer');
        const labelRange = globalThis.document.createRange();
        const addressRange = globalThis.document.createRange();
        const rideRange = globalThis.document.createRange();
        labelRange.selectNodeContents(label);
        addressRange.selectNodeContents(address);
        rideRange.selectNodeContents(ride);
        const labelBounds = label.getBoundingClientRect();
        const locationBounds = location.getBoundingClientRect();
        const rideBounds = ride.getBoundingClientRect();
        const verticalCenters = [labelBounds, locationBounds, rideBounds].map(
          (bounds) => bounds.top + bounds.height / 2,
        );
        return {
          labelToLocation:
            locationBounds.left - labelRange.getBoundingClientRect().right,
          addressToDivider:
            rideBounds.left - addressRange.getBoundingClientRect().right,
          dividerToRide:
            rideRange.getBoundingClientRect().left - rideBounds.left,
          verticalCenterDrift:
            Math.max(...verticalCenters) - Math.min(...verticalCenters),
        };
      })(),
      flyerBackground: globalThis.getComputedStyle(flyer).backgroundColor,
      imageLoaded:
        globalThis.document.querySelector('.venue-study')?.naturalWidth > 0,
    };
  });

  if (
    checks.width !== 1080 ||
    checks.height !== 1920 ||
    checks.scrollWidth !== 1080 ||
    checks.scrollHeight !== 1920
  ) {
    throw new Error(
      `Expected a contained 1080x1920 flyer, found ${checks.width}x${checks.height} with ${checks.scrollWidth}x${checks.scrollHeight} scroll bounds`,
    );
  }
  if (checks.visibleOverflow.length > 0) {
    throw new Error(
      `Visible elements overflow the flyer: ${checks.visibleOverflow.join(', ')}`,
    );
  }
  if (
    checks.heroHeight !== 640 ||
    checks.exhibitionHeight !== 360 ||
    checks.rosterHeight !== 700 ||
    checks.afterPartyHeight !== 220
  ) {
    throw new Error(
      `Section geometry is incorrect: ${checks.heroHeight}/${checks.exhibitionHeight}/${checks.rosterHeight}/${checks.afterPartyHeight}`,
    );
  }
  if (
    checks.artists.length !== 18 ||
    !checks.artists.includes('12AKLO') ||
    !checks.artists.includes('18Esteban')
  ) {
    throw new Error('The final 18-artist roster is incomplete');
  }
  if (
    !checks.text.includes('Free Lyft rides to Shinsen for all attendees') ||
    !checks.text.includes('AFTER-PARTY · 10PM') ||
    !checks.text.includes('44 BOWERY · NEW YORK, NY 10013')
  ) {
    throw new Error('The approved after-party or Lyft copy is missing');
  }
  if (
    checks.rideLineCount !== 2 ||
    checks.rideLines.join('|') !==
      'Free Lyft rides to Shinsen|for all attendees'
  ) {
    throw new Error(
      `Lyft statement must use the approved two-line lockup; found ${checks.rideLineCount} lines: ${checks.rideLines.join(' / ')}`,
    );
  }
  if (
    checks.footerLineCounts.label !== 1 ||
    checks.footerLineCounts.address !== 1
  ) {
    throw new Error(
      `Footer label and address must each render on one line: ${JSON.stringify(checks.footerLineCounts)}`,
    );
  }
  if (
    checks.footerClearances.labelToLocation < 52 ||
    checks.footerClearances.labelToLocation > 56 ||
    checks.footerClearances.addressToDivider < 55 ||
    checks.footerClearances.addressToDivider > 59 ||
    checks.footerClearances.dividerToRide < 54 ||
    checks.footerClearances.dividerToRide > 56 ||
    Math.max(
      checks.footerClearances.labelToLocation,
      checks.footerClearances.addressToDivider,
      checks.footerClearances.dividerToRide,
    ) -
      Math.min(
        checks.footerClearances.labelToLocation,
        checks.footerClearances.addressToDivider,
        checks.footerClearances.dividerToRide,
      ) >
      5 ||
    checks.footerClearances.verticalCenterDrift > 0.5
  ) {
    throw new Error(
      `Footer spacing is incorrect: ${JSON.stringify(checks.footerClearances)}`,
    );
  }
  if (
    checks.titleSize !== 190 ||
    checks.premiseSize !== 54 ||
    checks.artistSize !== 28 ||
    checks.rideSize !== 24 ||
    checks.footerLabelSize !== 14 ||
    checks.footerVenueSize !== 38 ||
    checks.footerAddressSize !== 13
  ) {
    throw new Error(
      `Type scale is incorrect: ${checks.titleSize}/${checks.premiseSize}/${checks.artistSize}/${checks.rideSize}/${checks.footerLabelSize}/${checks.footerVenueSize}/${checks.footerAddressSize}`,
    );
  }
  if (
    checks.venueLogoHeight !== 56 ||
    checks.canvasBounds?.width !== 120 ||
    checks.canvasBounds?.height !== 150
  ) {
    throw new Error('Brand or format geometry is incorrect');
  }
  if (
    checks.locationDetail !==
      'PORT AUTHORITY\nSOUTH WING · MAIN FL\n625 8TH AVE & W40TH ST.' ||
    checks.locationSpanLineCounts.some((lineCount) => lineCount !== 1)
  ) {
    throw new Error(
      `Location block wraps incorrectly: ${checks.locationDetail} / ${checks.locationSpanLineCounts.join(',')}`,
    );
  }
  if (!checks.imageLoaded || checks.flyerBackground !== 'rgb(10, 10, 10)') {
    throw new Error('The approved image or black flyer ground is missing');
  }

  await page.locator('.flyer').screenshot({path: output});
  await page.close();
  process.stdout.write(`Wrote ${output}\n`);
} finally {
  await browser.close();
}
