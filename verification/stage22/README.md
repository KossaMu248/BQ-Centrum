# Stage22 — Bear walking repair

The calf mesh was repainting original shorts texels below the fixed shorts. The repair gives cloth/calves separate source ownership, joins calf roots to moving trouser hems, and coordinates torso/pelvis motion. Original two boots remain rigid/distinct with restrained roll. No source artwork, baby likeness, camera, physical walking speed, combat/cycling rules, scene geometry or save format is replaced.

- [Core checks](core-checks.json):36 CJS/38 syntax plus source/provenance/codec/Pages safety.
- [Actual gameplay](browser/README.md): seven accepted desktop/CDP-touch groups,24 new normal-size captures, two actual baselines and a7.08-second native walking clip.
- [Renderer diagnostics](render-lab/): enlarged paused phase samples, explicitly not gameplay screenshots.
- [Exact standalone protocol](standalone/README.md): root/subpath desktop/touch archive validation after freeze; external certificate avoids self-reference.

The new source-surface contract checks5,184 poses,1,804,032 submitted calf vertices and181,440 hem joins (worst numerical gap<4.3e-14), positive triangle orientation,90 exact legacy/default cases and six source-contact velocity cases. Five regressions plus the actual previous published defect are rejected. Cache tests retain the single bounded worker and isolate route/Centrum/legacy fallback. Original illustrative skinning and small phone microexpressions remain limitations; no newly drawn full animation or physical-device test is claimed.
