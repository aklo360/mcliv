# 1620 proposal scaffold

## Locked working facts

- Title: `1620`
- Positioning: A group exhibition of 18 artists presented by MCLIV.
- Curatorial premise: Artists from all walks of life come together in one cohesive exhibition.
- Work format: Every work is 16 × 20 inches.
- Spatial brief: Three walls, six works per wall, 18 total works.
- Opening: September 16 at 6:00PM ET.
- Venue: NYC Culture Club at Port Authority, NYC.

## Final confirmed roster

John confirmed the final 18-artist roster by text on August 15, 2026. AKLO set the display casing to `AKLO` on August 24, 2026, superseding the earlier lowercase direction. Current order and styling:

Madsteez; Trouble Andrew; Hoxxoh; Jerami Dean Goodwin; Cavier Coleman; Gianni Lee; Steph Costello; John Black; Smurfo; Jason Rohlf; King Saladeen; AKLO; Lola Jiblazee; Gazoo ToTheMoon; NotYourMuse; Keya Tama; Kevin Cincotta; Esteban.

## Open confirmations before public release

- Event year.
- Installation, press, and opening schedule.

## Public flyer facts

- Opening venue: NYC Culture Club, The Port Authority Midtown Bus Terminal, South Wing, Main Floor, 625 8th Ave & W40th St., New York, NY. Parker and Clayton supplied this public-facing venue wording to John on August 18, 2026; John forwarded their correction and AKLO confirmed it the same day.
- After-party venue: Shinsen, 44 Bowery, New York, NY 10013. The official spelling and address were verified against Shinsen's website on August 17, 2026.
- AKLO withdrew the free-Lyft-rides claim as inaccurate on August 18, 2026. On August 19, 2026, AKLO explicitly directed the new 1080 × 1920 public-flyer review variation to retain the exact line `Free Lyft rides to Shinsen for all attendees`. On August 21, 2026, AKLO authorized publication of the current repository work to the public GitHub repository; that direction does not independently verify the offer.
- John's September 13, 2026 brief requests a final reminder flyer with large opening details, the `1620` title, and a 9PM after-party start for now. `content.js` carries the updated time; the preserved earlier flyers and motion proofs still show the superseded 10PM time.

## Source imagery

Fourteen reference photographs were retrieved from the supplied public Instagram carousel and stored in `../reference-instagram/`. They document a prior exhibition and are labeled as linked exhibition references throughout the proposal; they are not represented as 1620 artwork or as the proposed venue.

Source: <https://www.instagram.com/p/DZxjGg4kbMs/?img_index=1>

## Outputs

