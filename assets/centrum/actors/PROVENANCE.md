# Approved bear-only directional artwork

On 2026-11-03 (Europe/Oslo client date), the user explicitly answered **“yes create them”** to the request for two matching bear-only toward/away angle poses, preserving the baby's original artwork and physical carrier attachment. This is a specific exception for the missing parent viewing-angle art; it does not authorize replacing the baby, riding artwork, other characters or title screen.

| Runtime PNG | Native pixels | SHA-256 |
|---|---|---|
| `bear-directions.png` |1536×1024 RGBA, alpha 0–254|`334a329ab35f7adeae1407e1223d702c27eb1ecf1d57a35ac61477d8dce21749`|

The sheet contains two newly generated bear-only full-body views: a near-frontal toward view at left, and an away-oblique view at right with the front-pouch edge still visible. Both pouches are empty. **No baby head, face, body, hands, lower legs or shoes were generated.** These are character asset sprites, not in-game screenshots.

Created with the image-generation tool using the active source empty-carrier `assets/art/front-background-v11-2.png` (top-left standing bear) as the identity/style reference, SHA-256 `cda0c3c087261469b6367651241bb955afadb3bd7f66f9cef693c869357a7c5a`. An initial sheet was rejected for retaining too much side-facing head/foot angle in the toward pose. A second edit made that pose genuinely frontal while keeping the away-oblique composition. Final asset review accepted head/helmet yaw, shoulders, paired feet, original bear identity/proportions, black/yellow/white 69 jersey, blue front carrier, outlines and warm source palette. Drafts stay in ignored `.image-work/stage13/`.

The new modular renderer measures body/leg/pouch polygons and anchors against this exact PNG, prepares bounded parts once, and uses the existing source gait for movement. It may omit faint parent-only alpha fringe during preparation. The original continuous BabyPassenger renderer supplies face/neck/collar/clothing at its native source scale; masked original child legs/shoes come from `assets/art/front-carrier-v7.png`. No child pixels are generated or colour-adjusted. The original carrier attachment, side/riding/transfer renderers and all original asset files remain intact.

Actual in-game screenshots and clips are recorded separately after integration. Asset approval alone is not proof of gameplay animation, attachment, grounding or performance; those checks are reported in Stage13 evidence.
