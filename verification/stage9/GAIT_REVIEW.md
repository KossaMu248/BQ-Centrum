# Shallow depth-gait review

Scope: the existing Centrum walking controller and existing illustrated leg rig. No character source image, baby face/neck/collar/clothing, body proportions, camera projection, cycling physics or source on-foot actions are replaced. No rear-facing or overhead actor is introduced.

## Actual cause

`centrum-square.js` previously advanced the original side gait by total XY travel. `locomotion.js` makes a stance sole move backward only in local X, so horizontal travel cancels that motion. During pure depth movement, the actor instead advances Y while the planted sole still sweeps X. The sole therefore moves across the floor in both axes; lowering animation weight or adding a shadow alone cannot fix that.

The current source assets provide side/front carrier figures and five measured contact/support/idle lower-body sources. They do not provide dedicated toward-camera / away-camera character cycles. Selecting a back-carrier figure would hide the important passenger and does not provide an appropriate replacement for depth travel.

## Bounded optional solution

`js/centrum-depth-gait.js` is a small optional math adapter. The parent owns integration into the existing renderer/controller and actual gameplay visual review. This document does not claim that a math test alone proves a convincing finished animation.

- Keep horizontal walking on the literal original gait object/path.
- Use existing source legs, knees, rigid boots and original native swing lift.
- Project only each foot’s stride onto the shallow ground movement vector. Do not rotate, shear or scale the whole figure, torso or baby.
- Limit depth projection to **0.23** of the native stride and depth speed to **60 world units/second**. At hero height 200 this gives about **1.812 cycles/second**, with the original 50% supporting duty per foot.
- Advance animation phase using metric distance `hypot(actualDX, actualDY / 0.23)`. Use actual resolved movement, so collisions cannot continue an unrelated walking phase.
- Normalize animation weight from this metric speed. Using raw depth speed / 120 would leave the renderer permanently in a transient blend, defeating its existing steady-pose cache.

For metric speed `m = hypot(vx, vy / S)`, local heading is `(face × vx / m, vy / (S × m))`. An original stride value `u` becomes local X `u × headingX`, plus added ground depth `u × S × headingY`. In the middle of stance, the original derivative is `du/dt = -m`, so the projected stance anchor cancels the actual actor travel in both X and Y. Authored heel/toe rolling remains original; the analytic stationary-contact test samples mid stance where that rolling offset is zero.

### Ground-depth bound

The native front-carrier far sole is about **-3.688525 logical pixels** from the root at height 200. The native stance half-step is 36 pixels. Thus the added ground-depth range is ±8.28, giving a total envelope of **[-11.968525, 8.28]**, within the existing player depth radius **12**. No collider, room/scene footprint, floor or saved-position rule needs enlargement.

The original Hermite swing recovery temporarily exceeds the stance excursion (±39.1918 rather than ±36). A naive full projection would extend the far ground plane to -12.7026. The adapter bounds **only the added ground-depth component during that airborne overshoot** to the native half-step. Native vertical lift, angles, knee flex and boot artwork remain unchanged; stance projection is exact.

## Executed math checks

`node tests/centrum_depth_gait.cjs` passed:

- 24 mid-stance velocity checks over eight motion directions and three actor/canonical heights; maximum residual **1.64 × 10⁻⁹ units/second**.
- Exhaustive 512-phase depth/contact envelope checks at heights 145, 200 and 280, both facings and both depth directions.
- Horizontal source-object identity and native phase/body bob/sway/roll, shin angles, knee flex, contact offsets and stance state remain unchanged.
- Finite-input handling and a bounded walking cadence rather than rapid tapping.

This test proves the optional math and footprint bound, not the final rendered sole trajectory or art quality. Actual source mesh landmarks, complete boots, source baby scale/continuity, collision/occlusion, starts/stops, direction changes and normal-size video must also be reviewed after integration. Frame-phase/heading cache quantization can add a small rendered residual even where the continuous planner is exact; tests must report it honestly.

## Remaining distinction

This reuses the accepted source side/front figure in a shallow place. It cannot create missing authored toward/away silhouettes, and it should never be described as a newly authored full directional character set. If the source mesh looks stretched or loses its proportions in actual review, retain the source rig and report the limitation rather than disguise it through a fake overhead rotation or replacement baby.

## Integration review

The parent integrated the optional renderer path and Square controller without changing floor/collider data. Actual resolved XY travel drives the metric stride and heading. The original renderer path remains the default for source riding/visits and for horizontal Centrum walking. The 1,152 existing source rig checks and the 944-file strict reconstruction check passed after the optional changes.

Read-only review caught and the parent corrected two integration details:

1. On a depth stop, replacing a zero-velocity heading with “horizontal” while animation weight was still easing down could snap boots sideways. The controller now retains the last nonzero heading until idle weight reaches zero. It also resets heading on scene entry; pause retains the same pose.
2. A cached body is baked using the first raw direction inside its heading bucket. Rebuilding planned landmarks from a newer raw direction could disagree slightly with those cached pixels. The renderer now uses the cached frame’s ground heading when reconstructing its pose/audit. The baby/upper-body transform already uses unchanged native phase/body motion.

No further material source-path or collision inconsistency was found in this read-only review. The existing original actor rotation, source torso/upper-body paint, native passenger scale/composition, actions and horizontal gait remain outside the optional projection. This is still subject to the parent’s actual gameplay visual/animation acceptance; the analytic tests alone do not certify a dedicated toward/away character cycle.
