# 1620 recap

## 4:3 card reflow — v3

**1620 RECAP 4x3 FINAL v3** replaces both cards with a dedicated stacked
composition in `assets/1620/motion/src/RecapCards4x3.tsx`. MCLIV and NYC Culture
Club occupy the header corners; the date, large **1620**, and one subtitle
are centered vertically in sequence. The header's duplicate “GROUP EXHIBITION”
is removed. “A group exhibition of 18 artists” appears once per card.
V2 enlarged the old side-by-side composition and did not satisfy the requested
reformat. Its exports are superseded, with source and outputs retained.

The opening remains 89 frames; the inverted end card remains 96 frames. Reveal
offsets and fade durations are unchanged. The final timeline is 2880 × 2160,
24 fps, 2,082 frames / 86.75 seconds. The picture edit, framing, retiming,
music and creative grades are preserved. All 86 native item boundaries and
retime payloads match v2; seven decoded footage samples are pixel-identical
after equal 720 × 540 review resampling. The MP4 retains the approved 16:9
color tags and measures 59.86 Mbps video. Verification and rendered card
review frames are in `output/1620-recap/reframe-4x3-v3/`.

- ProRes: **1620-recap-4x3-prores-v3.mov**
- H.264: **1620-recap-4x3-2160p-60mbps-v3.mp4**
- Native backups: **1620-FINAL-4x3-v3.drt** and
  **MCLIV-1620-FINAL-4x3-v3.drp**

## 4:3 title and export-tag correction — v2

**1620 RECAP 4x3 FINAL v2** preserves the v1 picture framing, cut, music and
grades. The opening and end cards now use a 1440 × 1080 design grid scaled to
2880 × 2160, with larger title and supporting type, adjusted gutters and the
original asymmetric flyer layout. Both retain the same reveal/fade timing.
V1 only adapted the canvas and block placement; its type remained too small.

The v1-r2 H.264 had a real metadata difference: its transfer tag was explicitly
rewritten to BT.709 (1), while the approved horizontal H.264 uses unspecified
transfer (2), with Rec.709 primaries/matrix and video range. The ProRes masters
have matching tags. V2 preserves the approved H.264 tags and uses libx264, as
the approved horizontal export does. This is an export correction; no gamma
conversion or new creative color correction is applied to the footage.
The earlier 17-artwork comparison and 18 additional moving-shot comparisons
show negligible mean color shifts. Details: `reframe-4x3-v2/` in the output
folder, including `color-tag-correction.json` and `crowd-color-comparison.json`.

Final files are **1620-recap-4x3-prores-v2-r2.mov** and
**1620-recap-4x3-2160p-60mbps-v2-r2.mp4**. Both are 2880 × 2160, 24 fps and
2,082 frames. H.264 measures 59.86 Mbps video and passes full decode; its
color tags match the approved 16:9 H.264. All 86 native item boundaries and
85 video retime payloads match v1. The cards were reviewed through their
reveals and fades. Of 1,897 footage frames compared with v1-r2, 1,767 decode
identically. Twelve samples among the other 130 BRAW frames show at most
0.032/255 mean absolute difference and less than 0.0001/255 mean channel shift;
do not describe every re-rendered frame as byte-identical. Audio differs by
at most one 24-bit code value. `final-verification.json` records the checks.

Native backups: **1620-FINAL-4x3-v2-r2.drt** and
**MCLIV-1620-FINAL-4x3-v2-r2.drp**. Unsuffixed v2 files and the
**1620 RECAP 4x3 TITLE TEST v2** timeline are rejected title-range trials,
not deliveries. MCP take replacement must specify inclusive source endpoints
and verify timeline start/end/duration: omitted endpoints default to 0..0.

## 4:3 companion — 2160 pixels high

**1620 RECAP 4x3 FINAL v1** is a native duplicate of the approved 16:9 v19,
at **2880 × 2160, 24 fps, 2,082 frames / 1:26:18**. Original video items retain
their edit boundaries and retime keyframe payloads. Framing changes belong
to the new timeline; the 16:9 and 9:16 finals remain the approved originals.

Forty-seven visible picture events have full-height framing, with individual
pan/headroom adjustments for crowd interactions. The three-painting back-wall
view uses the original graded video with plain wall pixels extended above
and below, keeping all three paintings complete. Its source remains underneath.
All 18 artwork close-ups remain, including Gianni's real tilt. No new creative
color correction was applied. The entrance remains an editable native compound.
New 4:3 cards retain the flyer layout, original animation and fade durations.

The two delivery files use the **v1-r2** suffix; unsuffixed v1 movies are
superseded framing reviews. Evidence is in `output/1620-recap/reframe-4x3-v1/`.

- `1620-recap-4x3-prores-v1-r2.mov`: ProRes 422 HQ, stereo PCM 24-bit/48 kHz.
- `1620-recap-4x3-2160p-60mbps-v1-r2.mp4`: H.264 High, 60 Mbps target,
  measured 59.68 Mbps video, stereo AAC 320 kbps target.
- Native backups: `1620-FINAL-4x3-v1.drt` and `MCLIV-1620-FINAL-4x3-v1.drp`.
- All 49 visible events reviewed at start, midpoint and last frame. Every
  final ProRes frame decoded; no border flags remain. Near-black frames are
  confined to the existing closing fade and sparse black end card. The H.264
  passes full decode and both files have the exact frame count and duration.
- All 17 static artworks compared with the same-height center crop of the
  approved UHD render, using equal 720 × 540 review resampling. Maximum mean
  absolute RGB difference is 0.44/255; maximum mean channel shift is 0.26/255.
  No art correction changed between that comparison and the final crowd-edge
  revision. Audio differs from the approved master by at most one 24-bit code
  value. Geometry and native serialization changes prevent treating whole
  native grade blobs as byte-identical; rendered appearance was checked directly.

## Instagram aspect-ratio research — checked 19 October 2026

**Use the existing 9:16 final for Reels as the practical default. Keep 4:3
for its room and artwork composition.** The sources reviewed do not establish
a fixed organic ranking bonus for 9:16, 4:5, 3:4, square, or landscape video.
Screen fit can improve the viewing experience; a claim that Instagram grants
a specific reach multiplier solely because of aspect ratio is unsupported.

### What the ranking evidence supports

