"""Extend the real moving shot from neighbouring video frames, not generated art.

Python is used for OpenCV feature registration and video-frame reprojection.
The current frame is kept first; aligned adjacent frames fill only its margins.
Unseen wall/floor beyond the camera sweep uses nearest real boundary pixels.
"""
import json, subprocess, sys
from pathlib import Path
import cv2
import numpy as np

root = Path(__file__).resolve().parents[1]
out = root / 'output/1620-recap'
version = sys.argv[1]
assert version.startswith('v') and version[1:].isdigit()
revision = f'{version}-r3'
target = out / f'portrait-wall-C054-real-tilt-{revision}.mov'
assert not target.exists(), 'Never overwrite creative exports'
plan = json.load(open(out / f'portrait-reframe-plan-{version}.json'))
shot = next(c for c in plan if c['id']=='C054' and c['role']=='art')
frame_count = shot['end']-shot['start']
middle = frame_count//2
last = frame_count-1
raw = Path(f'/private/tmp/mcliv-gianni-{version}-1920.bgr')
if not raw.exists():
    subprocess.run(['ffmpeg','-v','error','-n','-ss',str(shot['start']/24),'-i',str(out/f'1620-recap-16x9-prores-{version}.mov'),'-frames:v',str(frame_count),'-vf','scale=1920:1080','-pix_fmt','bgr24','-f','rawvideo',str(raw)],check=True)
frames = np.memmap(raw, dtype=np.uint8, mode='r', shape=(frame_count,1080,1920,3))
sift = cv2.SIFT_create(nfeatures=3500)
features = []
for frame in frames:
    small = cv2.resize(frame,(960,540))
    features.append(sift.detectAndCompute(cv2.cvtColor(small,cv2.COLOR_BGR2GRAY),None))
homographies = [np.eye(3)]
checks = []
matcher = cv2.BFMatcher()
for n in range(1,len(frames)):
    kp, desc = features[n]; prevkp, prevdesc = features[n-1]
    matches = [a for a,b in matcher.knnMatch(desc,prevdesc,k=2) if a.distance < .7*b.distance]
    src = np.float32([kp[m.queryIdx].pt for m in matches])*2
    dst = np.float32([prevkp[m.trainIdx].pt for m in matches])*2
    h, mask = cv2.findHomography(src,dst,cv2.RANSAC,2.5)
    assert h is not None and int(mask.sum()) >= 45, f'Unreliable registration at {n}'
    errors = np.linalg.norm(cv2.perspectiveTransform(src[:,None,:],h)[:,0,:]-dst,axis=1)[mask[:,0]>0]
    assert np.median(errors) < 1.0
    homographies.append(homographies[-1]@h)
    checks.append({'frame':n,'inliers':int(mask.sum()),'median_error_px':float(np.median(errors))})
print(json.dumps({'registered':len(frames),'worst_median_error_px':max(c['median_error_px'] for c in checks)}),flush=True)
# A 930-pixel window contains the full 768-pixel canvas, with real wall margins.
scale = 1080/930
view = np.array([[scale,0,-495*scale],[0,scale,(1920/scale-1080)/2*scale],[0,0,1.]])
encoder = subprocess.Popen(['ffmpeg','-v','error','-nostdin','-n','-f','rawvideo','-pix_fmt','bgr24','-s','1080x1920','-r','24','-i','-','-an','-c:v','prores_ks','-profile:v','4','-pix_fmt','yuv444p10le','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-threads','2',str(target)],stdin=subprocess.PIPE)
source_mask = np.full((1080,1920),255,np.uint8)
unknown_fractions = []
for n in range(len(frames)):
    result = np.zeros((1920,1080,3),np.uint8)
    known = np.zeros((1920,1080),bool)
    candidates = list(dict.fromkeys([n,middle,0,last]))
    inverse = np.linalg.inv(homographies[n])
    for k in candidates:
        transform = view@inverse@homographies[k]
        mask = cv2.warpPerspective(source_mask,transform,(1080,1920),flags=cv2.INTER_NEAREST)>0
        use = mask & ~known
        if not np.any(use): continue
        warped = cv2.warpPerspective(frames[k],transform,(1080,1920),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REPLICATE)
        # Three continuous reference surfaces avoid strip boundaries from many
        # nearby frames. Feather the overlap at the original camera boundary.
        if k != n:
            distance = cv2.distanceTransform(known.astype(np.uint8),cv2.DIST_L2,5)
            blend = mask & known & (distance < 48)
            alpha = (distance[blend]/48)[:,None]
            result[blend] = np.rint(result[blend]*alpha+warped[blend]*(1-alpha)).astype(np.uint8)
        result[use] = warped[use]
        known |= mask
    unknown_fractions.append(float(np.mean(~known)))
    if not np.all(known):
        _,labels = cv2.distanceTransformWithLabels((~known).astype(np.uint8),cv2.DIST_L2,5,labelType=cv2.DIST_LABEL_PIXEL)
        pixels = result[known]
        result[~known] = pixels[labels[~known]-1]
    if n in [0,frame_count//4,middle,frame_count*3//4,last]: cv2.imwrite(str(out/f'gianni-portrait-{revision}-{n:03}.png'),result)
    encoder.stdin.write(result.tobytes())
    if n%26==0: print(json.dumps({'encoded_frame':n,'unseen_wall_fraction':unknown_fractions[-1]}),flush=True)
encoder.stdin.close()
assert encoder.wait()==0
json.dump({'method':'Real first/middle/last frame reprojection with 48px seam blend; current frame interior retained; unseen wall/floor edge extension','source_start':shot['start'],'frames':frame_count,'registration':checks,'unseen_boundary_fraction':unknown_fractions},open(out/f'gianni-portrait-extension-{revision}.json','w'),indent=2)
