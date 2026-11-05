"""Strict source reconstruction and in-memory negative guards; never edits donors."""
import contextlib
import hashlib
import io
import runpy
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
with contextlib.redirect_stdout(io.StringIO()):
    verifier = runpy.run_path(str(ROOT / 'tools/verify-source-integrity.py'))
reverse = verifier['reverse_stage14_source']
reverse16 = verifier['reverse_stage16_source']
checks = []


def stage15_text(source):
    """Older inverse contracts still receive the exact version they reviewed."""
    current = (ROOT / source).read_text()
    return reverse16(source, current) if source in verifier['STAGE16_PREVIOUS'] else current


def rejected(name, operation):
    try:
        operation()
    except AssertionError:
        checks.append(name)
    else:
        raise AssertionError('Unreviewed mutation accepted: ' + name)


for source in verifier['STAGE14_PREVIOUS']:
    current = stage15_text(source)
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
    rejected('Stage14 inverse manifest tampering', lambda: reverse('js/npc-motion.js', stage15_text('js/npc-motion.js')))

assert len(checks) == 9

# Stage16 protects exact additions as well as native behavior outside them.
# These strings are modified only in memory; no working-tree/donor save changes.
native_markers = {
    'js/game.js': ('  function update(dt){', '  function update(dt){dt*=2;'),
    'js/brawler.js': ('    function update(dt,p){', '    function update(dt,p){dt*=2;'),
    'js/hero-rig.js': ('  function draw(c,px,py,h,face,options={}){', '  function draw(c,px,py,h,face,options={}){h*=.5;'),
    'js/npc-motion.js': ('  function draw(c,n,x,y,height=130,scale=1,options={}){', '  function draw(c,n,x,y,height=130,scale=1,options={}){height*=.5;'),
    'js/illustrated-visits.js': ('  function update(s){', '  function update(s){s.dt*=2;'),
    'js/illustrated-kids.js': ('WORLD_HEIGHT=94', 'WORLD_HEIGHT=93'),
    'js/illustrated-neighbourhood.js': ('bearHeight:145', 'bearHeight:72.5'),
    'js/brawler-art.js': ('  function adult(c,n,x,y,h=130,scale=1){', '  function adult(c,n,x,y,h=130,scale=1){h*=.5;'),
    'js/street-life.js': ('  function caption(c,n,x,y,h,time){', '  function caption(c,n,x,y,h,time){h*=.5;'),
}
stage16_cases = []
for source, expected in verifier['STAGE16_PREVIOUS'].items():
    current = (ROOT / source).read_text()
    restored = reverse16(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage16 inverse')
    stage16_cases.append(source)
    rejected(source + ' appended unreviewed source', lambda: reverse16(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    else:
        marker, replacement = native_markers[source]
    assert current.count(marker) >= 1, (source, marker)
    changed = current.replace(marker, replacement, 1)
    assert changed != current
    rejected(source + ' unreviewed native path or load order', lambda: reverse16(source, changed))

# Independently pin the unchanged cycling simulation, so even a newly edited
# inverse manifest cannot silently call a physics change a rendering addition.
game = (ROOT / 'js/game.js').read_text()
start = game.index('  function update(dt){')
end = game.index('  function updateParticles(', start)
assert hashlib.sha256(game[start:end].encode()).hexdigest() == 'be413cd99f320f38d94a49fdf3b93d297dfe5f5039aa977d4c20442250fc9bef'
checks.append('unchanged 17,332-character cycling simulation block')

manifest16 = ROOT / 'references/source/stage16-source-integration.json'


def modified_stage16_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest16 else b'')


with patch.object(Path, 'read_bytes', modified_stage16_manifest):
    rejected('Stage16 inverse manifest tampering', lambda: reverse16('js/game.js', (ROOT / 'js/game.js').read_text()))

assert len(checks) == 11 + 3 * len(stage16_cases)
print(f'PASS: 944 protected originals; prior Stage14 guards retained; {len(stage16_cases)} exact Stage16 inverses, '
      f'{2 * len(stage16_cases)} rejected Stage16 source/load-order mutations and tampered Stage16 manifest; '
      'cycling simulation block unchanged; all mutations in memory.')
