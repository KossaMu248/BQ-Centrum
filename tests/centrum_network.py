"""Stage 3: actual keyboard traversal of the compact Centrum scene network.

No player teleport or scene-state writes are used. A grid planner reads the public
scene geometry solely to choose keyboard waypoints. Existing debug helpers set a
non-full health/quest sentinel before traversal; source saves are never touched.
"""
import functools
import hashlib
import heapq
import json
import math
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage3'
OUT.mkdir(parents=True, exist_ok=True)


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def audit(page):
    return page.evaluate('BearlyCentrumSquare.audit()')


def current(page):
    state = audit(page)
    return {'sceneId': state['sceneId'], 'x': state['x'], 'y': state['y'],
            'face': state['face'], 'height': state['height'],
            'camera': state['camera'], 'save': state['save']}


def hold(page, key, milliseconds):
    page.keyboard.down(key)
    page.wait_for_timeout(milliseconds)
    page.keyboard.up(key)
    page.wait_for_timeout(180)


def scene(page):
    state = audit(page)
    data = state['world']
    if state['save'].get('gateOpened'):
        data['solids'] = [solid for solid in data['solids'] if not solid.get('gateClosedOnly')]
    return data


def blocked(data, x, y):
    f = data['floor']
    if x - 30 < f['left'] or x + 30 > f['right'] or y - 20 < f['top'] or y + 20 > f['bottom']:
        return True
    return any(s.get('collidable') is not False and x + 30 > s['x'] and x - 30 < s['x'] + s['w'] and
               y + 20 > s['y'] and y - 20 < s['y'] + s['h'] for s in data['solids'])


def route(data, start, target):
    """Four-way A* with actor-sized clearance; output cardinal waypoints."""
    step = 20
    f = data['floor']
    origin = (f['left'] + 31, f['top'] + 21)
    cols = math.floor((f['right'] - 31 - origin[0]) / step) + 1
    rows = math.floor((f['bottom'] - 21 - origin[1]) / step) + 1
    point = lambda node: (origin[0] + node[0] * step, origin[1] + node[1] * step)
    allowed = [(a, b) for a in range(cols) for b in range(rows) if not blocked(data, *point((a, b)))]
    assert allowed, data['id']
    first = min(allowed, key=lambda node: math.dist(point(node), start))
    last = min(allowed, key=lambda node: math.dist(point(node), target))
    queue = [(0, first)]
    cost = {first: 0}
    came = {}
    while queue:
        _, node = heapq.heappop(queue)
        if node == last:
            break
        for nxt in [(node[0] - 1, node[1]), (node[0] + 1, node[1]),
                    (node[0], node[1] - 1), (node[0], node[1] + 1)]:
            if not (0 <= nxt[0] < cols and 0 <= nxt[1] < rows) or blocked(data, *point(nxt)):
                continue
            value = cost[node] + 1
            if value < cost.get(nxt, math.inf):
                came[nxt] = node
                cost[nxt] = value
                heuristic = abs(nxt[0] - last[0]) + abs(nxt[1] - last[1])
                heapq.heappush(queue, (value + heuristic, nxt))
    assert last == first or last in came, ('No walking route', data['id'], start, target)
    nodes = [last]
    while nodes[-1] != first:
        nodes.append(came[nodes[-1]])
    nodes.reverse()
    # Compress straight segments. Keep every turn clear of solid rectangles.
    simplified = [nodes[0]]
    direction = None
    for index in range(1, len(nodes)):
        nxt = (nodes[index][0] - nodes[index - 1][0], nodes[index][1] - nodes[index - 1][1])
        if direction is not None and nxt != direction:
            simplified.append(nodes[index - 1])
        direction = nxt
    if nodes[-1] != simplified[-1]:
        simplified.append(nodes[-1])
    return [point(node) for node in simplified]


def move_axis(page, axis, target, tolerance=7):
    for _ in range(14):
        value = audit(page)[axis]
        delta = target - value
        if abs(delta) <= tolerance:
            return
        key = ('ArrowRight' if delta > 0 else 'ArrowLeft') if axis == 'x' else ('ArrowDown' if delta > 0 else 'ArrowUp')
        hold(page, key, min(2400, max(60, abs(delta) / 155 * 1000 - 80)))
    raise AssertionError(('Keyboard waypoint blocked', axis, target, current(page)))


