"""Centrum Square: real controls, collision/depth/camera and source baby review.

Run with Python Playwright and system Chromium. All movement uses keyboard/touch
input; no player teleports, game-state writes or generated artwork. Outputs are
actual browser captures at ordinary gameplay size. Phones are emulated only.
"""
import base64
import functools
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess
import sys
from threading import Thread
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'verification/stage2'
OUT.mkdir(parents=True, exist_ok=True)


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def audit(page):
    return page.evaluate('BearlyCentrumSquare.audit()')


def compact(state):
    return {key: state.get(key) for key in ['x', 'y', 'vx', 'vy', 'jump', 'camera',
            'height', 'face', 'paused', 'shadow', 'drawOrder', 'hero']}


def hold(page, keys, milliseconds):
    if isinstance(keys, str):
        keys = [keys]
    for key in keys:
        page.keyboard.down(key)
    page.wait_for_timeout(milliseconds)
    for key in keys:
        page.keyboard.up(key)
    page.wait_for_timeout(170)


def move_to(page, x=None, y=None, tolerance=9):
    """Axis routes keep collision tests deliberate; movement remains real input."""
    for axis, target in [('x', x), ('y', y)]:
        if target is None:
            continue
        for _ in range(12):
            state = audit(page)
            delta = target - state[axis]
            if abs(delta) <= tolerance:
                break
            key = ('ArrowRight' if delta > 0 else 'ArrowLeft') if axis == 'x' else ('ArrowDown' if delta > 0 else 'ArrowUp')
            hold(page, key, min(2400, max(60, abs(delta) / 155 * 1000 - 70)))
        else:
            raise AssertionError(('unreachable keyboard waypoint', axis, target, compact(audit(page))))


def sorted_at(page, object_id, relation):
    state = audit(page)
    order = [item['id'] for item in state['drawOrder']]
    assert object_id in order and 'player' in order, order
    assert (order.index('player') < order.index(object_id)) == (relation == 'behind'), (relation, state['y'], order)
    assert all(a['footY'] <= b['footY'] for a, b in zip(state['drawOrder'], state['drawOrder'][1:])), state['drawOrder']
    return compact(state)


def source_baby(page, mood=None):
    state = audit(page)
    hero = state['hero']
    face = hero['babyFace']
    assert hero['height'] == 200, hero
    assert hero['integratedCarrier'] and hero['carrier'] == 'front', hero
    assert face['continuousUpperBody'] and face['originalCollar'] and not face['headOnly'], face
    assert face['source'].startswith('assets/baby_pose_') or face['source'].startswith('assets/v151_baby_pose_'), face
    assert face['headHeight'] >= 30, ('baby is too small in logical gameplay pixels', face)
    if mood:
        assert face['mood'] == mood, (mood, face)
    return face


class BrowserClip:
    """Native browser screencast, encoded by available system ffmpeg."""
    def __init__(self, page):
        self.frames = []
        self.directory = OUT / '.clip-frames'
        self.directory.mkdir(exist_ok=True)
        self.session = page.context.new_cdp_session(page)
        self.session.on('Page.screencastFrame', self.frame)
        self.session.send('Page.startScreencast', {'format': 'jpeg', 'quality': 85,
                          'maxWidth': 1440, 'maxHeight': 1000, 'everyNthFrame': 2})

    def frame(self, event):
        name = self.directory / f'{len(self.frames):05d}.jpg'
        name.write_bytes(base64.b64decode(event['data']))
        self.frames.append((name, event['metadata']['timestamp']))
        self.session.send('Page.screencastFrameAck', {'sessionId': event['sessionId']})

    def finish(self):
        self.session.send('Page.stopScreencast')
        self.session.detach()
        assert len(self.frames) >= 20, ('insufficient real browser video frames', len(self.frames))
        concat = self.directory / 'frames.txt'
        lines = []
        for (name, at), (_, next_at) in zip(self.frames, self.frames[1:]):
            lines.extend([f"file '{name.resolve()}'", f'duration {max(.015, min(.5, next_at - at)):.6f}'])
        lines.append(f"file '{self.frames[-1][0].resolve()}'")
        concat.write_text('\n'.join(lines) + '\n')
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat), '-t', '15', '-r', '30', '-c:v', 'libvpx-vp9', '-crf', '35', '-b:v', '0', '-pix_fmt', 'yuv420p', str(OUT / 'walking.webm')], check=True)
        info = {'source': 'native Chromium Page.screencastFrame JPEG frames; system ffmpeg VP9 WebM', 'framesCaptured': len(self.frames), 'captureSeconds': self.frames[-1][1] - self.frames[0][1], 'file': 'walking.webm', 'maximumClipSeconds': 15, 'noGeneratedFrames': True}
        shutil.rmtree(self.directory)
        return info


