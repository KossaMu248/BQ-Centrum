#!/usr/bin/env python3
"""Test that Pages keeps every runtime byte and excludes development artifacts."""
import hashlib
import importlib.util
import json
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
(ROOT / 'delivery').mkdir(exist_ok=True)
spec = importlib.util.spec_from_file_location('stage_pages', ROOT / 'tools/stage-pages.py')
pages = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pages)


def rejected(action, reason):
    try:
        action()
    except ValueError as error:
        assert reason in str(error), str(error)
    else:
        raise AssertionError('Unsafe Pages staging was accepted: ' + reason)


with tempfile.TemporaryDirectory(prefix='pages-staging-', dir=ROOT / 'delivery') as temp:
    root = Path(temp)
    for name in pages.DIRECTORIES:
        (root / name).mkdir(parents=True)
        (root / name / 'retained.txt').write_text('source bytes\n')
    for name in pages.DOCUMENTS:
        (root / name).write_text('public source\n')
    (root / 'assets/cache').mkdir()
    native = b'original runtime render cache\x00\x01'
    (root / 'assets/cache/body.png').write_bytes(native)
    for name in ('.git/config', 'tests/private.py', 'verification/old.webm', 'delivery/previous.zip', '.env'):
        (root / name).parent.mkdir(parents=True, exist_ok=True)
        (root / name).write_text('do not publish\n')
    out = root / 'delivery/site'
    report = pages.stage(root, out)
    manifest = json.loads((out / 'PAGES_CONTENTS.json').read_text())
    assert report == manifest
    assert (out / 'assets/cache/body.png').read_bytes() == native
    assert set(manifest['files']) == {x.relative_to(root).as_posix() for x in pages.collect(root)[0]}
    assert manifest['payloadBytes'] == sum((out / name).stat().st_size for name in manifest['files'])
    for name, digest in manifest['files'].items():
        assert hashlib.sha256((out / name).read_bytes()).hexdigest() == digest
    assert not any((out / name).exists() for name in ('.git', 'tests', 'verification', 'delivery', '.env'))
    rejected(lambda: pages.stage(root, out), 'new or empty')
    assert (out / 'assets/cache/body.png').read_bytes() == native
    rejected(lambda: pages.stage(root, root / 'assets'), 'inside delivery/')
    rejected(lambda: pages.stage(root, root / 'delivery'), 'inside delivery/')
    (root / 'assets/linked.png').symlink_to(root / '.env')
    rejected(lambda: pages.collect(root), 'symlink')
    (root / 'assets/linked.png').unlink()
    (root / 'assets/.env').write_text('excluded secret')
    rejected(lambda: pages.collect(root), 'Forbidden')
    (root / 'assets/.env').unlink()
    (root / 'js/leak.js').write_text('token=' + 'ghp_' + 'x' * 36)
    rejected(lambda: pages.collect(root), 'Credential-pattern')
    (root / 'js/leak.js').unlink()
    old_limit = pages.MAX_BYTES
    pages.MAX_BYTES = 1
    rejected(lambda: pages.collect(root), 'budget')
    pages.MAX_BYTES = old_limit

print(json.dumps({'passed': True, 'scope': 'Pages allowlist, byte-preserving copies, cache retention, evidence/Git exclusion, output safety, symlink/secret/budget rejection'}))
