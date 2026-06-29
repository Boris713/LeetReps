#!/usr/bin/env python3
"""
board_check.py — find live postings from public ATS APIs (Greenhouse, Lever, Ashby).
Pure stdlib. NOTE: run this on your own machine — it makes outbound HTTPS calls.

Two ways to use it:

1) From the CSV: fill the `ats` and `board_token` columns in applications.csv, then:
       python3 board_check.py --from-csv
   It queries every firm that has both filled and prints matching roles.
   Add --save to also write found_roles.csv.

2) Ad hoc, one firm:
       python3 board_check.py greenhouse stripe
       python3 board_check.py lever ramp
       python3 board_check.py ashby openai

HOW TO FIND A board_token:
  Look at a company's careers page URL / network tab:
    job-boards.greenhouse.io/<token>  or boards.greenhouse.io/<token>   -> ats=greenhouse
    jobs.lever.co/<token>                                               -> ats=lever
    jobs.ashbyhq.com/<token>                                            -> ats=ashby
  Many quant/startups self-host (no public API) -> leave blank, check manually.

Filtering: matches titles containing any KEYWORD and not containing any NEG word
(so "Quantitative Researcher"/"Trader" get filtered out). Tweak the lists below.
"""
import argparse, csv, json, re, sys, urllib.request, urllib.error

KEYWORDS = ["software engineer", "software developer", "swe", "new grad", "new graduate",
            "university grad", "graduate engineer", "entry level", "early career",
            "platform engineer", "infrastructure engineer", "systems engineer"]
NEG = ["quantitative researcher", "quant researcher", "quantitative trader", "quant trader",
       "research scientist", "investment analyst", "sales", "recruiter", "internship", "intern"]

TIMEOUT = 20
UA = {"User-Agent": "Mozilla/5.0 (job-search personal tracker)"}


def _get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return json.loads(r.read().decode("utf-8"))


def _match(title):
    t = (title or "").lower()
    if any(re.search(r"\b" + re.escape(n) + r"\b", t) for n in NEG):
        return False
    return any(k in t for k in KEYWORDS)


def fetch_greenhouse(token):
    url = f"https://boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true"
    data = _get(url)
    out = []
    for j in data.get("jobs", []):
        if _match(j.get("title")):
            out.append((j.get("title", ""), (j.get("location") or {}).get("name", ""),
                        j.get("absolute_url", "")))
    return out


def fetch_lever(token):
    url = f"https://api.lever.co/v0/postings/{token}?mode=json"
    data = _get(url)
    out = []
    for j in data:
        if _match(j.get("text")):
            loc = (j.get("categories") or {}).get("location", "")
            out.append((j.get("text", ""), loc, j.get("hostedUrl", "")))
    return out


def fetch_ashby(token):
    url = f"https://api.ashbyhq.com/posting-api/job-board/{token}?includeCompensation=true"
    data = _get(url)
    out = []
    for j in data.get("jobs", []):
        if _match(j.get("title")):
            out.append((j.get("title", ""), j.get("locationName", ""),
                        j.get("jobUrl") or j.get("applyUrl", "")))
    return out


FETCHERS = {"greenhouse": fetch_greenhouse, "lever": fetch_lever, "ashby": fetch_ashby}


def check_one(company, ats, token):
    fn = FETCHERS.get(ats.strip().lower())
    if not fn:
        return None, f"unknown ats '{ats}'"
    try:
        return fn(token.strip()), None
    except urllib.error.HTTPError as e:
        return None, f"HTTP {e.code} (bad token?)"
    except urllib.error.URLError as e:
        return None, f"network error: {e.reason}"
    except Exception as e:
        return None, f"error: {e}"


def print_results(company, roles):
    if not roles:
        print(f"  {company}: no matching roles right now")
        return
    print(f"  {company}: {len(roles)} matching")
    for title, loc, url in roles:
        print(f"     - {title}  [{loc}]\n       {url}")


def main():
    ap = argparse.ArgumentParser(description="Check live postings via public ATS APIs.")
    ap.add_argument("ats", nargs="?", choices=list(FETCHERS), help="ad-hoc: ats provider")
    ap.add_argument("token", nargs="?", help="ad-hoc: board token")
    ap.add_argument("--from-csv", action="store_true", help="check all firms with ats+token in applications.csv")
    ap.add_argument("--save", action="store_true", help="write found_roles.csv (with --from-csv)")
    args = ap.parse_args()

    if args.from_csv:
        try:
            rows = list(csv.DictReader(open("applications.csv", newline="")))
        except FileNotFoundError:
            print("applications.csv not found."); sys.exit(1)
        todo = [r for r in rows if r.get("ats") and r.get("board_token")]
        if not todo:
            print("No firms have both `ats` and `board_token` filled yet. Fill those columns first.")
            print("Tip: see the 'HOW TO FIND a board_token' notes at the top of this file.")
            sys.exit(0)
        found = []
        print(f"Checking {len(todo)} firms...\n")
        for r in todo:
            roles, err = check_one(r["company"], r["ats"], r["board_token"])
            if err:
                print(f"  {r['company']}: {err}")
                continue
            print_results(r["company"], roles)
            for title, loc, url in roles:
                found.append({"company": r["company"], "title": title, "location": loc, "url": url})
        if args.save and found:
            with open("found_roles.csv", "w", newline="") as f:
                w = csv.DictWriter(f, fieldnames=["company", "title", "location", "url"])
                w.writeheader(); w.writerows(found)
            print(f"\nSaved {len(found)} roles to found_roles.csv")
        return

    if args.ats and args.token:
        roles, err = check_one(args.token, args.ats, args.token)
        if err:
            print(f"{args.token}: {err}"); sys.exit(1)
        print_results(args.token, roles)
        return

    ap.print_help()


if __name__ == "__main__":
    main()
