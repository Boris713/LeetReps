#!/usr/bin/env python3
"""
tracker.py — manage your job application pipeline (applications.csv).
Pure stdlib, no installs. Run `python3 tracker.py -h`.

Statuses (pipeline order):
  not_started -> applied -> oa -> phone -> onsite -> offer
  (terminal: rejected, ghosted, withdrawn, accepted)

Examples:
  python3 tracker.py list                       # everything
  python3 tracker.py list --priority P1         # only P1
  python3 tracker.py list --category quant_hft  # one category
  python3 tracker.py list --status not_started --priority P1   # what to do next
  python3 tracker.py next                        # P1/P2 not yet started
  python3 tracker.py update "Jane Street" applied --date 2026-07-15 --referral yes
  python3 tracker.py update "OpenAI" onsite
  python3 tracker.py stats                        # funnel + counts
"""
import argparse, csv, sys, datetime
from collections import Counter, defaultdict

CSV = "applications.csv"
PIPELINE = ["not_started", "applied", "oa", "phone", "onsite", "offer"]
TERMINAL = ["rejected", "ghosted", "withdrawn", "accepted", "on_hold"]
VALID = PIPELINE + TERMINAL
PRIORITY_ORDER = {"P1": 0, "P2": 1, "P3": 2, "P4": 3}


def load():
    try:
        with open(CSV, newline="") as f:
            return list(csv.DictReader(f)), None
    except FileNotFoundError:
        return None, f"{CSV} not found. Run build_data.py first."


def save(rows):
    cols = ["company", "category", "priority", "dev_role_to_search", "expected_tc",
            "ats", "board_token", "careers_url", "status", "date_applied", "referral", "notes"]
    with open(CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)


def _sort_key(r):
    return (PRIORITY_ORDER.get(r["priority"], 9), r["category"], r["company"].lower())


def cmd_list(rows, args):
    out = rows
    if args.priority:
        out = [r for r in out if r["priority"] == args.priority]
    if args.category:
        out = [r for r in out if r["category"] == args.category]
    if args.status:
        out = [r for r in out if r["status"] == args.status]
    out = sorted(out, key=_sort_key)
    if not out:
        print("(no matches)")
        return
    w = max(len(r["company"]) for r in out) + 1
    print(f"{'COMPANY':<{w}} {'PRI':<4} {'STATUS':<12} {'TC':<14} ROLE")
    print("-" * (w + 48))
    for r in out:
        print(f"{r['company']:<{w}} {r['priority']:<4} {r['status']:<12} "
              f"{r['expected_tc']:<14} {r['dev_role_to_search']}")
    print(f"\n{len(out)} firms.")


def cmd_next(rows, args):
    out = [r for r in rows if r["priority"] in ("P1", "P2") and r["status"] == "not_started"]
    out = sorted(out, key=_sort_key)
    print("Highest-leverage firms not yet started (P1/P2):\n")
    cat = None
    for r in out:
        if r["category"] != cat:
            cat = r["category"]
            print(f"  [{cat}]")
        print(f"    - {r['company']:<28} {r['priority']}  {r['expected_tc']}")
    print(f"\n{len(out)} to go. Apply the day each opens.")


def cmd_update(rows, args):
    if args.status not in VALID:
        print(f"Invalid status. Use one of: {', '.join(VALID)}")
        sys.exit(1)
    matches = [r for r in rows if args.company.lower() in r["company"].lower()]
    if not matches:
        print(f"No firm matching '{args.company}'.")
        sys.exit(1)
    if len(matches) > 1:
        print(f"Ambiguous '{args.company}' matches: {', '.join(m['company'] for m in matches)}")
        sys.exit(1)
    r = matches[0]
    old = r["status"]
    r["status"] = args.status
    if args.status == "applied" and not r["date_applied"]:
        r["date_applied"] = args.date or datetime.date.today().isoformat()
    if args.date:
        r["date_applied"] = args.date
    if args.referral:
        r["referral"] = args.referral
    if args.note:
        r["notes"] = (r["notes"] + " | " + args.note).strip(" |")
    save(rows)
    print(f"{r['company']}: {old} -> {r['status']}"
          + (f"  (applied {r['date_applied']})" if r["date_applied"] else ""))


def cmd_stats(rows, args):
    by_status = Counter(r["status"] for r in rows)
    print("Pipeline funnel:")
    for s in PIPELINE:
        bar = "#" * by_status.get(s, 0)
        print(f"  {s:<12} {by_status.get(s,0):>3}  {bar}")
    term = {s: by_status.get(s, 0) for s in TERMINAL if by_status.get(s, 0)}
    if term:
        print("Terminal:", ", ".join(f"{k}={v}" for k, v in term.items()))

    active = sum(by_status.get(s, 0) for s in PIPELINE[1:])  # applied..offer
    print(f"\nActive (applied+): {active} / {len(rows)} firms")

    print("\nBy priority (active vs total):")
    by_pri = defaultdict(lambda: [0, 0])
    for r in rows:
        by_pri[r["priority"]][1] += 1
        if r["status"] in PIPELINE[1:]:
            by_pri[r["priority"]][0] += 1
    for p in sorted(by_pri, key=lambda x: PRIORITY_ORDER.get(x, 9)):
        a, t = by_pri[p]
        print(f"  {p}: {a}/{t} active")

    print("\nBy category (total):")
    for c, n in sorted(Counter(r["category"] for r in rows).items()):
        print(f"  {c:<20} {n}")


def main():
    p = argparse.ArgumentParser(description="Job application pipeline tracker.")
    sub = p.add_subparsers(dest="cmd", required=True)

    pl = sub.add_parser("list", help="list firms (filterable)")
    pl.add_argument("--priority", choices=["P1", "P2", "P3", "P4"])
    pl.add_argument("--category")
    pl.add_argument("--status", choices=VALID)

    sub.add_parser("next", help="P1/P2 firms not yet started")

    pu = sub.add_parser("update", help="update a firm's status")
    pu.add_argument("company")
    pu.add_argument("status")
    pu.add_argument("--date", help="YYYY-MM-DD (defaults to today on 'applied')")
    pu.add_argument("--referral", help="e.g. yes / name")
    pu.add_argument("--note", help="append a note")

    sub.add_parser("stats", help="funnel + counts")

    args = p.parse_args()
    rows, err = load()
    if err:
        print(err); sys.exit(1)

    {"list": cmd_list, "next": cmd_next, "update": cmd_update, "stats": cmd_stats}[args.cmd](rows, args)


if __name__ == "__main__":
    main()
