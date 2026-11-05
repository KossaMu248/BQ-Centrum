# Stage16 independent visual review

Reviewed actual Chromium gameplay at 1280×720 and Chromium touch emulation at
844×390, plus the 390×844 portrait sample. This was a separate, read-only
review of the QA captures and recorded state; it did not launch another browser
or performance run. Physical devices and Safari were not tested here.

The reviewed files and their SHA-256 hashes are listed in `results.json`.
Gameplay, source reference captures, renderer references and derived video
crops are identified separately. No illustration is presented as gameplay.

## Findings

- The wider copied route/street framing keeps the upright source characters
  grounded in the illustrated scene. The workshop room retains its original
  indoor scale. The accepted Centrum `.75` framing is preserved.
- Compared with `references/source/ride.png` and
  `front-carrier-street.png`, the baby retains his original face, neck, collar,
  blue clothing and attachment. The final transfer supplement shows the
  continuous original upper body in both transfer directions, an empty chair
  in carrier mode, and one seated passenger after remounting the same bicycle.
  The original transfer crossfade briefly blends bear poses; this is distinct
  from another passenger or bicycle entity.
- The five **renderer reference** boards cover adult variants 0–11 and all
  three child identities. Original complete bodies and outfits remain intact,
  with coherent knees, boots and sole anchors in the reviewed keys. The child
  references and actual nearby crew captures show visibly shorter children
  (nominal 94 versus adult 128), without stretching the original artwork.
- Native-size timeline samples decoded from the actual desktop and touch
  walking clips show the NPCs changing complete authored poses as they move.
  The sampled poses do not show the previous crossed/folded mesh legs or torn
  boots. These clips and the gameplay state traces provide motion evidence;
  the renderer boards alone do not. The two labelled contact sheets are
  vertical crops at the recording's original pixel scale, not new gameplay
  screenshots or an FPS benchmark.
- The actual promenade frames and matching runtime traces show the reader,
  smoker and seated resident still in their original resting activities after
  32 desktop / 18 touch-emulated simulation seconds. A nearby pass preserves
  the seat; real contact makes the contacted woman get up and walk. Her
  resulting whole-pose legs remain coherent. Those rest scenarios have no
  continuous video, so the conclusion uses the timed trace plus rendered
  before/after/contact samples.
- The earlier primary phone capture had its transient source instruction text
  across the baby. In the final transfer supplement, the source instruction is
  at the right of the scene and the baby stays unobscured.

## Limits

NPC walking is deliberately keyed: four whole authored keys for variants 0–8,
two distinct keys for variants 9–11. It is visibly stepped; this review does
not claim continuous foot locking or new up/down NPC artwork. Fine eye and
expression detail is limited in the smaller phone-landscape copied street
view (bear about 90 CSS pixels; baby roughly 14–18). The source likeness and
pink face/blue clothing remain recognisable; the portrait and Centrum samples
show more detail. The copied source has no authored peaceful lying routine;
combat down/recovery is a separate state.

The primary walking clips precede the final transfer-mask and source-tip
placement repairs. Their exact runtime hashes remain in the primary QA
reports. Final transfer captures are separately bound to Hero
`34d2c90e46f96b1ce9cd8630773737f46369502313e4cb1a1c313d49b2440263`
and Visits
`861be8792f04df66f48162d5b8bdd6e0bb6a96349f712b92fb770a928221bc9d`.
No continuous final-transfer video was recorded. The passenger/pouch reference
board is a separate renderer comparison; its report records 2,105 protected
face/neck/collar/torso probes with maximum delta 0. It is not gameplay.

This review found no remaining visual blocker in its sampled evidence. It does
not certify every animation frame, all hardware, physical iPhone/Safari,
combat balance or frame rate. Functional and performance results belong to
the separate Stage16 QA and performance reports.
