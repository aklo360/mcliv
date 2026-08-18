import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const motionRoot = path.resolve(here, "..");
const sourcePath = path.resolve(motionRoot, "../proposal/content.js");
const outputPath = path.resolve(motionRoot, "src/event-data.generated.json");
const source = await readFile(sourcePath, "utf8");
const assignment = source.match(
  /window\.EVENT_1620\s*=\s*Object\.freeze\((\{[\s\S]*?\})\);/,
);

if (!assignment) {
  throw new Error(`Could not find EVENT_1620 in ${sourcePath}`);
}

const event = vm.runInNewContext(`(${assignment[1]})`, Object.create(null), {
  filename: sourcePath,
  timeout: 1000,
});

if (!Array.isArray(event.artists) || event.artists.length !== 18) {
  throw new Error("EVENT_1620 must contain exactly 18 artists");
}

if (event.artists[11] !== "AKLO") {
  throw new Error("Artist 12 must be uppercase AKLO");
}

if (event.afterPartyTime !== "10PM") {
  throw new Error("After-party time must be 10PM");
}

await mkdir(path.dirname(outputPath), {recursive: true});
await writeFile(outputPath, `${JSON.stringify(event, null, 2)}\n`);
console.log(`Synced ${event.artists.length} artists to ${outputPath}`);
