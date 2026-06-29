#!/usr/bin/env python3
"""Regenerate COMPANIES.md and WEEKLY_SWEEP.md from applications.csv."""
import csv, urllib.parse
from collections import defaultdict

rows=list(csv.DictReader(open("applications.csv")))
PORDER={"P1":0,"P2":1,"P3":2,"P4":3}
CATNAME={
 "quant_hft":"Quant — HFT","quant_prop":"Quant — Prop Trading",
 "quant_prop_small":"Quant — Smaller Prop","quant_hf_mm":"Quant — Multi-Manager HF",
 "quant_hf_central":"Quant — Centralized HF","ai_lab":"AI Labs",
 "startup_infra":"Startups — AI Infra/Dev Tools","startup_app":"Startups — AI App Layer",
 "startup_robotics":"Startups — Robotics","ai_hardware":"AI Hardware","safety_net":"Safety Net / Brand",
}
CATORDER=list(CATNAME)

def search(c): return "https://www.google.com/search?q="+urllib.parse.quote(c+" careers software engineer")

# COMPANIES.md
g=defaultdict(list)
for r in rows: g[r["category"]].append(r)
out=["# Company List (98 firms)\n",
     "Auto = notifier can watch it (on a public ATS). Manual = self-hosted, weekly hand-check.\n"]
for cat in CATORDER:
    if cat not in g: continue
    items=sorted(g[cat],key=lambda r:(PORDER.get(r['priority'],9),r['company'].lower()))
    out.append(f"\n## {CATNAME[cat]} ({len(items)})\n")
    out.append("| Company | Pri | TC | Coverage | Role |")
    out.append("|---|---|---|---|---|")
    for r in items:
        cov={"auto":"✅ auto","auto_verify":"🔧 verify","manual":"✋ manual"}[r["coverage"]]
        out.append(f"| {r['company']} | {r['priority']} | {r['expected_tc']} | {cov} | {r['dev_role_to_search']} |")
open("COMPANIES.md","w").write("\n".join(out)+"\n")

# WEEKLY_SWEEP.md (manual only)
man=[r for r in rows if r["coverage"]=="manual"]
man.sort(key=lambda r:(PORDER.get(r['priority'],9),r['company'].lower()))
out=["# Weekly Manual Sweep\n",
     f"{len(man)} firms the auto-notifier can't see (self-hosted / Workday / Google).",
     "Check these ~once a week (15 min). Links are pre-built searches to their careers pages.\n",
     "| ✓ | Company | Pri | Role to look for | Careers search |",
     "|---|---|---|---|---|"]
for r in man:
    out.append(f"| ☐ | {r['company']} | {r['priority']} | {r['dev_role_to_search']} | [search]({search(r['company'])}) |")
out.append("\n> Tip: if you find any of these is actually on Greenhouse/Lever/Ashby "
           "(check the careers-page URL), fill its `ats`+`board_token` in applications.csv "
           "and set coverage=auto — then the notifier takes it over and you can stop hand-checking it.")
open("WEEKLY_SWEEP.md","w").write("\n".join(out)+"\n")
print("wrote COMPANIES.md and WEEKLY_SWEEP.md")
