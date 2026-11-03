"""Strict source reconstruction and in-memory negative guards; never edits donors."""
import contextlib
import io
import runpy
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
with contextlib.redirect_stdout(io.StringIO()):
    verifier = runpy.run_path(str(ROOT / 'tools/verify-source-integrity.py'))
reverse = verifier['reverse_stage14_source']
checks = []


def rejected(name, operation):
    try:
        operation()
    except AssertionError:
        checks.append(name)
    else:
        raise AssertionError('Unreviewed mutation accepted: ' + name)


for source in verifier['STAGE14_PREVIOUS']:
    current = (ROOT / source).read_text()
    restored = reverse(source, current)
    assert restored and restored != current
    checks.append(source + ' exact reviewed inverse')
    rejected(source + ' appended unreviewed code', lambda: reverse(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('hero-rig.js'):
        needle = 'foreground:true'
        changed = current.replace(needle, 'foreground:false', 1)
        native = 'function draw(c,px,py,h,face,options={}){'
        changed_native = current.replace(native, native + 'h*=.5;', 1)
    else:
        needle = 'preloadVariants(variants=[])'
        changed = current.replace(needle, 'preloadVariants(variants=[0])', 1)
        native = 'function preloadAll(){startWalkCache();'
        changed_native = current.replace(native, native + 'return;', 1)
    assert changed != current and changed_native != current
    rejected(source + ' edited optional preparation hunk', lambda: reverse(source, changed))
    rejected(source + ' edited native default path', lambda: reverse(source, changed_native))

manifest = ROOT / 'references/source/stage14-source-integration.json'
read_bytes = Path.read_bytes


def modified_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest else b'')


with patch.object(Path, 'read_bytes', modified_manifest):
    rejected('inverse manifest tampering', lambda: reverse('js/npc-motion.js', (ROOT / 'js/npc-motion.js').read_text()))

assert len(checks) == 9
print('PASS: 944 protected originals; 2 exact Stage14 inverses; 6 rejected source mutations and 1 rejected inverse-manifest mutation, all in memory.')
