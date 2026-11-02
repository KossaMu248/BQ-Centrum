# Validation evidence — BQ-Centrum

All screenshots and clips here are actual rendered gameplay. No generated illustration is used as gameplay evidence. Read the root [compact test report](../../TEST_REPORT.md) for conditions, fixes and limits.

| Evidence | Scope and preparation |
| --- | --- |
| [Complete native route](full-route/README.md) | Fresh empty save; ordinary road, walking, dialogue and bag controls. No debug teleport or state grants. Actual source dismount/remount, three reloads and the full earned quest/purchase/eating cycle. |
| [State/input edges](edges/README.md) | 44 browser groups; disclosed production-save/source-debug setups isolate edge cases. Includes locked exits, residents, collision/occlusion, transfer reloads, touch, pause, viewport, food/reward/retry consistency. |
| [Repeated remount regression](remount-race/README.md) | Two stronger same-event-turn duplicate requests at a disclosed prepared stop. The repaired transfer retains one owner. |
| [Real combat and defeat](combat/README.md) | Prepared starting HP/food and source practice NPCs; actual attacks cause final defeat, with no forced death helper. Eating refusal and coherent retry. |
| [Standalone package test description](standalone/README.md) | Clean extracted archive, root and repository subpath, desktop and Chromium touch emulation. Detailed exact-archive certificate is supplied outside the archive beside the delivery zip. |
| [Core checks](core-checks.json) | 32 JavaScript syntax checks, all 15 unit suites and 944 pinned original files, plus target Git boundary checks. |

The primary route is independent of the edge fixtures. Recordings disclose playback speed and capped wait gaps; state/input traces and sampled animation phases supplement normal-size screenshots. [Stage 7](../stage7/README.md) retains the normal-scale character/source comparison and environment-art review.

Only system Chromium was available. Phone emulation is not physical iPhone/Safari testing. Physical devices, other engines, gamepads and sustained mobile performance remain untested. Gate, side-passage and cage art remains labelled development work; source depth walking retains its existing gait limitation.
