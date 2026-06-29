# Adding this to your existing repo

This is a self-contained feature. Two pieces:

1. **`job-tracker/`** — all the code + data + docs (this folder).
2. **`.github/workflows/check-jobs.yml`** — MUST sit at your repo root under
   `.github/workflows/` (GitHub only runs workflows from there). It's already pathed
   to `working-directory: job-tracker`, so it finds the scripts in the subfolder.

## Install
Copy both into your repo root (so you end up with `your-repo/job-tracker/...` and
`your-repo/.github/workflows/check-jobs.yml`), then:
```bash
git add job-tracker .github/workflows/check-jobs.yml
git commit -m "feat: daily job-opening tracker + notifier"
git push
```
Repo → **Actions** → enable workflows → run "Check job boards" once to test.

If you already have workflows, this just adds one more file — no conflicts.
If your repo is **public**, consider keeping `applications.csv` private or moving the
tracker to a private repo (it's your personal pipeline).

## Coverage model (the accurate part)
Each firm in `applications.csv` has a `coverage` value:
- `auto`      — verified on a public ATS; notifier watches it. (Seeded: Anthropic.)
- `auto_verify` — likely on Greenhouse/Lever/Ashby; fill `ats`+`board_token` to activate.
- `manual`    — self-hosted / Workday / Google; the API checker CANNOT see it. Hand-check
                weekly via `WEEKLY_SWEEP.md`.

The notifier only ever touches firms with `ats`+`board_token` filled, so `manual` firms
are safely ignored by automation. Move a firm from manual→auto anytime you find its real
ATS token.

## Regenerate docs after editing the CSV
```bash
python3 gen_docs.py      # rebuilds COMPANIES.md + WEEKLY_SWEEP.md from applications.csv
```