Adam Mosseri's January 2025 explanation identifies watch time, likes and sends
as the leading signals. He recommends average watch time, likes per reach and
sends per reach; likes matter somewhat more for connected audiences, sends for
people who do not follow the account. No public numeric weights were supplied.
This is a useful priority order for measurement, not a complete description of
every ranking model. [Original explanation](https://www.instagram.com/mosseri/reel/DFFyRp-pINJ/),
[dated contemporary coverage](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/).

Meta's May 2024 recommendation update describes eligible original content
being shown to an initial audience and expanding distribution as it performs.
The published criteria include originality, recommendation eligibility and
absence of visible watermarks; they do not specify an aspect-ratio multiplier.
This supports making recognizable faces, engaging interactions and readable
artwork easy to see, then checking whether viewers keep watching and share.
The latter is our creative inference, not a published weighting formula.
[Meta's recommendation update](https://about.fb.com/ltam/news/2024/05/ayudando-a-los-creadores-a-encontrar-nuevas-audiencias/).

### Aspect ratios and this film

| Format | Practical use | Evidence about organic boost |
| --- | --- | --- |
| 9:16 | Fills the vertical Reels canvas; use the already reframed final | Strong screen-fit rationale; no isolated public ranking multiplier found |
| 4:5 | Portrait feed composition when that framing suits the content | No demonstrated automatic bonus; it does not fill a 9:16 canvas |
| 3:4 | Portrait photo composition; distinguish it from landscape 4:3 | Photo support or grid changes do not establish video ranking preference |
| 1:1 | Square composition when the scene benefits | No demonstrated automatic bonus |
| 4:3 | Gallery relationships, complete paintings and groups of people | No verified fixed penalty merely for being native 4:3 |
| 16:9 | Wide rooms and the approved horizontal master | Uses less of a portrait screen, which is a presentation tradeoff |

These are composition recommendations, not an algorithmic league table.
At the same 2160-pixel height, a straight 9:16 crop of the new 2880-pixel-wide
master would keep only 1215 pixels, or 42.2% of its width. Use the existing
individually reframed vertical timeline, not a new automatic center crop.

### Why quoted vertical-video lift figures need care

Meta's October 2023 Reels advertising analysis reported improved paid results
for vertical video **with audio**. Its March 2026 publication again describes
a correlation between a larger share of 9:16-with-audio creatives and lower
cost per acquisition. These concern ad sets, combine ratio with sound and
other creative differences, and do not isolate organic distribution. They
cannot substantiate a claim that a 9:16 organic Reel receives a guaranteed
percentage boost. [2023 advertising evidence](https://about.fb.com/br/news/2023/10/atualizacoes-do-reels-ads-novos-recursos-de-desempenho-criacao-automatizada-e-solucoes-de-adequacao/),
[2026 advertising evidence and methodology](https://about.fb.com/ltam/news/2026/03/del-comercio-a-la-cultura-como-la-ia-impulsa-la-conexion-personalizada-y-el-crecimiento-a-lo-largo-del-funnel/).

Older 2023 Instagram guidance also discouraged low-resolution, watermarked or
bordered Reels. It should not be stretched into proof that native landscape
video is penalized identically to baked-in black bars. The official page was
not directly retrievable during this research, so this point relies on dated
coverage and is not presented as a newly verified 2026 rule.
[Contemporary report](https://www.socialmediatoday.com/news/instagram-explainer-feed-reels-and-stories-algorithm/651705/).

### How to learn what works for MCLIV

Use average watch time, the available retention information, sends per reach,
likes per reach and non-follower reach to judge the vertical release. A later
4:3 trial can give directional evidence if the same edit, audio and duration
are retained and exposure windows are comparable. Trial Reels initially go
to non-followers and provide early engagement feedback, but two organic
uploads are not a randomized experiment: audience, timing and prior exposure
can change the result. One winner does not prove an aspect-ratio preference
across all future films. [Meta's Trial Reels documentation](https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/).

No MCLIV account analytics were accessed, and nothing was published. Several
Instagram/Threads/help pages were login- or fetch-blocked; accessible Meta
publications and dated corroboration support the conclusions above. No
official fixed organic aspect-ratio boost or clean public causal test was
found in the reviewed sources.

## Final user cut conformed — v19

The latest user-edited **1620 RECAP 16x9 FINAL v18** is the authority:
**2,082 frames / 1:26:18 / 24 fps**. The new **1620 RECAP 16x9 FINAL v19**
is a native duplicate, and **1620 RECAP 9x16 FINAL v19** carries every edit,
retime, color correction, custom curve and music edit from that duplicate.
The original user timeline is preserved. No new creative color correction
was applied; the earlier alternate color-repair media remain unused because
the latest instruction was to match the user's final appearance exactly.

- All 84 original video items retain their record boundaries and retime data.
  Native color parameter comparisons pass in both formats. Portrait title
  takes have identical timing and centered 1620 typography. Seventeen
  portrait artwork plates use the exact current horizontal source pixels,
  real-wall extension and exact 4:5 canvases; Gianni retains the real tilt.
  The C052 held frame cannot accept a native take, so its original remains
  underneath a same-duration portrait overlay with its native grade copied.
- The 49 visible events include 18 painting close-ups, three filmed wall
  views, 25 crowd/interaction moments, the entrance and two cards.
  Thirty moving/wall/entrance/Gianni events were checked at start, middle
  and last frame. The editable entrance compound is shared with the final
  master; portrait outer zoom **3.508148** fills its nested widescreen canvas.
  Its RAW, original keyframes and color nodes remain inside **Open in Timeline**.
- Both complete ProRes movies passed native-resolution border and black-frame
  scans. The nine near-black frames belong to the unchanged closing fade/card.
  All four outputs pass full decode, frame count, duration, dimensions and
  audio checks. Horizontal and portrait PCM differ by at most one 24-bit
  code value. All seventeen static artwork canvas comparisons were reviewed;
  maximum mean rendered pixel difference is 1.59/255, with identical native
  corrections and small differences from resampling/chroma encoding.
- Final deliveries: **1620-recap-9x16-instagram-25mbps-v19.mp4**,
  **1620-recap-16x9-youtube-uhd-60mbps-v19.mp4**, and
  **1620-recap-16x9-prores-v19.mov**. Vertical ProRes master:
  **1620-recap-9x16-prores-v19-r2.mov**. The unsuffixed vertical ProRes v19
  is the superseded framing review, not the delivery master.
- Backups: **MCLIV-1620-FINAL-v19.drp**, **1620-FINAL-main-v19.drt**,
  **1620-FINAL-portrait-v19.drt**. Evidence and shot inventory live in
  `output/1620-recap/final-conform-v19/`; output checks are in
  `final-output-verification-v19.json`. The manifest now records the new
  duration, timing and sources. All previous versions and files are retained.
- The cut is editorially final. Populated-track lock calls returned success
  but read back unlocked, a known MCP/native API limitation; do not claim
  all track padlocks are enabled. This does not alter the edit or exports.


## Earlier alternate color-repair preparation — v19

- The user noticed a color shift in v18. It was real: the raw YUV input
  to the geometry encoder lacked explicit BT.709 matrix/range metadata,
  causing an unwanted conversion. It was not a deliberate artistic grade.
  The largest sampled mean-luma shifts were about 4.8 eight-bit code values
  in the red paintings. V18 final movies retain this issue.
- `scripts/rectify-1620-artwork-video.py` now tags both sides of the raw-video
  handoff explicitly. All 34 inserts were rebuilt from the approved v17
  composites as `art-4x5-Cxxx-v19.mov` and their portrait counterparts.
  The exact 4:5 geometry and Gianni exception remain intact.
- Both-format canvas comparisons pass: maximum mean-luma differences are
  below one eight-bit code value. Correct metadata, durations and geometry
  pass for all 34 inserts. Evidence is in `art-geometry-v19/`:
  `plan.json`, `color-verification.json`, `geometry-verification.json`.
- Corrected media are imported in **Master / 1620 Art Color Corrected v19**.
  These alternate repair plates remain unused. The subsequent user-final
  conform above supersedes the integration plan: preserve the new main
  appearance exactly, including grades applied since this repair was prepared.
- The first camera shot is the editable compound **ENTRANCE full bleed
  16x9 v16**, not rendered media. Its original RAW, retime/keyframes and grade
  remain inside. Open it with **Open in Timeline** to edit the original;
  the outer 1.11 zoom supplies the black-edge correction.

## Exact canvas rectangles — v18

- **1620 RECAP 16x9 FINAL v18** and **1620 RECAP 9x16 FINAL v18**
  square 17 single-painting canvases to exact **4:5 / 16:20** rectangles.
  Measurement is inside physical frames. Nearby frame, shadow and real wall
  pixels follow the correction; full-bleed image boundaries remain covered.
- **Gianni Lee is the user-requested exception.** Its near-4:5 initial canvas
  framing (measured ratio 0.819), natural perspective, real tilt, shells and
  bead curtain remain as approved. The three wall wides and all people
  footage are untouched. NotYourMuse's portrait insert is recentered from
  the complete UHD image to recover its left-edge margin.
- The locked **2,287-frame / 1:35:07 / 24 fps** cut, source ranges, retimes,
  grades, titles and music are preserved. New inserts occupy main V12 and
  portrait V13; all 33 tracks are locked. V17 remains available.
- `scripts/rectify-1620-artwork-video.py` owns the bounded video remap.
  Python/OpenCV is required for measured projective geometry; the image
  pipeline retains 16-bit YUV precision. No artwork is generated or recolored.
  Accepted insert media have the `v18-r3` suffix; earlier trials are preserved.
  Geometry and source references: `output/1620-recap/art-geometry-v18/plan.json`.
- All 17 canvas geometries pass exact-ratio, axis-alignment and no-fold
  checks in both formats. All 46 rendered shot comparisons, every-frame
  border/black-frame checks and full output decode checks pass. Main and
  portrait audio match within one 24-bit code value.
- Final deliveries: `1620-recap-16x9-prores-v18.mov`,
  `1620-recap-16x9-youtube-uhd-60mbps-v18.mp4`, and
  `1620-recap-9x16-instagram-25mbps-v18.mp4`.
  Portrait intermediate: `1620-recap-9x16-prores-v18.mov`.
  Native backups: `MCLIV-1620-FINAL-v18.drp`, `1620-FINAL-main-v18.drt`,
  `1620-FINAL-portrait-v18.drt`. Detailed verification is linked in the
  canonical `recap-edit.json` manifest.

## Website photo close-ups — v17

- **1620 RECAP 16x9 FINAL v17** and **1620 RECAP 9x16 FINAL v17**
  replace only the **18 single-painting close-ups** with approved website
  photographs. The three wall wides and all people footage remain video.
  Both retain the v16 cut: **2,287 frames / 1:35:07 at 24 fps**.
- Seventeen new composites occupy main V11 and portrait V12. Lola's existing
  replacement is byte-identical to the website image and remains in place.
  Original RAW, timing, retiming, grades, stabilization, titles and music
  remain underneath. All 31 tracks are locked. V16 is preserved.
- Photographs are registered to the filmed artwork, retaining walls,
  shadows and physical frames. Gianni's approved artist-supplied website
  photograph follows the real 105-frame tilt; filmed shells and the hanging
  bead curtain remain. No artwork was generated.
- Geometry, source hashes, shot ranges and media references are in
  `output/1620-recap/art-photo-v17/plan.json`.
  `scripts/replace-1620-artwork-photos.py` owns the video composites;
  Python/OpenCV is required for feature registration and reprojection.
- Final outputs: `1620-recap-16x9-prores-v17.mov`,
  `1620-recap-16x9-youtube-uhd-60mbps-v17.mp4`, and
  `1620-recap-9x16-instagram-25mbps-v17.mp4`.
  Portrait intermediate: `1620-recap-9x16-prores-v17.mov`.
- Both renders passed all 46 shot comparisons, including three wall wides
  and 18 photographs. Every-frame native border checks found no exposed
  edges or unintended black frames. The original closing fade and black
  card remain. All four exports passed full decode, dimensions, duration
  and frame-rate checks. Main and portrait PCM match within one 24-bit
  code value. Detailed evidence is linked in `recap-edit.json`.
- Native backups: `MCLIV-1620-FINAL-v17.drp`,
  `1620-FINAL-main-v17.drt`, `1620-FINAL-portrait-v17.drt`.
  Resolve is saved on horizontal v17 at the start.

## Full-bleed correction — v16

- **1620 RECAP 16x9 FINAL v16** and **1620 RECAP 9x16 FINAL v16**
  preserve the v15 cut: **2,287 frames / 1:35:07**, all grades, retimes,
  music, titles and Lola's replacement. Both timelines are locked.
- The every-frame scan found rotation edges in both entrances, a thin
  right edge in horizontal C038, and a small lower edge in the portrait
  selfie. Earlier midpoint checks missed them.
- Each entrance now sits inside an editable native compound clip. The
  original RAW, retiming, rotation and grade remain inside. Outer zoom is
  **1.11 horizontal / 1.04 portrait**. The first direct Inspector zoom
  attempt did not change the entrance render and was rejected.
  Horizontal C038 zoom is **1.133** (3% above 1.10); portrait selfie zoom
  is **1.02**. No other framing changed.
- Accepted movies have the **v16-r2** suffix. Initial v16 movies are
  preserved trials and are not deliveries:
  - `1620-recap-16x9-prores-v16-r2.mov` — UHD ProRes 422 HQ.
  - `1620-recap-16x9-youtube-uhd-60mbps-v16-r2.mp4` — UHD H.264, 60 Mbps.
  - `1620-recap-9x16-instagram-25mbps-v16-r2.mp4` — 1080 × 1920 H.264,
    25 Mbps.
  - `1620-recap-9x16-prores-v16-r2.mov` — portrait ProRes intermediate.
- Both accepted masters passed every-frame picture scans and native
  resolution checks of the outer four pixels: no exposed borders or
  unintended black frames. The native 141-frame closing fade and black
  end card remain. Their nine near-black frames are intentional.
- Native proof includes the nested entrance RAW and confirms all 46
  shots retain source ranges, duration, retiming and color values.
  Evidence: `edge-fix-native-verification-v16.json`,
  `full-bleed-16x9-v16-r2.json`, `full-bleed-9x16-v16-r2.json`,
  `final-output-verification-v16-r2.json` and
  `portrait-native-framing-v16.json`.
- Final native backups: `MCLIV-1620-FINAL-v16-r3.drp`,
  `1620-FINAL-main-v16-r3.drt`, `1620-FINAL-portrait-v16.drt`.
  The r3 backup records the verified final main V1 lock. MCP track-lock
  calls reported success without changing that lock; the Timeline menu
  applied it and readback confirmed all 29 tracks locked.

## Previous delivery — v15

- AKLO's latest **1620 RECAP 16x9 LOCKED v14** is the source. Two painting
  trims remove 17 frames. Final duration is **2,287 frames at 24 fps /
  1:35:07**. All 49 user picture/audio items retain their timing, sources,
  retimes, effect settings and correction values.
- **1620 RECAP 16x9 FINAL v15** adds only Lola Jiblazee's replacement on
  V10, frames **1798–1838**. The supplied photograph is corner-pinned into
  the original glass opening. The physical frame, wall and shadow remain.
  No artwork was generated. Original RAW remains underneath.
- Source asset: `assets/1620/lola-jiblazee-recap-photo-v15.jpg`.
  `scripts/replace-1620-lola.mjs` owns the deterministic video composite.
  Accepted media is `lola-photo-on-original-wall-v15-r2.mov`; the first
  trial remains available. Outside the replacement, 99% of measured wall
  pixels differ by at most one 8-bit code value after compression.
- **1620 RECAP 9x16 FINAL v15** matches every cut and retime. V11 holds
  all 18 complete painting inserts, including the real Gianni tilt.
  Seventeen verified v14 extension clips are reused; Lola uses
  `portrait-wall-C060-v15.mov`. Prior full-screen subject reframes,
  C038 zoom 1.06 and centered 1620 cards remain. Both final timelines
  have all tracks locked.
- End card: **2191–2287**. Music retains six frames in, 230 frames out,
  and no loop. Main and portrait decoded PCM match within one 24-bit
  code value. Source RAW grades remain editable beneath baked inserts.
- Final files under `output/1620-recap/`:
  - `1620-recap-16x9-prores-v15.mov` — UHD ProRes 422 HQ, 10-bit,
    stereo PCM 24-bit/48 kHz.
  - `1620-recap-16x9-youtube-uhd-60mbps-v15.mp4` — UHD H.264,
    60 Mbps target, 59.874 Mbps measured video, AAC 320 kbps.
  - `1620-recap-9x16-instagram-25mbps-v15.mp4` — 1080 × 1920 H.264,
    25 Mbps target, 24.948 Mbps measured video, AAC 320 kbps.
  - `1620-recap-9x16-prores-v15.mov` — portrait ProRes intermediate.
- All four files passed full decode, dimensions, frame-count, duration
  and audio checks. All 46 shot midpoints and both cards were checked in
  each format. Native proof excludes only revision counters and portrait
  canvas/transform matrices from color-graph comparison.
- Backups: `MCLIV-1620-user-source-v15.drp`, `MCLIV-1620-FINAL-v15.drp`,
  `1620-FINAL-main-v15.drt`, `1620-FINAL-portrait-v15.drt`.
  Evidence: `final-native-verification-v15.json`,
  `final-output-verification-v15.json`, `lola-wall-preservation-v15.json`
  and `user-changes-v15.json`. Current trims and media references are in
  `assets/1620/recap-edit.json`. Prior outputs remain. Nothing was published.

## Storage cleanup — October 16, 2026

Five superseded full-length exports (26.77 GiB) were copied to the external
`ARCHIVE02/projects/mcliv/output/1620-recap/` archive, SHA-256 verified, and
removed from the laptop output folder: `1620-recap-16x9-UHD-v1.mov`,
`1620-recap-16x9-prores-v11.mov`, `1620-recap-9x16-prores-v11.mov`,
`1620-recap-16x9-prores-v13.mov`, and `1620-recap-9x16-prores-v13.mov`.
None is referenced in `MCLIV-1620-LOCKED-v14-r2.drp`. Current v14 delivery
files, source footage, titles, wall-extension media, timeline exports, and
project backups remain unchanged. Earlier sections describing these five
movies in the laptop output folder now refer to their archived copies.

## Previous locked delivery — v14

- AKLO's final **1620 RECAP 16x9 v13_archived_v02** is the authority.
  **1620 RECAP 16x9 LOCKED v14** preserves all 49 picture/audio items,
  source ranges, retime maps, clip grades and effect payloads exactly.
  Only the disabled guide extending beyond the programme was removed from
  the new duplicate. The source timeline remains available.
- Main and **1620 RECAP 9x16 LOCKED v14** are **2,304 frames at 24 fps /
  1:36**. All tracks in both final timelines are locked. There are 46 RAW
  shots: 24 crowd/interaction shots, three wall views, one entrance and
  all 18 painting close-ups, each once.
- The end card starts at frame **2208** and lasts 96 frames. AKLO's music
  fade remains **230 frames**, with six frames in and no loop. Portrait
  uses the same audio source, trims, fades and effects. Decoded portrait
  PCM differs from main by at most one 24-bit code value.
- Portrait was duplicated from the locked main. All cuts, source ranges,
  retime maps and correction-node color values match. Centered portrait
  cards retain the main card timing. V10 contains 17 complete painting
  inserts with source-wall extensions plus the real Gianni Lee tilt,
  regenerated from the final main render. RAW remains underneath.
  Changing RAW grades would require regenerating these extension files.
- The first portrait render exposed a thin stabilization edge in C038.
  Its portrait zoom is now **1.06**. The accepted portrait files have the
  **v14-r2** suffix; the first trial is preserved but is not a delivery.
- Final files under `output/1620-recap/`:
  - **1620-recap-16x9-prores-v14.mov** — UHD 3840 × 2160, ProRes 422 HQ,
    10-bit, stereo PCM 24-bit/48 kHz.
  - **1620-recap-16x9-youtube-uhd-60mbps-v14.mp4** — UHD H.264,
    60 Mbps target, 59.875 Mbps measured video, AAC 320 kbps.
  - **1620-recap-9x16-instagram-25mbps-v14-r2.mp4** — 1080 × 1920 H.264,
    25 Mbps target, 24.948 Mbps measured video, AAC 320 kbps.
  - **1620-recap-9x16-prores-v14-r2.mov** — portrait ProRes intermediate.
- All four files passed full decode, dimensions, frame-count and duration
  checks. All 46 shot midpoints and portrait start/mid/end samples for
  26 moving shots were checked. The corrected portrait has no unintended
  black frames or black borders. Main remains exactly as AKLO locked it.
- Backups: **MCLIV-1620-user-locked-source-v14.drp** before changes,
  **MCLIV-1620-LOCKED-v14-r2.drp**, **1620-LOCKED-main-v14.drt** and
  **1620-LOCKED-portrait-v14-r2.drt**. Resolve is saved on locked main.
- Evidence: **locked-delivery-verification-v14.json** links the final
  preservation, conform and render checks. Source plans are
  `portrait-reframe-plan-v14.json`, `portrait-native-framing-v14-r2.json`,
  `portrait-wall-plan-v14.json` and `gianni-portrait-extension-v14-r3.json`.
  Earlier creative exports remain. Nothing was published.

## Previous final edit — v13

- Project **MCLIV 1620 RECAP v3** uses **1620 RECAP 16x9 v13** and
  **1620 RECAP 9x16 v13**. Both are **2,574 frames at 24 fps / 1:47.25**.
- AKLO's manual changes after v12 are the source of truth. All 50 native RAW
  items, including hidden alternates, retain the revised timing, source ranges
  and color correction values. The visible cut has 47 RAW shots, including
  25 crowd/interaction shots, three wall views and all 18 painting close-ups.
- Picture ends at frame 2478. A four-second inverted opening card follows:
  white type and logos on black. The music fades over those 96 frames to
  silence. The original non-looping soundtrack and its level are preserved.
- Portrait was duplicated from this revised main cut and rebuilt at
  **1080 × 1920**. Each crowd shot uses full-height fill with subject framing.
  Both portrait cards place **1620 at the horizontal and vertical center**;
  the date and description sit close to it.
- V10 holds 17 complete artwork inserts with source-wall extensions. Gianni
  Lee keeps the real moving tilt; its portrait extension uses aligned captured
  frames from the same shot. Accepted media is
  `portrait-wall-C054-real-tilt-v13-r3.mov`; earlier trials are not used.
  RAW clips remain underneath. These extension clips contain the main grade;
  later RAW grade changes require regenerating the extension media.
- **1620-recap-16x9-prores-v13.mov** is UHD 3840 × 2160.
  **1620-recap-9x16-prores-v13.mov** is 1080 × 1920. Both are ProRes 422 HQ,
  10-bit, with stereo PCM 24-bit/48 kHz. Both passed full decode and duration
  checks. Portrait has no unintended black frames or black borders; all 47
  shot midpoints and 27 moving-shot start/mid/end samples were checked.
  Decoded audio differs from main by at most one 24-bit code value.
- Backups: **MCLIV-1620-user-cut-before-end-v13.drp** (before changes),
  **MCLIV-1620-RECAP-v13.drp**, **1620-final-main-v13.drt**, and
  **1620-final-portrait-v13.drt**, under `output/1620-recap/`.
- Evidence: `main-native-verification-v13.json`,
  `main-final-verification-v13.json`, `portrait-native-verification-v13.json`,
  `portrait-final-verification-v13.json`, `portrait-wall-plan-v13.json`, and
  `gianni-portrait-extension-v13-r3.json`. Earlier creative exports remain.

## Previous intro revision — v12

- Project **MCLIV 1620 RECAP v3** now uses **1620 RECAP 16x9 v12** and
  **1620 RECAP 9x16 v12**. Only the opening title media changed.
- The lower-right NYC Culture Club text is removed. The top-right logo and
  all other element positions remain. Text holds until frame 77 and shares
  the white card's fade curve through frame 89. Its fade starts 29 frames
  later than before. The entrance and all later cuts retain their timing.
- Source: `assets/1620/motion/src/RecapTitles.tsx`. New alpha media:
  `title-opening-animated-before-16x9-v6.mov` and
  `title-opening-animated-before-9x16-v6.mov`. These are reversible selected
  takes; prior timelines and media remain available.
- Both native timelines, title renders, alpha curves and Resolve transition
  frames were checked. All 52 RAW items per format retain correction values,
  retimes, sizing and group links. Evidence: `intro-verification-v12.json`.
- Native backup **MCLIV-1620-RECAP-v12.drp** and timeline exports
  **1620-title-main-v12.drt**, **1620-title-portrait-v12.drt** are in
  `output/1620-recap/`. Resolve is on horizontal v12 at the start.
  The full-length ProRes files below remain v11 and predate this title change.

## Previous completed finish — v11

- Resolve project **MCLIV 1620 RECAP v3** contains **1620 RECAP 16x9 v11**
  and **1620 RECAP 9x16 v11**. Both retain the v10 edit: 2,805 frames at
  24 fps, 18 unique painting close-ups, original timing/retimes, portrait
  compositions and one complete song without looping.
- All **27 crowd shots in each format** have native camera stabilization:
  Perspective, Smooth 0.25, Crop 0.50, Strength 1, Zoom on, Camera Lock off.
  The 17 static artwork inserts and three static wall views remain still;
  Gianni Lee retains the real tilt.
- **42 shot grades per format** have small measured neutral-balance and
  density corrections in local version **MATCH v11 — measured**. The six
  user painting grades and entrance correction remain unchanged. Earlier
  local grades remain available. Median neutral-patch RGB spread fell from
  four code values to one; this is image measurement, not chart calibration.
- Shared spatial NR is **enabled, luma 1.0, chroma 4.0**. Temporal NR retains
  the user's live settings. Sharpen radius changed from 0.49 to 0.485.
  Current group details and the API workaround are under Color controls.
- Both **ProRes 422 HQ, 10-bit, stereo PCM 24-bit/48 kHz** exports passed full
  decode and 2,805-frame checks: **1620-recap-16x9-prores-v11.mov** at
  3840 × 2160 and **1620-recap-9x16-prores-v11.mov** at 2160 × 3840.
  The portrait timeline stays 1080 × 1920 and exports at twice that size.
  All 49 RAW-shot midpoints and start/mid/end samples of all 29 moving shots
  were checked in both formats. No black frames or unintended black borders
  were detected. Existing portrait neutral fields remain intentional.
- Audio measures **−14.17 LUFS / −6.99 dBTP**. Sample checks at five positions
  match the prior approved song edit with correlation above 0.99985.
- Native deliverables: **MCLIV-1620-RECAP-v11.drp**,
  **1620-finish-16x9-v11.drt**, **1620-finish-9x16-v11.drt**, all under
  `output/1620-recap/`. The previous project and all earlier exports remain.
  Resolve is saved on horizontal v11, Edit page, 01:00:00:00.
- Evidence: `finish-native-verification-v11.json`,
  `finish-native-project-verification-v11.json`,
  `finish-16x9-verification-v11.json`, `finish-9x16-verification-v11.json`,
  `finish-audio-verification-v11.json`, `finish-motion-comparison-v11.json`.
  `match-plan-v11.json` records the corrections. Initial `match-v11-before/`
  stills were stale and were rejected; `match-v11-before-accurate/` contains
  the frame-accurate baseline used for measurement.

## Previous completed edit — v10 artistic polish, no repeated shots

- Resolve project **MCLIV 1620 RECAP v2**: **1620 RECAP 16x9 v10** and
  **1620 RECAP 9x16 v10**, both **2,805 frames / 1:56:21** at 24 fps.
  Main is UHD; portrait is 1080 × 1920. Both new bodies are on **V8**.
- AKLO’s first **489 picture frames / 20.375 seconds** remain exact in main.
  Native verification compares all 15 original stacked items, their timing,
  source ranges, retime maps and correction-node parameters. The original user
  edit remains in horizontal v8 and its before-final DRT/DRP backup.
- **51 visible events**, 45 visible BRAW source files, **18 painting close-ups
  shown once**. The four rapid close-ups already in the protected opening are
  their only close-up appearances. Repeated crowd setups, painting reprises,
  redundant left-wall wides and the static Gianni bead insert were removed.
  This latest best-moments/no-repeat direction supersedes using every selected
  timeline occurrence. Previous timelines and all rendered versions remain.
- Each filmed B-roll setup appears once. C030 contains four distinct setups:
  entrance, selfie, flower viewer and back-wall viewers. C035 contains the
  opening pointing pair and the later family group. Their selected source
  ranges do not overlap; they are different shots within long camera files.
- Wall progression remains **left → back → right**. The original left-wall wide
  is in the opening; the back wide starts at **54.000 seconds**, and the right
  oblique at **80.833 seconds**. Connected passages include a flower viewer into
  that work, an oblique reveal into the black-and-white work, and portrait
  viewers into the blue portrait. Artwork clusters replace rigid alternation.
  Camera interaction, applause and the broad smiling embrace form the finale.
- Gianni Lee appears once through **C054 source frames 0–159**, a continuous
  real tilt from the painted figure to the draped beads. There is no separate
  C053 close-up or static drape insert. Native stabilization was applied in
  both formats. The other **17 artworks and three wall views** retain exact
  zero-speed holds. All new retiming stays editable on the Edit page.
- New internal cuts follow measured song transients within half a video frame.
  The protected opening and its 489-frame boundary are exempt from resnapping.
  New moving people shots use native speeds **115.789–244.604%**; 250% is real
  time for these 60 fps offspeed files interpreted at 24 fps. Shot lengths vary
  with the action and music phrase, rather than a uniform alternating pattern.
- All **38 new body BRAW correction graphs** retain their prior native values;
  all six user-adjusted artwork grades remain exact, including the four in the
  protected opening. Shared **Pre 3 / Clip 3 / Post 2** remains unchanged.
  Both final timelines have 52 BRAW items including covered/disabled alternatives,
  all correctly grouped with three clip nodes. The original RAW bin still has
  **all 63 files**, verified through MCP. A004 was read only.
- Portrait has the same timing and correction-node color values. Prior manual
  compositions remain; v10 widens the oblique wall view to keep the work visible
  and gives the flower painting full edge clearance. Gianni’s tilt is framed
  at 0.72. C058 uses native held frame 130 in main and 129 in portrait; both are
  motionless full-art views. Portrait v9 and its movie remain preserved.
- Music is one full **Tornado** item from source zero, **no loop**, with no
  camera audio. Both reviews measure **−14.19 LUFS / −6.94 dBTP**. Source/export
  audio checks at seconds 10/30/60/90/114 exceed 0.9998 correlation with zero
  measured shift. Native fades remain six frames in and 24 frames out.
- All exports pass full decode, dimensions and 2,805-frame checks. Reviews have
  no black frames. All 51 cut midpoints, start/mid/end samples for 29 moving
  shots and all 18 artwork views were checked; the two changed portrait crops
  were checked again. All 20 static holds show only codec-level variation.
  Source selection used prior logging plus 19 new tilt/viewer samples; this is
  not continuous review of every raw minute. The UHD master is 785,458,119 bytes.
- Deliverables in `output/1620-recap/`:
  **1620-recap-16x9-review-v9.mp4**, **1620-recap-16x9-master-v9.mp4**,
  **1620-recap-9x16-review-v10.mp4**. The horizontal review is open in QuickTime.
  Native backup **MCLIV-1620-RECAP-v9.drp** passes archive and group-graph checks;
  timeline exports are **1620-polish-16x9-v8b.drt** and
  **1620-polish-9x16-v9.drt**. The before-polish main DRT is preserved too.
- `assets/1620/recap-edit.json` owns current trims, visible opening coverage,
  setup identities and artwork identities. The preparation script validates
  exactly 18 unique close-ups across opening/body and rejects repeated setups;
  it refuses interchange regeneration of this native hand-edited workflow.
  `polish-edit-plan-v8.json` records the assembly. Verification reports use
  `polish-native-verification-v8.json`, `polish-native-project-verification-v9.json`,
  `polish-16x9-review-verification-v9.json`,
  `polish-9x16-review-verification-v10.json`,
  `polish-audio-both-verification-v10.json` and
  `polish-uhd-master-verification-v9.json`.
- Resolve is left on **horizontal v10, Edit page, 01:00:00:00**. The top **V9
  portrait guide** is disabled/locked for clean exports. Keep A004 mounted and
  linked music/graphics available. No material was published.

## Manual edit handoff — October 16, 2026

AKLO moved the entrance and subsequent picture clips 11 frames earlier and took
manual control of retiming and color. The current horizontal v8 timeline is now
the editable authority; the review movies below predate these changes. The title
and disabled guide retained their prior placement when inspected.

Before clearing Fusion, the user-edited timeline was exported to
`1620-before-manual-retime-20261016-v1.drt`. Only the V3 C030 entrance had a Fusion
composition among the 50 inspected video items. Resolve refused composition
deletion; subsequent native graph inspection confirms only `MediaIn1` and
`MediaOut1` remain, directly connected. The Fusion ramp, stabilization and their
animation modifiers are absent. No claim is made about who removed those nodes
during concurrent manual work. The cleared timeline is saved and exported as
`1620-manual-retime-no-fusion-20261016-v1.drt`. Portrait and earlier movies were
not revised in this handoff.

## Previous completed review — crowd, camera and art interaction

- Native project **MCLIV 1620 RECAP v2**: **1620 RECAP 16x9 v8** and
  **1620 RECAP 9x16 v6**, both 1,791 frames / **1:14:15** at 24 fps.
  The horizontal master is UHD; the portrait is 1080 × 1920.
- The first five body shots show a wave, a crowd camera reaction, a pointing
  smile, three smiling guests and a smiling couple. The body has 15 face/crowd
  moments and five art-interaction moments. Weak-focus passing faces, rear-view
  conversation and sparse room walks were removed. The art-viewing rear angles
  remain because the subjects clearly engage with the work.
- Art interaction includes a pair studying a work, their pointing/smiling
  response, a guest photographing wall art, a viewer with a dense crowd behind,
  and a profile studying the blue multi-panel work. All **18 artworks**, the
  Gianni detail and five approved wall views remain. The 24 artwork/installation
  inserts retain exact zero-motion native BRAW holds.
- The opening card is animated before the entrance. Type rises/fades into place,
  then clears by frame 65. Footage starts at frame 77; blank white fades through
  frame 89. The first ceiling frame holds under that fade. The complete tracked
  tilt/walk starts after white clears. The entrance retains heavy stabilization
  and the 6× to normal-speed ramp; normal speed begins at entrance frame 92.
- Body cuts match measured song transients within half a video frame. Audio is
  one original music item, trimmed to the cut, with **no loop**. Both reviews
  measure −14.13 LUFS / −6.74 dBTP. Correlations against the original at seconds
  10/30/50/70 exceed 0.9999, with zero measured timing shift.
- Portrait has eight native Smart Reframes and 12 manual compositions. Seven
  camera/group shots were rebuilt because Smart Reframe omitted the waving
  guest or the best smiles. The other five manual compositions retain viewers
  and artwork together. The earlier portrait v5 timeline/movie remain intact.
- Both final movies pass full decode with no black frames. All 47 cut midpoints,
  three frames from each of the 20 moving body shots, and all 18 complete artwork
  edges were visually checked. Selection uses 305 additional samples across 17
  sources plus the prior 63-source quick log; this is not continuous review of
  every source minute. The revised C030 pair shot shows a phone selfie.
- **MCLIV-1620-RECAP-v5.drp** passes archive/native graph verification. All 63
  original RAW files remain in the pool. Both current timelines have 47 BRAW
  items, three individual correction nodes each and the same shared group:
  Pre three nodes, Post two. The less-yellow/lower-highlight v4 grade remains.
- Reviews in `output/1620-recap/`: **1620-recap-16x9-review-v5.mp4** and
  **1620-recap-9x16-review-v6.mp4**. The horizontal review is open in QuickTime.
  Native timeline exports: `1620-crowd-main-final-v8.drt` and
  `1620-crowd-portrait-final-v6.drt`. Earlier creative outputs remain intact.
- Evidence: `native-project-verification-v5.json`,
  `crowd-native-16x9-verification-v5.json`,
  `crowd-native-9x16-verification-v6.json`, `review-verification-v5.json`,
  `review-verification-v6.json`, `audio-alignment-verification-v5.json`,
  `audio-alignment-verification-v6.json`, and `opening-sequence-verification-v5.json`.
  `assets/1620/recap-edit.json` owns the selection and source trims;
  `crowd-camera-edit-plan-v5.json` contains the current technical cut plan.
- Resolve is left on horizontal v8, Color page at 01:00:18:10 (C044).
  Keep A004 mounted and retain linked music/graphics in the output folder.
  Final creative/color review remains with AKLO. Nothing was published.

## Previous completed review — version 4

- AKLO approved the general v3 cut, then requested approximately 1.5× faster
  pacing, removal of sparse room views, retention of the wide art-wall views,
  beat/transient-based cuts, less yellow in the highs, a lower white point,
  and no music loop.
- **1620 RECAP 16x9 v7** is saved in **MCLIV 1620 RECAP v2**. It is 2,525
  frames / **1:45:05**, with 80 cut events. Three sparse moving room shots
  (C003, C005, C006) were removed; wall views C004/C008/C009/C010/C029 remain.
  All 18 artworks, 19 ISO takes and 24 exact artwork/installation holds remain.
- Local spectral-flux analysis of the original WAV measures approximately
  **150 BPM / 75 half-time**. Cut boundaries follow measured transients within
  half a video frame; retained-shot pace is 1.493× the previous cut. Body order
  and normal source playback speed are preserved.
- Audio is one original `music-tornado-48k24-v1.wav` item, source start zero,
  trimmed to 105.208 seconds. **No loop or repeated bed** is present. Native
  normalization is −14 LUFS, with six-frame fade-in and 24-frame fade-out.
- New clip versions preserve the old grade. Node 3 gain is 0.986/0.988/1.000;
  the C044 test wall is RGB 224/224/224, previously 228/228/224. This is a small
  highlight balance/headroom revision; export comparisons are recorded below.
- Opening stabilization remains in `OPENING_STEADY`. The shorter ramp is in
  Fusion **ENTRANCE_RAMP / SourceTime**, not the timeline speed control:
  6× initially, normal speed from record frame 80 (3.333 seconds), 125 record
  frames total, using the first 445 source frames. A rendered frame at four
  seconds shows the camera inside. All 125 keys were completed; the final key
  reads source frame 444. Native timeline speed therefore reads 100%.
- `1620-rhythm-main-native-readback-v7.drt` and
  `rhythm-native-main-verification-v4.json` verify all cut positions/durations,
  81 BRAW items with three correction nodes each, 24 zero-speed maps, and one
  non-looping music clip. Native art captures half a second apart are identical.
  `rhythm-edit-plan-v4.json` and `audio-transients-v4.json` own the measurements.
- AKLO approved the restart. Resolve reopened, and portrait settings completed
  after moving the playhead away from the opening Fusion shot. The comp remains
  intact; its deletion API returned false. **1620 RECAP 9x16 v4** is now
  1080 × 1920, with the neutral artwork field and all 54 native Smart Reframes.
- The opening now starts with black type on white. It reuses the original motion
  flyer's two logos, header rule, asymmetric twelve-column title split, Helvetica
  Neue and JetBrains Mono. The card holds 28 frames, then the white and black
  type dissolve together through frame 76, revealing the running entrance.
  Separate 16:9/9:16 ProRes 4444 overlays are selected as reversible takes;
  prior title media remains. The portrait Fusion ramp's first source key is 1
  because its MediaIn starts at 1; source 0 caused a first-frame render failure.
  The same first-key correction is applied in the horizontal timeline.
- **Both review-v4 exports are complete.** Each contains 2,525 frames at 24 fps,
  H.264/Rec.709 and stereo 48 kHz AAC. Full decode passes; no black frames.
  Both measure −14.24 LUFS / −6.94 dBTP. All 80 cut midpoints and all 18 complete
  artwork edges were checked in both formats. Audio correlations exceed 0.9999
  at source seconds 10/40/80/100, with zero measured timing shift and no loop.
- Same-pipeline H.264 comparison of the identical C044 hold: wall median changes
  from RGB 226/228/225 to 224/224/224, and the 99th percentile from 229/229/226
  to 225/225/225. The C018 skin/ceiling comparison was also checked. These are
  representative checks, not certification of every shot's color balance.
- **MCLIV-1620-RECAP-v3.drp** passes archive and native graph validation. Each
  current timeline has 81 BRAW items, three active correction nodes per item,
  and the same single shared group: Pre three nodes, Post two nodes. Native
  DRT readback confirms 24 zero-speed maps, 80 cut positions/durations and one
  original music item in both timelines. Earlier outputs remain unchanged.
- Reviews: `1620-recap-16x9-review-v4.mp4` and
  `1620-recap-9x16-review-v4.mp4`, in `output/1620-recap/`.
  Reports: `review-verification-v4.json`, `audio-alignment-verification-v4.json`,
  `rhythm-native-main-final-verification-v4.json`,
  `rhythm-native-portrait-verification-v4.json`, and
  `native-project-verification-v3.json` in the same folder.
  Resolve is on horizontal v7, Color page at 01:00:10:20 (C044).
  Keep A004 mounted and retain the output folder for linked music/graphics.
  Final creative/color review remains with AKLO. Nothing was published.
- An earlier attempt to import `1620-rhythm-main-v7.drt`, an offline modified
  timeline candidate, coincided with Resolve quitting. Root cause is unknown.
  Do not import that candidate or `1620-rhythm-portrait-v4.drt`. The working v7
  was built from **v9 OTIO** plus native MCP/Fusion operations; v8 OTIO is an
  older assembly draft. Native readback DRT files are evidence, not edited inputs.
- Verified backups: `MCLIV-1620-RECAP-before-rhythm-v3.drp` and
  `MCLIV-1620-RECAP-before-new-grade-copy-v4.drp`. The original v6/v3 timelines
  and review-v3 movies remain intact. The previous finished review is 2:42.

## Previous completed review — version 3

Resolve project **MCLIV 1620 RECAP v2**, Local Database, Studio 21.1.1.10.
The original project and all earlier rendered outputs remain intact.

- Horizontal: **1620 RECAP 16x9 v6**, UHD 3840 × 2160, 24 fps.
- Portrait: **1620 RECAP 9x16 v3**, 1080 × 1920, same cut and timing.
- Picture: **3,894 frames / 2:42:06**. The former 90-second limit is removed.
- 81 body events: 50 people, seven moving gallery views, five locked installation
  views, 18 individual artworks and one additional Gianni Lee detail.
- All 18 works and all 19 ISO takes appear. 61 of 63 source files are used.
  C002 is a partial entrance reset; C028 is a two-second camera drop. Both
  remain in the RAW bin. Multiple moments from the longer takes are included.
- People and artworks appear in varied groups, without strict shot/art pairs.
  Most body events last 1.3–2.4 seconds.
- All 63 original BRAW files are in **Master/RAW A004**, with short descriptions
  and edit notes. Source total: 54,186 frames / 37:37.750 / 231,522,201,400 bytes.
  Camera source files were not changed.
- `assets/1620/recap-shot-log.csv` owns the 63 descriptions and catalogue matches.
  Five sampled frames per source support the quick log. This does not establish
  that every good moment in all 37 minutes has been found.
- `assets/1620/recap-edit.json` owns the selected source trims and coverage.
  Both current timelines have one semantic marker per cut event.

## Opening and motion

C001, C003 and C030 remain stacked entrance choices. C030 is the visible
provisional take. It starts at 4×, ramps from 4× to 1× over seconds 3–5, then
plays at normal speed inside the room. The eight-second opening uses the first
20 source seconds. Native DRT readback confirms all ten speed segments.

Heavy stabilization uses tracked translation, rotation and uniform scale in a
native Fusion Transform on the original BRAW. It uses a fixed 16% crop; the
intended tilt and walk remain. A rendered transform test confirms that Resolve
applies the composition. This is not a claim of zero residual opening motion.

All **24 art/installation inserts use exact native BRAW frame holds**, giving
zero camera motion. The 18 main ISO frames were selected from sharpness samples.
Native readback confirms 24 zero-motion maps; two actual art frame captures one
second apart are pixel-identical. Moving originals remain available in the pool.
This implements the stated clean-frame-hold assumption after the optional
hold-versus-live-stabilization question received no answer.

Portrait artwork uses a neutral field to preserve full edges; people and moving
gallery views use Resolve Smart Reframe on 57 events. The horizontal V5 guide is
centered at x=1312.5–2527.5 in UHD. Its source is
`guide-9x16-in-uhd-v4.mov`; disable V5 for clean exports. Portrait guide is V6
and stays disabled. Opening and closing graphics reuse the flyer logo,
Helvetica Neue, JetBrains Mono, motion timing and easing.

## Color controls

Camera metadata: Pocket Cinema Camera 4K, Blackmagic Film Gen 5, 3200 K,
tint 0, ISO 3200. Sensor rate is 60 fps with offspeed enabled; media and edit
play at the intended 24 fps. Camera date 2023-11-04 is not the event date.
Project color science is manual DaVinci YRGB, working in DWG/Intermediate.

All 52 BRAW items in each v11 timeline use group **A004 GEN5 — FINISH v11**:

- **Group Pre-Clip:** temporal NR unchanged; spatial NR enabled at luma 1.0,
  chroma 4.0; camera Gen 5
  CST to DaVinci Wide Gamut / Intermediate. Input tone/gamut mapping and OOTF off.
  The spatial node's old “OPTIONAL” label does not mean it is disabled.
- **Clip:** WB/exposure; contrast/black point; highlights/saturation. These three
  nodes are independent per shot for AKLO to fine-tune. The v11 matching pass
  refines node 3, preserving nodes 1 and 2 and the six user artwork references.
- **Group Post-Clip:** CST to Rec.709 Gamma 2.4, DaVinci tone mapping and forward
  OOTF; slight sharpening, radius 0.485.

Group changes affect both v11 timelines. Clip changes are independent
in the duplicated portrait timeline. Old flat seven-node grade versions remain;
viewing them while grouped would apply the transforms twice. Ungroup first or
restore the pre-group backup when examining those versions.

Group graph writes through ApplyGradeFromDRX were rejected by Resolve. The node
enable API also reported success while native export still showed spatial NR
disabled. The v11 group was corrected in a separate exported project copy,
imported as v3, and verified in native exports, the UI and rendered frames.
Only the v11 timelines use the new group; earlier timelines retain their group.
The live project database was not edited directly.

## Sound

Temporary song: Trouble Andrew, **Tornado**, selected YouTube ID vYs4D85vDuc.
yt-dlp downloaded the best available source: Opus 251, 48 kHz stereo,
126.79 kb/s. The 24-bit WAV is decoded audio, not added source quality.
The current edit uses the full song once, from source zero, without camera
audio or looping. Native fades remain six frames in and 24 frames out.
The older `music-tornado-extended-v3.wav` loop is superseded and is not the
current soundtrack. No release clearance or publication was performed.

## Files and verification

Current review files and native project exports are under `output/1620-recap/`.
Keep A004 mounted and retain that output folder for music, titles and guide links.
The original 90-second v1 reviews, UHD ProRes master and DRP remain unchanged.
The expanded final review exports are version 3; the final DRP is version 2.

`scripts/prepare-1620-recap.mjs vN` validates dynamic cut continuity, source
bounds, all 18 artworks and native source timecode, then uses the installed MCP
OTIO writer. It refuses to overwrite exports. Version 7 is the current assembly
interchange. Import option is **importSourceClips:true**; snake_case is not
accepted by the wrapper whitelist. Always read the actual imported timeline name.
OTIO carries assembly only; the native DRP/DRT owns the variable speed ramp,
Fusion stabilization, group graphs, grades and portrait reframes.

DaVinci Resolve MCP 4.13.1 is the primary control path. Local compatibility fixes
use Resolve 21.1 GetProperties/SetProperties and wait for Smart Reframe completion,
including one second for stale job status to clear. Other old property helpers
can still use obsolete methods; use the verified generic actions.

Focused assembly syntax and source/continuity validation passed. Retime evidence
is in `native-retime-verification-v2.json`. Source sampling is not exhaustive
continuous footage review. C030 and the music remain provisional. Final color,
framing, edit and soundtrack approval remains with AKLO. Nothing was published.

The v2 reviews passed full decode and exact frame-count checks with no detected
black frames. Both measure −14.25 LUFS integrated and −6.95 dBTP. The all-cut
midpoint check found one empty-wall pan; source frames 2374–2425 of C001 replace
it in both final timelines. Start/middle/end source frames and both native
replacement reframes were checked. All earlier versions remain intact.

## Final review checkpoint

- `1620-recap-16x9-review-v3.mp4` and `1620-recap-9x16-review-v3.mp4` each
  contain 3,894 video frames, 24 fps, Rec.709-tagged H.264 and stereo 48 kHz AAC.
  Picture is exactly 162.250 seconds; AAC padding extends the container slightly.
- Both final files decode without errors and measure −14.25 LUFS / −6.95 dBTP.
  The horizontal full-frame check detects no black frames. The portrait replacement
  passes start/middle/end framing; its other 82 cut midpoints and all 18 complete
  artwork edges were checked in v2 and retain their source trims and grades.
- `MCLIV-1620-RECAP-v2.drp` is the final native backup. Archive extraction and
  native graph validation pass: 84 BRAW items in each current timeline, all linked
  to the same group, all with three active clip correction nodes; group Pre has
  three nodes and Post has two. Each timeline remains 3,894 frames.
- Resolve is left on the Color page, horizontal v6 at 01:00:20:00, C044 selected.
  V5 guide remains present, disabled and locked for unobstructed grading. Enable
  it for the centered portrait framing reference; disable it for clean exports.
- Reports: `review-verification-v3.json`, `portrait-final-verification-v3.json`
  and `native-project-verification-v2.json`, all in the ignored output folder.