def walk_to(page, target):
    data = scene(page)
    state = audit(page)
    for x, y in route(data, (state['x'], state['y']), (target['x'], target['y'])):
        move_axis(page, 'x', x)
        move_axis(page, 'y', y)
    assert math.dist((audit(page)['x'], audit(page)['y']), (target['x'], target['y'])) < 35, (target, current(page))


def exit_to(page, destination, source_id=None):
    exits = scene(page)['exits']
    matches = [e for e in exits if (e.get('toScene') or e.get('destinationSceneId')) == destination]
    if source_id:
        matches = [e for e in matches if e['id'] == source_id]
    assert len(matches) == 1, (destination, exits)
    return matches[0]


def wait_scene(page, scene_id):
    page.wait_for_function("id => BearlyCentrumSquare.audit().sceneId===id&&!BearlyCentrumSquare.audit().loading&&!BearlyCentrumSquare.audit().transition", arg=scene_id, timeout=60000)
    page.wait_for_timeout(250)


def use_exit(page, target, expected):
    walk_to(page, target)
    page.keyboard.down('e')
    wait_scene(page, expected)
    # A held key across a loading/arrival transition must not bounce back.
    page.keyboard.down('e')
    page.wait_for_timeout(850)
    page.keyboard.up('e')
    assert audit(page)['sceneId'] == expected, ('Immediate exit/re-entry loop', current(page))
    destination = scene(page)
    entrance_id = target.get('toEntrance') or target.get('destinationEntranceId')
    anchors = destination.get('anchors') or destination.get('entrances')
    entrance = anchors[entrance_id]
    arrived = audit(page)
    assert math.dist((arrived['x'], arrived['y']), (entrance['x'], entrance['y'])) < 3, (entrance_id, arrived['x'], arrived['y'], entrance)
    assert arrived['face'] == entrance['face'] and arrived['face'] in [-1, 1]
    return current(page)


def open_network(page, base):
    page.goto(base + '/index.html', wait_until='domcontentloaded')
    page.locator('#introStart').click(timeout=30000)
    page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'", timeout=30000)
    page.keyboard.press('F3')
    page.locator('#centrumSquareBtn').click()
    page.wait_for_function('BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading', timeout=60000)
    page.wait_for_timeout(450)


