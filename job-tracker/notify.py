#!/usr/bin/env python3
"""
notify.py — diff live postings vs snapshot; report only NEW roles.
Runs in GitHub Actions daily. Checks BOTH:
  - applications.csv  (greenhouse/lever/ashby simple-slug firms)
  - boards_extra.json (workday/smartrecruiters/custom/html firms)
Writes new_roles.md, updates snapshot.json, prints NEW_COUNT=<n>.
"""
import json, csv, sys
import board_check as bc

SNAP="snapshot.json"

def current_roles():
    roles={}
    # simple-slug from CSV
    try:
        for r in csv.DictReader(open("applications.csv",newline="")):
            ats=r.get("ats","").lower(); tok=r.get("board_token","")
            if ats in bc.SIMPLE and tok:
                found,err=bc.check_simple(r["company"],ats,tok)
                if err: print(f"  ! {r['company']}: {err}"); continue
                for t,l,u in found:
                    roles[u or f"{r['company']}::{t}"]={"company":r["company"],"title":t,"location":l,"url":u}
    except FileNotFoundError: pass
    # complex from boards_extra.json
    try:
        for e in json.load(open("boards_extra.json")):
            if e.get("_skip"): continue
            ats=e["ats"]; cfg=e["company_id"] if ats=="smartrecruiters" else e
            found,err=bc.check_complex(e["company"],ats,cfg)
            if err: print(f"  ! {e['company']}: {err}"); continue
            for t,l,u in (found or []):
                roles[u or f"{e['company']}::{t}"]={"company":e["company"],"title":t,"location":l,"url":u}
    except FileNotFoundError: pass
    return roles

def main():
    cur=current_roles()
    try: old=json.load(open(SNAP))
    except (FileNotFoundError,json.JSONDecodeError): old={}
    new=[k for k in cur if k not in old]
    json.dump(cur,open(SNAP,"w"),indent=2)
    if not new: print("NEW_COUNT=0"); return
    by={}
    for k in new: by.setdefault(cur[k]["company"],[]).append(cur[k])
    lines=["## New matching roles\n"]
    for co,items in sorted(by.items()):
        lines.append(f"### {co}")
        for it in items:
            loc=f" — {it['location']}" if it["location"] else ""
            lines.append(f"- **{it['title']}**{loc}\n  {it['url'] or '(no url)'}")
        lines.append("")
    open("new_roles.md","w").write("\n".join(lines))
    print(f"NEW_COUNT={len(new)}")

if __name__=="__main__": main()
