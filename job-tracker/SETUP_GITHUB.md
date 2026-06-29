# Setup: auto-notify when roles open (GitHub Actions)

This runs `notify.py` on a daily schedule in the cloud (free), and opens a GitHub
**Issue** when a new matching role appears. GitHub emails you on new issues, so that
*is* your notification — no servers, no paid services.

## 1. Make a repo and push these files
```bash
cd tracker                       # the folder with these files
git init
git add .
git commit -m "job tracker + notifier"
gh repo create job-tracker --private --source=. --push     # GitHub CLI
# (or make an empty private repo on github.com and `git remote add origin ... && git push -u origin main`)
```
Make it **private** — it's your personal pipeline.

## 2. Turn on the schedule
Nothing to do — `.github/workflows/check-jobs.yml` runs automatically once a day.
To test it now: repo → **Actions** tab → "Check job boards" → **Run workflow**.

## 3. Get the notifications
- New role found → the Action opens an Issue titled "🔔 N new role(s) opened."
- GitHub emails you on new issues by default. (Settings → Notifications to confirm.)
- Want phone pings? Install the **GitHub mobile app** and enable issue notifications.

## 4. (Optional) Slack/Discord instead of issues
Add a webhook step to the workflow after "Open issue":
```yaml
      - name: Ping Discord
        if: steps.run.outputs.new_count != '0'
        run: |
          curl -H "Content-Type: application/json" \
            -d "{\"content\": \"$(cat new_roles.md | head -c 1500)\"}" \
            ${{ secrets.DISCORD_WEBHOOK }}
```
Then add a `DISCORD_WEBHOOK` repo secret (Settings → Secrets → Actions).

---

## IMPORTANT: it only checks firms with `ats` + `board_token` filled
Out of the box only **Anthropic** is seeded (greenhouse/anthropic). To cover more,
fill the `ats` and `board_token` columns in `applications.csv`:

| ATS | URL pattern on the company careers page | ats value |
|---|---|---|
| Greenhouse | `job-boards.greenhouse.io/<token>` | `greenhouse` |
| Lever | `jobs.lever.co/<token>` | `lever` |
| Ashby | `jobs.ashbyhq.com/<token>` | `ashby` |

**Verify each token** before committing — guessing wrong just means that firm is skipped.
Test one without touching the CSV:
```bash
python3 board_check.py greenhouse anthropic     # should list matching roles
python3 board_check.py ashby <token>
python3 board_check.py lever <token>
```

### Likely-but-VERIFY starting points for your priority labs/startups
(Confirm by opening each careers page and reading the URL — don't trust this blindly.)
- OpenAI → likely `ashby` / `openai`
- xAI → check (often self-hosted)
- Modal, Baseten, Together, Fireworks, ClickHouse, Etched → mostly Ashby or Greenhouse; check each
- DeepMind → applied via Google careers (NOT a public ATS token) — check manually
- Most **quant firms self-host** (no public API) → leave blank, check their pages manually

## Coverage reality
This reliably catches labs/startups on Greenhouse/Lever/Ashby. It will **not** catch
self-hosted boards (most quant shops, Google/DeepMind). For those, keep a weekly manual
sweep — or just rely on your referrals there (which convert better anyway).
