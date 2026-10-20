"""Decode every frame and flag dark borders for visual review; never modify media."""
import argparse
import json
import subprocess
from pathlib import Path
import numpy as np

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('video', type=Path)
parser.add_argument('report', type=Path)
parser.add_argument('--picture-start', type=int, default=89)
parser.add_argument('--fade-start', type=int, default=1845)
args = parser.parse_args()
probe = json.loads(subprocess.check_output([
    'ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(args.video)]))
video = next(s for s in probe['streams'] if s['codec_type'] == 'video')
w, h = video['width'], video['height']
process = subprocess.Popen(['ffmpeg', '-v', 'error', '-nostdin', '-i', str(args.video),
    '-map', '0:v:0', '-an', '-vf', 'format=gray', '-f', 'rawvideo', 'pipe:1'],
    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
count = 0
black_frames = []
border_flags = []
while True:
    raw = process.stdout.read(w * h)
    if not raw:
        break
    assert len(raw) == w * h, 'Truncated decoded frame'
    frame = np.frombuffer(raw, np.uint8).reshape(h, w)
    if np.mean(frame < 5) > 0.99:
        black_frames.append(count)
    if args.picture_start <= count < args.fade_start:
        edges = {'top': frame[:4], 'bottom': frame[-4:],
                 'left': frame[:, :4], 'right': frame[:, -4:]}
        flags = {k: round(float(np.mean(v < 4)), 4) for k, v in edges.items()
                 if np.mean(v < 4) > 0.15}
        if flags:
            border_flags.append({'frame': count, 'edges': flags})
    count += 1
error = process.stderr.read().decode()
assert process.wait() == 0, error
report = {'file': str(args.video), 'width': w, 'height': h, 'frames': count,
          'black_frames': black_frames, 'border_flags_for_review': border_flags,
          'picture_scan': [args.picture_start, args.fade_start],
          'method': 'Every decoded frame; native-resolution outer four pixels; dark content requires visual review'}
args.report.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'frames': count, 'black_frames': len(black_frames),
                  'border_flags_for_review': len(border_flags)}))
