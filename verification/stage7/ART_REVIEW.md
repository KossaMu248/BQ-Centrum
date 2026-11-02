# Environmental art and character review

This stage reuses local source artwork. No character, title screen or replacement environment illustration was generated. Five scene footprints and collision solids are unchanged.

| Existing area | Source artwork retained/reused | Visual emphasis |
| --- | --- | --- |
| Metro Square | `assets/art/metro.png`; prepared source arcade/pizzeria atlas; original bench renderer; `v98_clean_planter.webp` | Original blue T/metro entrance, warm windows, actual arch approach, grounded furniture |
| Shopping Arcade | Distinct `corner-shop` and `workshop` source atlas fronts | Shop windows/awnings and delivery wayfinding toward Door 7 |
| Service Courtyard | Source courtyard atlas; `v98_clean_utility.webp`, `v98_clean_market_crates.webp`, `v60_courtyard_fence.webp` | Utility/storage area, delivery check-in and planted rear fence |
| Billy’s Food Shop | `assets/art/pizzeria-walkable-v7.png`, actual `v142_pizza_wrapper.webp` | Warm counter and original interior; short readable exchanges |
| Bicycle Workshop | `assets/art/workshop-interior-v7.png` | Original repair bench, hanging tools and painted bicycle display |

Active atlas textures remain the source prepared `assets/cache/scene-v19-centrum.png`, `scene-v19-shops.png` and `scene-v19-neighbourhood.png`, with their original crop/ground anchors. Added signs/ground seams are navigation overlays, not new shop or building artwork.

## Missing matched finished artwork

- Functional service gate: matching open/closed gate leaves and posts, with the existing shallow view. The current collidable geometry is labelled **DEV PLACEHOLDER · GATE**.
- Arcade-to-courtyard service passage: a matching illustrated passage/doorway facade. Current navigation geometry is labelled **DEV PLACEHOLDER · PASSAGE**.
- Delivery cage B-04: matching closed/open cage fronts. The existing source market crates are real reused artwork; their functional wireframe enclosure is labelled **DEV · DELIVERY CAGE**.

These are remaining development art gaps. They are not claimed finished scenery. No missing tree/canopy illustration was substituted: existing planter foliage alone moves/fades, while its stone pot remains fixed and opaque. The seven small drifting leaves reuse the source’s pointed leaf motif/palette; they draw below props/actors, never warp the scene or overlay the UI. Reduced motion removes drift/sway.

## Character comparison

Compare actual normal-size stage-7 frames in [the gameplay gallery](README.md) against [the original front carrier](../../references/source/front-carrier-street.png), [walking](../../references/source/front-carrier-walk.png) and [dismount](../../references/source/dismount.png). The [renderer board](../../references/source/renderer-reference-board.png) is explicitly a renderer reference, not gameplay. Original face/neck/collar and carrier attachment, outlines, bear/jersey proportions and bicycle remain byte-identical in source assets/renderers; the comparison results also record native expression/scale audits. New cues select existing point/idle/laugh logic only. The pinned street reference uses a 145-pixel actor and uniform passenger scale 0.4140352056; at the accepted 200-pixel square scale the same ratio is 0.5710830422. The native point frame therefore has a 39.97581295-pixel logical head, with continuous upper body/original collar, rather than a separately resized face.

The same 200-pixel logical actor height and bounded shallow camera apply. Phone landscape covers/crops the same rendered frame; it does not shrink actors to fit an overhead map. At extreme frame boundaries, the cover crop can slide within that frame to protect the head/boots. Physical devices and non-Chromium browsers remain untested; final captures report actual remaining input/art limitations.
