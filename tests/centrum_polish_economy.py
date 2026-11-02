"""Stage 7 regression of the established consumable UI and live action paths.

The stage 6 test implementation and its evidence remain unchanged. This wrapper
uses its two focused scenarios against the polished runtime and stores fresh
captures/results only under verification/stage7/economy-regression. Quest
completion and starting supplies are disclosed production-factory fixtures;
counter choices, eating, interruptions, scene exits and reload use actual input.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sys

import centrum_economy_browser as economy

OUT = Path(__file__).resolve().parents[1] / 'verification/stage7/economy-regression'
original_context = economy.make_context


def make_context(*args, **kwargs):
    context, page = original_context(*args, **kwargs)
    assert page.evaluate('window.BEARLY_BUILD_ID') == 'BQ_CENTRUM_STAGE7'
    assert page.evaluate('!!window.BearlyCentrumAtmosphere&&typeof BearlyCentrumStory.babyReacting==="function"')
    return context, page


def final_door_check():
    """Fresh final-runtime context: E exits at the physical food-shop door."""
    server = economy.ThreadingHTTPServer(('127.0.0.1', 0), economy.functools.partial(economy.Quiet, directory=str(economy.ROOT)))
    economy.Thread(target=server.serve_forever, daemon=True).start()
    result = {'stage': 7, 'scenario': 'final-door', 'preparedFixtures': True, 'checks': [], 'errors': [], 'httpFailures': []}
    try:
        with economy.sync_playwright() as p:
            browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
            def watch(page):
                page.on('pageerror', lambda e: result['errors'].append(str(e)))
                page.on('response', lambda r: result['httpFailures'].append({'status': r.status, 'url': r.url}) if r.status >= 400 else None)
            base = f'http://127.0.0.1:{server.server_port}'
            setup_context, setup = make_context(browser, base, watch=watch)
            setup.evaluate('BEARLY_DEBUG_MENU.warp(7550);BearlyVisits.setHealth(60)')
            setup.wait_for_timeout(300)
            setup.keyboard.press('e')
            economy.wait_exploration(setup)
            template = setup.evaluate('BearlyCentrumLink.audit().parking')
            prepared = economy.fixture(setup, template, food=2, hp=60, reported=False)
            context, page = make_context(browser, base, prepared, watch=watch)
            economy.start_eat(page)
            page.keyboard.press('e')
            page.wait_for_function("BearlyCentrumSquare.audit().sceneId==='shopping-arcade'&&!BearlyCentrumSquare.audit().transition", timeout=60000)
            economy.finish_eat(page)
            arrival = page.evaluate("({position:BearlyCentrumSquare.position(),expected:BearlyCentrumScenes.get('shopping-arcade').anchors['from-food-shop'],door:BearlyCentrumScenes.get('shopping-arcade').exits.find(e=>e.id==='food-door')})")
            assert arrival['position']['entranceId'] == 'from-food-shop'
            assert abs(arrival['position']['x']-arrival['expected']['x']) < 1
            assert abs(arrival['position']['y']-arrival['expected']['y']) < 1
            assert arrival['door']['x'] == arrival['expected']['x'] == 235, arrival
            assert economy.health(page) == 60 and economy.ledger(page)['inventory']['billys'] == 2
            result['checks'].append({'name': 'final physical food door keeps the named arcade arrival and cancels eating atomically', 'arrival': arrival, 'health': 60, 'food': 2})
            context.close();setup_context.close();browser.close()
        assert not result['errors'] and not result['httpFailures'], result
        result['passed'] = True
    except Exception as exc:
        result['passed'] = False;result['failure'] = repr(exc)
        raise
    finally:
        server.shutdown();OUT.mkdir(parents=True, exist_ok=True)
        (OUT / 'results-final-door.json').write_text(json.dumps(result, indent=2) + '\n')
    return result


def counter_reaction_check():
    """Actual final-runtime counter choices preserve the native point renderer."""
    server = economy.ThreadingHTTPServer(('127.0.0.1', 0), economy.functools.partial(economy.Quiet, directory=str(economy.ROOT)))
    economy.Thread(target=server.serve_forever, daemon=True).start()
    result = {'stage': 7, 'scenario': 'counter-reactions', 'preparedFixtures': True, 'checks': [], 'errors': [], 'httpFailures': []}
    try:
        with economy.sync_playwright() as p:
            browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
            def watch(page):
                page.on('pageerror', lambda e: result['errors'].append(str(e)))
                page.on('response', lambda r: result['httpFailures'].append({'status': r.status, 'url': r.url}) if r.status >= 400 else None)
            base = f'http://127.0.0.1:{server.server_port}'
            setup_context, setup = make_context(browser, base, watch=watch)
            setup.evaluate('BEARLY_DEBUG_MENU.warp(7550);BearlyVisits.setHealth(60)')
            setup.wait_for_timeout(300);setup.keyboard.press('e');economy.wait_exploration(setup)
            template = setup.evaluate('BearlyCentrumLink.audit().parking')
            prepared = economy.fixture(setup, template, food=0, hp=60, reported=False)
            prepared['raw'] = setup.evaluate("""raw=>{
              const key='bq-centrum:scene-network:v1',values=new Map([[key,raw]]),memory={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))};
              const broker=BearlyCentrumSave.createAdventure(memory);
              broker.storage.setItem('bq-centrum:quest:wrong-entrance:v1',JSON.stringify({schemaVersion:1,questId:'wrong-entrance',state:'delivery_confirmed',cageInspected:true,slipPresented:true,cargoMoved:true,entitlement:null,rewardReceipt:null}));
              return values.get(key);
            }""", prepared['raw'])
            context, page = make_context(browser, base, prepared, watch=watch)
            for action, kind in [('report', 'quest-reported'), ('claim_reward', 'billys-reward'), ('buy_billys', 'billys-purchase')]:
                economy.counter_action(page, action)
                audit = page.evaluate("({story:BearlyCentrumStory.audit().reaction,reacting:BearlyCentrumStory.babyReacting(),hero:BearlyHeroRig.audit(),height:BearlyCentrumSquare.audit().height,health:BEARLY_DEBUG().health,food:BearlyCentrumSave.adventure.snapshot().inventory.billys,wallet:BearlyCentrumSave.adventure.snapshot().wallet.kr})")
                assert audit['story']['kind'] == kind and 0 < audit['story']['remaining'] <= 1.05, audit
                assert audit['reacting'] and audit['height'] == 200 and audit['health'] == 60, audit
                baby = audit['hero']['babyFace']
                assert baby['mood'] == 'point' and baby['continuousUpperBody'] and baby['originalCollar'] and not baby['headOnly'], baby
                assert abs(baby['headHeight']-39.97581295350712) < .001 and abs(baby['uniformScale']-.5710830421929589) < .000001, baby
                result['checks'].append({'name': kind+' uses one short native point reaction without changing health or baby scale', 'reaction': audit['story'], 'food': audit['food'], 'wallet': audit['wallet'], 'health': audit['health'], 'baby': {k:baby[k] for k in ['mood','source','continuousUpperBody','originalCollar','headOnly','headHeight','uniformScale']}})
            assert audit['food'] == 2 and audit['wallet'] == 20, audit
            page.wait_for_timeout(1250)
            assert not page.evaluate('BearlyCentrumStory.babyReacting()')
            context.close();setup_context.close();browser.close()
        assert not result['errors'] and not result['httpFailures'], result
        result['passed'] = True
    except Exception as exc:
        result['passed'] = False;result['failure'] = repr(exc)
        raise
    finally:
        server.shutdown();OUT.mkdir(parents=True, exist_ok=True)
        (OUT / 'results-counter-reactions.json').write_text(json.dumps(result, indent=2) + '\n')
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--scenario', choices=['all', 'economy', 'interruptions', 'final-door', 'counter-reactions'], default='all')
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    economy.OUT = OUT
    economy.make_context = make_context
    selected = ['economy', 'interruptions', 'final-door', 'counter-reactions'] if args.scenario == 'all' else [args.scenario]
    parts = []
    failure = None
    old_argv = sys.argv[:]
    try:
        for name in selected:
            if name == 'final-door':
                part = final_door_check()
            elif name == 'counter-reactions':
                part = counter_reaction_check()
            else:
                sys.argv = [old_argv[0], '--scenario', name]
                economy.main()
                path = OUT / ('results-' + name + '.json')
                part = json.loads(path.read_text())
            path = OUT / ('results-' + name + '.json')
            part['stage'] = 7
            part['build'] = 'BQ_CENTRUM_STAGE7'
            part['regressionSource'] = 'Established stage 6 production-input scenario; starting supplies and reported task are prepared through the production ledger factory.'
            path.write_text(json.dumps(part, indent=2) + '\n')
            parts.append(part)
    except Exception as exc:
        failure = repr(exc)
        raise
    finally:
        sys.argv = old_argv
        if parts:
            combined = {'stage': 7, 'build': 'BQ_CENTRUM_STAGE7', 'passed': failure is None and len(parts) == len(selected) and all(p['passed'] for p in parts),
                'failure': failure, 'completedScenarios': [p['scenario'] for p in parts], 'scenarios': selected, 'preparedFixtures': True,
                'checks': [c for p in parts for c in p['checks']],
                'errors': [e for p in parts for e in p['errors']],
                'httpFailures': [e for p in parts for e in p['httpFailures']],
                'limits': ['Desktop Chromium only. Phone-landscape polish is verified separately.',
                    'Quest completion and starting economy are explicitly prepared states; this regression exercises actual counter/input/action paths.']}
            if parts[0].get('recording'):
                combined['recording'] = parts[0]['recording']
            (OUT / 'results.json').write_text(json.dumps(combined, indent=2) + '\n')
        shots = sorted(OUT.glob('*.png'))
        (OUT / 'frames.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in shots))
    (OUT / 'README.md').write_text('''# Stage 7 consumable regression

The established economy and interruption scenarios were replayed in actual desktop Chromium against the polished Stage 7 scenes and compact dialogue. Fresh final-runtime checks also verify the physical food-shop door’s named arrival and the baby’s native point reaction after actual report, reward and purchase choices. Stage 6 evidence was not overwritten. Starting supplies and pre-report/reported quest completion are explicit production-ledger fixtures; counter transactions, eating, scene exits, movement and reload use actual gameplay controls.

[Structured results](results.json). [Economy gameplay recording at 2× speed](consumable-loop.webm). [Capture hashes](frames.sha256).

Run `python3 tests/centrum_polish_economy.py` from BQ-Centrum. These prepared-state consumable captures document transactions rather than final environment placement; the fresh final-door check uses the final authored position (235,440). Phone-landscape visual/input evidence is recorded separately for this stage; physical devices remain untested.
''')
    print(json.dumps({'stage': 7, 'passed': all(p['passed'] for p in parts), 'checks': sum(len(p['checks']) for p in parts)}))


if __name__ == '__main__':
    main()
