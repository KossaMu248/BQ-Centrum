# Stage22 real walking/body acceptance

Linux Chromium154.0.8037.57, headless1280×720 desktop and844×390 CDP touch emulation, device scale1. Physical phones/Safari/thermal are skipped. These are actual game inputs/captures; no generated character art is used.

Two selected normal-size Stage21 PNG baselines in `before/` show the duplicate shorts/calf patch. They come from own published target commit `aed621dcb42052770fda52ca3bcb2c2de0237cc7`; the recorded Hero SHA matches the exact Stage22 inverse. One original debug route stop is disclosed, followed by native entry and walking. The full13-frame private baseline remains ignored; only the selected two are published.

`after/results.json` passes all six main contexts: desktop/touch Square walking and copied route walking, plus two native gang-combat/recovery groups. Cardinal/diagonal movement, original baby/front/back carrier calibration, bench collision, arcade/food-shop/named returns, reload, bag/pause/fullscreen, viewport changes and the same grounded bicycle pass. Source walking after combat explicitly uses the repaired surface in the back carrier. No health/item/NPC/reward grant is injected. Both J/Maul attacks retain22damage(60→38); combat health goes50→10desktop/50→30touch as native incoming hits occur. Main peaceful returns remain100HP.

There are23 main normal-size JPEGs plus one exact-south-boundary touch supplement:24 total. The supplement reaches the original918floor boundary, checks head/foot crop clearance and returns to the same bike. Main/supplement runs preserve runtime hashes, project-only storage, one mainRAF and zero JS/console/HTTP errors. The final boundary run observes host RAF median16.7ms/p9533.3/max33.4, not a physical-device or dedicated performance benchmark.

The real desktop walking clip is7.082061seconds at1×,142 native samples, encoded24fps (not gameFPS). Camera, physical walk speeds, scene floor geometry and original artwork remain unchanged. Enlarged phase boards under `../render-lab/` are paused production-renderer diagnostics at h320, explicitly NOT gameplay screenshots or pixel-equivalence proof. Full campaign/economy replay remains historical; this stage exercises animation and its existing interactions.

Reproduce: `python3 tests/centrum_stage22_browser.py --phase after --clip`; exact edge: add `--only-south --out verification/stage22/browser/south-boundary`. Python Playwright/Chromium/ffmpeg are development tools, not game runtime dependencies.
