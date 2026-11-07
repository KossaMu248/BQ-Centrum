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
reverse22 = verifier['reverse_stage22_source']
reverse23 = verifier['reverse_stage23_source']
reverse24 = verifier['reverse_stage24_source']
reverse25 = verifier['reverse_stage25_source']
checks = []


def stage24_text(source):
    """Normalize the rigid-limb integration before all earlier source guards."""
    current = (ROOT / source).read_text()
    return reverse25(source, current) if source in verifier['STAGE25_PREVIOUS'] else current


def stage23_text(source):
    """Normalize current walking-track repair before every older source guard."""
    current = stage24_text(source)
    return reverse24(source, current) if source in verifier['STAGE24_PREVIOUS'] else current


def stage22_text(source):
    """Normalize current articulation before every older source guard."""
    current = stage23_text(source)
    return reverse23(source, current) if source in verifier['STAGE23_PREVIOUS'] else current


def stage21_text(source):
    """Normalize the current renderer repair before every older guard."""
    current = stage22_text(source)
    return reverse22(source, current) if source in verifier['STAGE22_PREVIOUS'] else current


def stage20_text(source):
    """Normalize current Stage21 to the exact Stage20 text earlier guards reviewed."""
    current = stage21_text(source)
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
    current = stage21_text(source)
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
    rejected('Stage21 inverse manifest tampering', lambda: reverse21('js/game.js', stage21_text('js/game.js')))

