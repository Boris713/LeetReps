#!/usr/bin/env python3
"""
notify.py — diff live postings against the last snapshot and report NEW ones.
Designed to run in GitHub Actions on a schedule. Pure stdlib.

Reads firms with `ats` + `board_token` filled in applications.csv, fetches current
matching roles (reusing board_check), compares to snapshot.json, and:
  - writes new_roles.md  (human-readable, used as the GitHub Issue body)
  - updates snapshot.json (so each role only alerts once)
  - exits 0 always; prints NEW_COUNT=<n> for the workflow to branch on.

Local test:  python3 notify.py
"""
import json, os, sys
import board_check as bc
import csv

SNAP = "snapshot.json"


def load_csv():
    try:
        return list(csv.DictReader(open("applications.csv", newline="")))
    except FileNotFoundError:
        print("applications.csv not found"); sys.exit(0)


def current_roles():
    roles = {}
    for r in load_csv():
        ats, tok = r.get("ats", "").strip(), r.get("board_token", "").strip()
        if not ats or not tok:
            continue
        found, err = bc.check_one(r["company"], ats, tok)
        if err:
            print(f"  ! {r['company']}: {err}")
            continue
        for title, loc, url in found:
            roles[url or f"{r['company']}::{title}"] = {
                "company": r["company"], "title": title, "location": loc, "url": url,
            }
    return roles


def main():
    cur = current_roles()
    try:
        old = json.load(open(SNAP))
    except (FileNotFoundError, json.JSONDecodeError):
        old = {}

    new_keys = [k for k in cur if k not in old]
    # persist union so we don't re-alert (and so removed roles drop out next cycle)
    json.dump(cur, open(SNAP, "w"), indent=2)

    if not new_keys:
        print("NEW_COUNT=0")
        return

    lines = ["## New matching roles\n"]
    by_co = {}
    for k in new_keys:
        by_co.setdefault(cur[k]["company"], []).append(cur[k])
    for co, items in sorted(by_co.items()):
        lines.append(f"### {co}")
        for it in items:
            loc = f" — {it['location']}" if it["location"] else ""
            url = it["url"] or "(no url)"
            lines.append(f"- **{it['title']}**{loc}\n  {url}")
        lines.append("")
    open("new_roles.md", "w").write("\n".join(lines))
    print(f"NEW_COUNT={len(new_keys)}")


if __name__ == "__main__":
    main()
