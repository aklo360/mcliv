"""Extract rendered shot reviews without changing source media or the cut."""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('video', type=Path)
parser.add_argument('shots', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
shots = json.loads(args.shots.read_text())
assert shots and all(s['end'] > s['start'] for s in shots)
args.output.mkdir(parents=True, exist_ok=True)
samples = sorted({f for s in shots for f in
                  (s['start'], (s['start'] + s['end'] - 1) // 2, s['end'] - 1)})
frames = args.output / 'frames'
frames.mkdir(exist_ok=True)
def selection(frames):
    if len(frames) == 1:
        return f'eq(n,{frames[0]})'
    middle = len(frames) // 2
    return f'({selection(frames[:middle])}+{selection(frames[middle:])})'

expression = selection(samples)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-nostdin',
                '-i', str(args.video), '-vf',
                f"select='{expression}',scale=480:-1:flags=lanczos",
                '-fps_mode', 'vfr', '-n', str(frames / '%04d.png')], check=True)
paths = {f: frames / f'{i + 1:04d}.png' for i, f in enumerate(samples)}
assert all(path.is_file() for path in paths.values())
for first in range(0, len(shots), 6):
    batch = shots[first:first + 6]
    sheet = Image.new('RGB', (1440, len(batch) * 396), '#242424')
    draw = ImageDraw.Draw(sheet)
    for row, shot in enumerate(batch):
        frame_ids = [shot['start'], (shot['start'] + shot['end'] - 1) // 2, shot['end'] - 1]
        for col, frame in enumerate(frame_ids):
            im = Image.open(paths[frame]).convert('RGB')
            sheet.paste(im, (col * 480, row * 396 + 32))
            draw.text((col * 480 + 8, row * 396 + 8),
                      f"{first + row:02d} | frame {frame} | {shot['name'][:42]}", fill='white')
    sheet.save(args.output / f'shots-{first:02d}-{first + len(batch) - 1:02d}.jpg', quality=93)
(args.output / 'review-index.json').write_text(json.dumps({
    'video': str(args.video), 'shots': len(shots), 'frames': samples,
    'method': 'Rendered start, midpoint and last frame of every visible event',
}, indent=2) + '\n')
print(json.dumps({'shots': len(shots), 'sampled_frames': len(samples), 'output': str(args.output)}))
