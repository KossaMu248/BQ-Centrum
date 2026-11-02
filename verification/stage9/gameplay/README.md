# Stage 9 rendered gameplay review

These are actual locally served Chromium gameplay captures, not generated scene illustrations. The new gate, passage and cage PNGs have separate [environment-art provenance](../../../assets/centrum/PROVENANCE.md). Original character artwork was not regenerated.

The complete focused run passed with **27 screenshots and 9 check groups**. The final passage repair supplement passed with **9 further screenshots and 7 groups**. Both runs had **no JavaScript exceptions or HTTP failures**. [results.json](results.json) contains states, render audits, source hashes and input samples. [passage-results.json](passage-results.json) supplies fresh final runtime hashes for the subsequent small passage-jamb/arrival repair. That supplement is the final passage collision/arrival evidence; the original gallery retains its original hashes and timing.

Run from the project root with the existing Python Playwright installation and `/usr/bin/chromium`:

```sh
python tests/centrum_remaining_review.py
python tests/centrum_remaining_review.py --passage-only
```

Desktop used **1280×720**, and phone landscape used **844×390**, device scale 1, Chromium **154.0.8037.57** on Linux, with touch/mobile emulation enabled for the latter. This is not physical iPhone, iOS or Safari testing. Other browser-engine checks are documented in [the browser evidence](../browsers/).

## Actual play and character comparison

- [Walking clip](after/walking-review.webm): 204 actual CDP frames, 57.14 seconds of native play shown at 2×, encoded as 1280×720 VP9 (28.75 seconds). It includes real up/down/diagonal movement, opposite facing, stopping, bench obstruction, walking behind/in front of it, jumping and planter overlap.
- [Moving down](after/desktop/walking-pure-depth-down.png), [moving up](after/desktop/walking-pure-depth-up.png), [diagonal](after/desktop/walking-diagonal-northwest.png), [rest](after/desktop/native-baby-at-rest.png).
- [Behind bench](after/desktop/bench-behind.png), [in front](after/desktop/bench-front.png), [jump and floor shadow](after/desktop/jump-ground-sort.png), [foliage overlap](after/desktop/planter-baby-overlap.png).
- [Closed gate](after/desktop/gate-closed.png), [open gate](after/desktop/gate-open.png), [closed cage with source crates](after/desktop/delivery-cage-closed.png), [released cage](after/desktop/delivery-cage-released.png).

All 83 unchanged curated character/art files checked by this review match their source hashes. Deliberately extended renderer/adapter code is excluded from that byte-equality list and checked separately by the project source-reconstruction verifier. Every sampled/captured ordinary walking pose retained the continuous source baby upper body and collar, integrated carrier, height-200 bear and baby uniform scale **0.5710830421929589**. The source gameplay reference is [front-carrier-street.png](../../../references/source/front-carrier-street.png); the prior accepted square is [the stage-8 square frame](../../stage8/full-route/04-metro-square.png). Native expression sizes remain different by design; they were not enlarged to standardise expressions.

The shallow foot projection visibly reduces pure depth sliding. The short native before sample measured mean rendered-sole midstance movement of **197.09 / 150.31 px/s** for down/up; the final sample measured **1.71 / 3.76 px/s**. Those comparisons have only **2/1 native and 2/2 final paired samples**, so they demonstrate the observed correction, not a comprehensive animation or performance benchmark. Final sampled stance contact depths were within **−11.28..8.28 px**. All **160 recorded rendered leg samples** retained source shoe orientation, noncollapsed shoe area, finite anatomy, rigid-shoe flags, a 12–80 px span and continuous body/upper-body rendering. Diagonal input was exercised, but this run did not produce enough settled paired diagonal samples for a numerical slip comparison.

The presentation remains an upright side/front source character with a shallow planar leg projection. It has no authored overhead/backward character set; this is not a claim of newly authored depth-walking animation. Shadows and sorting stay at ground anchors during jumps, pause freezes play/atmosphere, and reduced motion removes drifting leaves and foliage wind.

## Scene views at normal play size

| Scene | Desktop | Chromium phone-landscape emulation |
|---|---|---|
| Metro Square | [view](after/desktop/metro-square.png) | [view](after/phone-landscape/metro-square.png) |
| Shopping Arcade | [view](after/desktop/shopping-arcade.png) | [view](after/phone-landscape/shopping-arcade.png) |
| Service Courtyard | [view](after/desktop/service-courtyard.png) | [view](after/phone-landscape/service-courtyard.png) |
| Food shop | [view](after/desktop/food-shop.png) | [view](after/phone-landscape/food-shop.png) |
| Bicycle workshop | [view](after/desktop/bicycle-workshop.png) | [view](after/phone-landscape/bicycle-workshop.png) |

Two-finger diagonal touch movement, the southeast floor/camera edge and all five scene views passed. The baby remains recognisable at this gameplay size. Phone cover framing still crops upper façades; at the far-right passage the fixed heart/bag HUD can overlap the bear's helmet/top of face. The baby's face, collar and clothes remain visible. Physical phones, gamepads and sustained mobile performance were not tested here.

## Setup and before evidence

The focused review prepares valid production parking saves and named entrances for overviews; the source debug stop only shortens initial parking preparation. Subsequent movement, collision and scene transitions use keyboard or touch controls. This is not the independent no-debug full story acceptance: see [the stage-8 full route](../../stage8/full-route/) and [the stage-9 integration regression](../full-route/).

[before.json](before.json), [the native clip](before/walking-review.webm) and [native-runtime.json](native-runtime.json) preserve the original loaded gait and exact Square/HeroRig hashes. Only the first page's completed movement/clip is the native renderer baseline. Later overview contexts overlapped integration; its additional phone assertion stopped because the old 350 ms/>10 px timing became too short after depth speed changed to 60 px/s. The final 750 ms touch test passed. No complete before acceptance pass is claimed.

The final passage supplement verifies [clear named arrival](after/desktop/passage-return-clear-arrival.png), immediate re-entry prevention, the new small jamb footprint, ground ordering [behind](after/desktop/passage-jamb-behind.png) and [in front](after/desktop/passage-jamb-in-front.png), [unobstructed passage use](after/phone-landscape/passage-clear-opening.png) and depth-stop easing. The [final phone arrival](after/phone-landscape/passage-return-clear-arrival.png) shows the actual baby and the remaining helmet/HUD overlap. The lower jamb is foot-sorted; the upper façade stays behind the baby. The repair changes neither the five scene floors/dimensions nor the accepted camera/character scale. [frames.sha256](frames.sha256) records the actual evidence files.