- `public-flyer-final-v3.html` and `public-flyer-final-v3.css`: current centered text-only reminder. Date and time read SEP 16 / 6PM on one baseline with matched visible letter heights. Title, opening, and venue share one center axis with equal space between groups; `content.js` centers visible glyph bounds to account for tracking and side bearings. GROUP EXHIBITION uses small all-caps JetBrains Mono. The approved campaign stylesheet, exact brand font stacks, and horizontal after-party lockup remain. Square and portrait use one source.
- `exports/1620-final-flyer-square-v11.png` / `.jpg` and `exports/1620-final-flyer-portrait-v11.png` / `.jpg`: current 1080 × 1080 and 1080 × 1920 reminder proofs, awaiting approval. V1 through v10 are preserved, superseded proofs. Regenerate with `node scripts/export-1620-public-flyer.mjs --final <version>`; the exporter protects prior files and checks brand styles, actual fonts, copy, center alignment, and equal gaps of at least 44 px square / 150 px portrait. V11 checks match date/time glyph heights; main text in both PNGs is centered within 0.5 px.
- `deck.html`: current six-page, 16:9 proposal source.
- `website-deck.css`: current deck-only styling, derived from the production MCLIV website's logo, typography, palette, hairlines, image captions, and archive-index patterns.
- `exports/1620-website-deck-v14.pdf`: preserved six-page, 16:9 proposal PDF with the final confirmed artist roster, the superseded lowercase `aklo` styling, and corrected print-faithful 1920 × 1080 scaling.
- `exports/1620-website-deck-v7-page-01.png` through `-06.png`: prior 1920 × 1080 slide proofs.
- `poster.html`: one-page, 4:5 poster concept source.
- `styles.css`: shared poster styling; unchanged by the website-language deck rebuild.
- `exports/1620-poster-concept-v3.pdf`: one-page, 4:5 poster PDF.
- `exports/1620-poster-concept-v3.png`: 1080 × 1350 poster render.
- `mobile-onesheet.html`: current two-page, 9:16 mobile one-sheet source.
- `mobile-onesheet.css`: standalone mobile one-sheet styling in the MCLIV proposal design language.
- `public-flyer-v16.html` and `public-flyer-v16.css`: current single-page public flyer source at exactly 1080 × 1440 pixels; it preserves the v15 composition and removes the standalone `New York, NY` line only from the Port Authority block.
- `public-flyer-v15.html` and `public-flyer-v15.css`: preserved prior source with the standalone Port Authority city line.
- `public-flyer-v14.html` and `public-flyer-v14.css`: preserved prior source with a centered three-line stacked after-party footer.
- `public-flyer-v13.html` and `public-flyer-v13.css`: preserved prior source with the full terminal name and no Lyft claim.
- `public-flyer-v12.html` and `public-flyer-v12.css`: preserved prior source with the confirmed full Port Authority venue wording and the now-withdrawn Lyft claim.
- `public-flyer-v11.html` and `public-flyer-v11.css`: preserved prior single-page public flyer source with the shortened Port Authority location line.
- `public-flyer-v10.html` and `public-flyer-v10.css`: preserved prior source with the edge-labelled Format diagram.
- `public-flyer-v9.html`: preserved prior source with the installation-study caption.
- `public-flyer.html` and `public-flyer-v8.css`: preserved prior white public-flyer source.
- `assets/nyc-culture-club-logo-official.png`: official NYC Culture Club wordmark sourced from the organization’s website header asset.
- `exports/1620-mobile-onesheet-v9.pdf`: preserved two-page, 9:16 mobile one-sheet PDF with the final confirmed artist roster and the superseded lowercase `aklo` styling.
- `exports/1620-website-deck-9x16-v1.pdf` through `v3.pdf`: preserved rejected proofs from the misdirected portrait-deck interpretation; do not use.
- `exports/1620-public-flyer-v20.png`: current 1080 × 1440 public social flyer. It carries forward v19 and removes the standalone `New York, NY` line only from the Port Authority block; the Shinsen address remains unchanged.
- `../motion/exports/1620-motion-flyer-v014.mp4`: current 33.5-second, 1080 × 1920 motion-flyer proof. It carries v013 forward and shortens only the Artists reading hold by one second. All animations, transitions, other holds, and the no-hold 6 × 3 grid timing remain unchanged. This is a working proof and requires visual approval before publication.
- `../motion/exports/1620-motion-flyer-v013.mp4`: preserved prior 34.5-second proof with the longer Artists hold.
- `../motion/exports/1620-motion-flyer-v013-grid-transition.png`: four-frame review sheet confirming the grid animates, exits, and transitions without an extended hold.
- `../motion/exports/1620-motion-flyer-v012.mp4`: preserved prior 36-second proof with an added hold on every screen, including the rejected hold on the 6 × 3 grid.
- `../motion/exports/1620-motion-flyer-v012-contact-sheet.png`: preserved six-frame visual review sheet for v012.
- `../motion/exports/1620-motion-flyer-v011.mp4`: preserved prior 21.77-second proof with the centered September 16 information screen and shorter reading holds.
- `../motion/exports/1620-motion-flyer-v010.mp4`: preserved prior proof with the rebuilt screen-three grid and the repeated 16 × 20 diagram on the September 16 screen.
- `../motion/exports/1620-motion-flyer-v009.mp4`: preserved prior proof with the corrected first-screen title but the rejected layered grid pulse and screen-three-to-artist overlap.
- `../motion/exports/1620-motion-flyer-v008.mp4`: preserved prior proof before the first-screen title correction.
- `../motion/exports/1620-motion-flyer-v008-contact-sheet.png`: six-frame visual review sheet confirming the vertically centered v008 scene system.
- `../motion/exports/1620-motion-flyer-v007.mp4`: preserved prior proof before the vertical-centering, photo-zoom, and third-screen flash corrections.
- `../motion/exports/1620-motion-flyer-v006.mp4`: preserved prior proof with the first shot held 0.5 seconds longer.
- `../motion/exports/1620-motion-flyer-v005.mp4`: preserved prior proof before the title, timing, transition, and installation-count corrections.
- `../motion/exports/1620-motion-flyer-v004.mp4`: preserved prior proof with the two moving edge ticks.
- `../motion/exports/1620-motion-flyer-v004-contact-sheet.png`: six-frame visual review sheet for the current v004 motion proof.
- `public-flyer-9x16-v1.html` and `public-flyer-9x16-v1.css`: current one-page, 1080 × 1920 public-flyer variation source with enlarged typography and the exact Lyft line directed by AKLO on August 19, 2026.
- `exports/1620-public-flyer-9x16-v9.png`: current one-page, 1080 × 1920 public-flyer review output. The complete footer hierarchy is reduced to 14px label, 38px venue, 13px address, and 24px Lyft copy; all groups share one vertical center and the three horizontal transitions remain within a measured 54–57px spacing band.
- `exports/1620-public-flyer-9x16-v8.png`: preserved prior proof with the larger footer typography; do not use.
- `exports/1620-public-flyer-9x16-v7.png`: preserved rejected proof with an imbalanced Lyft wrap that orphaned `all attendees`; do not use.
- `exports/1620-public-flyer-9x16-v6.png`: preserved rejected proof with excessive negative space between the Shinsen address and divider; do not use.
- `exports/1620-public-flyer-9x16-v5.png`: preserved rejected proof that cleared the divider but wrapped the after-party label; do not use.
- `exports/1620-public-flyer-9x16-v4.png`: preserved rejected proof with the Shinsen address overlapping the divider; do not use.
- `exports/1620-public-flyer-9x16-v3.png`: preserved prior portrait-flyer proof with the Lyft statement wrapping to three lines.
- `exports/1620-public-flyer-9x16-v2.png`: preserved prior portrait-flyer proof with the location split across excess lines.
- `exports/1620-public-flyer-9x16-v1.png`: preserved first portrait-flyer proof with footer crowding; do not use.
- `exports/1620-public-flyer-v19.png`: preserved prior render with the standalone Port Authority city line.
- `exports/1620-public-flyer-v18.png`: preserved prior render with a centered three-line stacked after-party footer.
- `exports/1620-public-flyer-v17.png`: preserved prior render with the full terminal name and no Lyft claim.
- `exports/1620-public-flyer-v16.png`: preserved prior render with the confirmed full Port Authority venue wording and the now-withdrawn Lyft claim.
- `exports/1620-public-flyer-v15.png`: preserved prior render with the shortened Port Authority location line and uppercase `AKLO`.
- `exports/1620-public-flyer-v14.png`: preserved prior render with lowercase `aklo`.
- `exports/1620-public-flyer-v13.png`: preserved prior render with the longer Port Authority location line.
- `exports/1620-public-flyer-v12.png`: preserved prior render with the black-on-white Format panel and 10px fine-print floor.
- `exports/1620-public-flyer-v11.png`: preserved prior render with the 8px diagram label.
- `exports/1620-public-flyer-v10.png`: preserved prior dark public-flyer render with the edge-labelled Format diagram.
- `exports/1620-public-flyer-v9.png`: preserved prior dark public-flyer render with the installation-study caption.
- `exports/1620-public-flyer-v8.png`: preserved prior white public-flyer render.
- `exports/1620-mobile-onesheet-v5-pdf-page-01.png` and `-02.png`: prior 1080 × 1920 PDF page proofs.
- `../venue-installed-nb2-v006-smaller-guided/`: current four installation studies, regenerated from the closest clean gallery sources with canvas dimensions reduced approximately 30%. The successful wide-interior v005 render was carried forward without another image-generation pass.

Earlier renders are retained as numbered iterations and are not the current handoff versions.
Deck v10 through v12 are retained as rejected QA iterations; v13 is the first version that contains the complete final roster while preserving every header, diagram, specification, and folio inside the page bounds. Deck v14 carries forward that approved layout with the now-superseded lowercase `aklo` styling. The August 24, 2026 direction restores uppercase `AKLO` in the current HTML source and live route.
Motion proofs v001 through v003 predate the August 18 factual correction and contain the withdrawn Lyft claim; they are preserved as historical proofs and must not be published.
