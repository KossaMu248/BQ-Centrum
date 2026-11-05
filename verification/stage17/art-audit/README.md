# Active NPC props: source-art fit audit

This is a source/reference audit, not gameplay proof. No artwork was generated, replaced, retouched or cropped into new game assets. [Numeric measurements and original hashes](results.json) record twelve seated-pose/route-height cases and the active source references.

The active bench is the original `bench()` painting in [illustrated-props.js](../../../js/illustrated-props.js), rendered through `BearlyStreetProps.draw`. In the **Stage16 baseline**, the source-street routine adapter drew it at196 nominal units with an unrelated hard-coded38-unit seat height. Its original180-unit painting has a sloped seat: rear corners at−39/−40 and front corners at−27/−28. This shallow seat depth can support different original poses without changing their art.

The original seated/read paintings come from [civilian-rest-v16.png](../../../assets/art/civilian-rest-v16.png), with immutable prepared masks and metadata in [actors-v19-manifest.json](../../../assets/cache/actors-v19-manifest.json). Their seated contact pivots and source stature remain appropriate; moving the older resident's hip pivot upward would sink the original posterior through the seat. Uniformly enlarging that pose to reach a tall seat would also enlarge her head and bag.

| Original identity | Source sit/read pivot Y | Stature | Opaque sole below hip at adult128 |
| --- | --- | --- | --- |
| Young reader, variant9 | 265 /265 | 420.08 | 31.354 /31.034 |
| Smoker, variant10 | 614 /614 | 400.02 | 30.718 /30.398 |
| Older bench resident, variant11 | 946 /945 | 359.9 | 21.211 /21.510 |

The existing1.05/1/.84 identity-height factors are included. The copied on-foot route uses127.6 instead of128; those six additional measurements are recorded too. At the old38-unit contact the older resident's shoes hover about17world units above the floor.

A **fixed140-unit bench** shrinks the original painting uniformly by29% from196. Its centre seat pan spans21.389–30.722 units above the floor. Taller poses can sit toward its rear, while the shorter resident can perch toward its front. Clamp the original pose's hip-to-sole drop to that painted range: all twelve calculated cases then place opaque soles within0.64world units of the floor. No body distortion, new pose, changed source pivot or nearby-visitor-dependent prop scaling is required. The bench remains about1.09times the128-unit adult's standing height in width, a plausible compact public bench.

Current ownership is unambiguous: the west promenade bench is used by the older resident; the east is shared by the reader and smoker. Every later scene bench has one authored seated visitor, while other walkers/neighbours have idle-only stops. A single fixed size remains safe when activities change. The two210-unit Centrum Square benches are scaled against176-unit residents, have no current seated users and should retain their accepted scene geometry.

Other directly used props were checked. The painted bin at68 units is about72.95 high, plausible against128-unit adults. The **Stage16 baseline** smoking anchor put the adult inside its centre; a fixed70-unit offset to one side gives about3.5units of opaque-body clearance for the broadest source smoker. Keep the bin's art and scale. Source newspapers and bags are painted into their complete poses and should retain their proportions. Utility cover is taller than its old dimension metadata reports (104.13drawn versus89.1reported at88width); it serves as cover rather than seating, so no unrequested art resize is recommended here. Fire-bin bodies at72width are about77.24high against94-unit children, with flame extent separate.

Actual seating, floor placement, depth order, peaceful rest and disturbance behaviour must be assessed in the separate after-gameplay captures. These calculations do not claim physical-phone testing or continuous foot locking in every source animation.

## Final actual gameplay review

Independently inspected all **six final normal-size gameplay JPEGs** from the [after-browser result](../browser/after/results.json), three each at1280×720 desktop and844×390 touch-emulated Chromium. Image hashes and final runtime hashes match; the [review receipt](results.json) retains them. No new browser or profiling run was started by this reviewer.

The unchanged civilian bodies now fit the visibly smaller original benches. The older resident's posterior rests toward the front of the pan and the reader sits farther back; both shoes meet the floor without the former conspicuous gap. The original handbag/newspaper retain their complete source proportions. The smoker stands beside a waist-high bin with clear space between their silhouettes.

Contact frames show the older resident standing/walking while leaving the same-sized bench empty. In the behind-bench frames, furniture correctly covers the player's lower body and the original baby remains visible above it. The accepted camera, original bear/baby clothing/likeness and bicycle are unchanged in the reviewed frames. No visual blocker was found.

These are actual gameplay **stills**, not a newly recorded walking clip or physical-phone test. Quiet-rest duration, contact, walking and render-order assertions belong to the separate browser harness. Existing source pose limits, tiny seated sway and dense phone UI remain; contextual hints occupy some NPC/background space and the rightmost action label sits close to the screen edge. The baby remains clear in these frames.