assert len(checks) == 18 + 3 * len(stage16_cases) + 3 * len(stage17_cases) + 3 * len(stage18_cases) + 3 * len(stage19_cases) + 3 * len(stage20_cases) + 3 * len(stage21_cases)
stage22_cases = []
for source, expected in verifier['STAGE22_PREVIOUS'].items():
    current = stage22_text(source)
    restored = reverse22(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage22 inverse')
    stage22_cases.append(source)
    rejected(source + ' appended Stage22 unreviewed source', lambda: reverse22(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    elif source == 'js/game.js':
        marker, replacement = '  function update(dt){', '  function update(dt){dt*=2;'
    else:
        marker, replacement = 'for(const polygon of topology[side])emit(source,polygon,map);', 'for(const polygon of topology[side])emit(source,polygon,body);'
    assert current.count(marker) >= 1, (source, marker)
    changed = current.replace(marker, replacement, 1)
    rejected(source + ' Stage22 unreviewed surface/physics/load-order path', lambda: reverse22(source, changed))

manifest22 = ROOT / 'references/source/stage22-source-integration.json'
def modified_stage22_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest22 else b'')
with patch.object(Path, 'read_bytes', modified_stage22_manifest):
    rejected('Stage22 inverse manifest tampering', lambda: reverse22('js/game.js', stage22_text('js/game.js')))

assert len(checks) == 19 + 3 * len(stage16_cases) + 3 * len(stage17_cases) + 3 * len(stage18_cases) + 3 * len(stage19_cases) + 3 * len(stage20_cases) + 3 * len(stage21_cases) + 3 * len(stage22_cases)
stage23_cases = []
for source, expected in verifier['STAGE23_PREVIOUS'].items():
    current = stage23_text(source)
    restored = reverse23(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage23 inverse')
    stage23_cases.append(source)
    rejected(source + ' appended Stage23 unreviewed source', lambda: reverse23(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    elif source == 'js/game.js':
        marker, replacement = '  function update(dt){', '  function update(dt){dt*=2;'
    else:
        marker, replacement = '  function draw(c,px,py,h,face,options={}){', '  function draw(c,px,py,h,face,options={}){h*=.5;'
    assert current.count(marker) >= 1, (source, marker)
    rejected(source + ' Stage23 unreviewed native/physics/load-order path', lambda: reverse23(source, current.replace(marker, replacement, 1)))

# Pin both the painted knee drive and shared-leg nonfolding limit, while the
# separate joint-motion test verifies their actual submitted geometric effects.
for marker, replacement, label in [
    ('(gait.walkPose?.knees[side]||0)*profile.stature*pose.s', '0', 'painted knee drive'),
    ('bendWeight=clamp(safe,0,1);', 'bendWeight=1;', 'shared-leg positive-area limit'),
]:
    current = stage23_text('js/hero-rig.js')
    assert current.count(marker) == 1
    rejected('Stage23 unreviewed ' + label, lambda: reverse23('js/hero-rig.js', current.replace(marker, replacement, 1)))

manifest23 = ROOT / 'references/source/stage23-source-integration.json'
def modified_stage23_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest23 else b'')
with patch.object(Path, 'read_bytes', modified_stage23_manifest):
    rejected('Stage23 inverse manifest tampering', lambda: reverse23('js/game.js', stage23_text('js/game.js')))

assert len(checks) == 22 + 3 * len(stage16_cases) + 3 * len(stage17_cases) + 3 * len(stage18_cases) + 3 * len(stage19_cases) + 3 * len(stage20_cases) + 3 * len(stage21_cases) + 3 * len(stage22_cases) + 3 * len(stage23_cases)
previous_check_count = len(checks)
stage24_cases = []
for source, expected in verifier['STAGE24_PREVIOUS'].items():
    current = stage24_text(source)
    restored = reverse24(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage24 inverse')
    stage24_cases.append(source)
    rejected(source + ' appended Stage24 unreviewed source', lambda: reverse24(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    elif source == 'js/game.js':
        marker, replacement = '  function update(dt){', '  function update(dt){dt*=2;'
    else:
        marker, replacement = '  function draw(c,px,py,h,face,options={}){', '  function draw(c,px,py,h,face,options={}){h*=.5;'
    assert current.count(marker) >= 1, (source, marker)
    rejected(source + ' Stage24 unreviewed native/physics/load-order path', lambda: reverse24(source, current.replace(marker, replacement, 1)))

# These whole-file guards complement actual rendered-pixel/stride geometry tests.
for marker, replacement, label in [
    ('(1-weight*Math.abs(gait.sourceWalk?1:(gait.groundMotion?.x??1)))', '(1-.1*weight)', 'persistent rest stagger'),
    ('v.y-=Math.max(0,hemAt(raw[0])-570)', 'v.y-=0*Math.max(0,hemAt(raw[0])-570)', 'trouser opening follow'),
    ("*(side==='far'?2.2:1)", '*1', 'rear calf flex gain'),
]:
    current = stage24_text('js/hero-rig.js')
    assert current.count(marker) == 1, marker
    rejected('Stage24 unreviewed ' + label, lambda: reverse24('js/hero-rig.js', current.replace(marker, replacement, 1)))

manifest24 = ROOT / 'references/source/stage24-source-integration.json'
def modified_stage24_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest24 else b'')
with patch.object(Path, 'read_bytes', modified_stage24_manifest):
    rejected('Stage24 inverse manifest tampering', lambda: reverse24('js/game.js', stage24_text('js/game.js')))

assert len(checks) == previous_check_count + 3 * len(stage24_cases) + 4
previous_check_count = len(checks)
stage25_cases = []
for source, expected in verifier['STAGE25_PREVIOUS'].items():
    current = (ROOT / source).read_text()
    restored = reverse25(source, current)
    assert hashlib.sha256(restored.encode()).hexdigest() == expected
    checks.append(source + ' exact Stage25 inverse')
    stage25_cases.append(source)
    rejected(source + ' appended Stage25 unreviewed source', lambda: reverse25(source, current + '\n// unreviewed source edit\n'))
    if source.endswith('.html'):
        marker, replacement = '<script src=', '<script async src='
    elif source == 'js/game.js':
        marker, replacement = '  function update(dt){', '  function update(dt){dt*=2;'
    else:
        marker, replacement = '  function draw(c,px,py,h,face,options={}){', '  function draw(c,px,py,h,face,options={}){h*=.5;'
    assert current.count(marker) >= 1, (source, marker)
    rejected(source + ' Stage25 unreviewed native/physics/load-order path', lambda: reverse25(source, current.replace(marker, replacement, 1)))

# Exact integration guards complement the actual shaft-volume and painted-bone
# contracts. These mutations stay in memory; no donor or game state is edited.
for marker, replacement, label in [
    ('shin:p=>rotate(p,K0,K,shinAngle)', 'shin:p=>rotate({x:K0.x+(p.x-K0.x)*.5,y:p.y},K0,K,shinAngle)', 'rigid shin volume'),
    ('let reach=clamp(distance,Math.abs(L1-L2)+1e-6,L1+L2),pole=1;', 'let reach=distance,pole=1;', 'fixed source bone reach'),
    ('const bone=bones[side],thigh=p=>bone.thigh(p);', 'const bone=bones[side],thigh=(p,r)=>body(r);', 'moving whole thigh'),
    ('centrumLowerTargets,centrumLowerMaterial,centrumLowerMesh', 'centrumLowerTargets,centrumLowerMesh', 'serialized material dependency'),
]:
    current = (ROOT / 'js/hero-rig.js').read_text()
    assert current.count(marker) == 1, marker
    rejected('Stage25 unreviewed ' + label, lambda: reverse25('js/hero-rig.js', current.replace(marker, replacement, 1)))

manifest25 = ROOT / 'references/source/stage25-source-integration.json'
def modified_stage25_manifest(path):
    return read_bytes(path) + (b'\n' if path == manifest25 else b'')
with patch.object(Path, 'read_bytes', modified_stage25_manifest):
    rejected('Stage25 inverse manifest tampering', lambda: reverse25('js/game.js', (ROOT / 'js/game.js').read_text()))

assert len(checks) == previous_check_count + 3 * len(stage25_cases) + 5
print(f'PASS: 944 protected originals; all earlier guards retained; '
      f'{len(stage25_cases)} exact Stage25 inverses/{2 * len(stage25_cases) + 4} rejected source/rig/load-order mutations '
      f'and Stage25 manifest tampering; cycling simulation block unchanged; {len(checks)} total in-memory checks.')
