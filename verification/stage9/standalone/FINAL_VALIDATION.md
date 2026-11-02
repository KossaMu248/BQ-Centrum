# Stage 9 final local archive validation

The exact standalone ZIP passed **28 extracted-package checks** at clean local server roots **/** and **/BQ-Centrum/**. Tests used headless system Chromium **154.0.8037.57**, desktop 1280×720 and phone/touch emulation 844×390, with fresh disposable browser contexts. This is not physical iPhone/Android or Safari testing. Firefox/Linux WebKit evidence is reported separately under the Stage 9 browser review; this archive run used Chromium only.

- Archive: `delivery/BQ-Centrum-validated.zip`, **489,640,686 bytes** (466.958 MiB).
- SHA256: `0a4a424bc6125502cc89ed195d2cf373cbdeba3e567eb1cf3db0bb63156f2302`.
- Local request counts: root **2254**, repository subpath **2257**.
- **Zero** page/console errors, page/server HTTP failures, external requests or requests escaping the repository prefix.
- Real keyboard/touch pedal input advanced the copied road simulation. Every existing scene and both active HTML entries loaded. Required gate/passage/cage PNGs decoded and passed renderer-ready audits; shared 73 HP, native continuous baby/carrier and one pending main game loop remained valid.
- Scene-load isolation uses explicitly disclosed production-save-factory fixtures and named entrances, not an earned quest completion. The separate actual no-debug full-route evidence covers the earned story/economy path.
- The **944-file pinned-source reconstruction check ran inside the extracted ZIP**, without a donor checkout or ignored inspection archive.
- ZIP CRC, **1294 payload SHA256 values**, all **919** original source-asset hashes, all **3** independent scenery/provenance hashes and **194** internal Markdown links passed. Metadata contains no Git/inspection directories, development/browser caches, raw recording frames or symlinks. The 55 immutable prepared runtime files are required source assets, not disposable caches. Both active HTML entries remain small: 13158, 13158 bytes.

| Actual profile | First frame from navigation, ms | Main-loop median, ms | p95, ms | Maximum, ms |
| --- | ---: | ---: | ---: | ---: |
| root-desktop fresh startup and actual pedal input | 1512.3 | 16.7 | 33.4 | 100 |
| root-phone-emulation fresh startup and actual pedal input | 895.2 | 16.7 | 33.4 | 33.4 |
| subpath-desktop fresh startup and actual pedal input | 882.1 | 16.7 | 33.4 | 33.4 |
| subpath-phone-emulation fresh startup and actual pedal input | 915.4 | 16.7 | 33.4 | 33.4 |

Frame intervals include startup on this shared headless Linux container; they are not a physical-device performance guarantee. Detailed `results.json`, archive audit, screenshot hashes and the combined `delivery/BQ-Centrum-validated.validation.json` are external certificates for this same frozen ZIP. They are deliberately excluded from the ZIP to avoid stale/self-referential evidence. This small review note was written after validation and is also excluded from the ZIP. No archive rebuild followed validation.
