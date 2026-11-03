# Original lower-baby source audit

Read-only inspection of `assets/art/front-carrier-v7.png` in BQ-Centrum. No original artwork, runtime code, donor checkout or Git configuration was edited. The images here are Canvas source references, **not in-game screenshots or generated character art**.

The production BabyPassenger renderer preserves the continuous upper body but deliberately cuts below its measured clothing seam. Current HeroRig retains the original lower legs and blue shoes from the first carrier cell. New bear-only views must retain those original pixels too.

[Measured descriptor](source-masks.json) contains the near/far closed paths, source SHA256 and anchors. Treat the two paths as one union and draw the original image once, preserving the source shoes' mutual occlusion and avoiding duplicate alpha compositing. Do not reconstruct a missing shoe, independently mirror a leg, or resize either leg separately.

- Source cell: `[0,0,384,512]`; source waist/pouch attachment: `[238,298]`.
- Uniform lower source scale: `heroHeight / 488`, or `0.4098360655737705` at hero200.
- Corresponding continuous BabyPassenger scale: `85 / 61 × heroHeight / 488`, or `0.5710830421929589` at hero200.
- Near bare knee/shin: approximately source `[234..260,295..335]`; far shin: `[261..270,303..326]`; overlapping source shoe pair: `[239..287,324..357]`.

The paths exclude the bear's glove, pouch face and the narrow parent trouser stripe behind the left edge of the sole. Render the original lower fragment under the production passenger/pouch foreground. The pouch can then cover the original proximal knee as it does in the current native carrier; the adult's new viewpoint never regenerates the baby.

`source-grid.png` magnifies the original lower-child region beside the source empty-carrier backing for comparison. `mask-preview.png` shows measured outlines and the isolated union on a flat field. Both were rendered in system Chromium154 on Linux, at enlarged reference size solely for pixel inspection. They do not establish final directional-baby attachment; that requires normal-size actual gameplay after the new adult poses are integrated.
