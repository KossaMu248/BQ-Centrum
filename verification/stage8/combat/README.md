# Production combat, eating refusal and defeat/retry

**Five checks passed**, zero JavaScript or HTTP failures, in system Chromium `/usr/bin/chromium`, headless desktop 1280×720. This is a secondary edge-case fixture, separate from the complete native ride.

The production save factory prepares **20 HP, one pizza and 0 kr** at the normal road start. The existing source practice entry supplies three nonessential NPCs. After setup, actual **J / repeated J** provokes aggression; only production enemy attacks cause damage and defeat. No health setter, hit helper or forced-death call creates the final defeat.

Observed health sequence: **20 → 12 → 4 → 0**, at combat times 9.015, 9.915, 11.054 and 12.121 seconds. The first successful maul damages an NPC and provokes two witnesses; the repeated input respects attack cooldown. While combat is active, **Eat** remains disabled and repeated actual pointer clicks grant neither healing nor food loss. After defeat and the former 2.2-second recovery delay, health stays 0 and food remains 1.

Actual **C** reloads the entire prepared checkpoint: health 20, food 1, wallet 0 and matching pickup/reward/gate/discovery state. The damaged practice encounter is gone, so health restoration cannot retain damage dealt.

- [Actual combat clip, 2× speed](real-enemy-defeat.webm): 191 captured frames, 9.5 seconds encoded. Capture wait gaps are capped at one second.
- [Combat: Eat disabled](01-combat-eat-disabled.png)
- [Production attacks cause defeat](02-production-attacks-defeat.png)
- [Defeated: food kept](03-defeated-food-kept.png)
- [Coherent retry and reset fight](04-coherent-retry-fight-reset.png)
- [Structured samples/results](results.json) · [PNG hashes](frames.sha256)

Run from BQ-Centrum: `python3 tests/centrum_combat_validation.py`. Physical devices and other browser engines were not tested by this regression. Screenshots/recording are real rendered gameplay, not generated illustrations.