def open_square(page, base):
    page.goto(base + '/index.html', wait_until='domcontentloaded')
    page.locator('#introStart').click(timeout=30000)
    page.wait_for_function("BEARLY_TOUCH_STATUS().state==='playing'", timeout=30000)
    settings = page.locator('#debugOpenBtn')
    if settings.is_visible():
        settings.click()
    else:
        page.locator('.ride-settings').click()
    entry = page.locator('#centrumSquareBtn')
    assert 'PROTOTYPE' in entry.inner_text().upper(), entry.inner_text()
    entry.click()
    page.wait_for_function('BearlyCentrumSquare.active()&&!BearlyCentrumSquare.audit().loading', timeout=60000)
    page.wait_for_timeout(650)


def expressions_only():
    """Short independent normal-size camera/character review, no state overrides."""
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    evidence = {'result': 'running', 'environment': 'Headless system Chromium desktop 1440×1000, native keyboard input; normal-size complete gameplay frames.', 'expressions': []}
    errors, failures = [], []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
            page = browser.new_page(viewport={'width': 1440, 'height': 1000})
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: failures.append([response.status, response.url]) if response.status >= 400 else None)
            open_square(page, base)
            evidence['expressions'].append({'action': 'idle after opening', 'baby': source_baby(page, 'idle')})
            page.keyboard.down('ArrowRight')
            page.wait_for_timeout(450)
            walking = source_baby(page, 'laugh')
            page.screenshot(path=str(OUT / '11-walking-laugh-normal-size.png'))
            page.keyboard.up('ArrowRight')
            page.wait_for_timeout(450)
            evidence['expressions'].append({'action': 'actual ArrowRight walking', 'baby': walking})
            page.keyboard.press('e')
            page.wait_for_timeout(100)
            pointing = source_baby(page, 'point')
            page.screenshot(path=str(OUT / '12-pointing-original-expression-normal-size.png'))
            evidence['expressions'].append({'action': 'actual E look/interaction', 'baby': pointing})
            page.keyboard.press('Space')
            page.wait_for_timeout(180)
            jumping = source_baby(page, 'terror')
            state = audit(page)
            assert state['jump'] > 15 and abs(state['shadow']['y'] - state['y']) < .1
            page.screenshot(path=str(OUT / '13-jumping-terror-normal-size.png'))
            evidence['expressions'].append({'action': 'actual Space jump', 'baby': jumping, 'shadow': state['shadow'], 'groundY': state['y'], 'jump': state['jump']})
            page.close()
            browser.close()
        assert not errors, errors
        assert not failures, failures
        evidence.update({'result': 'passed', 'pageErrors': errors, 'httpFailures': failures})
    except Exception as error:
        evidence.update({'result': 'failed', 'failure': repr(error)})
        raise
    finally:
        (OUT / 'expression-evidence.json').write_text(json.dumps(evidence, indent=2) + '\n')
        server.shutdown()
        server.server_close()
    print('PASS: idle/laugh/point/terror use original continuous source baby at 200px fixed hero scale; ordinary gameplay frames saved.', flush=True)


