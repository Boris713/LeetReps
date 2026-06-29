# Covering the manual firms — discovery guide

Goal: get the remaining self-hosted firms (mostly big quant) into the auto-notifier.
Most "self-hosted" career sites actually call a JSON endpoint behind the scenes. Find it
once, drop it into `boards_extra.json`, and the notifier watches it like any other board.

This is the part to run in **Claude Code** (or your browser) — it needs live network +
the browser Network tab, which couldn't be done when the system was built.

## The 4 platform types and how to fill each

### 1. Workday  (many finance firms)
Careers URL looks like `https://{tenant}.{dc}.myworkdayjobs.com/{site}` (dc = wd1/wd3/wd5).
Fill in `boards_extra.json`:
```json
{ "company":"IMC Trading","ats":"workday","tenant":"imc","dc":"wd3","site":"IMC_Careers" }
```
Verify: `python3 board_check.py workday imc wd3 IMC_Careers`

### 2. SmartRecruiters
Careers URL or postings under `jobs.smartrecruiters.com/{company}`.
```json
{ "company":"SomeFirm","ats":"smartrecruiters","company_id":"SomeFirm" }
```
Verify: `python3 board_check.py smartrecruiters SomeFirm`

### 3. custom  (the firm hits its own JSON API)
**Find the endpoint:** open the careers page → DevTools (F12) → **Network** tab → filter **Fetch/XHR**
→ reload → look for a request that returns JSON with the job list (often named `jobs`, `search`,
`postings`, `roles`). Click it → copy the **Request URL** and look at the JSON shape.
```json
{ "company":"Two Sigma","ats":"custom",
  "url":"https://careers.twosigma.com/api/jobs",
  "items_path":"jobs",        // dotted path to the list, e.g. "data.results"
  "title_field":"title",      // field with the role title
  "url_field":"applyUrl",     // field with the job link
  "url_prefix":"" }           // prepend if url_field is a relative path
```
If it's a POST (some are), add `"method":"POST","body":{...}` copied from the Network tab.
Verify by running `--extra` after removing `"_skip"`.

### 4. html  (truly static page, no JSON — last resort, fragile)
```json
{ "company":"Jane Street","ats":"html",
  "url":"https://www.janestreet.com/join-jane-street/open-roles/",
  "link_pattern":"/join-jane-street/","base":"https://www.janestreet.com" }
```
`link_pattern` = a regex the job links' href contains. Fragile: breaks on redesigns.

## Turn a template on
`boards_extra.json` already has `_skip:true` templates for Two Sigma, Citadel, Citadel
Securities, Optiver, IMC, Jane Street, DE Shaw, Jump. For each: fill the FILL fields, delete
`"_skip"`, run `python3 board_check.py --extra` to confirm it lists roles, commit.

## Worklist — all manual firms (careers pages to inspect)

Priority quant (do these first):
- Jane Street      https://www.janestreet.com/join-jane-street/open-roles/   (static html)
- Citadel          https://www.citadel.com/careers/open-opportunities/        (custom JSON likely)
- Citadel Sec.     https://www.citadelsecurities.com/careers/open-opportunities/
- Two Sigma        https://careers.twosigma.com/                              (custom JSON likely)
- DE Shaw          https://www.deshaw.com/careers                             (static html)
- Jump Trading     https://www.jumptrading.com/careers/                       (custom JSON likely)
- Optiver          https://optiver.com/working-at-optiver/career-opportunities/
- IMC Trading      https://careers.imc.com/                                   (Workday likely)

Hedge funds / others:
- Millennium, Point72/Cubist, Balyasny, ExodusPoint, WorldQuant, Tudor, PDT,
  Squarepoint, G-Research, Virtu, Tower Research, Bridgewater, AQR, RenTec

Big tech (self-hosted/Workday; lower priority since you'll likely apply directly):
- Meta, Netflix, Nvidia, Google DeepMind

No public board found (keep weekly-manual): Lightmatter, Factory AI, Thinking Machines, SSI

> Reality: some of these (Jane Street, DE Shaw) are static and only html-scrapeable (fragile);
> a few may block automated requests entirely. For any that resist, leave them in WEEKLY_SWEEP.md
> and rely on referrals — which at quant convert better than a job-board alert anyway.
