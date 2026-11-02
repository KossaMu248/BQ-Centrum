"""Replay the original complete quest acceptance route against the stage 6 ledger.

The historical stage 5 test/captures stay untouched. Counter economy actions are
deliberately excluded by this regression so reporting remains a pending reward;
the consumable acceptance suite tests redemption separately.
"""
import hashlib
import json
from pathlib import Path

import wrong_entrance as story

story.OUT = Path(__file__).resolve().parents[1] / 'verification/stage6/story-regression'
story.OUT.mkdir(parents=True, exist_ok=True)
original_wait_exploration = story.wait_exploration


def wait_exploration(page):
    original_wait_exploration(page)
    assert page.evaluate('window.BEARLY_BUILD_ID') == 'BQ_CENTRUM_STAGE6'
    assert page.evaluate("BearlyCentrumSave.adventure.snapshot().components['bq-centrum:quest:wrong-entrance:v1']?.state||null") == story.quest(page)['state']


def finish_dialogue(page, limit=20):
    texts=[]
    for _ in range(limit):
        if not story.dialogue(page).is_visible():
            return texts
        texts.append(story.dialogue_text(page))
        buttons=story.dialogue(page).locator('button:visible:not(:disabled)')
        assert buttons.count(),texts[-1]
        next_button=story.dialogue(page).locator('[data-dialogue-next]:visible:not(:disabled),.quest-next:visible:not(:disabled)')
        actions=story.dialogue(page).locator('[data-quest-action]:not([data-quest-action="buy_billys"]):not([data-quest-action="claim_reward"]):visible:not(:disabled)')
        if next_button.count():
            next_button.first.click()
        elif actions.count():
            correct=actions.filter(has_text='B-04')
            (correct.first if correct.count() else actions.first).click()
        else:
            close=story.dialogue(page).locator('[data-dialogue-close]:visible:not(:disabled)')
            (close.first if close.count() else buttons.last).click()
        page.wait_for_timeout(650)
    raise AssertionError(('dialogue did not finish',texts))


def main():
    story.wait_exploration=wait_exploration
    story.finish_dialogue=finish_dialogue
    story.main()
    path=story.OUT/'evidence.json'
    evidence=json.loads(path.read_text())
    evidence['build']='BQ_CENTRUM_STAGE6'
    evidence['saveModel']='Canonical bq-centrum:scene-network:v1 ledger with project-owned component facade; no direct quest-save writes.'
    evidence['limits']=['Physical devices, other browser engines and gamepads are untested.',
        'This regression deliberately leaves the reward pending at reported; stage6 consumable acceptance verifies counter redemption separately.']
    path.write_text(json.dumps(evidence,indent=2)+'\n')
    shots=sorted(story.OUT.glob('*.png'))
    (story.OUT/'README.md').write_text('# Stage 6 story regression\n\nThe original complete Wrong Entrance route was replayed in actual desktop Chromium gameplay against the stage 6 canonical ledger. No stage 5 captures were overwritten. Reporting deliberately leaves the reward pending for explicit counter redemption.\n\n'+
        '\n'.join(f'- [{p.name}]({p.name})' for p in shots)+'\n\n[Complete actual gameplay recording, 3× speed](wrong-entrance-loop.webm). [Structured evidence](evidence.json). Physical devices and other browser engines remain untested.\n')
    (story.OUT/'frames.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in shots))


if __name__=='__main__':
    main()
