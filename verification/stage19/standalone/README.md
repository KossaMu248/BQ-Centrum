# Stage19 exact standalone archive validation

After the final documentation/runtime freeze:

```sh
python3 tools/package-project.py
python3 tests/centrum_standalone.py
```

The exact archive is hashed and extracted into a clean directory. Every payload hash and all944 protected original files are checked without a donor checkout. The extracted game runs at `/` and `/BQ-Centrum/` in headless system Chromium at1280×720 desktop and844×390 touch emulation. All28 top-level checks remain: both HTML aliases, native ride input/startup, all five scene arrivals at unchanged73HP, on-demand inventory, one bicycle/original baby and authored-direction walking. Production-factory sealed named-arrival/parking fixtures are disclosed; these delivery checks are separate from native gameplay acceptance.

All36 projection samples (20scene arrivals plus16walk samples), Centrum.75 camera,200world/150screen actor height and original baby scale remain checked. Namespace, relative asset paths, route stylesheet/camera, attribution, one main loop, health/supplies and console/HTTP/external-prefix failures keep their existing assertions. No physical iPhone/Safari, thermal or new FPS claim is implied.

Four representative normal-size Metro Square screenshots use JPEG quality65, one per root/subpath and desktop/touch context. Ride and food-shop assertions still execute; only redundant screenshots are omitted. These are real gameplay delivery frames, not pixel-equivalence references. Older screenshots, source assets and certificates remain unchanged.

The complete compact JSON result is stored as **lossless gzip** in `results.json.gz`. Every field, assertion and measurement remains; `RESULT_ENCODING.json` records compressed and decoded byte sizes/SHA256 hashes and an exact byte-roundtrip check. The identical raw UTF-8 JSON stays only in ignored `delivery/stage19-standalone-raw/results.json`. Decode with:

```sh
gzip -dc verification/stage19/standalone/results.json.gz
```

The exact certificate, encoding receipt, four JPEGs/`frames.sha256`, archive review, package audit and SHA sidecar remain **outside the ZIP they validate** in `verification/stage19/standalone/` and ignored `delivery/`. The package contains this protocol page, avoiding stale/self-referential validation. Passing status belongs to the generated results. Playing requires only a static HTTP server and browser.
