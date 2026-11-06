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
reverse17 = verifier['reverse_stage17_source']
reverse18 = verifier['reverse_stage18_source']
reverse19 = verifier['reverse_stage19_source']
reverse20 = verifier['reverse_stage20_source']
reverse21 = verifier['reverse_stage21_source']
checks = []


def stage20_text(source):
    """Normalize current Stage21 to the exact Stage20 text earlier guards reviewed."""
    current = (ROOT / source).read_text()
    return reverse21(source, current) if source in verifier['STAGE21_PREVIOUS'] else current


def stage19_text(source):
    """Keep every earlier guard against the exact Stage19 version it reviewed."""
    current = stage20_text(source)
    return reverse20(source, current) if source in verifier['STAGE20_PREVIOUS'] else current


def stage18_text(source):
    """Keep every earlier guard against the exact Stage18 version it reviewed."""
    current = stage19_text(source)
    return reverse19(source, current) if source in verifier['STAGE19_PREVIOUS'] else current


def stage17_text(source):
    """Keep existing Stage17 contracts against the exact source they reviewed."""
    current = stage18_text(source)
    return reverse18(source, current) if source in verifier['STAGE18_PREVIOUS'] else current


def stage16_text(source):
    """Preserve all earlier negative guards against the version they reviewed."""
    current = stage17_text(source)
    return reverse17(source, current) if source in verifier['STAGE17_PREVIOUS'] else current


def stage15_text(source):
    """Older inverse contracts still receive the exact version they reviewed."""
    current = stage16_text(source)
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
    current = stage16_text(source)
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
    rejected('Stage16 inverse manifest tampering', lambda: reverse16('js/game.js', stage16_text('js/game.js')))

assert len(checks) == 11 + 3 * len(stage16_cases)
stage17_cases = []
stage17_native_markers = {
    'js/game.js': ('  function update(dt){', '  function update(dt){dt*=2;'),
    'js/npc-motion.js': ('  function draw(c,n,x,y,height=130,scale=1,options={}){', '  function draw(c,n,x,y,height=130,scale=1,options={}){height*=.5;'),
    'js/street-life.js': ('  function caption(c,n,x,y,h,time){', '  function caption(c,n,x,y,h,time){h*=.5;'),
}
for source, expected in verifier['STAGE17_PREVIOUS'].items():
    current = stage17_text(source)
    restored = reverse17(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage17 inverse')
    stage17_cases.append(source)
    rejected(source + ' appended Stage17 unreviewed source', lambda: reverse17(source, current + '\n// unreviewed source edit\n'))
    marker, replacement = ('<script src=', '<script async src=') if source.endswith('.html') else stage17_native_markers[source]
    assert current.count(marker) >= 1, (source, marker)
    changed = current.replace(marker, replacement, 1)
    assert changed != current
    rejected(source + ' Stage17 unreviewed native path or load order', lambda: reverse17(source, changed))

# Pin the reviewed prop dimensions and the intact-pose seating transform too.
# Tests deliberately alter only working-memory strings, never files or saves.
for source, marker, replacement in [
    ('js/street-life.js', 'const benchWidth=140,benchScale=benchWidth/180;', 'const benchWidth=196,benchScale=benchWidth/180;'),
    ('js/npc-motion.js', 'seatHeight=clamp(reach,seatPan.front,seatPan.rear);', 'seatHeight=seatPan.rear*2;'),
]:
    current = stage17_text(source)
    assert current.count(marker) == 1
    rejected(source + ' unreviewed prop/seat geometry', lambda: reverse17(source, current.replace(marker, replacement, 1)))

manifest17 = ROOT / 'references/source/stage17-source-integration.json'


def modified_stage17_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest17 else b'')


with patch.object(Path, 'read_bytes', modified_stage17_manifest):
    rejected('Stage17 inverse manifest tampering', lambda: reverse17('js/game.js', stage17_text('js/game.js')))

