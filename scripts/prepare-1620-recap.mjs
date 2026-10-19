import assert from 'node:assert/strict';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

// Uses the installed MCP release's own Resolve-shaped OTIO writer. It does not
// open Resolve, change a project, render media, or write to the camera card.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2] || 'v1';
assert.match(version, /^v[1-9]\d*$/, 'Expected an output version such as v2');
const output = join(root, 'output/1620-recap');
const edit = JSON.parse(readFileSync(join(root, 'assets/1620/recap-edit.json')));
if (edit.assembly_mode === 'native-final-conform') {
  // The locked cut includes overlapping native layers. Validate visible ranges
  // instead of flattening them or regenerating interchange without its grades.
  let end = edit.opening_card.duration_frames;
  for (const clip of edit.clips) {
    assert.equal(clip.visible_start_frame, end, `Gap or overlap before ${clip.shot_key}`);
    assert.ok(clip.visible_end_frame > clip.visible_start_frame);
    assert.ok(clip.record_start_frame <= clip.visible_start_frame);
    assert.ok(clip.record_start_frame + clip.record_duration_frames >= clip.visible_end_frame);
    assert.equal(clip.native_retime_preserved, true);
    assert.equal(clip.native_clip_grade_preserved, true);
    end = clip.visible_end_frame;
  }
  assert.equal(end, edit.end_card.start_frame);
  assert.equal(end + edit.end_card.duration_frames, edit.duration_frames);
  assert.equal(edit.music.edit_duration_frames, edit.duration_frames);
  assert.equal(edit.music.loops, false);
  const artworks = edit.clips.filter((clip) => clip.role === 'art');
  assert.equal(artworks.length, 18);
  assert.equal(new Set(artworks.map((clip) => clip.artwork_id)).size, 18);
  console.log(JSON.stringify({
    native_only: true,
    timeline: edit.native_horizontal_timeline,
    duration_frames: edit.duration_frames,
    duration_seconds: edit.duration_frames / edit.fps,
    artworks: artworks.length,
    note: 'Continue from the saved final Resolve project; preserve its native edits and color corrections.',
    outputs_written: [],
  }));
  process.exit(0);
}
if (edit.assembly_mode === 'native-preserved-prefix') {
  let end = edit.protected_prefix.frames;
  for (const clip of edit.clips) {
    assert.equal(clip.record_start_frame, end, `Gap or overlap before ${clip.shot_key}`);
    end += clip.record_duration_frames;
  }
  assert.equal(end, edit.duration_frames);
  const visible = [...(edit.protected_prefix.visible_shots || []), ...edit.clips];
  const artworks = visible.filter((clip) => clip.role === 'art');
  assert.equal(artworks.length, 18, 'Each painting close-up must appear once');
  assert.equal(new Set(artworks.map((clip) => clip.artwork_id || clip.id)).size, 18);
  const setups = visible.map((clip) => clip.setup_id || clip.shot_key);
  assert.equal(new Set(setups).size, setups.length, 'Repeated filmed setup');
  assert.equal(edit.music.loops, false);
  console.log(JSON.stringify({
    native_only: true,
    timeline: edit.native_horizontal_timeline,
    protected_prefix_frames: edit.protected_prefix.frames,
    duration_frames: end,
    duration_seconds: end / edit.fps,
    artworks: 18,
    note: 'Continue from the saved native timeline. Interchange regeneration would discard AKLO’s protected retiming, grades and stacked opening.',
    outputs_written: [],
  }));
  process.exit(0);
}
const inventory = JSON.parse(readFileSync(join(output, 'inventory-v1.json')));
const mcpRoot = process.env.MCLIV_RESOLVE_MCP_ROOT ||
  join(homedir(), '.local/share/davinci-resolve-mcp/4.13.1');
const {eventsToOTIO, otioMediaOriginAssumed} = await import(pathToFileURL(
  join(mcpRoot, 'resolve-advanced/server/author-interchange.mjs'),
).href);

const tcFrame = (tc) => {
  assert.match(tc, /^\d\d:\d\d:\d\d:\d\d$/);
  const [h, m, s, f] = tc.split(':').map(Number);
  return ((h * 60 + m) * 60 + s) * edit.fps + f;
};