def main():
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    errors, failures, requests = [], [], []
    evidence = {'result': 'running', 'environment': 'Headless system Chromium desktop 1440×1000; native keyboard movement, no teleports.',
                'setup': 'Existing debug setHealth(63) and adventure act(lunch) establish non-default continuity sentinels before scene traversal; no physics/scene overrides.',
                'limits': ['Physical devices, other browser engines and sustained performance are untested.', 'The stylised layout does not claim geographic accuracy.'], 'steps': []}
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
            context = browser.new_context(viewport={'width': 1440, 'height': 1000})
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: failures.append([response.status, response.url]) if response.status >= 400 else None)
            page.on('request', lambda request: requests.append(request.url))
            open_network(page, base)
            assert audit(page)['sceneId'] == 'metro-square'
            assert audit(page)['height'] == 200
            page.evaluate("BearlyVisits.setHealth(63);BearlyQuests.game.act('lunch')")
            health = page.evaluate('BEARLY_DEBUG().health')
            assert health == 63
            quest = page.evaluate('BearlyQuests.game.snapshot()')

            def unchanged():
                assert page.evaluate('BEARLY_DEBUG().health') == health
                assert page.evaluate('BearlyQuests.game.snapshot()') == quest
                state = audit(page)
                assert state['height'] == 200
                face = state['hero']['babyFace']
                assert face['continuousUpperBody'] and face['originalCollar'] and face['headHeight'] >= 30

            def log(step):
                unchanged()
                evidence['steps'].append({'step': step, 'state': current(page)})

            def shot(name):
                page.screenshot(path=str(OUT / name))

            # The same approach function used by interactions rejects an obstacle
            # crossing even when both endpoints and horizontal distance are valid.
            assert page.evaluate("!BearlyCentrumSquareWorld.approach('shopping-arcade',440,670,{x:640,y:670,radius:250},{gateOpened:false})")
            # Matching horizontal coordinates at a distance must not enter.
            page.keyboard.press('e')
            page.wait_for_timeout(300)
            assert audit(page)['sceneId'] == 'metro-square'
            gate = exit_to(page, 'service-courtyard')
            walk_to(page, gate)
            page.keyboard.press('e')
            page.wait_for_timeout(300)
            assert audit(page)['sceneId'] == 'metro-square' and not audit(page)['save']['gateOpened']
            shot('01-metro-square-locked-gate.png')
            log('Square-side gate is physically visible and initially locked; distant E does not enter')

            arrived = use_exit(page, exit_to(page, 'shopping-arcade'), 'shopping-arcade')
            shot('02-shopping-arcade.png')
            log('Square to Shopping Arcade uses named entrance and valid arrival facing without bounce')
            use_exit(page, exit_to(page, 'service-courtyard'), 'service-courtyard')
            shot('03-service-courtyard.png')
            log('Visible arcade side passage enters Service Courtyard')
            gate = exit_to(page, 'metro-square')
            walk_to(page, gate)
            page.keyboard.press('e')
            page.wait_for_timeout(350)
            # Courtyard interaction may unlock and cross, or unlock before a second E.
            if audit(page)['sceneId'] == 'service-courtyard':
                assert audit(page)['save']['gateOpened']
                page.wait_for_timeout(650)
                page.keyboard.press('e')
            wait_scene(page, 'metro-square')
            assert audit(page)['save']['gateOpened']
            shot('04-metro-square-gate-open.png')
            log('Courtyard side opens gate and completes square → arcade → courtyard → square')
            use_exit(page, exit_to(page, 'service-courtyard'), 'service-courtyard')
            log('Opened gate now works from Metro Square toward courtyard')
            use_exit(page, exit_to(page, 'shopping-arcade'), 'shopping-arcade')

            use_exit(page, exit_to(page, 'food-shop'), 'food-shop')
            shot('05-billys-food-shop.png')
            log('Food shop is a real walkable room with named doorway arrival')
            counter = next(i for i in scene(page)['interactions'] if 'billy' in (i.get('kind', '') + i.get('id', '') + i.get('label', '')).lower())
            walk_to(page, counter)
            quantity = audit(page)['save']['inventory']['billys']
            page.keyboard.press('e')
            page.wait_for_timeout(300)
            assert audit(page)['save']['inventory']['billys'] == quantity + 1
            shot('06-billys-counter.png')
            log('Approach Billy’s counter on foot and buy a prototype pack without restoring health')
            use_exit(page, exit_to(page, 'shopping-arcade'), 'shopping-arcade')
            use_exit(page, exit_to(page, 'bicycle-workshop'), 'bicycle-workshop')
            shot('07-bicycle-workshop.png')
            log('Bicycle Workshop is a separate walkable room')
            use_exit(page, exit_to(page, 'shopping-arcade'), 'shopping-arcade')
            assert audit(page)['save']['inventory']['billys'] == quantity + 1
            log('Both shops leave through matching arcade entrances; inventory and health survive all transitions')

            page.keyboard.press('m')
            page.locator('.square-map').wait_for(state='visible')
            shot('08-discovered-area-map.png')
            assert page.locator('.square-map').locator('button').count() <= 1, 'Map must have no fast travel buttons'
            page.keyboard.press('m')
            discovered = audit(page)['save']['discovered']
            assert set(discovered) == {'metro-square', 'shopping-arcade', 'service-courtyard', 'food-shop', 'bicycle-workshop'}
            log('Discovered-area map explains all five connections without fast travel')
            saved_before_reload = audit(page)['save']
            page.reload(wait_until='domcontentloaded')
            page.keyboard.press('F3')
            page.locator('#centrumSquareBtn').click()
            page.wait_for_function('BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading', timeout=60000)
            page.wait_for_timeout(400)
            after_reload = audit(page)
            assert after_reload['save']['gateOpened']
            assert set(after_reload['save']['discovered']) == set(discovered)
            assert after_reload['save']['inventory']['billys'] == quantity + 1
            assert after_reload['sceneId'] == saved_before_reload['position']['sceneId']
            shot('09-reload-network-state.png')
            evidence['steps'].append({'step': 'Reload retains opened gate, all discoveries, Billy’s pack and compatible safe position', 'state': current(page)})
            assert not errors, errors
            assert not failures, failures
            assert all(url.startswith(base + '/') or url.startswith(('blob:', 'data:')) for url in requests), requests
            evidence.update({'result': 'passed', 'pageErrors': errors, 'httpFailures': failures, 'requestCount': len(requests),
                             'screenshots': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in OUT.glob('*.png')}})
            browser.close()
    except Exception as error:
        evidence.update({'result': 'failed', 'failure': repr(error), 'pageErrors': errors, 'httpFailures': failures})
        raise
    finally:
        (OUT / 'evidence.json').write_text(json.dumps(evidence, indent=2) + '\n')
        server.shutdown()
        server.server_close()
    print('PASS: complete network/gate/shop loop, named arrivals, no bounce, proximity, continuity, discoveries and reload; actual scene screenshots saved.')


