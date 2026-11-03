# Stage 13 phone-landscape functional evidence

These are actual rendered gameplay captures from local system Chromium **154.0.8037.57**, an 844 × 390 viewport, device scale 1, `is_mobile=True` and `has_touch=True`. This is **Chromium emulation, not a physical phone, iPhone or Safari test**. Build: `BQ_CENTRUM_STAGE13`. Runtime hashes and full audits are in [results.json](results.json).

The [capture harness](../art-review/capture_phone.py) uses one disclosed debug warp to the existing route parking stop. Thereafter all movement and doors use sustained CDP `Input.dispatchTouchEvent` touch points, two-finger diagonal input and native touch taps. No scene teleport, health grant, food grant or edited save is used. These are functional/visual checks; recording overhead and 24 fps encoding are not gameplay performance measurements.

Passed through the live interface:

- Native touch parking and the original dismount/baby transfer, with one parked player bicycle.
- Up/away, down/toward, both horizontal directions and a real two-touch diagonal. Original baby face, continuous neck/clothing and native expression scale remain visible at ordinary size. The new paired boots/calf parts are distinct and grounded in the reviewed frames.
- Touch pause freezes position and resumes; inventory is initially hidden, opens through the existing settings/bag button, stays clear of the baby and closes by touch.
- Normal reload restores the same valid walking position and exact parked route record, with the safe source-side rest view and one parking node.
- Actual square → arcade → food shop → arcade → workshop → arcade → courtyard → arcade → square traversal through physical doors. Both rooms are walked and both new parent angles are shown in each.
- Back-to-bike walks within the current square to the same parking record, then plays the original remount/transfer. The baby is seated again, both wheels have clearance below 2 and speed is controlled.
- Existing draw instrumentation reports passenger-alpha maximum 1 in riding, dismount, exploring and remount; no passenger duplication violations before or after reload. The game has at most one pending `loop` callback. Ownership reports one player bicycle and one passenger. The workshop's illustrated display bicycle is environment artwork, not a second player-owned bike.
- No JavaScript exceptions, console errors or HTTP failures.

There are 17 original-size PNGs. The normal-speed [walking clip](walking-native-angles.webm) contains 7.119452 native seconds / 143 captured frames; [return/remount clip](same-bike-remount.webm) contains 8.213016 native seconds / 125 captured frames. Both were sampled for independent visual review: [walking contact sheet](walking-contact.png), [return contact sheet](remount-contact.png). Contact sheets are reduced extracts of actual recording frames, not generated illustrations or substitutes for the clips.

The normal-size square, both room angles, dismount/remount, bag and returned riding frames were independently inspected. Native child expressions remain readable, the new whole-parent views genuinely differ, the original passenger remains attached and no duplicate leg or obvious floor crop is visible in those reviewed frames. This remains a compact cut-out gait, not a new fully drawn animation set.

Health stayed at its fresh default 100 and inventory stayed empty. This particular run alone cannot detect a hidden heal capped at full health; damaged-health transition coverage must be assessed from the separate existing regression evidence. This run does not repeat the complete delivery quest or economy campaign, test physical devices or make a frame-time claim.
