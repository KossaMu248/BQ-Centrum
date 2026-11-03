# Stage13 independent visual review

These art inspections concern generated bear-only asset proposals, **not in-game screenshots**. Runtime/gameplay verification is separate. Original baby assets are not generated or edited.

## Source likeness reference

Best reference is the top-left standing figure in `assets/art/front-background-v11-2.png`, with `front-carrier-v7.png` for original baby/carrier relative placement and Stage12 `after/rest.png` for ordinary200-pixel appearance. Preserve the large head/short neck, tan protruding muzzle, dark nose, wide white eyes with dark pupils, orange-brown fur, black69helmet, black/yellow/white69jersey, gloves, blackshorts, bluefrontpouch and chunky brown/gray pairedboots. Original baby head is about37logicalpixels versus bearhead about65at200.

## Initial proposal — refinement needed

Candidate `.image-work/stage13/bear-angles-initial.png` SHA256 `aecb4ef5e04f9da16aa90c957458599a43ce1014c974e9984fe0cbfd57a47e29` was visually inspected at its native1536×1024size. No runtime/assets were edited by this reviewer.

- Identity, outlines, palette, compact proportions, empty carrier and two distinct whole-body views match the source family reasonably well. No baby was painted into the asset.
- Right figure has a genuinely rear-oblique torso, helmet nape, back shoulder and heel view. It can keep the front baby visible only at the right/front silhouette. A full135–180degree rear view would hide the passenger and is unsuitable; a gentler100–115degree away-oblique view is preferable.
- Left figure has a frontal chest, but its head remains close to the original right-three-quarter yaw: far eye is tiny and muzzle projects right. Both boots also point mostly right. This is not sufficiently clear as a new toward-camera view at ordinary size. Request a near-frontal20–25degree head with both eyes comparably visible, centred muzzle and properly paired toes toward camera/down with slight outward splay.

This proposal is not final acceptance. New parent art must retain the original continuous BabyPassenger face/neck/collar/clothing, scale and physical front attachment. The original child lowerlegs/blueshoes must also remain; BabyPassenger.draw only supplies the upper-body texture. No approval of numeric rig metadata can substitute for actual200-pixel gameplay and walking clips.

## Source visible scale measured before integration

`source-painted-bounds.json` records16 transparent production-renderer laboratory cases at declared height200, alpha threshold32. Current Centrum idle paints x−52/y−210/width104/height212; selected walking phases paint height207–211. Default source idle paints height211. Therefore simply fitting a new full sprite to a200-pixel bounding box would shrink the parent about5–6%; the directional art should retain the existing visible scale around210pixels at rest while the logical actor remains200 and the original baby scale stays0.571083. These are lab measurements, not gameplay or a camera change. The measurement browser was closed after capture.

## Refined proposal — accepted as asset, pending in-game composition

Candidate `.image-work/stage13/bear-angles-refined.png` SHA256 `334a329ab35f7adeae1407e1223d702c27eb1ecf1d57a35ac61477d8dce21749` visibly changes the toward head to a near-frontal muzzle/two-eye view and gives it correctly paired boots facing down/camera. The away figure retains its real back shoulder/helmet nape/heel angle while keeping the blue front pouch visible at the silhouette. Bear identity, original palette/outlines, helmet/jersey69 and compact proportions match the established family. No baby is painted in the proposed asset. Accepted for renderer integration; this is not a claim that gameplay/animation or the child attachment has passed.

### Original baby anchor insight

The production front `paintPassenger` uses its lip around sourceY294 on the lower blue front-panel divider, not the top edge of the empty carrier nearY240. On this refined sheet the corresponding blue midpanel divider is aroundY565–580; choosing the top opening aroundY475 would place the native baby roughly20worldpixels too high and collide with the bear's tongue. The original baby head extends roughly47–51worldpixels above its native waist. The midpanel anchor retains the source relation: head below the parent's lower face, intact neck/shirt in the upper cavity, lower cut occluded only by the front panel. This coordinate observation needs verification with actual normal-size rendering for all native expressions; it is not permission to shrink or clip the baby.

The refined accepted asset was copied unchanged to `assets/centrum/actors/bear-directions.png`, SHA256 `334a329ab35f7adeae1407e1223d702c27eb1ecf1d57a35ac61477d8dce21749`. This is bear-only generated artwork, not an in-game screenshot. The original baby files are still separate and untouched. Preserve each authored boot's new forward/away orientation when animating; the old side-boot normalisation (`footAngle - atan2(rawToe-rawHeel)`) would incorrectly rotate frontal shoes back sideways if applied blindly.

## Independent normal-size native baby composition — passed

`capture_reference.py` draws the source side and both new views at logical200 in both facing mirrors. The final lab explicitly selects nine original production expressions (idle, laugh, point, terror, brace, excited, leanForward, leanBack, sick) using temporary browser-only resolve/draw wrappers; this keeps the native frame polygon used for fitting consistent with the frame drawn. It does not modify runtime files, create new expressions or claim those fixtures were reached through gameplay. Sick uses the existing v151 source override.

