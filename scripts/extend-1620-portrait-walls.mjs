import assert from 'node:assert/strict';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

// Video-only wall extension. The painting and its existing shadow are retained;
// ffmpeg extends only the plain wall at the upper and lower source boundaries.
// Input coordinates are measured against the 1280x720 main review frames.
const root = resolve(import.meta.dirname, '..');
const out = join(root, 'output/1620-recap');
const version = process.argv[2];
assert.match(version || '', /^v\d+$/);
const planPath = join(out, `portrait-wall-plan-${version}.json`);
const plan = JSON.parse(readFileSync(planPath));
const source = join(out, plan.source);
assert.ok(existsSync(source));
const run = (args) => {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-nostdin', '-n', ...args], {encoding: 'utf8'});
  assert.equal(r.status, 0, r.stderr);
};
for (const shot of plan.shots) {
  const target = join(out, shot.file);
  assert.ok(!existsSync(target), `Refusing to overwrite ${shot.file}`);
  const [x, y, w, h] = shot.art_bounds;
  assert.ok(y > 10 && y + h < 716, 'Wall boundary must be outside the painting');
  const cropWidth = Math.ceil(w * 3 / .86 / 2) * 2;
  const cropX = Math.round(((x + w / 2) * 3 - cropWidth / 2) / 2) * 2;
  const height = Math.round(2160 * 1080 / cropWidth / 2) * 2;
  const top = Math.round((960 - (y + h / 2) * 3 * 1080 / cropWidth) / 2) * 2;
  const bottom = 1920 - height - top;
  assert.ok(top > 0 && bottom > 0);
  shot.crop = {x: cropX, width: cropWidth, height, top, bottom};
  const filter = `crop=${cropWidth}:2160:${cropX}:0,scale=1080:${height}:flags=lanczos,pad=1080:1920:0:${top},fillborders=top=${top}:bottom=${bottom}:mode=smear,loop=loop=-1:size=1:start=0,setpts=N/(24*TB)`;
  run(['-ss', String(shot.frame / 24), '-i', source, '-an', '-vf', filter,
    '-frames:v', String(shot.end - shot.start), '-r', '24', '-c:v', 'prores_ks',
    '-profile:v', '4', '-pix_fmt', 'yuv444p10le', '-vendor', 'apl0',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-threads', '2', target]);
  console.log(JSON.stringify({id: shot.id, file: shot.file, frames: shot.end - shot.start}));
}
writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);
