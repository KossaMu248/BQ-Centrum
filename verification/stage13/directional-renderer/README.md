# Directional renderer reference

`reference.html`, `first-composite.png` and `first-composite.json` are a **renderer reference, not in-game screenshots**. They compare the original source side actor with the new toward/away parent poses at logical height 200 on a common floor. The original source paints approximately 210 pixels from helmet to floor at that nominal height, so the new measured artwork uses the same visible extent rather than shrinking the actors to a 200-pixel painted box.

This first composition predates restoration of the original moving baby's directional lean and final drawing-call audit. It proves only the inspected early composition. Use [the final actual gameplay](../gameplay/README.md) and [the independent native-expression lab](../art-review/) for final evidence.

The new `js/centrum-directional-rig.js` prepares bounded polygons from the approved bear-only sheet, articulates separate far/near pants, calf and boot pieces, and delegates the complete original head/neck/shirt to the source passenger painter. Original lower baby legs and shoes are extracted together from the source carrier cell; their measured paths and source hash are recorded in [baby-legs](../baby-legs/). Torso motion transforms its hip attachments and the baby together; the boot/contact transforms remain in the floor frame.

The module has no independent loop, timer, input handler or storage write. The optional new image failing to load leaves the original side view playable and shows a warning; an explicit later preload can retry. It never starts loading or allocates a new canvas from `draw()`.

Focused checks, rerun after runtime freeze:

```sh
node tests/centrum_directional_rig.cjs
node tests/hero-gait.cjs
```

The first suite passed 12 heading cases, 96 draw cases, seven source/action guards, 192 submitted boot-matrix checks, four contact cases, four failed-asset fallback checks and three explicit recovery checks. It also executes the real `Square.update()` function with small dependency adapters: four diagonal release cases with 160 braking samples, four blocked sliding cases and four automatic-return cases pass. Removing the actual input-intent guard makes the retention assertion fail, confirming the regression checks the repaired bug. These mocked-Canvas/control assertions test transforms/lifecycle/delegation, not pixels or visual quality. The unchanged default source-path suite passed 1,152 cases. Separate browser gameplay and native-expression probes provide the visual evidence.

Frozen runtime SHA256:

```text
f6412df50749c6bff95b259910421b1fb6f76c6d81a9743d424d90b9f1641dad  js/hero-rig.js
d89c8cd57ca71f0b045f7f4b8a18c057ddbf383f478e4f768aeb45558fe9fb08  js/centrum-square.js
7f6a4e2a54025fd16e3bd14827f9b8ff2a4c01ac38cbc68d9299071306ff47b6  js/centrum-directional-rig.js
```
