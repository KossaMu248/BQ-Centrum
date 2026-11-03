"""Verify protected source files, reversing explicit reviewed integration additions.

The saved donor manifest is local provenance; this tool never reads a donor checkout.
Added bridge/transfer/restore blocks and reviewed rig inverse hunks are SHA-pinned, then removed.
The complete reconstructed original files must still match their donor hashes.
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HASHES = json.loads((ROOT / 'references/source/donor-files.sha256.json').read_text())
INTENTIONAL = {
    'README.md', 'autumn-version.json', 'index.html', 'autumn-v19.html',
    'js/game.js', 'js/autumn-quests.js', 'js/illustrated-visits.js', 'js/hero-rig.js',
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def remove_reviewed_block(text, start, end, expected):
    """Remove a single exact added block, never an arbitrary function body."""
    assert text.count(start) == 1, 'Missing or repeated integration block: ' + start
    first = text.index(start)
    last = text.index(end, first)
    block = text[first:last]
    assert hashlib.sha256(block.encode()).hexdigest() == expected, 'Changed integration block: ' + start
    return text[:first] + text[last:]


def replace_reviewed(text, added, original='', count=1):
    """Reverse only a complete, exact integration edit before donor hashing."""
    assert text.count(added) == count, 'Missing or repeated reviewed edit: ' + added
    return text.replace(added, original)


def reverse_stage13_rig(text):
    """Restore Stage12 through exact SHA-pinned approved directional-render hook hunks."""
    path = ROOT / 'references/source/stage13-hero-integration.json'
    raw = path.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == '25838b098e4bf6ec7fed63655717fb77951ad176e7de326eba5734bb19317379', 'Changed Stage13 rig inverse manifest'
    spec = json.loads(raw)
    assert spec['path'] == 'js/hero-rig.js' and spec['previousProjectCommit'] == '3f230dbbba0b57a7c9672dc62c258e9a207fd47c'
    for edit in reversed(spec['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == 'c89a1cba364486ba9fa9e1e18c3b1a8148e604d1da8530af8f7adb099bc1f1aa', 'Unexpected rig edits beyond reviewed Stage13 integration'
    return text


def reverse_stage12_rig(text):
    """Restore Stage11 through exact SHA-pinned Stage12 source-only context hunks."""
    path = ROOT / 'references/source/stage12-hero-integration.json'
    raw = path.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == '8ef685ae12bf25f3a7a2b8f173867fed307104e725c94a8c6f24f3a3fd5dab13', 'Changed Stage12 rig inverse manifest'
    spec = json.loads(raw)
    assert spec['path'] == 'js/hero-rig.js' and spec['previousProjectCommit'] == 'e5b0daa58ea5bdbddc866767badea86901169290'
    for edit in reversed(spec['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == 'f5fb15663af2dc871962aa5e0d834876bc3d5c2ad2069b134ca2c534f6e2b1fb', 'Unexpected rig edits beyond reviewed Stage12 integration'
    return text


def reverse_stage11_rig(text):
    """Reverse exact SHA-pinned context hunks before older donor reconstruction."""
    path = ROOT / 'references/source/stage11-hero-integration.json'
    raw = path.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == '6ed48030cf3e2862d7a0412fdc47de260b248daf9a41718a2cecb72a0370333f', 'Changed Stage11 rig inverse manifest'
    spec = json.loads(raw)
    assert spec['path'] == 'js/hero-rig.js' and spec['previousProjectCommit'] == '69ab19a79736eddb47a2988bb71787c538545cbc'
    for edit in reversed(spec['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == '12c96e458c66854b10f1a6ed50fdd7b09791cff8c20733f31c584e43aa2932a8', 'Unexpected rig edits beyond reviewed Stage11 integration'
    return text


def restore_donor(path):
    text = (ROOT / path).read_text()
    if path.endswith('.html'):
        for resource in ['js/hero-rig.js', 'js/game.js']:
            text = replace_reviewed(text, f'{resource}?edition=centrum-stage13', f'{resource}?edition=centrum-stage12')
        text = replace_reviewed(text, 'js/centrum-square.js?edition=centrum-stage13', 'js/centrum-square.js?edition=centrum-stage11')
        text = replace_reviewed(text, '<script src="js/centrum-directional-rig.js?edition=centrum-stage13"></script>\n')
    if path.endswith('.html'):
        for resource in ['js/hero-rig.js', 'js/game.js']:
            text = replace_reviewed(text, f'{resource}?edition=centrum-stage12', f'{resource}?edition=centrum-stage11')
    if path.endswith('.html'):
        # Stage 11 changes only the project menu/status markup and script editions.
        for resource, previous in [('css/centrum-inventory.css', 10), ('js/centrum-inventory.js', 10),
                                   ('js/centrum-square.js', 10), ('js/game.js', 10),
                                   ('js/centrum-depth-gait.js', 9), ('js/hero-rig.js', 9)]:
            text = replace_reviewed(text, f'{resource}?edition=centrum-stage11', f'{resource}?edition=centrum-stage{previous}')
        text = replace_reviewed(text, '<script src="js/centrum-hero-cache.js?edition=centrum-stage11"></script>\n')
        text = replace_reviewed(text, '<button id="inventoryMenuBtn" class="dbg-x" type="button" aria-haspopup="dialog" aria-controls="centrumInventoryPanel">BAG · I</button>')
        text = replace_reviewed(text, '<span hidden>🍕 PIZZA <b id="starsCount">', '<span>🍕 PIZZA <b id="starsCount">')
    if path.endswith('.html'):
        text = replace_reviewed(text, 'css/centrum-square.css?edition=centrum-stage10', 'css/centrum-square.css?edition=centrum-stage7')
        for resource in ['css/centrum-inventory.css', 'js/centrum-inventory.js']:
            text = replace_reviewed(text, f'{resource}?edition=centrum-stage10', f'{resource}?edition=centrum-stage6')
        text = replace_reviewed(text, '<script src="js/centrum-depth-gait.js?edition=centrum-stage9"></script>\n')
        text = replace_reviewed(text, '<script src="js/centrum-scenery.js?edition=centrum-stage9"></script>\n')
        text = replace_reviewed(text, '<link rel="icon" href="data:,"/>\n')
        text = replace_reviewed(text, '<script src="js/centrum-atmosphere.js?edition=centrum-stage7"></script>\n')
        text = replace_reviewed(text, '<link rel="stylesheet" href="css/centrum-square.css?edition=centrum-stage7"/>\n')
        text = replace_reviewed(text, '<link rel="stylesheet" href="css/centrum-story.css?edition=centrum-stage7"/>\n')
        text = replace_reviewed(text, '<link rel="stylesheet" href="css/centrum-inventory.css?edition=centrum-stage6"/>\n')
        for name in ['centrum-balance', 'centrum-save', 'centrum-economy', 'centrum-inventory']:
            text = replace_reviewed(text, f'<script src="js/{name}.js?edition=centrum-stage6"></script>\n')
        text = text.replace('<title>BQ-Centrum — Autumn Ride</title>',
                            '<title>Bearly Qualified — Autumn Ride</title>')
        text = text.replace('<link rel="stylesheet" href="css/centrum-square.css?edition=centrum-stage2"/>\n', '')
        text = text.replace('<link rel="stylesheet" href="css/centrum-link.css?edition=centrum-stage4"/>\n', '')
        text = text.replace('<link rel="stylesheet" href="css/centrum-story.css?edition=centrum-stage5"/>\n', '')
        text = text.replace('          <h3>BQ-Centrum prototype</h3>\n          <div class="dbg-actions"><button id="centrumSquareBtn" type="button">CENTRUM PARKING STOP · DEBUG SHORTCUT</button></div>\n          <p class="dbg-help">Places connect from the marked cycling stop. Stop and press E to park; M opens the discovered map on foot.</p>\n', '')
        for name in ['centrum-square-world', 'centrum-square', 'centrum-scenes', 'centrum-save', 'centrum-parking-save', 'centrum-link', 'wrong-entrance-quest', 'centrum-civilians', 'centrum-story']:
            for stage in [2, 3, 4, 5, 7, 9, 10]:
                text = text.replace(f'<script src="js/{name}.js?edition=centrum-stage{stage}"></script>\n', '')
    if path.endswith('.html'):
        for name, stage in [('hero-rig', 9), ('game', 10)]:
            text = replace_reviewed(text, f'js/{name}.js?edition=centrum-stage{stage}', f'js/{name}.js?edition=autumn-v19')
    if path == 'js/hero-rig.js':
        text = reverse_stage13_rig(text)
        text = reverse_stage12_rig(text)
        text = reverse_stage11_rig(text)
        # Optional ground projection is used only by the independent square.
        # Default source calls, source locomotion, torso and baby pixels remain
        # intact. Reverse each complete, exact edit before the donor-file hash.
        text = replace_reviewed(text, '  function projectGroundGait(gait,motion){return window.BearlyCentrumDepthGait?.project(gait,motion)||gait;}\n')
        text = replace_reviewed(text, 'function bodyFrame(profile,name,distance,h,weight,groundMotion=null)', 'function bodyFrame(profile,name,distance,h,weight)')
        text = replace_reviewed(text, "+(groundMotion?.y?':'+groundMotion.cacheKey:'')")
        text = replace_reviewed(text, 'projectGroundGait(window.BearlyLocomotion.pose(window.BearlyLocomotion.cycleLength(BODY_HEIGHT)*effectivePhase,BODY_HEIGHT,weight),groundMotion)', 'window.BearlyLocomotion.pose(window.BearlyLocomotion.cycleLength(BODY_HEIGHT)*effectivePhase,BODY_HEIGHT,weight)')
        text = replace_reviewed(text, 'bodyFrame(profile,name,options.distance||0,h,weight,options.groundMotion)', 'bodyFrame(profile,name,options.distance||0,h,weight)')
        text = replace_reviewed(text, 'projectGroundGait(window.BearlyLocomotion.pose(frame.gait.phase*window.BearlyLocomotion.cycleLength(h),h,weight),frame.gait.groundMotion||options.groundMotion)', 'window.BearlyLocomotion.pose(frame.gait.phase*window.BearlyLocomotion.cycleLength(h),h,weight)')
    if path == 'js/game.js':
        text = replace_reviewed(text, "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE13';", "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE12';")
        text = replace_reviewed(text, "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE12';", "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE11';")
        text = replace_reviewed(text, "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE11';", "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE10';")
        text = replace_reviewed(text, 'if(startup.requested&&!window.BearlyCentrumLink?.holding()&&!window.BearlyCentrumEconomy?.ready())enterReadyRide();', 'if(startup.requested&&!window.BearlyCentrumLink?.holding())enterReadyRide();')
        # Stage 6 changes the pickup destination and adds narrow ledger/action
        # hooks. All other source physics, damage and renderer code is hashed.
        text = replace_reviewed(text, '(window.BearlyCentrumSave?.storage||localStorage)', 'localStorage', count=2)
        for added in [
            '    if(window.BearlyCentrumEconomy?.interceptReset(startPlaying))return;\n',
            '    window.BearlyCentrumEconomy?.afterReset(startPlaying);\n',
            '    if(window.BearlyCentrumEconomy?.ready()){window.BearlyCentrumEconomy.retry();return;}\n',
            "          window.BearlyCentrumEconomy?.scheduleCheckpoint('route-checkpoint-'+checkpoint);\n",
            '    window.BearlyCentrumEconomy?.update(dt);\n',
            '    window.BearlyCentrumInventory?.update(dt);\n',
            '  window.BearlyCentrumEconomy?.bind(centrumCycleBridge);\n',
            '    await window.BearlyCentrumEconomy?.bootstrap();\n',
        ]:
            text = replace_reviewed(text, added)
        text = replace_reviewed(text,
            'METRO C • BILLY’S TO BAG · I TO EAT · PUKE DRAINS HP',
            'METRO C • BILLYS PIZZA +16 HP · PUKE DRAINS HP · SMARTER ENEMIES')
        text = replace_reviewed(text,
            '    if(!window.BearlyCentrumInventory?.isBrowsing())window.BearlyCentrumLink?.update(dt,debugOpen);',
            '    window.BearlyCentrumLink?.update(dt,debugOpen);')
        text = replace_reviewed(text,
            '    if(window.BearlyCentrumInventory?.isBrowsing()){acc=0;}\n    else if(window.BearlyCentrumLink?.holding()){acc=0;}',
            '    if(window.BearlyCentrumLink?.holding()){acc=0;}')
        text = replace_reviewed(text, """      for(const [pickupIndex,star] of stars.entries()) if(!star.got&&v146PizzaTouched(star)){
        const collected=window.BearlyCentrumEconomy?.collect('route-pizza-'+pickupIndex);
        if(collected?.ok){
          star.got=true;numStars++;bonus+=100;score+=100;sound('pizza-kiss');
          $('starsCount').textContent=`${numStars} / ${stars.length}`;
        }
      }""", """      for(const star of stars) if(!star.got&&v146PizzaTouched(star)){
        star.got=true;numStars++;bonus+=100;score+=100;
        const restored=Math.min(100-health,16);
        health=clamp(health+16,0,100);pizzaHealingTotal+=restored;
        sound('pizza-kiss');banner(`BILLYS PAN PIZZA · +${Math.round(restored)} HP`,1.4);
        $('starsCount').textContent=`${numStars} / ${stars.length}`;
      }""")
        text = remove_reviewed_block(text,
            '  // Narrow bridge: parking uses', '  function centrumVisitContext(dt)',
            '0e16f397ddfb893b4432783ac47343623f2d5417e8f87c7737d14c926016a1be')
        # Inlining this exact extracted context is checked by the original full-file hash.
        first = text.index('  function centrumVisitContext(dt){\n    return ')
        last = text.index('  function loop(now){', first)
        context = text[first:last].removeprefix('  function centrumVisitContext(dt){\n    return ').removesuffix(';\n  }\n')
        text = text[:first] + text[last:]
        text = text.replace('    window.BearlyVisits?.update(centrumVisitContext(dt));',
                            '    window.BearlyVisits?.update(' + context + ');')
        text = text.replace('    window.BearlyVisits?.centrumContext(centrumVisitContext(dt));\n', '')
        text = text.replace('    window.BearlyCentrumLink?.update(dt,debugOpen);\n', '')
        text = text.replace('    if(window.BearlyCentrumLink?.holding()){acc=0;}\n    else if(window.BearlyCentrumSquare?.active())',
                            '    if(window.BearlyCentrumSquare?.active())')
        text = text.replace('    window.BearlyCentrumLink?.cancel();\n', '')
        text = text.replace('window.BearlyCentrumLink?.cancel();', '')
        text = text.replace('window.BearlyCentrumLink?.renderRouteMarker(ctx,groundAt);', '')
        text = text.replace('  window.BearlyCentrumLink?.bind(centrumCycleBridge);\n', '')
        text = text.replace('    await window.BearlyCentrumLink?.bootstrap();\n', '')
        text = text.replace('    if(window.BearlyCentrumLink?.holding()){e.preventDefault();return;}\n', '')
        text = text.replace('if(debugOpen||window.BearlyCentrumLink?.holding())return;', 'if(debugOpen)return;')
        text = text.replace('&&!window.BearlyCentrumLink?.holding()', '')
        text = text.replace("window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE10';",
                            "window.BEARLY_BUILD_ID='AUTUMN_RIDE_ART_V19';")
        text = text.replace('bq-centrum:best-score:v1', 'bearBestAutumn')
        text = text.replace('    window.BearlyCentrumSquare?.close();\n', '')
        text = text.replace('    if(window.BearlyCentrumSquare?.render(ctx,W,H))return;\n', '')
        text = text.replace("    $('centrumSquareBtn').addEventListener('click',()=>{if(!window.BearlyCentrumLink?.holding())debugWarpTo(11325/WORLD_STRETCH);debugOpenMenu(false);});\n", '')
        text = text.replace("()=>{window.BearlyCentrumSquare?.close();", "()=>{")
        text = text.replace("&&!window.BearlyCentrumSquare?.active()", '')
        text = text.replace('    // Independent prototype holds the existing ride and visits without mutating them.\n    if(window.BearlyCentrumSquare?.active()){acc=0;window.BearlyCentrumSquare.update(dt,debugOpen);}\n    else {\n', '')
        text = text.replace('    }\n    const t0=performance.now();render();const took=performance.now()-t0;',
                            '    const t0=performance.now();render();const took=performance.now()-t0;')
        text = text.replace("  window.addEventListener('centrum-square-change',()=>{keys.clear();clearMobileControls();last=performance.now();acc=0;});\n", '')
    if path == 'js/autumn-quests.js':
        text = replace_reviewed(text, 'storage=window.BearlyCentrumSave?.storage||window.localStorage', 'storage=window.localStorage')
        text = text.replace('bq-centrum:adventure:v1', 'bearAutumnAdventureV7')
        text = remove_reviewed_block(text, '    function restore(saved){', '    return {snapshot,act,restore};',
            'bc9a5d9775c150ff6d57d4906b456411cf8b87add3182ffab600fffaf175fe56')
        text = text.replace('    return {snapshot,act,restore};', '    return {snapshot,act};')
    if path == 'js/illustrated-visits.js':
        # Stage8 repair: show current health during the existing transfer too.
        hearts = "    const hearts=status.querySelector('.brawl-hp');hearts.setAttribute('aria-label',`Health ${combatState.hp} out of 100`);\n    for(const [i,heart] of [...hearts.children].entries())heart.firstElementChild.style.width=clamp((combatState.hp-i*20)/20,0,1)*100+'%';\n"
        text = replace_reviewed(text, "    const q=quests.snapshot(),t=nearby();\n" + hearts + "    if(transition)", "    const q=quests.snapshot(),t=nearby();\n    if(transition)")
        position = "    const meter=status.querySelector('.primal-track'),value=combatState.phase==='madness'?combatState.frenzy/8*100:combatState.heat;"
        text = replace_reviewed(text, position, hearts + position)
        text = replace_reviewed(text,
            "    if(e.code==='KeyC'&&!e.repeat&&window.BearlyCentrumEconomy?.ready()){e.preventDefault();e.stopImmediatePropagation();window.BearlyCentrumEconomy.retry();return;}\n")
        text = replace_reviewed(text,
            "    if(combatState.hp===0&&combatState.defeatAge>1.85){combat.cancel();setMessage('Open the bag · I · to retry the complete checkpoint or abandon the encounter and rest.');}",
            "    if(combatState.hp===0&&combatState.defeatAge>1.85){combat.cancel();combat.recover();combatState=combat.snapshot();s.storeHealth?.(combatState.hp);x=mode==='street'?context.x+28:160;depth=0;jumpZ=0;setMessage('The bear shakes it off back by the entrance.');}")
        text = text.replace('  let linkedTransfer=false;\n', '')
        text = remove_reviewed_block(text, '  function centrumContext(next){', '  function leave(){',
            '241ec8438984a0ca42b336685b84c5d22c3b0e6a3ac5297afdb1d1cab5b7c310')
        text = text.replace('pendingStepOff=false;linkedTransfer=false;return;', 'pendingStepOff=false;return;')
        text = text.replace("linkedTransfer=false;document.body.classList.remove('autumn-exploring');", "document.body.classList.remove('autumn-exploring');")
        text = remove_reviewed_block(text, '    if(linkedTransfer){\n      // The first', '    park();const mountedBlend',
            '00b0a8cc411481711b7c516cec00a2054d7dbb41c544b8a62b39279c5bd0f50d')
        text = text.replace('    if(linkedTransfer)return Math.floor(clamp((t-.03)/.69,0,1)*5)<2?1:0;\n', '')
        text = text.replace('    if(linkedTransfer&&(mode||transition))return true;\n', '')
        text = text.replace('overlay,centrumContext,centrumTransfer,restoreCentrumStreet,footActive:', 'overlay,footActive:')
        text = text.replace(",linkedTransfer,passengerOwner:linkedTransfer?(roadBabyAlpha()>0?'chair':'transfer-carrier'):null,place:", ',place:')
    return hashlib.sha256(text.encode()).hexdigest()


failures = []
for name, expected in HASHES.items():
    if name in INTENTIONAL:
        if name not in {'README.md', 'autumn-version.json'} and restore_donor(name) != expected:
            failures.append(name + ': unexpected changes beyond the documented substitutions')
    elif not (ROOT / name).is_file() or digest(ROOT / name) != expected:
        failures.append(name + ': missing or changed')

assert not failures, '\n'.join(failures)
assert (ROOT / 'index.html').read_bytes() == (ROOT / 'autumn-v19.html').read_bytes()
manifest = json.loads((ROOT / 'autumn-version.json').read_text())
assert manifest['source']['commit'] == 'da109213fdf24947c2ac0b85de900214cc72e44f'
assert manifest['edition'] == 'BQ_CENTRUM_STAGE13'
print(f'PASS: {len(HASHES)} pinned original files verified; all source assets/CSS and original protected code match;')
print('only reviewed identity/save, scene hooks, parking/economy bridge, pickup destination, action/state-restore and optional Centrum walking/worker additions differ.')
