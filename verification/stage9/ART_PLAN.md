# Stage 9 environmental-art audit

Read-only audit of the local BQ-Centrum source and runtime, 2026-11-02. The initial audit read no donor checkout or website and modified no source art. The implementation below followed the audit after the parent agent generated and reviewed an environment-only kit.

## Result

The copied assets provide good style/material references and the existing commercial cargo, but no complete isolated gate kit, service-passage facade or closed/open delivery-cage front. Replacing the remaining development geometry with a shopping cart, garden fence or old panorama would change its identity or create visibly mismatched art. New **environment-only** artwork is appropriate for these three gaps; the source characters and existing building fronts should remain unchanged.

## Actual files inspected

| File | What is actually present | Usable role |
| --- | --- | --- |
| `assets/cache/scene-v19-neighbourhood.png` | Active prepared neighbourhood atlas. The courtyard crop is x835,y58,w682,h471, foot x1176,y528. It includes warm brick, dark iron, autumn ivy and an integral open arch/gate. | Best style/material reference for new gate and service passage. Existing courtyard building stays in place. |
| `assets/art/neighbourhood-buildings-v5.png` | Original fallback for that same atlas, not a separate new gate set. | Source reference/fallback only. |
| `assets/cache/scene-v19-centrum.png` | Active arcade and corner-shop fronts with painted stone/brick, warm lighting and existing shop identities. | Passage palette, perspective, outline and paving reference. Do not replace these fronts. |
| `assets/cache/scene-v19-shops.png` | Active workshop/pizzeria facade art. | Existing storefront view/style reference. |
| `assets/v60_courtyard_fence.webp` | Planted stone retaining wall with an angled iron railing; no gate leaf or open/closed states. | Already reused rear boundary; not a functional gate replacement. |
| `assets/v95_garden_screen.webp` | Tiny wooden garden screen with posts and plants. | Decorative fence; too small/different to relabel as the existing iron gate. |
| `assets/env_park_props.webp` | A mixed low-resolution prop sheet: lamp, retaining wall, garden screen, rocks and notice board. | Existing decoration, no missing functional asset. |
| `assets/v98_clean_market_crates.webp` | Transparent produce crates/market stock with an ICA note, native 275×126. | Retain inside/behind the cage and during the caretaker’s delivery animation. Cargo remains non-edible and separate from inventory. |
| `assets/v53_props_cart.webp`, `assets/v60_cart_hazard.webp` | A shopping cart and overturned shopping-cart hazard. | Neither is a secure delivery cage. Do not rename one to fake the missing asset. |
| `assets/art/painted-hazards-v5.png` | Painted scooter, shopping cart, barrier, cones, glass and pothole. | Metal texture reference only; not a cage asset. |
| `assets/v58_unique_03/04/06/07/08.webp` | Old 1200×440 composited metro/market panoramas with sky/buildings, not isolated doorway art. | Unsuitable for replacing the active scene’s source fronts or the functional passage. |

The integral courtyard arch is approximately source x1020–1225,y337–528 within the active atlas. Its iron leaves are painted as narrow open details inside the building; there is no matching isolated closed leaf, front post pair or delivery-cage geometry. Cropping that whole arch into the current 105×200 passage would require severe squashing or a footprint change. Keep it as reference rather than misrepresenting it as a complete reusable kit.

## Geometry to preserve

The existing scene data and interaction IDs should stay unchanged. Art can extend a few transparent pixels for outlines/shadows, but may not imply a new walkable region.

| Element | Current visual anchor/size | Existing interaction and collision contract |
| --- | --- | --- |
| Square gate | Origin 1360,795. Posts span local x−66..−52 and52..66, local y−110..8. Total visible body about132×118. Ground sort803. | Permanent post footprints1294,783,14,20 and1412,783,14,20. Closed leaf1310,785,100,14. Exit1360,820. |
| Courtyard gate | Origin 1025,625; same local art geometry. Ground sort633. | Permanent post footprints959,613,14,20 and1077,613,14,20. Closed leaf975,615,100,14. Exit1025,650. |
| Arcade side passage | Current visual rectangle995,405,105,200; inner passage1006,420,94,185; threshold1053,602. Drawn behind the actors. | `courtyard-passage` exit1060,550; destination `service-courtyard/from-arcade`. Return anchor `shopping-arcade/from-courtyard`985,550 facing−1. Floor/solids unchanged. |
| B-04 cage | Current enclosure rectangle720,466,130,110, ground anchor785,575. Source crates behind the front bars at730,535,110,40. | Inspect anchor785,620 radius75. Existing crate solid and quest progression unchanged. The caretaker moves source cargo after approval; the baby/player never carries it. |

## Recommended new environment kit

