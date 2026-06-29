# Job Search Toolkit — Handoff Doc

A personal new-grad-dev job search system: a tracked firm list, a daily automated
job-opening checker, and prep material. Built around Boris's targets (quant SWE,
AI labs, infra startups, AI hardware) for a Dec 2026 graduation.

> **Important accuracy note:** this does **not** scrape arbitrary company websites.
> It queries the *public JSON APIs* of three hiring platforms (Greenhouse, Lever,
> Ashby) on a daily schedule. That's more reliable and lower-maintenance than HTML
> scraping, but it only sees firms hosted on those platforms. Coverage + how to extend
> to real scraping are spelled out below.

---

## What's in the system

| File | Type | What it does |
|---|---|---|
| `applications.csv` | data | The 98-firm universe. One row per firm: category, priority, target dev role, expected TC, ATS info, status, referral, notes. The single source of truth. |
| `build_data.py` | script | Regenerates `applications.csv` from a hardcoded firm list. Edit here to add/remove firms, then re-run. (Overwrites status — only run to reset.) |
| `tracker.py` | CLI | Manage the pipeline: `list` / `next` / `update` / `stats`. Reads & writes the CSV. |
| `board_check.py` | script | Queries Greenhouse/Lever/Ashby APIs for live SWE/new-grad postings; filters out trader/researcher/intern roles. Run ad-hoc or over the whole CSV. |
| `notify.py` | script | Diffs current postings vs a saved snapshot; emits only *new* roles. The engine behind the daily alert. |
| `.github/workflows/check-jobs.yml` | CI | Runs `notify.py` daily on GitHub's servers; opens a GitHub Issue (→ email/phone alert) when new roles appear. |
| `README.md` | docs | Daily usage. |
| `SETUP_GITHUB.md` | docs | How to deploy the auto-notifier (push to repo, enable, get alerts, fill tokens). |
| `INTERVIEW_PREP.md` | docs | Interview patterns for quant / labs / hardware + a prep plan. |
| `newgrad-dev-applylist-2026.md` | docs | The human-readable strategy writeup behind the CSV (bands, TC, timing). |

---

## How the daily automation actually works

```
 GitHub Actions (cron: daily 13:00 UTC)
        │
        ▼
   notify.py
        │   for each firm in applications.csv that has ats + board_token filled:
        ├──► board_check.py → GET public API:
        │         greenhouse: boards-api.greenhouse.io/v1/boards/<token>/jobs
        │         lever:      api.lever.co/v0/postings/<token>
        │         ashby:      api.ashbyhq.com/posting-api/job-board/<token>
        │         → keep titles matching SWE/new-grad keywords, drop trader/researcher/intern
        │
        ├──► diff results against snapshot.json (last known roles)
        │
        ├──► write new_roles.md (only the newly-appeared roles)
        └──► commit updated snapshot.json
        │
        ▼
   if new roles found → open a GitHub Issue titled "🔔 N new role(s) opened"
        │
        ▼
   GitHub emails you / pushes to the GitHub mobile app
```

Each role alerts **once** (the snapshot remembers what it already reported). No servers,
no paid services, runs free on GitHub's scheduled runners.

---

## Data model (`applications.csv` columns)

`company, category, priority, dev_role_to_search, expected_tc, ats, board_token,
careers_url, status, date_applied, referral, notes`

- **category:** `quant_hft`, `quant_prop`, `quant_prop_small`, `quant_hf_mm`,
  `quant_hf_central`, `ai_lab`, `startup_infra`, `startup_app`, `startup_robotics`,
  `ai_hardware`, `safety_net`
- **priority:** `P1` (push hardest) → `P4` (lottery)
- **status:** `not_started → applied → oa → phone → onsite → offer`
  (terminal: `rejected`, `ghosted`, `withdrawn`, `accepted`, `on_hold`)
- **ats / board_token:** drive the automation. Blank = not auto-checked (see coverage).

---

## Coverage — what the auto-checker sees and DOESN'T see

**Sees (once token is filled):** any firm on Greenhouse, Lever, or Ashby. That's most
AI labs and infra startups. Currently seeded: **Anthropic** (greenhouse/anthropic) as a
working example. You fill the rest per `SETUP_GITHUB.md`.

**Does NOT see:**
- **Most quant firms** — they self-host their own boards (no public API). ~half the list.
- **Google / DeepMind** — applied through Google's own careers system.
- Anything on a custom/un-templated career page.

For the blind spots, the plan is **manual weekly sweep + referrals** (referrals convert
better at quant anyway). The automation handles the high-volume lab/startup boards so you
only hand-check the ~40 self-hosted quant pages.

---

## If you want TRUE website scraping later (optional extension)

The current design deliberately avoids HTML scraping (brittle, breaks on redesigns, some
ToS issues). If you want to cover the self-hosted quant boards, options in rough order of
effort:

1. **Per-firm scrapers** — write a small parser per quant careers page (e.g. with
   `requests` + `selectolax`/`BeautifulSoup`), add a `custom` ats type that dispatches to
   them in `board_check.py`. High maintenance: each site redesign breaks its scraper.
2. **Headless browser** (Playwright) for JS-rendered boards — heavier, slower, more fragile,
   but handles dynamic pages. Run it as a separate workflow step.
3. **Aggregator APIs** — point the checker at a jobs aggregator that already indexes these
   firms, instead of scraping each. Lower maintenance, depends on the aggregator's coverage.
4. **Keep it API-only (recommended)** — accept that quant = manual/referral, and let the
   automation own the ATS-hosted firms where it's reliable. Best effort-to-value ratio.

Respect each site's robots.txt / ToS if you go the scraping route, and rate-limit politely.

---

## Setup (TL;DR)
1. `cd tracker && git init && git add . && git commit -m "init"`
2. Create a **private** GitHub repo, push.
3. Repo → Actions → enable. (Runs daily; trigger manually to test.)
4. Fill `ats` + `board_token` for more firms (see `SETUP_GITHUB.md`) to widen coverage.
5. Daily: `python3 tracker.py next` to see what to apply to; `tracker.py update ...` as you go.

## Status as of handoff
- 98 firms loaded; Cursor + Anthropic marked `on_hold` (no new-grad pipeline now).
- Automation built + tested (logic verified; live API calls run on GitHub, not in sandbox).
- 1 ATS token seeded (Anthropic). Remaining tokens: you fill to expand coverage.
- Open follow-ups: (a) fill priority lab/startup tokens, (b) OA prep block (graphs/greedy/
  DP, timed, C++), (c) Etched — ask recruiter for the loop + rehearse MTIA story.
```