def invalid_save_only():
    """An isolated storage fixture proves the browser's safe entry fallback."""
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    evidence = {'result': 'running', 'environment': 'Headless system Chromium desktop 1440×1000.',
                'fixture': 'An incompatible layout version and impossible saved position are written only to this disposable context’s project-owned save key; gate/discoveries/Billy’s are valid.'}
    errors, failures = [], []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
            page = browser.new_page(viewport={'width': 1440, 'height': 1000})
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: failures.append([response.status, response.url]) if response.status >= 400 else None)
            page.goto(base + '/index.html', wait_until='domcontentloaded')
            page.evaluate("""localStorage.setItem('bq-centrum:scene-network:v1', JSON.stringify({schemaVersion:1,layoutVersion:999,gateOpened:true,discovered:['metro-square','shopping-arcade','service-courtyard','food-shop','bicycle-workshop'],inventory:{billys:3},position:{sceneId:'shopping-arcade',entranceId:'from-square',x:999999,y:-500,face:0}}))""")
            page.reload(wait_until='domcontentloaded')
            page.keyboard.press('F3')
            page.locator('#centrumSquareBtn').click()
            page.wait_for_function('BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading', timeout=60000)
            page.wait_for_timeout(400)
            state = audit(page)
            start = state['world']['anchors']['start']
            assert state['sceneId'] == 'metro-square'
            assert math.dist((state['x'], state['y']), (start['x'], start['y'])) < .1
            assert state['face'] == start['face'] == 1
            assert state['save']['gateOpened'] and state['save']['inventory']['billys'] == 3
            assert len(state['save']['discovered']) == 5
            assert state['save']['layoutVersion'] == 3
            page.screenshot(path=str(OUT / '10-invalid-save-safe-entry.png'))
            safe_state = current(page)
            # Focused final-art check for the food door's source-measured X.
            use_exit(page, exit_to(page, 'shopping-arcade'), 'shopping-arcade')
            food_door = exit_to(page, 'food-shop')
            assert food_door['x'] == 235
            walk_to(page, food_door)
            page.screenshot(path=str(OUT / '11-aligned-food-door.png'))
            use_exit(page, food_door, 'food-shop')
            page.screenshot(path=str(OUT / '12-aligned-food-room.png'))
            use_exit(page, exit_to(page, 'shopping-arcade'), 'shopping-arcade')
            assert audit(page)['entranceId'] == 'from-food-shop'
            assert abs(audit(page)['x'] - 235) < .1
            assert audit(page)['save']['inventory']['billys'] == 3
            assert not errors and not failures, (errors, failures)
            evidence.update({'result': 'passed', 'safeEntry': safe_state, 'finalFoodDoor': food_door, 'foodRoundTripArrival': current(page), 'pageErrors': errors, 'httpFailures': failures})
            browser.close()
    except Exception as error:
        evidence.update({'result': 'failed', 'failure': repr(error), 'pageErrors': errors, 'httpFailures': failures})
        raise
    finally:
        (OUT / 'fallback-evidence.json').write_text(json.dumps(evidence, indent=2) + '\n')
        server.shutdown()
        server.server_close()
    print('PASS: incompatible/unsafe saved position falls back to named Metro Square start; valid gate/discoveries/inventory remain.')


if __name__ == '__main__':
    if '--invalid-save-only' in sys.argv:
        invalid_save_only()
    else:
        main()
