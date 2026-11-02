# Centrum polish — actual gameplay review

**18 desktop/touch visual and input checks passed**, with zero JavaScript or HTTP failures. These are actual Chromium gameplay screenshots and a real recording, at desktop **1280×720** and emulated phone landscape **844×390**. No image was generated or presented as gameplay. The accepted 200-pixel logical actor scale and bounded 1160×640 camera remain; the phone's cover crop can slide within that same frame to protect the head and boots.

[Watch the short actual walking clip at 2× speed](polish-walking.webm): walk behind and around a solid bench, pass in front, jump with the shadow on the ground and approach the source planter. [Structured results and exact render audits](results.json) · [Screenshot hashes](frames.sha256).

The source debug warp shortens cycling travel to the existing parking stop, followed by the production dismount. Scene overview starting positions are prepared using the production adventure save factory, a valid parked bicycle and existing named entrances; starting health/one food are disclosed fixtures. Subsequent acceptance traversal, door/passage use, bench collision, jumping, diagonal movement and phone input use actual keyboard/touch controls. The payoff picture starts from a disclosed reported-task fixture and redeems through the real counter. The complete story and economy have separate regression evidence; this recording does not claim to replay the task.

## Existing area identities

| Existing area | Desktop normal-size gameplay | Phone landscape normal-size gameplay |
| --- | --- | --- |
| Metro Square — original T sign, source façades, furniture | [Square](after/desktop/metro-square.png) | [Square](after/phone-landscape/metro-square.png) |
| Shopping Arcade — distinct shop fronts and delivery passage | [Arcade](after/desktop/shopping-arcade.png) | [Arcade](after/phone-landscape/shopping-arcade.png) |
| Service Courtyard — delivery/storage/check-in details | [Courtyard](after/desktop/service-courtyard.png) | [Courtyard](after/phone-landscape/service-courtyard.png) |
| Billy’s Food Shop — warm existing walkable room | [Food shop](after/desktop/food-shop.png) | [Food shop](after/phone-landscape/food-shop.png) |
| Bicycle Workshop — existing repair room | [Workshop](after/desktop/bicycle-workshop.png) | [Workshop](after/phone-landscape/bicycle-workshop.png) |

The final door anchors match the source paintings: square arcade **340**, food shop **235**, workshop **760**. All five scene dimensions, floor bounds and furniture/building footprints remain unchanged. Native E/touch traversal reached both rooms, the courtyard passage and the gate shortcut through the correct named arrivals. Three source residents retain their identities and ordinary routines, without a new crowd at the doors.

## Character and grounding review

- [Behind bench](after/desktop/bench-behind.png), [in front](after/desktop/bench-front.png), [jump with grounded shadow](after/desktop/jump-grounded-shadow.png), [foliage overlap](after/desktop/planter-overlap.png). Actual movement meets the bench footprint before walking around it. Actor/object order uses floor anchors, and jumping does not change ground depth. Only source foliage fades; the stone remains opaque and collidable.
- [Billy’s discovery](after/desktop/billys-discovery-dialogue.png) and [phone payoff](after/phone-landscape/quest-payoff-baby-and-dialogue.png) retain the original point expression, face, continuous neck/collar/clothing and carrier. The small dialogue sits opposite the baby. A short reaction expires; ordinary movement does not open repeated conversations.
- [Phone southeast boundary](after/phone-landscape/square-southeast-boundary.png): actual two-touch movement reaches the floor limit. The cover crop protects the complete figure; boots project to **334.7 px**, above the right touch buttons at **338 px**. Camera coordinates and actor scale are unchanged. [Desktop boundary](after/desktop/square-southeast-boundary.png).
- [Reduced motion](after/desktop/reduced-motion.png): drifting leaves are omitted and foliage wind is zero. Normal motion uses at most **seven** tiny floor leaves, drawn before objects/actors, with no scene-wide transform. Pause freezes their clock.

[Original source carrier gameplay](../../references/source/front-carrier-street.png) is the character baseline, not a new Centrum screenshot. Its original hero height is **145**, with native baby uniform scale **0.4140352056**. At the accepted Centrum height **200**, the expected scale is **0.5710830422**; every final screenshot and tested idle, walking, point and jump state matches. Point/idle head bounds differ in the original frames (70/62 source pixels); they do not receive different physical scaling. All **84** relevant original character-art and unchanged renderer-module hashes checked here match the pinned baseline. The documented integrated game/Visits/quest files are checked separately by the strict original-source reconstruction tool.

Visual comparison used actual normal-size frames against the source gameplay reference, with the blue collar, neck, carrier attachment, jersey outline, short legs and original boots preserved. The full combat/crash action set was not replayed during this polish review; its original artwork and renderer code were not edited.

## Context before polish

[Initial desktop context](before/desktop/metro-square.png) · [initial phone context](before/phone-landscape/metro-square.png) · [previous phone southeast control overlap](before/phone-landscape/square-southeast-boundary.png) · [all initial capture audits](before.json).

These context frames were captured at the beginning of this stage while initial door/UI adjustments were being reviewed. They are **pre-environment-polish context**, not a uniform pinned Stage 6 build. The true pinned character baseline is the separate source reference linked above. Final images and audits all use the final reviewed scene/world/controller hashes recorded in results.json.

## Remaining art and input limits

- Matching illustrated **open/closed service-gate leaves/posts**, **side-passage façade** and **B-04 cage front/open states** are absent from the source asset set. Their functional geometric shapes remain visibly labelled **DEV / PLACEHOLDER** and are not claimed as finished environmental art. Source shop fronts, room images, fences, planters, utility box, storage crates and furniture are reused unchanged.
- The narrow phone cover view still crops upper roofs/fronts at some positions; the actor keeps the accepted scale and scrolls within bounds. Pure depth travel retains the accepted source side/front walking gait and may slide. There is no newly invented rear view or chewing animation.
- Phone evidence uses Chromium touch emulation. **Physical phones/tablets, other browser engines and gamepads remain untested.** No sustained device-performance claim is made.

Run from BQ-Centrum: `python3 tests/centrum_polish.py`. `--baseline-only` intentionally writes only contextual before captures; historical stage evidence is untouched. Other current regressions are linked from the main [progress report](../../PROGRESS.md).

[Final local checks and repository boundaries](final-checks.json): 32 JavaScript syntax checks, all 14 unit suites and all 944 pinned original-file checks passed. Both active entries match and the target Git configuration/remotes are unchanged.
