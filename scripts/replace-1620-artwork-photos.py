"""Composite approved website photographs into the existing video inserts.

Python is required for OpenCV homography measurement and video reprojection.
The background remains 10-bit video through FFmpeg. No art is generated.
The Lola replacement is reused. Gianni retains the filmed shells and beads.
"""
import json, subprocess, sys
from pathlib import Path
import cv2
import numpy as np

root=Path(__file__).resolve().parents[1]
out=root/'output/1620-recap'
plan_path=Path(sys.argv[1]);plan=json.load(open(plan_path));work=plan_path.parent
master=out/plan['source']
def run(args):subprocess.run(['ffmpeg','-v','error','-nostdin','-n',*args],check=True)
def overlay_png(src,alpha,h,path,size=(3840,2160)):
    assert not path.exists(),f'Preserve existing output: {path}'
    rgb=cv2.warpPerspective(src.astype(np.uint16)*257,h,size,flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REPLICATE)
    a=cv2.warpPerspective(alpha,h,size,flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
    assert cv2.imwrite(str(path),np.dstack([rgb,a.astype(np.uint16)*257]))
def encode(shot,overlay,moving=False):
    target=out/shot['main_file'];assert not target.exists()
    extra=['-framerate','24','-i',str(overlay)]if moving else['-loop','1','-framerate','24','-i',str(overlay)]
    run(['-ss',str(shot['start']/24),'-i',str(master),*extra,'-filter_complex','[0:v][1:v]overlay=shortest=1:format=auto,format=yuv444p10le[v]',
         '-map','[v]','-an','-frames:v',str(shot['end']-shot['start']),'-r','24','-c:v','prores_ks','-profile:v','4','-pix_fmt','yuv444p10le',
         '-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-threads','2',str(target)])
def portrait(shot):
    if shot['id']=='C054':return
    c=shot['crop'];target=out/shot['portrait_file'];assert not target.exists()
    vf=f"crop={c['width']}:2160:{c['x']}:0,scale=1080:{c['height']}:flags=lanczos,pad=1080:1920:0:{c['top']},fillborders=top={c['top']}:bottom={c['bottom']}:mode=smear"
    run(['-i',str(out/shot['main_file']),'-an','-vf',vf,'-c:v','prores_ks','-profile:v','4','-pix_fmt','yuv444p10le','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-threads','2',str(target)])
for shot in plan['shots']:
    if shot.get('reuse'):continue
    if (out/shot['main_file']).exists():
        if shot['id']!='C054'and not(out/shot['portrait_file']).exists():portrait(shot)
        continue
    src=cv2.imread(str(root/shot['source']));assert src is not None
    alpha=np.full(src.shape[:2],255,np.uint8)
    if 'source_mask_quad'in shot:
        alpha[:]=0;cv2.fillConvexPoly(alpha,np.round(shot['source_mask_quad']).astype(np.int32),255)
    base=np.array(shot['homography'])
    if shot['id']!='C054':
        ov=work/(shot['id']+'-overlay.png');overlay_png(src,alpha,base,ov);encode(shot,ov);portrait(shot)
    else:
        # Register adjacent video frames at 960x540. Cumulative transforms keep
        # the photograph attached to the real tilt, even as it leaves frame.
        count=shot['end']-shot['start'];raw=work/'gianni-track.bgr'
        if not raw.exists():run(['-ss',str(shot['start']/24),'-i',str(master),'-frames:v',str(count),'-vf','scale=960:540','-pix_fmt','bgr24','-f','rawvideo',str(raw)])
        frames=np.memmap(raw,dtype=np.uint8,mode='r',shape=(count,540,960,3));sift=cv2.SIFT_create(nfeatures=5000)
        feats=[sift.detectAndCompute(cv2.cvtColor(f,cv2.COLOR_BGR2GRAY),None)for f in frames]
        transforms=[base];cumulative=np.eye(3);checks=[];matcher=cv2.BFMatcher()
        for n in range(1,count):
            ka,da=feats[n];kb,db=feats[n-1]
            matches=[a for a,b in matcher.knnMatch(da,db,k=2)if a.distance<.7*b.distance]
            p=np.float32([ka[m.queryIdx].pt for m in matches])*4;q=np.float32([kb[m.trainIdx].pt for m in matches])*4
            h,mask=cv2.findHomography(p,q,cv2.RANSAC,5)
            assert h is not None and mask.sum()>=45,(n,'Unreliable tracking')
            error=np.linalg.norm(cv2.perspectiveTransform(p[:,None,:],h)[:,0]-q,axis=1)[mask[:,0]>0]
            assert np.median(error)<2.0
            cumulative=cumulative@h;transforms.append(np.linalg.inv(cumulative)@base)
            checks.append({'frame':n,'inliers':int(mask.sum()),'median_error_uhd_px':float(np.median(error))})
        # The supplied photograph ends above the hanging beads. Keep the filmed
        # shells and fabric along the bottom; soften only the joining 12 pixels.
        if 'bottom_feather'in shot:
            y0,y1=shot['bottom_feather'];alpha[y1:]=0
            for y in range(y0,y1):alpha[y]=np.minimum(alpha[y],round(255*(y1-y)/(y1-y0)))
        # Portrait uses the already approved real wall/floor extension as base.
        scale=1080/930;view=np.array([[scale/2,0,-495*scale],[0,scale/2,(1920-1080*scale)/2],[0,0,1.]])
        for n,h in enumerate(transforms):
            overlay_png(src,alpha,h,work/f'C054-{n:03}.png')
            overlay_png(src,alpha,view@h,work/f'C054-portrait-{n:03}.png',size=(1080,1920))
        encode(shot,work/'C054-%03d.png',True)
        run(['-i',str(out/shot['previous_portrait_file']),'-framerate','24','-i',str(work/'C054-portrait-%03d.png'),'-filter_complex','[0:v][1:v]overlay=shortest=1:format=auto,format=yuv444p10le[v]','-map','[v]','-an','-frames:v',str(count),'-c:v','prores_ks','-profile:v','4','-pix_fmt','yuv444p10le','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-threads','2',str(out/shot['portrait_file'])])
        json.dump({'checks':checks,'transforms':[h.tolist()for h in transforms]},open(work/'gianni-tracking.json','w'),indent=2)
    print(json.dumps({'id':shot['id'],'main':shot['main_file'],'portrait':shot['portrait_file'],'frames':shot['end']-shot['start']}),flush=True)
