# BQ-Centrum test report

2026-11-03 · **BQ_CENTRUM_STAGE12** corrects leg identity. **Actual up/down viewing angles remain unfinished:** the source has no compatible views, and new matching bear-only artwork is awaiting approval. The previous lean is not a viewing-angle fix.

| Check actually run | Result |
|---|---|
| Core/source |19 unit suites, 35 JavaScript syntax checks and 944 exact source reconstructions passed; two in-memory unreviewed edits were rejected. No original art, baby, cycling physics/damage or save-format change.|
| New leg regression |Published Stage 11 fails the foreground-size and swing-layer guards. Repair passes 240 pose cases,720 lift-order cases and6 baby/facing cases. Existing160 anatomy cases cover 15,360 positive-orientation triangles. Numeric checks do not certify appearance.|
| Real walking |13 baseline + 13 repaired normal 1280×720 screenshots and a 10.08-second 1× gameplay clip reviewed. Foreground boot is correctly larger, background boot stays behind, calf sources correspond to the correct trouser openings and the unused third fur strip is excluded. Source baby continuity/scale remains unchanged. Zero JS/HTTP errors and worker ready.|
| Input/transfer smoke |Desktop and 844×390 touch emulation, both HTML entries: native E park, four movement directions, P pause, I/menu bag, same-bike Q remount with grounded wheels. 100 HP preserved, one bike/passenger, bounded ready worker and no JS/HTTP errors. Debug-stop setup is disclosed.|

The input/transfer smoke precedes the final complete-leg paint-order correction; final walking/core checks cover that correction. Other input/transfer code stayed unchanged.

No newly authored angle art is present. Two genuine bear views are needed, with the original continuous baby renderer kept intact; [scope](verification/stage12/ANGLE_ART_REQUIREMENTS.md). No extra lean, sprite rotation or carrier-state switch is claimed as fulfilling this requirement.

Performance was not reprofiled in this focused repair. The Stage 11 worker and inventory changes remain; its known raster-equivalence failure is unchanged. Physical-device/Safari/thermal testing stays skipped. The prior clean Stage 11 ZIP/28-check certificate, fresh earned quest route and WebKit 16-group run are historical and were not rerun/relabelled as Stage 12. [Historical report](verification/stage11/TEST_REPORT_SNAPSHOT.md).

[Stage 12 evidence](verification/stage12/README.md) · [actual walking](verification/stage12/leg-identity/after/walking.webm) · [core](verification/stage12/core-checks.json). Work and authorized publication are confined to BQ-Centrum. Donor repositories, save keys and deployments were not changed.
