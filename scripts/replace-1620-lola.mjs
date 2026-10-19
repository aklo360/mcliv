import assert from 'node:assert/strict';
import {readFileSync, existsSync, writeFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {spawnSync} from 'node:child_process';

// Video corner pin: the supplied artwork photograph replaces only the glass
// opening. The original moving-image frame, wall and shadow remain underneath.
const root = resolve(import.meta.dirname, '..');
const out = join(root, 'output/1620-recap');
const version = process.argv[2];
assert.match(version || '', /^v\d+$/);
const revision = process.argv[3];
if (revision) assert.match(revision, /^r\d+$/);
const exportVersion = revision ? `${version}-${revision}` : version;
const data = JSON.parse(readFileSync(join(out, `lola-registration-${version}.json`)));
const source = join(root, `assets/1620/lola-jiblazee-recap-photo-${version}.jpg`);
const wall = join(out, `lola-wall-original-${version}.mov`);
const target = join(out, `lola-photo-on-original-wall-${exportVersion}.mov`);
assert.ok(existsSync(source) && existsSync(wall));
assert.ok(!existsSync(target), 'Never overwrite a creative export');
const perspective = (points, sense) => `perspective=${points.flatMap(([x,y],i)=>[`x${i}=${x}`,`y${i}=${y}`]).join(':')}:sense=${sense}:interpolation=cubic`;
const [tl,tr,br,bl] = data.source_inner_quad;
const [x,y,w,h] = data.rectified_patch;
const filter = `[0:v]format=rgba,${perspective([tl,tr,bl,br],'source')},scale=${w}:${h}:flags=lanczos,format=rgba,pad=3840:2160:${x}:${y}:color=black@0,${perspective(data.padded_canvas_destination_corners,'destination')}[art];[1:v][art]overlay=shortest=1:format=auto,scale=iw:ih:out_color_matrix=bt709:out_range=tv,format=yuv444p10le[out]`;
const args = ['-v','error','-nostdin','-n','-loop','1','-framerate','24','-i',source,'-i',wall,'-filter_complex',filter,'-map','[out]','-an','-frames:v','40','-r','24','-c:v','prores_ks','-profile:v','4','-pix_fmt','yuv444p10le','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-threads','2',target];
const r = spawnSync('ffmpeg',args,{encoding:'utf8'});
assert.equal(r.status,0,r.stderr);
writeFileSync(join(out, `lola-video-composite-${exportVersion}.json`),JSON.stringify({source:source.split('/').at(-1),wall:wall.split('/').at(-1),target:target.split('/').at(-1),frames:40,method:'Measured feature registration, fixed video corner pin, original frame and wall retained',filter},null,2)+'\n');
console.log(JSON.stringify({file:target,frames:40}));
