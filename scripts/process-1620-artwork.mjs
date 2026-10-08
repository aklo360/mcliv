import {readFile, writeFile, mkdtemp, rm, access, mkdir} from 'node:fs/promises';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(resolve(root, 'assets/1620/artwork-image-edits.json'), 'utf8'));
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
const profile = '/System/Library/ColorSync/Profiles/sRGB Profile.icc';
const run = (command, args) => execFileSync(command, args, {encoding: 'utf8', timeout: 120000, maxBuffer: 1024 * 1024});
const work = await mkdtemp(join(tmpdir(), 'mcliv-photo-'));
const receipts = [];
await mkdir(resolve(root, 'assets/1620/r2-gallery'), {recursive: true});
try {
  for (const edit of config.images.filter((item) => !only || item.slug === only)) {
    const version = edit.version ?? config.version;
    const output = resolve(root, `assets/1620/r2-gallery/${edit.slug}-corrected-v${version}.${edit.matte ? 'png' : 'jpg'}`);
    try { await access(output); process.stdout.write(`Preserved existing export: ${edit.slug}\n`); continue; } catch { /* New version only. */ }
    let source = resolve(root, edit.source);
    const decoded = join(work, 'decoded.tiff');
    const normalized = join(work, 'normalized.miff');
    if (/\.(dng|arw|heic)$/i.test(source)) {
      run('sips', ['-s', 'format', 'tiff', source, '--out', decoded]);
      source = decoded;
    }
    // Native RAW conversion retains 16-bit Display P3; convert the embedded
    // profile to sRGB before measuring neutral samples in linear-light RGB.
    run('magick', [source, '-auto-orient', '-profile', profile, '-depth', '16', normalized]);
    const [width, height] = run('magick', ['identify', '-format', '%w %h', normalized]).trim().split(' ').map(Number);
    const sx = width / edit.referenceSize[0];
    const sy = height / edit.referenceSize[1];
    let gains = [1, 1, 1];
    if (edit.neutralSample) {
      const [x, y, w, h] = edit.neutralSample;
      const sample = `${Math.round(w * sx)}x${Math.round(h * sy)}+${Math.round(x * sx)}+${Math.round(y * sy)}`;
      const means = run('magick', [normalized, '-crop', sample, '+repage', '-colorspace', 'RGB', '-format', '%[fx:mean.r] %[fx:mean.g] %[fx:mean.b]', 'info:']).trim().split(' ').map(Number);
      const neutral = means.reduce((sum, value) => sum + value, 0) / 3;
      gains = means.map((value) => neutral / value);
      if (gains.some((gain) => !Number.isFinite(gain) || gain < 0.65 || gain > 1.5)) throw new Error(`White balance needs review: ${edit.slug}`);
    }
    // Do not upscale a small supplied image. Framed works retain their outer
    // proportions; the common 4:5 format applies to unframed canvases only.
    const edgeHeight = Math.min(
      Math.hypot((edit.corners[3][0] - edit.corners[0][0]) * sx, (edit.corners[3][1] - edit.corners[0][1]) * sy),
      Math.hypot((edit.corners[2][0] - edit.corners[1][0]) * sx, (edit.corners[2][1] - edit.corners[1][1]) * sy),
    );
    const outHeight = Math.min(2400, Math.round(edgeHeight));
    const outWidth = Math.round(outHeight * edit.aspect);
    // Optional margins outside the front face (reference px), carried through the same homography.
    const perRef = (outHeight / edgeHeight) * sx;
    const pad = Object.fromEntries(['left', 'right', 'top', 'bottom'].map((side) => [side, Math.round((edit.extend?.[side] ?? 0) * perRef)]));
    const viewW = outWidth + pad.left + pad.right; const viewH = outHeight + pad.top + pad.bottom;
    const targets = [[pad.left, pad.top], [pad.left + outWidth - 1, pad.top], [pad.left + outWidth - 1, pad.top + outHeight - 1], [pad.left, pad.top + outHeight - 1]];
    const controlPoints = edit.corners.map(([x, y], index) => `${x * sx},${y * sy} ${targets[index].join(',')}`).join(' ');
    const args = [normalized, '-colorspace', 'RGB'];
    for (const [index, channel] of ['R', 'G', 'B'].entries()) args.push('-channel', channel, '-evaluate', 'Multiply', String(gains[index] * 2 ** edit.exposureEV));
    args.push('+channel', '-colorspace', 'sRGB');
    if (edit.contrast) args.push('-sigmoidal-contrast', `${edit.contrast}x50%`);
    if (edit.midtoneGamma) args.push('-gamma', String(edit.midtoneGamma));
    args.push('-filter', 'Lanczos', '-virtual-pixel', 'edge', '-define', `distort:viewport=${viewW}x${viewH}+0+0`,
      '-distort', 'Perspective', controlPoints, '+repage', '-background', 'white', '-alpha', 'remove', '-alpha', 'off', '-strip');
    if (edit.matte) {
      // Keep the front face opaque. Outside it, inside the stated zone, keep textured objects
      // (shells have hard edges and slits; the wall is flat): local contrast, closed to fill
      // shell bodies, minus large dark regions (the bead curtain, not thin slits), minus specks.
      // Result is a trimmed transparent PNG.
      const m = edit.matte; const rect = join(work, 'rect.miff');
      run('magick', [...args, rect]);
      const px = (refPx) => Math.max(1, Math.round(refPx * perRef));
      const edges = join(work, 'edges.miff'); const dark = join(work, 'dark.miff'); const shell = join(work, 'shell.miff'); const zone = join(work, 'zone.miff'); const alpha = join(work, 'alpha.miff');
      run('magick', [rect, '-colorspace', 'Gray', '-statistic', 'StandardDeviation', `${px(m.textureRadius)}x${px(m.textureRadius)}`, '-threshold', `${m.textureThreshold}%`, edges]);
      run('magick', [rect, '-fx', `lightness<=${m.darkLightness}?1:0`, '-threshold', '50%', '-morphology', 'Open', `Disk:${px(m.slitRadius)}`, dark]);
      run('magick', [edges, '-morphology', 'Close', `Disk:${px(m.closeRadius)}`, '(', dark, '-negate', ')', '-compose', 'Multiply', '-composite', '-morphology', 'Open', `Disk:${px(m.speckRadius)}`, shell]);
      const bottom = pad.top + outHeight; const left = pad.left; const right = pad.left + outWidth;
      run('magick', ['-size', `${viewW}x${viewH}`, 'xc:black', '-fill', 'white',
        '-draw', `rectangle ${left - px(m.sideReach)},${bottom - px(m.above)} ${right + px(m.sideReach)},${viewH}`,
        '-draw', `rectangle ${left - px(m.sideReach)},${bottom - px(m.sideRise)} ${left + px(m.sideReach)},${viewH}`,
        '-draw', `rectangle ${right - px(m.sideReach)},${bottom - px(m.sideRise)} ${right + px(m.sideReach)},${viewH}`, zone]);
      run('magick', [shell, zone, '-compose', 'Multiply', '-composite', '(', '-size', `${viewW}x${viewH}`, 'xc:black', '-fill', 'white', '-draw', `rectangle ${left},${pad.top} ${right - 1},${bottom - 1}`, ')', '-compose', 'Lighten', '-composite', '-blur', '0x0.7', alpha]);
      run('magick', [rect, alpha, '-alpha', 'off', '-compose', 'CopyOpacity', '-composite', '-trim', '+repage', '-profile', profile, '-define', 'png:compression-level=9', output]);
      // Web copy: lossy WebP keeps the alpha at a fraction of the PNG weight; the PNG stays the master.
      run('magick', [output, '-quality', '92', '-define', 'webp:alpha-quality=100', output.replace(/\.png$/, '.webp')]);
    } else {
      run('magick', [...args, '-profile', profile, '-sampling-factor', '4:4:4', '-quality', '94', output]);
    }
    receipts.push({slug: edit.slug, version, output: `assets/1620/r2-gallery/${edit.slug}-corrected-v${version}.${edit.matte ? 'png' : 'jpg'}`, web: edit.matte ? `assets/1620/r2-gallery/${edit.slug}-corrected-v${version}.webp` : null, width: outWidth, height: outHeight, extend: edit.extend ?? null, matte: edit.matte ?? null, neutralGains: gains, exposureEV: edit.exposureEV, contrast: edit.contrast, midtoneGamma: edit.midtoneGamma ?? 1});
    process.stdout.write(`Corrected ${edit.slug}: ${outWidth} × ${outHeight}\n`);
    await rm(decoded, {force: true});
    await rm(normalized, {force: true});
  }
  const suffix = only ? `-${only}` : '';
  const reportVersion = only ? config.images.find((edit) => edit.slug === only)?.version ?? config.version : config.version;
  const report = resolve(root, `output/1620-image-corrections-v${reportVersion}${suffix}.json`);
  if (receipts.length) await writeFile(report, JSON.stringify({method: config.method, images: receipts}, null, 2) + '\n', {flag: 'wx'});
} finally {
  if (process.env.KEEP_WORK) process.stdout.write(`Work directory kept: ${work}\n`);
  else await rm(work, {recursive: true, force: true});
}
