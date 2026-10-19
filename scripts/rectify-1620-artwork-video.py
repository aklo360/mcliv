"""Square the accepted artwork inserts without changing the locked edit.

Python/OpenCV is required for measured, bounded video remapping. Canvas corners
map to exact 4:5 rectangles; nearby wall/frame pixels follow smoothly, while
the image boundary stays fixed. Processing stays in 16-bit planar YUV and does
not regenerate or recolor artwork. Gianni's moving, sculptural work is exempt.
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/1620-recap'
WORK = OUT / 'art-geometry-v19'
cv2.setNumThreads(2)


def project(points, matrix):
    return cv2.perspectiveTransform(np.float32(points)[:, None], matrix)[:, 0]


def geometry(shot, kind):
    sw, sh = shot['source_size']
    source = [[0, 0], [sw-1, 0], [sw-1, sh-1], [0, sh-1]]
    if shot['id'] == 'C043':
        source = [[74, 88], [1848, 88], [1844, 2321], [80, 2322]]
    original = project(source, np.array(shot['homography']))
    if shot['id'] == 'C060':
        original = np.float32([[1254, 215], [2684, 222], [2624, 1957], [1286, 1950]])
    if kind == 'portrait':
        c = shot['crop']
        view = np.array([[1080/c['width'], 0, -c['x']*1080/c['width']],
                         [0, c['height']/2160, c['top']], [0, 0, 1.]])
        original = project(original, view)
    area = abs(cv2.contourArea(original))
    unit = round(np.sqrt(area / 20))
    width, height = 4*unit, 5*unit
    cx, cy = original.mean(axis=0)
    left, top = round(float(cx)-width/2), round(float(cy)-height/2)
    target = np.float32([[left, top], [left+width, top],
                         [left+width, top+height], [left, top+height]])
    return original, target


def maps(original, target, size):
    width, height = size
    inverse = cv2.getPerspectiveTransform(target, original)
    yy, xx = np.mgrid[:height, :width].astype(np.float32)
    denominator = inverse[2, 0]*xx + inverse[2, 1]*yy + inverse[2, 2]
    hx = (inverse[0, 0]*xx + inverse[0, 1]*yy + inverse[0, 2])/denominator
    hy = (inverse[1, 0]*xx + inverse[1, 1]*yy + inverse[1, 2])/denominator
    left, top = target[0]; right, bottom = target[2]
    clearance = min(left, top, width-1-right, height-1-bottom)
    assert clearance > 10
    # Keep the same projective transform over the physical frame and shadow.
    # Starting the blend at the canvas itself would bend the frame rails.
    protect_x = min(150 if width == 3840 else 70, min(left, width-1-right)*.5)
    protect_y = min(150 if width == 3840 else 70, min(top, height-1-bottom)*.5)
    # Bilinear displacement decay keeps narrow portrait wall margins monotone.
    # A smoothstep in those margins can fold the map when frame rails move.
    wx = np.clip(np.minimum(xx/(left-protect_x),
                           (width-1-xx)/(width-1-right-protect_x)), 0, 1)
    wy = np.clip(np.minimum(yy/(top-protect_y),
                           (height-1-yy)/(height-1-bottom-protect_y)), 0, 1)
    weight = wx*wy
    mx = (xx + weight*(hx-xx)).astype(np.float32)
    my = (yy + weight*(hy-yy)).astype(np.float32)
    jacobian = np.gradient(mx, axis=1)*np.gradient(my, axis=0)-np.gradient(mx, axis=0)*np.gradient(my, axis=1)
    assert float(jacobian.min()) > .1, 'Warp folds over itself'
    return mx, my, float(jacobian.min())


def encode(source, target, mx, my, frames, source_size=None):
    assert not target.exists(), f'Preserve existing creative output: {target}'
    height, width = mx.shape
    decoder = subprocess.Popen(['ffmpeg', '-v', 'error', '-threads', '2', '-i', str(source),
        '-an', '-pix_fmt', 'yuv444p16le', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
    encoder = subprocess.Popen(['ffmpeg', '-v', 'error', '-nostdin', '-n', '-f', 'rawvideo',
        '-pix_fmt', 'yuv444p16le', '-s', f'{width}x{height}', '-r', '24',
        '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709',
        '-color_trc', 'bt709', '-i', '-', '-an',
        '-vf', 'scale=in_color_matrix=bt709:out_color_matrix=bt709:in_range=tv:out_range=tv',
        '-c:v', 'prores_ks', '-profile:v', '4', '-pix_fmt', 'yuv444p10le', '-threads', '3',
        '-color_range', 'tv', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', str(target)], stdin=subprocess.PIPE)
    source_width, source_height = source_size or (width, height)
    size = source_width*source_height*6
    for _ in range(frames):
        data = decoder.stdout.read(size)
        assert len(data) == size, 'Unexpected input duration'
        planes = np.frombuffer(data, np.uint16).reshape(3, source_height, source_width)
        for plane in planes:
            encoder.stdin.write(cv2.remap(plane, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE).tobytes())
    assert not decoder.stdout.read(1), 'Unexpected extra source frame'
    encoder.stdin.close()
    assert decoder.wait() == 0 and encoder.wait() == 0


def main():
    global WORK
    parser = argparse.ArgumentParser()
    parser.add_argument('--ids', nargs='*')
    parser.add_argument('--kind', choices=['main', 'portrait', 'both'], default='both')
    parser.add_argument('--version', type=int, default=19)
    args = parser.parse_args()
    assert args.version >= 19, 'Preserve previous output versions'
    WORK = OUT / f'art-geometry-v{args.version}'
    WORK.mkdir(exist_ok=True)
    source_plan = json.load(open(OUT / 'art-photo-v17/plan.json'))
    plan_path = WORK / 'plan.json'
    plan = json.load(open(plan_path)) if plan_path.exists() else {
        'version': args.version, 'base_version': 17, 'scope': 'Only single-artwork close-ups; no edit or color changes',
        'color_encoding': 'Explicit limited-range BT.709 on both raw YUV input and encoded output; no implicit matrix conversion',
        'exception': 'Gianni Lee: retain accepted near-4:5 composition, real tilt, shells and bead curtain',
        'shots': source_plan['shots']}
    for shot, base in zip(plan['shots'], source_plan['shots']):
        if shot['id'] == 'C054':
            shot['geometry_exception'] = True
            continue
        if args.ids and shot['id'] not in args.ids:
            continue
        assert hashlib.sha256((ROOT/shot['source']).read_bytes()).hexdigest() == shot['source_sha256']
        for kind in ['main', 'portrait'] if args.kind == 'both' else [args.kind]:
            field = kind+'_file'
            filename = ('portrait-' if kind == 'portrait' else '') + f"art-4x5-{shot['id']}-v{args.version}.mov"
            target = OUT / filename
            size = (3840, 2160) if kind == 'main' else (1080, 1920)
            original, rectangle = geometry(base, kind)
            source_file = base[field]
            source_size = None
            if shot['id'] == 'C058' and kind == 'portrait':
                # The previous vertical crop touched the canvas's left edge.
                # Reframe from the complete corrected UHD insert, extending
                # only the real wall pixels above/below the camera image.
                _, original = geometry(base, 'main')
                rectangle = np.float32([[80, 385], [1000, 385], [1000, 1535], [80, 1535]])
                scale = (original[1, 0]-original[0, 0])/920
                yy, xx = np.mgrid[:1920, :1080].astype(np.float32)
                cx, cy = original.mean(axis=0)
                mx = (xx-540)*scale+cx
                my = (yy-960)*scale+cy
                minimum = float(scale*scale)
                source_file = shot['main_file']
                source_size = (3840, 2160)
            else:
                mx, my, minimum = maps(original, rectangle, size)
            if not target.exists():
                encode(OUT/source_file, target, mx, my, shot['end']-shot['start'], source_size)
            shot[field] = filename
            shot.setdefault('rectification', {})[kind] = {
                'source_canvas_quad': original.tolist(), 'target_canvas_quad': rectangle.tolist(),
                'width': float(rectangle[1, 0]-rectangle[0, 0]),
                'height': float(rectangle[3, 1]-rectangle[0, 1]),
                'aspect_ratio': .8, 'minimum_map_jacobian': minimum,
                'background': 'Smooth local wall/frame deformation; outer image boundary fixed',
                'base_file': source_file}
            json.dump(plan, open(plan_path, 'w'), indent=2)
            print(json.dumps({'id': shot['id'], 'format': kind, 'file': filename}), flush=True)


if __name__ == '__main__':
    main()
