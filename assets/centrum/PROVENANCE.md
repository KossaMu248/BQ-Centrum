# Independent Centrum scenery

These three environmental PNGs were generated and refined for BQ-Centrum on 2026-11-02. They are new independent-project art, not copied donor artwork or in-game screenshots. Generation references were the active pinned `assets/cache/scene-v19-neighbourhood.png` courtyard and `assets/v60_courtyard_fence.webp`: warm brick/stone, olive iron, clear outlines and autumn ivy in the accepted shallow side/front view. No source character, source environment atlas, title screen, actor scale, scene floor or camera was replaced. A later small passage-jamb collision repair is documented below.

The initial cage had an opaque paper background; it was rejected and refined to true transparency. The gate was refined to narrow, fixed metal posts and a clear open gap. The passage was refined to a broad, transparent standing opening. All final PNGs have real alpha spanning 0–255. Existing `assets/v98_clean_market_crates.webp` remains separate, visible through the mesh and moved by the original caretaker animation; cargo is not baked into the cage or added to food inventory. Labels remain game-rendered text.

| Final file | Native pixels | SHA-256 |
| --- | --- | --- |
| `service-gate.png` | 1877 × 838 | `570c2238cb0d0e5a339d191581313ed5071504773bd5ae4378e4a478b3fb5f68` |
| `service-passage.png` | 912 × 1724 | `65b1829a4be6e71344b30d964682d2413debf17c6b987664a6a8bfd6ac6be18b` |
| `delivery-cage.png` | 2172 × 724 | `969ed1af10111cf56208e6fe362b3c2788c09cf6f21cb0ea02e11d2950bcb5ac` |

## Reviewed runtime geometry

`js/centrum-scenery.js` loads only these images and draws uniformly scaled crops. It creates no input listener, timer, animation loop, storage write or simulation. Required images decode during scene preparation; a failed load rejects preparation and can be retried. Explicitly labelled development geometry remains the fallback if an approved image is unavailable.

- **Gate:** closed crop `(91,140,764,556)`, open crop `(1024,140,764,556)`. Both use the same 132-world-unit width and 0.17277487 uniform scale, yielding 132 × 96.06283. Common base is `(1360,803)` in Metro Square and `(1025,633)` in Service Courtyard. Art remains within the old 132 × 118 maximum; the permanent 14-unit post solids and closed-leaf solid are unchanged. The open gap is transparent and the posts stay in the same place to within one world unit.
- **Passage:** crop `(60,55,790,1550)`. Uniform fit in `(969,196,180,354)` gives 180 × 353.16456, with common base 550 and opening centre approximately x1060. This art-only placement aligns the visible threshold with existing exit `(1060,550)`. It replaces the too-small initial 105 × 200 visual placement; scene dimensions, floors and exit IDs are unchanged. Final actual-return review found the old `(985,550,-1)` arrival inside the painted left jamb. The named `from-courtyard` arrival is now `(1048,586,-1)` on the clear approach; a 35×13 jamb footprint at `(979,537)` matches the visible base. The lower jamb redraw is foot-sorted at550, while its upper facade remains behind the baby. The Door 7 sign sits beside the entrance.
- **Cage:** closed crop `(0,0,1000,724)`, pivot `(483.5,683)`; open crop `(1014,0,1158,724)`, local pivot `(483.75,683)`. Both use measured native front-post span 678.5, mapped to 130 world units at common ground anchor `(785,575)`. Uniform scale is 130/678.5. The open leaf extends to the right without shrinking or moving the enclosure body. Transparent interiors preserve the separate source cargo. The existing crate solid, inspect anchor `(785,620)` and quest states are unchanged.

Actual Chromium gameplay review frames and machine-readable render positions are under `verification/stage9/art/`. They use disclosed canonical save fixtures to inspect closed/open states, followed by native movement. Desktop is 1280 × 720; 844 × 390 is Chromium phone/touch emulation, not a physical phone or Safari claim. The caregiver, continuous original baby upper body and native 200-unit hero presentation remain the source renderers. See the stage test report for broader end-to-end verification.
