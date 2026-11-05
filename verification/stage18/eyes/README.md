# Original bear eye opacity on injury

The active riding renderer switches to `bear_upper_rightarm_injured` after losing the right arm. That **original** cel already has holes in the eye whites; its immutable prepared PNG preserves them. Ordinary hurt uses the existing opaque coast cel. The native on-foot hurt renderer is separate and is exercised in the gameplay evidence.

The repair reuses only the original matching coast cel's eye pixels beneath the injured cel, in two bounded native regions: `[182,42,20,22]` and `[209,47,7,9]` on the291×309source. It does not paint a replacement eye or regenerate character art. Existing opaque pupil/outline pixels stay intact. All unrelated fur, jersey, body and the missing arm retain their original pixels/transparency. Both source images and the compiled PNGs remain unmodified. Mounted riding and the airborne crash torso both use the repair when the original injured-arm cel is selected; normal upright, unavailable-image fallback and landed/prone art keep their existing raw paths.

`illustrated-hero.js` caches one native repair surface per injured/reference image pair. The active game supplies the coast image already included in critical riding preload: no new image request, timer, listener, game loop or damage rule. The existing material/ink fallback also receives the same repair. The actual compiled game pair allocates359,676bytes once; audit byte totals count allocations, not total browser memory.

Actually run:

- `node tests/centrum_damage_eyes.cjs`:500repeated draws reuse one surface; native and compiled APIs/fallbacks, four invalid references, two mounted and four thrown-body cases are checked by executing the actual game functions. Previous missing-reference and airborne-bypass mutations are rejected. Healthy/fallback/prone paths stay raw and native offsets remain unchanged. Mock pixels do not prove visual quality.
- `python3 tests/centrum_damage_eyes.py`: actual Chromium154.0.8037.57 native-pixel renderer lab, both original/fallback and immutable compiled images, on dark blue and warm pale backgrounds. [Results](pixels.json) retain component/harness hashes and exact samples. This is a renderer reference, **not a gameplay screenshot or physical-device/FPS test**.

For each source family,299changed pixels stay inside the two eye regions.123zero-alpha white-eye pixels regain the exact intact source colours. All pixels outside those regions, and every previously opaque pixel, are byte-identical to the existing renderer.917missing-arm pixels remain transparent. Eye colours no longer depend on the contrasting backgrounds.

Known native probes after the existing material pass:

| Point | BeforeRGBA | FixedRGBA | Intact sourceRGBA |
| --- | --- | --- | --- |
| Near eye190,49 |0,0,0,0 |255,249,223,255 |255,249,223,255 |
| Far eye212,51 |36,42,30,42 |219,208,185,255 |255,241,216,255 |

The far eye retains its original translucent dark edge over the source underlay, making the result opaque rather than replacing the authored edge. The two source families intentionally produce the same final samples. The lab proves this specific permanent-injury defect; actual native damage, transfers, resting/movement and both viewport conditions belong to the separately labelled gameplay tests. No whole-campaign or new stand-up-animation claim is implied.