The final54cases passed scale/continuous-collar checks. At284 eligible opaque original face/chin/neck/collar probe locations, the actual composite matched a production baby-only layer at identical transforms within a maximum2/255 RGB difference (declared allowance4/255 for compositing). This supplements file hashes and human inspection; it is not an assertion that every rendered RGBA pixel is identical or proof of animation.

[Six-expression normal200 board](all-moods-normal200.png) and [lean/sick normal200 board](extra-moods-normal200.png) were visually inspected. Both new angles remain distinct in both mirrors; the original face, neck and clothing stay attached above the blue front panel, and original lower legs/blue shoes remain visible. LeanForward reaches forward close to the parent's tongue edge but its face is foreground and unoccluded in the reviewed frames. No baby shrink, cropped neck or head-only replacement was accepted.

[Final results](all-moods-results.json) record54cases, all exact requested native expression names, no JavaScript/console/HTTP errors and runtime hashes. An initial36-case reference run had an implicit missing favicon in the laboratory HTML; the harness now serves only that irrelevant favicon as204. The active game entries already declare an empty favicon. All other asset failures remain observable. The original attempt is labelled separately; it is not a runtime-game defect or part of the final clean result.

These boards are **renderer references, not gameplay screenshots**. Native walking input, view persistence, scene/camera/occlusion, transfers and normal desktop/phone footage require the separate gameplay checks.


## Actual desktop walking review — passed

The first native gameplay captures (before the later diagonal-stop guard correction) were reviewed independently at their original 1280 × 720 screenshot size: `up-2.png`, `down-2.png` and `away-rest.png`. The original side pose, a genuinely frontal toward-camera pose and an away-oblique pose with visible helmet nape, shoulder back and heels are visibly distinct. The original baby remains attached, readable and continuous, including the native lean expressions. The paired boots/calf pieces do not show the earlier duplicate leg column. No obvious ground clipping or scale jump appears in these reviewed frames, and exactly one parked bicycle is visible.

The first real walking recording was also sampled throughout its 13.917-second encoded duration at two frames per second. `actual-walk-contact-before-diagonal.png` is the retained historical contact sheet extracted from that first real recording; it is not generated artwork. It shows movement across the floor, alternating gait, true view changes and the retained view after stopping. The encoded 24 fps is a playback setting, not a measured gameplay frame rate. These samples are a visual interaction check; the separate performance report owns frame-time claims. The capture harness discloses one route-stop setup before the native E dismount/transfer, after which ordinary walking input is used without teleporting.

Phone-landscape touch-emulation, interior traversal and return-to-bicycle review are recorded separately in `../phone-landscape/README.md`. No physical-device or Safari claim is made.


### Final diagonal-stop guard revision

The final runtime adds an active-input guard to view selection; it does not change artwork or baby geometry. Fresh normal-size `north-east-rest.png` and `south-west-rest.png` from the final 19-capture run were independently inspected: the actual nape/heel away pose and frontal toward pose remain after diagonal stopping. The original baby remains continuous and attached and the paired boots remain grounded in these reviewed frames. The final recording has 22.512244 native seconds, 357 captured frames, normal playback speed and SHA256 `af761175839418b1e9352e2592e530389ad687bbb29f1b248150ad3f222a0e11`. The final clip was independently sampled at 1.5 frames per second across its whole duration: `actual-walk-contact.png`. It shows alternating gait, actual floor movement and the four diagonal-stop views without the earlier braking snap. Original baby attachment and paired legs remain clear in the reviewed sequence. The older contact sheet is retained separately and is not claimed to be the final clip.


## Phone-landscape functional visual review — passed

The separate `../phone-landscape/README.md` and `results.json` record an actual Chromium 844 × 390 touch-emulated flow. Seventeen ordinary-size screenshots, a 7.119-second walking recording and an 8.213-second return/remount recording cover the native transfer, four directions, two-touch diagonal, touch pause, on-demand bag, normal reload, all five scenes, both room angles and the same player bicycle. These use one initial route-stop setup and then real touch input; there are no post-setup scene teleports or state grants.

The original-size square up/down, both room angles, transfers, bag and final riding images were independently inspected. The source baby remains recognisable and continuous at ordinary phone-landscape size. The genuine parent views, paired calves/boots and floor attachment remain clear in these captures. Contact sheets sampled from both actual recordings show motion and the original transfer sequence. Maximum original passenger alpha weight remains 1, with no duplication violations; one pending game animation loop and no JavaScript/console/HTTP errors were recorded. The fresh default-health flow remained at 100; it alone cannot detect a heal capped at full health. No physical-device, Safari or performance claim is made by this functional review.