1. **Gate closed/open:** transparent shallow front/side sprites, common exact pivot/base/post positions. Weathered dark green/charcoal iron, warm painted stone posts, restrained autumn leaves/ground shadow. Closed leaf spans the existing100-unit clear gap. Open art must leave the clear gap genuinely transparent, with leaves parked beside the same posts. Permanent posts remain opaque/collidable. No people, baby, bear, bicycle, replacement scenery panorama, text or interface baked into the asset.
2. **Open service passage:** transparent environmental facade sized to the existing105×200 placement, with warm brick/stone jambs, dark iron/wood detail, restrained warm lantern and shallow paved approach. Preserve an unobstructed approach around1060,550. Do not paint stairs requiring different movement, a new district, station or extra storefront. Keep readable Door 7/delivery labels rendered by the existing game text code rather than relying on generated lettering.
3. **Delivery cage closed/open fronts:** transparent130×110 equivalent fronts with common pivot/base. Small practical metal storage enclosure with weathered charcoal/green outline and clear open/closed panel states. Keep the actual source crates as separate cargo; do not bake a huge pizza crate or a person into the new cage. A rear layer can draw before the source crates; closed/open front layer after them. Existing B-04 label remains runtime text and quest cargo stays separate from food slots.

Generate at a larger resolution and scale uniformly to the existing placement; avoid per-axis squashing. Prefer one sheet with measured, clearly separated cells or individual files with the same transparent canvas/pivot per state. New artwork should be reviewed in real gameplay next to the source fronts, furniture and unchanged 200-pixel bear/baby—not judged only as a standalone illustration.

## Reference inputs and real context

Best pure environment references for generation: active source neighbourhood and centrum atlas images plus `v60_courtyard_fence.webp` and `v98_clean_market_crates.webp`. Those contain no characters. If a gameplay context frame is used, explicitly exclude its actors/UI from generated output.

Real context captures already available:

- `verification/stage7/after/desktop/shopping-arcade.png`: source storefronts and current service-gap location.
- `verification/stage7/after/desktop/service-courtyard.png`: existing courtyard, utility, cage/cargo and gate placement.
- `verification/stage8/full-route/07-open-shortcut.png`: actual opened shortcut and scale in the playable task.
- `verification/stage7/after/phone-landscape/delivery-passage-and-resident.png`: normal-size phone view and source resident context.

Keep all source files byte-identical. Put any new approved environmental artwork in an explicitly named independent-project asset folder and record its provenance honestly. Generated sprite sheets are development art assets, never claimed to be actual in-game screenshots; capture new real gameplay after integration.

## Implemented review outcome

The new environment-only files and final hashes/crops are recorded in `assets/centrum/PROVENANCE.md`. Source atlas, source cargo and all character artwork files remain unchanged; the separately documented optional rig adapter is checked by strict source reconstruction. `centrum-scenery.js` supplies a small decoded-image/draw layer without listeners, storage, timers or animation loops. `centrum-square-world.js` retains the old, explicitly labelled fallback and uses the reviewed gate/passage when decoded. The delivery-cage draw in `centrum-story.js` retains the original quest/caretaker/cargo behavior. The initial art-only pass kept scene/floor/interaction/exit/solid data intact. The subsequent named-arrival/jamb repair is documented below; scene floors and IDs still remain intact.

Actual renderer review found the first passage placement too small and 55 units below its physical exit. The final art-only placement uses a uniform 180-unit width and approximately 353-unit height, with its base at y550 and opening centre at x1060, matching the existing exit. The runtime Door 7 label moved beside the opening. Gate posts/base retain the existing collision positions in closed/open states, and the final cage uses a common front-post pivot so its open leaf does not shrink or shift the body.

Real Chromium review captures cover gate closed/open, passage and cage closed/open in desktop 1280×720 and phone landscape 844×390 touch emulation, plus a separate frame during the existing source-cargo/caretaker movement. The review uses disclosed canonical state fixtures followed by native movement; it is supplementary art evidence, not a claim of a no-debug full quest run. See `verification/stage9/art/results.json` and `frames.sha256`. The source baby remains continuous with the original collar at native 200-unit hero height in every capture.

An additional `art/gallery.html` renderer fixture and `art/environment-fixture.png` show the reviewed open/closed states side by side, with explicit **not gameplay** labelling and common ground guides. The gallery confirms clear alpha openings and consistent post/body pivots. It is supplementary asset geometry evidence, separate from real gameplay captures.


### Final return-entry correction

The expanded standing-height passage revealed that the former arcade arrival985,550 sat inside the painted left jamb. Final integration moves the same named `from-courtyard` anchor to1048,586,facing−1, adds a35×13 solid at979,537 matching that base, and repaints the lower jamb in foot order at550. The upper facade stays behind the source baby. Floors, room dimensions, IDs, camera and the existing exit1060,550 remain unchanged. This is a focused alignment/collision repair, not a new passage or expanded scene. Subsequent real return/collision verification is recorded in the stage gameplay report.
