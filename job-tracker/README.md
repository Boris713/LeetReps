# Job Application Tracker

A tiny, dependency-free toolkit to run your new-grad dev search (98 firms seeded).

## Files
- `applications.csv` — your data: 98 firms with category, priority, target role, expected TC, status.
- `tracker.py` — manage the pipeline (list / filter / update status / funnel stats).
- `board_check.py` — pull live postings from public Greenhouse / Lever / Ashby APIs.
- `build_data.py` — regenerates `applications.csv` from scratch (edit the firm lists here to add/remove).

No installs needed — pure Python 3 stdlib.

## Priorities
- **P1** — best fit + pay; push hardest (HFT/prop dev, top labs, Cursor/Databricks).
- **P2** — strong, apply (systematic HFs, infra startups).
- **P3** — safety net / optionality.
- **P4** — lottery (RenTec, Bridgewater).

## Daily workflow
```bash
python3 tracker.py next                  # what to apply to next (P1/P2 not started)
python3 tracker.py update "Jane Street" applied --referral yes
python3 tracker.py update "OpenAI" onsite
python3 tracker.py stats                  # see your funnel
python3 tracker.py list --status onsite   # who you're interviewing with
```

Statuses: `not_started -> applied -> oa -> phone -> onsite -> offer`
(terminal: `rejected`, `ghosted`, `withdrawn`, `accepted`)

## Finding live postings (run on your own machine)
1. Fill the `ats` and `board_token` columns in `applications.csv` for firms that use a public ATS:
   - `job-boards.greenhouse.io/<token>` -> ats=`greenhouse`
   - `jobs.lever.co/<token>` -> ats=`lever`
   - `jobs.ashbyhq.com/<token>` -> ats=`ashby`
   (Many quant shops self-host with no public API — leave blank, check those manually.)
2. Then:
```bash
python3 board_check.py --from-csv --save     # checks all filled firms, writes found_roles.csv
python3 board_check.py greenhouse stripe     # ad-hoc single firm
```
It filters titles to SWE / new-grad and drops trader/researcher/intern roles. Tune `KEYWORDS`/`NEG` at the top of the file.

## Notes
- TC figures are year-1 estimates from levels.fyi / public reporting; verify before signing.
- Re-run `python3 build_data.py` only if you want to reset the firm list (it overwrites status too).