assert len(checks) == 14 + 3 * len(stage16_cases) + 3 * len(stage17_cases)
stage18_cases = []
for source, expected in verifier['STAGE18_PREVIOUS'].items():
    current = stage18_text(source)
    restored = reverse18(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage18 inverse')
    stage18_cases.append(source)
    rejected(source + ' appended Stage18 unreviewed source', lambda: reverse18(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    elif source == 'js/game.js':
        marker, replacement = '  function update(dt){', '  function update(dt){dt*=2;'
    else:
        # Mutate a complete real reviewed line in memory. The strict whole-file
        # digest must reject editing even a reviewed rendering addition.
        import json
        inverse = json.loads((ROOT / 'references/source/stage18-source-integration.json').read_text())
        candidates = [line for edit in inverse['files'][source]['changes'] for line in edit['current'].splitlines()
                      if line.strip() and not line.lstrip().startswith(('//','/*','*')) and current.count(line) == 1]
        assert candidates, source
        marker = max(candidates, key=len)
        replacement = marker + '/* unreviewed Stage18 alteration */'
    assert current.count(marker) >= 1, (source, marker)
    changed = current.replace(marker, replacement, 1)
    assert changed != current
    rejected(source + ' Stage18 unreviewed native/render path or load order', lambda: reverse18(source, changed))

manifest18 = ROOT / 'references/source/stage18-source-integration.json'


def modified_stage18_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest18 else b'')


with patch.object(Path, 'read_bytes', modified_stage18_manifest):
    rejected('Stage18 inverse manifest tampering', lambda: reverse18('js/game.js', stage18_text('js/game.js')))

assert len(checks) == 15 + 3 * len(stage16_cases) + 3 * len(stage17_cases) + 3 * len(stage18_cases)
stage19_cases = []
for source, expected in verifier['STAGE19_PREVIOUS'].items():
    current = stage19_text(source)
    restored = reverse19(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage19 inverse')
    stage19_cases.append(source)
    rejected(source + ' appended Stage19 unreviewed source', lambda: reverse19(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    elif source == 'js/game.js':
        marker, replacement = '  function update(dt){', '  function update(dt){dt*=2;'
    else:
        import json
        inverse = json.loads((ROOT / 'references/source/stage19-source-integration.json').read_text())
        candidates = [line for edit in inverse['files'][source]['changes'] for line in edit['current'].splitlines()
                      if line.strip() and not line.lstrip().startswith(('//','/*','*')) and current.count(line) == 1]
        assert candidates, source
        marker = max(candidates, key=len)
        replacement = marker + '/* unreviewed Stage19 alteration */'
    assert current.count(marker) >= 1, (source, marker)
    changed = current.replace(marker, replacement, 1)
    rejected(source + ' Stage19 unreviewed native/render path or load order', lambda: reverse19(source, changed))

manifest19 = ROOT / 'references/source/stage19-source-integration.json'


def modified_stage19_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest19 else b'')


with patch.object(Path, 'read_bytes', modified_stage19_manifest):
    rejected('Stage19 inverse manifest tampering', lambda: reverse19('js/game.js', stage19_text('js/game.js')))

assert len(checks) == 16 + 3 * len(stage16_cases) + 3 * len(stage17_cases) + 3 * len(stage18_cases) + 3 * len(stage19_cases)
stage20_cases = []
for source, expected in verifier['STAGE20_PREVIOUS'].items():
    current = stage20_text(source)
    restored = reverse20(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage20 inverse')
    stage20_cases.append(source)
    rejected(source + ' appended Stage20 unreviewed source', lambda: reverse20(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    elif source == 'js/game.js':
        marker, replacement = '  function update(dt){', '  function update(dt){dt*=2;'
    else:
        import json
        inverse = json.loads((ROOT / 'references/source/stage20-source-integration.json').read_text())
        candidates = [line for edit in inverse['files'][source]['changes'] for line in edit['current'].splitlines()
                      if line.strip() and not line.lstrip().startswith(('//','/*','*')) and current.count(line) == 1]
        assert candidates, source
        marker = max(candidates, key=len)
        replacement = marker + '/* unreviewed Stage20 alteration */'
    assert current.count(marker) >= 1, (source, marker)
    changed = current.replace(marker, replacement, 1)
    rejected(source + ' Stage20 unreviewed native/walking path or load order', lambda: reverse20(source, changed))

manifest20 = ROOT / 'references/source/stage20-source-integration.json'

def modified_stage20_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest20 else b'')

with patch.object(Path, 'read_bytes', modified_stage20_manifest):
    rejected('Stage20 inverse manifest tampering', lambda: reverse20('js/game.js', stage20_text('js/game.js')))

assert len(checks) == 17 + 3 * len(stage16_cases) + 3 * len(stage17_cases) + 3 * len(stage18_cases) + 3 * len(stage19_cases) + 3 * len(stage20_cases)
stage21_cases = []
for source, expected in verifier['STAGE21_PREVIOUS'].items():
    current = (ROOT / source).read_text()
    restored = reverse21(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage21 inverse')
    stage21_cases.append(source)
    rejected(source + ' appended Stage21 unreviewed source', lambda: reverse21(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    elif source == 'js/game.js':
        marker, replacement = 'if(p.x<visible.left||p.x>visible.right)continue;', 'if(p.x<cameraX-60||p.x>cameraX+W+60)continue;'
    else:
        marker, replacement = 'view?view.right+32:-Infinity', '-Infinity'
    assert current.count(marker) >= 1, (source, marker)
    changed = current.replace(marker, replacement, 1)
    rejected(source + ' Stage21 unreviewed culling path or load order', lambda: reverse21(source, changed))

manifest21 = ROOT / 'references/source/stage21-source-integration.json'

def modified_stage21_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest21 else b'')

with patch.object(Path, 'read_bytes', modified_stage21_manifest):
    rejected('Stage21 inverse manifest tampering', lambda: reverse21('js/game.js', (ROOT / 'js/game.js').read_text()))

assert len(checks) == 18 + 3 * len(stage16_cases) + 3 * len(stage17_cases) + 3 * len(stage18_cases) + 3 * len(stage19_cases) + 3 * len(stage20_cases) + 3 * len(stage21_cases)
print(f'PASS: 944 protected originals; prior Stage14/16/17/18/19/20 guards retained; '
      f'{len(stage21_cases)} exact Stage21 inverses/{2 * len(stage21_cases)} rejected source/culling/load-order mutations '
      'and Stage21 manifest tampering; cycling simulation block unchanged; all mutations in memory.')
