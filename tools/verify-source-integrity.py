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
    'js/game.js', 'js/autumn-quests.js', 'js/illustrated-visits.js', 'js/hero-rig.js', 'js/npc-motion.js',
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


STAGE22_PREVIOUS = {'autumn-v19.html': '7e1fb53109e07f5ca44f8584db37aa14f9bb2bd9b438c8143d861e4e3166adc2', 'index.html': '7e1fb53109e07f5ca44f8584db37aa14f9bb2bd9b438c8143d861e4e3166adc2', 'js/game.js': '6ae19f516feb6b6f2f72196098e964d7062fbaf591d5100d3f3d709f1954dccc', 'js/hero-rig.js': '34d2c90e46f96b1ce9cd8630773737f46369502313e4cb1a1c313d49b2440263'}
STAGE22_MANIFEST_SHA256 = '328730f15eb3ee54627e2c9ddc47414a3cd142fa15fbd39aa0c6699b676b8289'
INTENTIONAL.update(STAGE22_PREVIOUS)


def reverse_stage22_source(path, text):
    """Undo only exact reviewed walking-surface and entry hunks."""
    raw = (ROOT / 'references/source/stage22-source-integration.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == STAGE22_MANIFEST_SHA256, 'Changed Stage22 source inverse manifest'
    spec = json.loads(raw)
    assert spec['format'] == 1 and spec['previousProjectCommit'] == 'aed621dcb42052770fda52ca3bcb2c2de0237cc7'
    assert set(spec['files']) == set(STAGE22_PREVIOUS), 'Unexpected Stage22 protected paths'
    edits = spec['files'][path]
    assert edits['previousSha256'] == STAGE22_PREVIOUS[path]
    assert hashlib.sha256(text.encode()).hexdigest() == edits['currentSha256'], 'Unreviewed Stage22 source bytes: ' + path
    for edit in reversed(edits['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == STAGE22_PREVIOUS[path], 'Unexpected source edits beyond reviewed Stage22 integration: ' + path
    return text


STAGE21_PREVIOUS = {'autumn-v19.html': '974e3d2788ad0c3c324dc891aa166ccb8e0242cce95230ec820c47962cdcc6af', 'index.html': '974e3d2788ad0c3c324dc891aa166ccb8e0242cce95230ec820c47962cdcc6af', 'js/game.js': 'e38d5830ca67225f54243835a776b067ded8f2c5c150c75d85e886eb67ba04c6', 'js/illustrated-world.js': '451f88c440ac03ef55ebb1448f936a34aff27600cd8a25db2508b05f029bb67b'}
STAGE21_MANIFEST_SHA256 = '978ed43c5bb02624a362844aedf5e89f0661ffc10b6100c5852b6afd4cffccc6'
INTENTIONAL.update(STAGE21_PREVIOUS)


def reverse_stage21_source(path, text):
    """Undo only exact reviewed camera/frustum-render and entry hunks."""
    raw = (ROOT / 'references/source/stage21-source-integration.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == STAGE21_MANIFEST_SHA256, 'Changed Stage21 source inverse manifest'
    spec = json.loads(raw)
    assert spec['format'] == 1 and spec['previousProjectCommit'] == '246e0eb7d9ce0dc8af2d594a8a67b40b94cf92fe'
    assert set(spec['files']) == set(STAGE21_PREVIOUS), 'Unexpected Stage21 protected paths'
    edits = spec['files'][path]
    assert edits['previousSha256'] == STAGE21_PREVIOUS[path]
    assert hashlib.sha256(text.encode()).hexdigest() == edits['currentSha256'], 'Unreviewed Stage21 source bytes: ' + path
    for edit in reversed(edits['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == STAGE21_PREVIOUS[path], 'Unexpected source edits beyond reviewed Stage21 integration: ' + path
    return text


STAGE20_PREVIOUS = {'autumn-v19.html': 'f1100dbd323d64ecda8a4d85b25dac1b6588d7442c30169650f97df51f5f0818', 'index.html': 'f1100dbd323d64ecda8a4d85b25dac1b6588d7442c30169650f97df51f5f0818', 'js/game.js': '03ea98523b86434921b59e33530e48738451b5e1bbf961b8703dc84cdc63ea3e', 'js/illustrated-visits.js': '861be8792f04df66f48162d5b8bdd6e0bb6a96349f712b92fb770a928221bc9d'}
STAGE20_MANIFEST_SHA256 = 'bd2db17eef646ab8e7d02c7759aa205c5be322d659b410f0b0eb8b5da1de8059'
INTENTIONAL.update(STAGE20_PREVIOUS)


def reverse_stage20_source(path, text):
    """Undo only exact reviewed walking-pace and entry hunks."""
    raw = (ROOT / 'references/source/stage20-source-integration.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == STAGE20_MANIFEST_SHA256, 'Changed Stage20 source inverse manifest'
    spec = json.loads(raw)
    assert spec['format'] == 1 and spec['previousProjectCommit'] == '5af70787eff81586dcbf67bc25b208fb7a63d8a5'
    assert set(spec['files']) == set(STAGE20_PREVIOUS), 'Unexpected Stage20 protected paths'
    edits = spec['files'][path]
    assert edits['previousSha256'] == STAGE20_PREVIOUS[path]
    assert hashlib.sha256(text.encode()).hexdigest() == edits['currentSha256'], 'Unreviewed Stage20 source bytes: ' + path
    for edit in reversed(edits['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == STAGE20_PREVIOUS[path], 'Unexpected source edits beyond reviewed Stage20 integration: ' + path
    return text


STAGE19_PREVIOUS = {'autumn-v19.html': '9ee316f87594803c6dec2a12cc3849da2dcdddc0d5b95c2b9a715223bb7a2f9b', 'index.html': '9ee316f87594803c6dec2a12cc3849da2dcdddc0d5b95c2b9a715223bb7a2f9b', 'js/game.js': '60ef1993ea5dd5112f45d24748eed8146733fcfa6a18953a16edcdbaa95674bf', 'js/illustrated-neighbourhood.js': '00115255cb42488640474d7a3f2e13ab6a0e673351e669009681d6ce838355cd', 'js/illustrated-world.js': 'c1c98346aa37601e97bcaa1f85a255c6362a5f4e1c5a7c55e5e91dc4e1eed47d', 'js/street-life.js': 'ded03758bd6019831d41889c58b5409dd6ec2df0d1634825310f034be621c308'}
STAGE19_MANIFEST_SHA256 = '0d08adfe07cbc987324d26ba64ddaf296e1f5b85a54374c639354f9a75ecd1da'
INTENTIONAL.update(STAGE19_PREVIOUS)


def reverse_stage19_source(path, text):
    """Undo only exact reviewed compact/sparse bench and entry hunks."""
    raw = (ROOT / 'references/source/stage19-source-integration.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == STAGE19_MANIFEST_SHA256, 'Changed Stage19 source inverse manifest'
    spec = json.loads(raw)
    assert spec['format'] == 1 and spec['previousProjectCommit'] == 'ff5f7d676365e139ed03111e0a43555b71579c74'
    assert set(spec['files']) == set(STAGE19_PREVIOUS), 'Unexpected Stage19 protected paths'
    edits = spec['files'][path]
    assert edits['previousSha256'] == STAGE19_PREVIOUS[path]
    assert hashlib.sha256(text.encode()).hexdigest() == edits['currentSha256'], 'Unreviewed Stage19 source bytes: ' + path
    for edit in reversed(edits['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == STAGE19_PREVIOUS[path], 'Unexpected source edits beyond reviewed Stage19 integration: ' + path
    return text


STAGE18_PREVIOUS = {'autumn-v19.html': '867a52d4ecdd67cf11d893bcec073145a2cd71e02e20753769fef7a5d72e20eb',
 'index.html': '867a52d4ecdd67cf11d893bcec073145a2cd71e02e20753769fef7a5d72e20eb',
 'js/brawler.js': 'b1678ee72b930dd0d7e15ac2a43448727bef001044477faab10da8934e7e0d09',
 'js/game.js': '5cfc8f851422d73cc9829d4bb8adf403ffbcf6f923427226d974cf9efa411a9c',
 'js/illustrated-hero.js': '04ab3ced1cc05e28164d0b3eeacf5a1f8de18ea10822038eaff2d267a00bcb51',
 'js/street-life.js': '7e54984fb2d8b94df6f5a055b0c1f8c2828bbde14634a8d9431d50a52e73b229'}
STAGE18_MANIFEST_SHA256 = '43cbcea8011d508c921aa0c2bab013b6a2e7e97309a935cc8d3c710daac302ef'
INTENTIONAL.update(STAGE18_PREVIOUS)


def reverse_stage18_source(path, text):
    """Undo only exact reviewed bench/peaceful-seat/opaque-eye and entry hunks."""
    raw = (ROOT / 'references/source/stage18-source-integration.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == STAGE18_MANIFEST_SHA256, 'Changed Stage18 source inverse manifest'
    spec = json.loads(raw)
    assert spec['format'] == 1 and spec['previousProjectCommit'] == 'bbf2de3d6c26652cf7ae29faa1c03456c0f533c0'
    assert set(spec['files']) == set(STAGE18_PREVIOUS), 'Unexpected Stage18 protected paths'
    edits = spec['files'][path]
    assert edits['previousSha256'] == STAGE18_PREVIOUS[path]
    assert hashlib.sha256(text.encode()).hexdigest() == edits['currentSha256'], 'Unreviewed Stage18 source bytes: ' + path
    for edit in reversed(edits['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == STAGE18_PREVIOUS[path], 'Unexpected source edits beyond reviewed Stage18 integration: ' + path
    return text


STAGE17_PREVIOUS = {
    'autumn-v19.html': '17d0516568c790a8ac968c57e3ac56d76d0563f193145f01799b38ab08c3d2c6',
    'index.html': '17d0516568c790a8ac968c57e3ac56d76d0563f193145f01799b38ab08c3d2c6',
    'js/game.js': '11c93d495aa746d673896781d0053a1a8f85b498bbab5f850a1ff7468d0e3dec',
    'js/npc-motion.js': '147503f395bd349444a4c8490d72b912c9d5211849323ef8c6c929ed5ff6db13',
    'js/street-life.js': '1677f641ef54a8e4ef3d2c7ffe0c8d15aea2d7bd5f1e6d3419f67c5d97401584',
}
STAGE17_MANIFEST_SHA256 = '699523fc251d06a6626cb793f330f24fdeb706d72c65af6248fb54c530fd7ce9'
INTENTIONAL.update(STAGE17_PREVIOUS)


def reverse_stage17_source(path, text):
    """Undo only the exact reviewed NPC-prop/seated-fit and entry hunks."""
    raw = (ROOT / 'references/source/stage17-source-integration.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == STAGE17_MANIFEST_SHA256, 'Changed Stage17 source inverse manifest'
    spec = json.loads(raw)
    assert spec['format'] == 1 and spec['previousProjectCommit'] == 'c75b5ca6dca299ea77bfb52eb6754bb00f1d41ea'
    assert set(spec['files']) == set(STAGE17_PREVIOUS), 'Unexpected Stage17 protected paths'
    edits = spec['files'][path]
    assert edits['previousSha256'] == STAGE17_PREVIOUS[path]
    assert hashlib.sha256(text.encode()).hexdigest() == edits['currentSha256'], 'Unreviewed Stage17 source bytes: ' + path
    for edit in reversed(edits['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == STAGE17_PREVIOUS[path], 'Unexpected source edits beyond reviewed Stage17 integration: ' + path
    return text



STAGE16_PREVIOUS = {
    "autumn-v19.html": "84cbd3fd22a209a3ae4831e0ab906f94e905d0b54e1fe5de29c4f761c3b428df",
    "index.html": "84cbd3fd22a209a3ae4831e0ab906f94e905d0b54e1fe5de29c4f761c3b428df",
    "js/brawler-art.js": "042627f4a89564bce96c26a7a8499ce06d1e691c6ca168e8c7dfa37950b930ee",
    "js/brawler.js": "83f40b2a50fa24c3534adc9b90cb1ba3ee4076133a523a3d93d2fc96c05f3294",
    "js/game.js": "4c7bf2e905cc0ca45d9c5bc9b1d5bedbb3b069b3fe82b04eb856c83d693761fc",
    "js/hero-rig.js": "91a818f5af58263951f686f6554b7b8927d65d1360b6e34a7909ca9b34f9ec4f",
    "js/illustrated-kids.js": "ae3a7dd4d5409ae8562f427bc655c494f8a46ef2c1862ea2bb640449a0f03444",
    "js/illustrated-neighbourhood.js": "71417eda5219cc410288dee15034cea96ca82d0c107e9f1cfd458dfe664609b0",
    "js/illustrated-visits.js": "1fd3a8f60a019b1529db6859d16be51ca8b35c2bb82ada9c4ef1dedab58c9003",
    "js/npc-motion.js": "290e13eae670e41784a0dc93b6f15dc88330a40e30a5c6e91c92f62f1cb5af07",
    "js/street-life.js": "8547a6829602b9c2070add14e2d89083299fa3c6e01d15885fe5f6b07d46f994"
}
STAGE16_MANIFEST_SHA256 = '7c8f291d196d5239d31a5bece59b71732279cc5b88aac88a7e3903fc9f60befd'
INTENTIONAL.update(STAGE16_PREVIOUS)


def reverse_stage16_source(path, text):
    """Undo only exact reviewed Stage16 source/entry hunks back to Stage15."""
    raw = (ROOT / 'references/source/stage16-source-integration.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == STAGE16_MANIFEST_SHA256, 'Changed Stage16 source inverse manifest'
    spec = json.loads(raw)
    assert spec['format'] == 1 and spec['previousProjectCommit'] == 'ffec905bf71296b63f2d38fab74a3ac20e2c3875'
    assert set(spec['files']) == set(STAGE16_PREVIOUS), 'Unexpected Stage16 protected paths'
    edits = spec['files'][path]
    assert edits['previousSha256'] == STAGE16_PREVIOUS[path]
    assert hashlib.sha256(text.encode()).hexdigest() == edits['currentSha256'], 'Unreviewed Stage16 source bytes: ' + path
    for edit in reversed(edits['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == STAGE16_PREVIOUS[path], 'Unexpected source edits beyond reviewed Stage16 integration: ' + path
    return text


STAGE14_PREVIOUS = {
    'js/hero-rig.js': 'f6412df50749c6bff95b259910421b1fb6f76c6d81a9743d424d90b9f1641dad',
    'js/npc-motion.js': 'ddc5a88e1cd653243bdd98c44fc5bf2bd97f70ada2f81c8bf7cce88d5174d766',
}


def reverse_stage14_source(path, text):
    """Restore exact Stage13 source through pinned optional preparation hunks."""
    raw = (ROOT / 'references/source/stage14-source-integration.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest() == 'b694c394902b071abbc523650fec5a76547f0bcee0e4f5b9c67e6e788d35dadf', 'Changed Stage14 source inverse manifest'
    spec = json.loads(raw)
    assert spec['previousProjectCommit'] == '46c670135347dcd6cc1bc60f8cba069a4aa2df6b'
    assert set(spec['files']) == set(STAGE14_PREVIOUS), 'Unexpected Stage14 protected paths'
    edits = spec['files'][path]
    assert edits['previousSha256'] == STAGE14_PREVIOUS[path]
    for edit in reversed(edits['changes']):
        text = replace_reviewed(text, edit['current'], edit['previous'])
    assert hashlib.sha256(text.encode()).hexdigest() == STAGE14_PREVIOUS[path], 'Unexpected source edits beyond reviewed Stage14 integration: ' + path
    return text


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
    if path in STAGE22_PREVIOUS:
        text = reverse_stage22_source(path, text)
    if path in STAGE21_PREVIOUS:
        text = reverse_stage21_source(path, text)
    if path in STAGE20_PREVIOUS:
        text = reverse_stage20_source(path, text)
    if path in STAGE19_PREVIOUS:
        text = reverse_stage19_source(path, text)
    if path in STAGE18_PREVIOUS:
        text = reverse_stage18_source(path, text)
    if path in STAGE17_PREVIOUS:
        text = reverse_stage17_source(path, text)
    if path in STAGE16_PREVIOUS:
        text = reverse_stage16_source(path, text)
    if path in STAGE14_PREVIOUS:
        text = reverse_stage14_source(path, text)
    if path.endswith('.html'):
        text = replace_reviewed(text, '<script src="js/centrum-camera.js?edition=centrum-stage15"></script>\n')
        for resource, previous in [('js/centrum-square.js',14),('js/centrum-inventory.js',11),('js/game.js',14)]:
            text = replace_reviewed(text, f'{resource}?edition=centrum-stage15', f'{resource}?edition=centrum-stage{previous}')
    if path.endswith('.html'):
        for resource, previous in [
            ('js/hero-rig.js', 'centrum-stage13'),
            ('js/centrum-directional-rig.js', 'centrum-stage13'),
            ('js/centrum-square.js', 'centrum-stage13'),
            ('js/npc-motion.js', 'autumn-v19'),
            ('js/centrum-civilians.js', 'centrum-stage5'),
            ('js/centrum-story.js', 'centrum-stage9'),
            ('js/centrum-link.js', 'centrum-stage4'),
            ('js/game.js', 'centrum-stage13'),
        ]:
            text = replace_reviewed(text, f'{resource}?edition=centrum-stage14', f'{resource}?edition={previous}')
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
        text = replace_reviewed(text, "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE15';", "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE14';")
        text = replace_reviewed(text, "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE14';", "window.BEARLY_BUILD_ID='BQ_CENTRUM_STAGE13';")
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
assert manifest['edition'] == 'BQ_CENTRUM_STAGE22'
assert manifest['project'] == 'BQ-Centrum' and manifest['entry'] == 'autumn-v19.html'
assert manifest['source']['repository'] == 'KossaMu248/BQ-Autumn'
assert manifest['source']['branch'] == 'main' and manifest['source']['build_id'] == 'AUTUMN_RIDE_ART_V19'
print(f'PASS: {len(HASHES)} pinned original files verified; all source assets/CSS and original protected code match;')
print('only reviewed identity/save, scene hooks, parking/economy bridge, pickup destination, action/state-restore, optional Centrum walking/worker/preparation, Stage16 camera/NPC/rest, Stage17 NPC-prop fit, Stage18 bench/peaceful-seat/opaque-eye, Stage19 compact/sparse bench, Stage20 walking-pace and Stage21 camera/render-frustum and Stage22 connected walking-surface additions differ.')