function event(clip) {
  const raw = inventory.find((item) => item.name === clip.source_file);
  const source = raw ? join('/Volumes/A004', raw.name) : join(output, clip.source_file);
  assert.ok(existsSync(source), `Missing media: ${source}`);
  if (raw) {
    assert.equal(raw.fps, edit.fps);
    assert.ok(clip.source_start_frame >= 0);
    assert.ok(clip.source_start_frame + clip.source_duration_frames <= raw.frames);
  }
  if (clip.locked_frame) {
    assert.equal(clip.source_duration_frames, 1);
    assert.equal(clip.speed, 0);
  } else {
    assert.equal(clip.source_duration_frames / clip.record_duration_frames, clip.speed);
  }
  return {
    track: clip.media_type || 'V', source, fps: edit.fps,
    mediaStartTcFrame: raw ? tcFrame(raw.timecode) : 0,
    mediaDuration: raw ? raw.frames : clip.source_duration_frames,
    srcIn: clip.source_start_frame,
    recIn: clip.record_start_frame,
    recOut: clip.record_start_frame + clip.record_duration_frames,
    speed: clip.speed * 100,
  };
}

function track(clips, number, enabled = true) {
  const events = clips.map(event);
  assert.deepEqual(otioMediaOriginAssumed(events), []);
  const result = eventsToOTIO(events, {fps: edit.fps}).tracks.children[0];
  result.name = `Video ${number}`;
  result.enabled = enabled;
  return result;
}

const primary = edit.opening_alternates.find((clip) => clip.track === 1);
const body = [primary, ...edit.clips];
let end = edit.opening_card?.footage_start_frame || 0;
for (const clip of body) {
  assert.equal(clip.record_start_frame, end, `Gap or overlap before ${clip.id}`);
  end += clip.record_duration_frames;
}
assert.equal(end, edit.duration_frames);
assert.equal(edit.duration_frames, end);
const peopleCount = edit.clips.filter((clip) => clip.role === 'people').length;
if (edit.coverage.people_events !== undefined) {
  assert.equal(peopleCount, edit.coverage.people_events);
} else {
  assert.ok(peopleCount >= 18);
}
assert.equal(new Set(edit.clips.filter((clip) => clip.role === 'art').map((clip) => clip.id)).size, 18);

const document = eventsToOTIO(body.map(event), {
  fps: edit.fps, startFrame: 86400, name: `1620 RECAP 16x9 ${version}`,
});
document.metadata.MCLIV = {
  status: 'Assembly interchange; current native grades and stabilization are in the Resolve project',
  width: edit.width, height: edit.height,
  note: 'Import with importSourceClips:true. V2/V3 are entrance alternatives. Disable V5 for clean export. Interchange does not carry native grades, variable speed ramps, Fusion stabilization or portrait reframes.',
};
for (const alternate of edit.opening_alternates.filter((clip) => clip.track > 1)) {
  document.tracks.children.push(track([alternate], alternate.track, alternate.enabled));
}
document.tracks.children.push(track([{
  id: 'opening-title', source_file: edit.opening_title,
  source_start_frame: 0,
  source_duration_frames: edit.opening_card?.duration_frames || primary.record_duration_frames,
  record_start_frame: 0,
  record_duration_frames: edit.opening_card?.duration_frames || primary.record_duration_frames,
  speed: 1,
}], 4));
document.tracks.children.push(track([{
  id: 'guide', source_file: edit.guide,
  source_start_frame: 0, source_duration_frames: edit.duration_frames,
  record_start_frame: 0, record_duration_frames: edit.duration_frames, speed: 1,
}], 5));
if (edit.music) {
  const audio = track([{
    id: 'music', source_file: edit.music.source_file, media_type: 'A',
    source_start_frame: 0, source_duration_frames: edit.duration_frames,
    record_start_frame: 0, record_duration_frames: edit.duration_frames, speed: 1,
  }], 1);
  audio.name = 'Music — Tornado';
  document.tracks.children.push(audio);
}

const entrance = eventsToOTIO([event({
  ...primary, source_duration_frames: 576, record_duration_frames: 576, speed: 1,
})], {fps: edit.fps, startFrame: 86400, name: `1620 ENTRANCE TAKES ${version}`});
entrance.metadata.MCLIV = {status: 'Native-speed take comparison; Resolve import pending'};
for (const alternate of edit.opening_alternates.filter((clip) => clip.track > 1)) {
  entrance.tracks.children.push(track([{
    ...alternate, source_duration_frames: 576, record_duration_frames: 576, speed: 1,
  }], alternate.track));
}
const files = [
  [join(output, `1620-recap-${version}.otio`), document],
  [join(output, `1620-entrance-takes-${version}.otio`), entrance],
];
for (const [path] of files) assert.ok(!existsSync(path), `Preserve existing export: ${path}`);
for (const [path, content] of files) writeFileSync(path, JSON.stringify(content, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({
  duration_seconds: end / edit.fps, art_inserts: edit.clips.filter(c => c.role === 'art').length, people_inserts: edit.clips.filter(c => c.role === 'people').length,
  entrance_takes: 3, tracks: document.tracks.children.length,
  source_origins_verified: true,
  outputs: files.map(([path]) => path),
  live_import_verified: false,
}));
