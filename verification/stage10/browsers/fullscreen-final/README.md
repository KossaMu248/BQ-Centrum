# Fullscreen and object-fit geometry phase

This phase tests the scene-only mobile fullscreen cover repair and cached object-fit-aware HUD projection. It follows the frozen pre-refinement main flow. Final acceptance also includes the later [source-toolbar repair checks](../source-fullscreen-final/README.md).

| Engine | Actual record |
|---|---|
| Firefox 153 | Startup + eight scene geometry groups passed; subsequent source-foot fullscreen bag case failed because the original fullscreen toolbar covered the bag. The failure is retained and repaired in the next phase. |
| Linux WebKit 26.5 | All ten groups passed, including the portrait source reset available in that run. |

Each engine checked all five scenes from requested 844×390 viewports, portrait Square/Arcade, one desktop letterbox case, actual movement and bag input. The portrait Square also explicitly removed the shell’s native fullscreen method to exercise the real viewport fallback once. Prepared scene/near-bike saves are disclosed; no quest repeat or physics changes are claimed.

**Actual fullscreen conditions:** Firefox native fullscreen expands to its headless virtual desktop, 1366×768, even when the requested viewport is phone-sized. Its native results therefore describe that actual desktop view. Its explicit fallback remains 390×844 and preserves the phone character scale. WebKit’s phone requests use the actual `viewport` fallback at 844×390 / 390×844; its 1280×900 desktop request enters actual native fullscreen. No native phone Safari/WebKit test is claimed. Chromium’s separate native phone-emulation scale proof is in the HUD evidence.

The phone-sized fallback painted actor heights remained 145.52 px in landscape and 263.75 px in portrait, matching the respective window references at 1.0×. Desktop WebKit containment uses scale 1.103448 and a positive vertical letterbox offset of 96.90 px. Expected coordinates use the fixed logical 1160×640 frame; the renderer’s adaptive backing may be 870×480 or another lower-resolution surface. Every completed geometry group checks the independent projection against the HUD, original baby continuity flags, native movement and actual bag input.

[Both raw engine records](results.json) · [Firefox source obstruction retained](firefox-results.json) · [WebKit ten-group pass](webkit-results.json) · [Screenshot hashes](frames.sha256)

Firefox native screenshots can be clipped to the configured screenshot buffer despite a larger actual virtual desktop. Read the recorded actual viewport/projection and hit-test data; those images are not labelled whole-desktop phone captures. The unmodified WebKit phone captures retain their requested phone dimensions.

The test window is explicitly brought to the foreground before fullscreen. Early harness calibration/selector attempts and one earlier native click miss are kept separately as excluded `-attempt` diagnostics. Those are not runtime acceptance failures. The later Firefox source-toolbar obstruction was a real blocked interaction and remains recorded above. These are shared-host functional checks, not an isolated performance benchmark. No physical-device testing was performed.