def main():
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    errors, failures, requests = [], [], []
    evidence = {'result': 'running', 'environment': 'Headless system Chromium; desktop 1440×1000 native time; emulated touch landscape 844×390.',
                'limits': ['Physical phones/tablets are untested.', 'No new missions/interiors/combat/economy tested or requested.', 'Directional animation is the preserved side/front source gait, not a new eight-direction rig.'],
                'steps': []}

    def log(label, value=None):
        evidence['steps'].append({'step': label, 'evidence': value})
        print(label, flush=True)

    def watch(page):
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: failures.append([response.status, response.url]) if response.status >= 400 else None)
        page.on('request', lambda request: requests.append(request.url))

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
            context = browser.new_context(viewport={'width': 1440, 'height': 1000})
            page = context.new_page()
            watch(page)
            open_square(page, base)
            ride_before = page.evaluate('BEARLY_TOUCH_STATUS()')
            source_baby(page, 'idle')
            page.screenshot(path=str(OUT / '01-square-entry-normal-size.png'))
            log('Prototype entry keeps the copied ride held; ordinary-size original baby', compact(audit(page)))

            before = audit(page)
            hold(page, ['ArrowRight', 'ArrowUp'], 800)
            after = audit(page)
            dx, dy = after['x'] - before['x'], after['y'] - before['y']
            assert dx > 50 and dy < -50 and abs(abs(dx / dy) - 1) < .08, (dx, dy)
            assert math.hypot(dx, dy) < 155 * 1.12, (dx, dy)
            log('Real diagonal input is normalized and changes both ground axes', {'dx': dx, 'dy': dy})

            # A recorded native-time walking route goes around both ends of the west bench.
            clip = BrowserClip(page)
            move_to(page, x=680)
            move_to(page, y=650)
            move_to(page, x=500)
            sorted_at(page, 'bench-west', 'front')
            page.screenshot(path=str(OUT / '02-west-bench-front.png'))
            move_to(page, x=350)
            move_to(page, y=510)
            move_to(page, x=500)
            source_baby(page)
            page.screenshot(path=str(OUT / '03-west-bench-behind.png'))
            log('Walk around west bench, with correct front/behind ordering', sorted_at(page, 'bench-west', 'behind'))
            hold(page, 'ArrowDown', 1100)
            assert audit(page)['y'] <= 544.5, audit(page)['y']
            page.keyboard.press('Space')
            page.keyboard.down('ArrowDown')
            page.wait_for_timeout(190)
            jumping = audit(page)
            source_baby(page, 'terror')
            assert jumping['jump'] > 15 and abs(jumping['shadow']['y'] - jumping['y']) < .1, jumping
            assert jumping['y'] <= 544.5
            sorted_at(page, 'bench-west', 'behind')
            page.screenshot(path=str(OUT / '04-jump-ground-depth-original-expression.png'))
            page.wait_for_timeout(800)
            page.keyboard.up('ArrowDown')
            page.wait_for_timeout(220)
            assert audit(page)['y'] <= 544.5
            log('West bench solid blocks walking/jumping; shadow and sort retain ground anchor', compact(jumping))
            evidence['clip'] = clip.finish()

            move_to(page, x=680)
            move_to(page, y=640)
            move_to(page, x=1080)
            sorted_at(page, 'bench-east', 'behind')
            hold(page, 'ArrowDown', 1000)
            assert audit(page)['y'] <= 699.5
            page.screenshot(path=str(OUT / '05-east-bench-behind.png'))
            move_to(page, x=1240)
            move_to(page, y=810)
            move_to(page, x=1080)
            log('Pass behind, collide with and walk around east bench to front', sorted_at(page, 'bench-east', 'front'))
            page.screenshot(path=str(OUT / '06-east-bench-front.png'))

            move_to(page, x=1240)
            move_to(page, y=400)
            move_to(page, x=820)
            sorted_at(page, 'planter', 'behind')
            page.screenshot(path=str(OUT / '07-planter-behind.png'))
            hold(page, 'ArrowDown', 1100)
            assert audit(page)['y'] <= 436.5
            move_to(page, x=950)
            move_to(page, y=550)
            move_to(page, x=820)
            log('Planter solid blocks feet and allows walking behind/around/in front', sorted_at(page, 'planter', 'front'))
            page.screenshot(path=str(OUT / '08-planter-front-normal-size.png'))

            # North/south and west/east crossings demonstrate a place, not road clamps.
            move_to(page, x=950)
            move_to(page, y=400)
            move_to(page, x=1220)
            hold(page, 'ArrowUp', 1100)
            assert 361.9 <= audit(page)['y'] <= 366.1
            page.keyboard.press('e')
            assert 'Door closed' in page.locator('.square-message').inner_text()
            move_to(page, y=400)
            move_to(page, x=280)
            hold(page, 'ArrowUp', 1100)
            assert 361.9 <= audit(page)['y'] <= 366.1
            page.keyboard.press('e')
            assert 'Door closed' in page.locator('.square-message').inner_text()
            move_to(page, y=400)
            move_to(page, x=765)
            hold(page, 'ArrowUp', 1100)
            assert 331.9 <= audit(page)['y'] <= 336.1
            page.keyboard.press('e')
            assert 'Door closed' in page.locator('.square-message').inner_text()
            log('All three existing fronts can be approached, with their own solid facade footprints')
            move_to(page, x=680)
            move_to(page, y=345)
            hold(page, 'ArrowUp', 900)
            assert 331.9 <= audit(page)['y'] <= 336.1, audit(page)['y']
            page.keyboard.press('e')
            assert audit(page)['active']
            log('Approach building fronts; northern facade blocks feet', compact(audit(page)))
            move_to(page, y=890)
            assert audit(page)['y'] > 875
            log('Cross square north to south', compact(audit(page)))
            hold(page, 'ArrowDown', 900)
            assert 913.9 <= audit(page)['y'] <= 918.1
            move_to(page, x=100)
            hold(page, 'ArrowLeft', 650)
            assert 81.9 <= audit(page)['x'] <= 86.1
            move_to(page, x=1385)
            assert audit(page)['x'] > 1370
            camera_east = audit(page)['camera']
            log('Cross square west to east with bounded scrolling', compact(audit(page)))
            hold(page, 'ArrowRight', 650)
            assert 1413.9 <= audit(page)['x'] <= 1418.1
            move_to(page, x=110)
            camera_west = audit(page)['camera']
            assert camera_east['x'] > camera_west['x'] + 200, (camera_west, camera_east)
            for camera in [camera_west, camera_east]:
                assert 0 <= camera['x'] <= 340.1 and 0 <= camera['y'] <= 360.1, camera
            assert audit(page)['height'] == 200
            log('Cross square east to west; all outer boundaries solid and actor scale constant', compact(audit(page)))
            page.screenshot(path=str(OUT / '09-southwest-normal-size.png'))

            page.keyboard.press('p')
            before = audit(page)
            assert before['paused']
            hold(page, ['ArrowRight', 'ArrowUp'], 500)
            after = audit(page)
            assert abs(after['x'] - before['x']) < .1 and abs(after['y'] - before['y']) < .1
            page.locator('#squarePauseBtn').click()
            assert not audit(page)['paused']
            page.locator('#squareFullscreenBtn').click()
            page.wait_for_function("BearlyFullscreen.state()!=='window'")
            assert audit(page)['active']
            page.keyboard.press('Escape')
            page.wait_for_function("BearlyFullscreen.state()==='window'")
            assert audit(page)['active'], 'First Escape leaves fullscreen while retaining square'
            log('Keyboard pause and current fullscreen controls preserve square')
            page.locator('.square-settings').click()
            before = audit(page)
            hold(page, 'ArrowRight', 450)
            assert abs(audit(page)['x'] - before['x']) < .1
            page.locator('#debugResumeBtn').click()
            page.locator('.square-exit').click()
            assert not page.evaluate('BearlyCentrumSquare.active()')
            ride_after = page.evaluate('BEARLY_TOUCH_STATUS()')
            assert abs(ride_after['x'] - ride_before['x']) < 3, (ride_before, ride_after)
            hold(page, 'ArrowUp', 1100)
            assert page.evaluate('BEARLY_TOUCH_STATUS().x') > ride_after['x'] + 30
            log('Settings holds movement; exit returns held ride with existing pedal controls')
            context.close()

            # Existing touch semantics: pointer holds; landscape emulation only.
            touch = browser.new_context(viewport={'width': 844, 'height': 390}, is_mobile=True, has_touch=True)
            page = touch.new_page()
            watch(page)
            open_square(page, base)
            session = touch.new_cdp_session(page)
            buttons = []
            for direction in ['right', 'up']:
                box = page.locator(f'.square-controls [data-square-dir="{direction}"]').bounding_box()
                assert box, direction
                buttons.append({'x': box['x'] + box['width'] / 2, 'y': box['y'] + box['height'] / 2, 'id': len(buttons)})
            before = audit(page)
            session.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': buttons})
            page.wait_for_timeout(700)
            session.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            page.wait_for_timeout(220)
            after = audit(page)
            assert after['x'] > before['x'] + 35 and after['y'] < before['y'] - 35, (before, after)
            source_baby(page)
            page.screenshot(path=str(OUT / '10-emulated-touch-landscape.png'))
            page.locator('#squarePauseBtn').tap()
            assert audit(page)['paused']
            page.locator('#squarePauseBtn').tap()
            page.locator('.square-exit').tap()
            assert not page.evaluate('BearlyCentrumSquare.active()')
            log('Emulated landscape two-finger diagonal touch, pause and return work', compact(after))
            touch.close()
            browser.close()

        assert not errors, errors
        assert not failures, failures
        assert all(url.startswith(base + '/') or url.startswith(('blob:', 'data:')) for url in requests), requests
        evidence.update({'result': 'passed', 'pageErrors': errors, 'httpFailures': failures, 'requestCount': len(requests), 'screenshots': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.glob('*.png'))}})
    except Exception as error:
        evidence.update({'result': 'failed', 'failure': repr(error), 'pageErrors': errors, 'httpFailures': failures})
        raise
    finally:
        (OUT / 'evidence.json').write_text(json.dumps(evidence, indent=2) + '\n')
        server.shutdown()
        server.server_close()
    print('PASS: square crossings/diagonals/solids/depth/shadow/source baby, bounded camera, keyboard/touch pause/fullscreen/return; real screenshots and walking clip.', flush=True)


if __name__ == '__main__':
    expressions_only() if '--expressions-only' in sys.argv else main()
