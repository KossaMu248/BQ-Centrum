# Stage 7 consumable regression

**19 checks passed**, zero JavaScript or HTTP failures: 6 economy, 9 interruption, 1 final physical-door and 3 counter-reaction checks. Scenarios were executed separately and consolidated without replaying passing checks.

Starting supplies and pre-report/reported quest states are explicit production-ledger fixtures. Counter transactions, eating, cancellation, scene exits and reload use actual gameplay input. The fresh final-runtime door check confirms the actual E exit uses the final authored arcade arrival **235, 440**, matching the physical food-shop door. The three payoff checks confirm the short native point expression retains the source continuous face/neck/collar at the unchanged head scale. No runtime files were edited by this regression.

[Structured results](results.json) · [Actual consumable recording at 2× speed](consumable-loop.webm) · [Capture hashes](frames.sha256).

The consumable captures document prepared-state transactions rather than final environment placement. Stage 6 captures/results were not overwritten. Phone-landscape visual/input evidence is separate for Stage 7; physical devices remain untested.

Run `python3 tests/centrum_polish_economy.py` from BQ-Centrum, or select `--scenario economy`, `interruptions`, `final-door` or `counter-reactions`.
