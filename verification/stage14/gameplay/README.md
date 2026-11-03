# Actual Stage14 walking

These19 normal1280×720 screenshots and the [walking clip](walking.webm) are actual rendered gameplay from frozen BQ_CENTRUM_STAGE14 on local system Chromium154, headlessLinux, scale1. They are not generated character previews or physical-device tests. [Results/audits/hashes](results.json).

The harness uses one disclosed debug setup at the original route parking stop7550. Native E then performs the existing transfer. Ordinary keyboard walking reaches the clear square lane and exercises left/right/up/down, all four diagonals and stopping, with no subsequent scene teleport, save edit or health/item grant.

The original continuous baby/collar/native0.571083 scale checks pass in every capture. True toward/away views remain after rest and diagonal release. Paired boots retain size/floor paths; swing knees now bend outward modestly while exact authored rest joints are preserved. Original upper/lower baby pieces share one body transform. This remains articulated painted animation, not a fully drawn new frame sequence.

The timestamped recording covers **22.606 native seconds at1×** from360 screencast samples, encoded24fps. Encoding rate is not gameplay FPS. Separate exclusive performance profiles own timing claims. No game JS/HTTP errors or recorder errors occurred in this final run. A prior capture passed gameplay but logged a late recorder-frame callback after browser detach; the harness now deactivates/removes that listener before teardown. That earlier attempt is separately labelled/excluded, not relabelled clean.

[Up/away](up-2.png) · [Down/toward](down-2.png) · [Stopped away](away-rest.png) · [Stopped toward](toward-rest.png) · [Independent motion review](../art-review/README.md).

Reproduce with `python3 tests/centrum_directional_gameplay.py --out verification/stage14/gameplay --clip`. Other browser scenes/task/economy/remount and touch-viewport evidence are separate in../browsers. Physical phones/Safari/thermal remain skipped.
