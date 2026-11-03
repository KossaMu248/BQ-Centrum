# Stage11 source pose audit

Read-only inspection of target BQ-Centrum on 2026-11-03. Working directory `/workspace/BQ-Centrum`; origin `https://github.com/KossaMu248/BQ-Centrum.git`. No donor was read and no runtime/art/Git file was edited by this audit. New evidence files are confined to this directory.

## Actual artwork finding

All visually inspected active and adjacent on-foot bear sheets use a shallow right-facing three-quarter view, mirrored for left. There is **no dedicated authored actor-up/down walking row** in those sources. `front` / `back` name the passenger attachment: front pouch / backpack. `state.baby` selects that attachment; it is not a direction flag. Changing it on an up/down input would move the passenger between carriers without a transfer.

| Source | Exact runtime crop/origin | Meaning |
| --- | --- | --- |
| `assets/art/front-carrier-v7.png` | torso `[51,13,256,377]`; origin `[179,500]`; stature488 | Active front-pouch walking upper body. Right-facing three-quarter bear. |
| `assets/art/back-carrier-v11.png` | torso `[252,4,310,398]`; origin `[414,516]`; stature507 | Active backpack upper body. Same actor view, baby behind shoulder. |
| `assets/art/bear-near-contact-v18.png` | `[52,62,1224,1117]`; waist `[655,115]`; floor1179 | Active lower-body contact pose. |
| `assets/art/bear-near-support-v18.png` | `[1225,115,314,471]`; waist `[1395,140]`; floor586 | Active lower-body support pose. |
| `assets/art/bear-far-poses-v18.png` | contact `[6,122,428,326]`, waist `[205,139]`, floor448; support `[449,113,306,331]`, waist `[600,130]`, floor444 | Active alternate lower-body poses. |
| `assets/art/bear-idle-lower-v18.png` | `[170,94,1021,1085]`; waist `[650,145]`; floor1179 | Active stationary lower body. |
| `assets/art/matched-legs-v11.png` | near boot `[160,370,712,433]`; far boot `[1077,372,642,421]` | Matching authored boots; same side/front view, no new direction row. |
| `assets/art/carrier-walk-v7.png` | Eight painted side-walk cels | Adjacent original art, not current HeroRig gait source; no forward/rear row. |
| `assets/art/carrier-reactions-v11.png` | front hurt `[61,7,515,705]`, origin `[315,705]`, stature696; collapse `[747,102,664,604]`, origin `[1085,704]`; defeated `[1528,173,592,530]`, origin `[1835,701]` | Action reactions, not direction frames. |
| `assets/art/brawler-bear-v9.png` | Existing combat row, visually inspected | Carrier absent. It cannot substitute for walking baby/parent. |

`bike-transfer-v7.png` has six established actions, with crop/origin tuples `[57,13,490,484,307,495]`, `[607,9,341,493,780,500]`, `[1121,8,304,494,1258,500]`, `[110,516,347,493,258,1007]`, `[604,515,340,495,772,1008]`, `[1112,517,287,495,1259,1010]`. The last four use `drawAuthored` as `transfer2`…`transfer5` at height/488. They are still three-quarter transfer actions with specific arms/carrier/baby positioning, not an authored depth walk.

The original continuous baby comes from `baby-passenger.js` definitions: the original `baby_pose_*` WebP head/neck/collar/shirt/upper torso, with explicit v151 excited/sick overrides. HeroRig removes the old carrier-sheet baby head/upper torso as a union, restores the matching background, and draws the continuous source baby behind the measured pouch lip. Front head box `[183,173,83,85]`, neck `[232,255]`; back head box `[270,79,84,78]`, neck `[320,154]`. The passenger uses source head height/61 as one uniform scale; directional posing must preserve it and move the pouch/passenger/attachment together.

## Playable recommendation

Use the same physically selected carrier with a modest, movement-derived directional three-quarter posture: opposing shoulder/pelvis lean, direction-dependent foot stagger/contact depth and restrained whole-pouch/passenger motion for up versus down. Keep the face readable and native baby scale fixed. Do not use backpack state as rear-facing actor, stretch/rotate a whole side sprite into an overhead view, or substitute combat/transfer actions as ordinary movement. Drive any optional posing from collision-resolved travel and retain the original path outside Centrum.

This can make up/down look visibly different while preserving the authored likeness. It should be described as **directional posing of the source three-quarter rig**, not dedicated authored front/rear animation. A true front/back silhouette is unavailable in the inspected source art and would require separately authorized matched artwork.

## Reference evidence

`reference.html` draws the production HeroRig/BabyPassenger/Locomotion renderers at requested200 hero height. `source-renderer-reference.png` is a renderer contact sheet, explicitly **not gameplay**. It shows front/back attachment, mirrors, ordinary walking and transfer/hurt actions; `renderer-audit.json` records real renderer source rectangles, scales and continuity checks for all12 examples. Chromium produced the sheet with zero JavaScript errors, and every passenger audit reports continuous original upper body/collar. It is supplementary source/reference evidence, not proof of gameplay or animation verification.
