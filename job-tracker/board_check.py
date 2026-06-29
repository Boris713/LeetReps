#!/usr/bin/env python3
"""
board_check.py — find live SWE/new-grad postings across MANY ATS platforms.
Pure stdlib. Run on your own machine / via Claude Code (makes outbound HTTPS calls).

SUPPORTED PLATFORMS
  Simple-slug (configured in applications.csv: ats + board_token columns):
    greenhouse | lever | ashby
  Complex (configured in boards_extra.json — need >1 param):
    workday | smartrecruiters | custom | html

USAGE
  python3 board_check.py --from-csv            # check greenhouse/lever/ashby firms in the CSV
  python3 board_check.py --extra               # check workday/smartrecruiters/custom/html in boards_extra.json
  python3 board_check.py --all                 # both
  python3 board_check.py greenhouse wehrtyou   # ad-hoc simple slug
  python3 board_check.py workday twosigma wd1 TwoSigmaCareers   # ad-hoc: ats tenant dc site

See DISCOVERY.md for how to find each firm's endpoint/slug.
"""
import argparse, csv, json, re, sys, urllib.request, urllib.error

KEYWORDS = ["software engineer","software developer","swe","new grad","new graduate",
            "university grad","graduate engineer","entry level","early career",
            "platform engineer","infrastructure engineer","systems engineer","core developer"]
NEG = ["quantitative researcher","quant researcher","quantitative trader","quant trader",
       "research scientist","investment analyst","sales","recruiter","internship","intern"]
TIMEOUT = 25
UA = {"User-Agent":"Mozilla/5.0 (personal job tracker)"}

def _match(title):
    t=(title or "").lower()
    if any(re.search(r"\b"+re.escape(n)+r"\b",t) for n in NEG): return False
    return any(k in t for k in KEYWORDS)

def _get(url, data=None, headers=None):
    h=dict(UA); 
    if headers: h.update(headers)
    req=urllib.request.Request(url, data=data, headers=h)
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return json.loads(r.read().decode("utf-8"))

def _get_text(url):
    req=urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.read().decode("utf-8","ignore")

# ---------- simple-slug ATSes ----------
def fetch_greenhouse(token):
    d=_get(f"https://boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true")
    return [(j.get("title",""),(j.get("location") or {}).get("name",""),j.get("absolute_url",""))
            for j in d.get("jobs",[]) if _match(j.get("title"))]

def fetch_lever(token):
    d=_get(f"https://api.lever.co/v0/postings/{token}?mode=json")
    return [(j.get("text",""),(j.get("categories") or {}).get("location",""),j.get("hostedUrl",""))
            for j in d if _match(j.get("text"))]

def fetch_ashby(token):
    d=_get(f"https://api.ashbyhq.com/posting-api/job-board/{token}?includeCompensation=true")
    return [(j.get("title",""),j.get("locationName",""),j.get("jobUrl") or j.get("applyUrl",""))
            for j in d.get("jobs",[]) if _match(j.get("title"))]

# ---------- complex ATSes ----------
def fetch_workday(cfg):
    # cfg: {tenant, dc, site}  -> POST wday/cxs jobs endpoint, paginate
    tenant,dc,site=cfg["tenant"],cfg["dc"],cfg["site"]
    base=f"https://{tenant}.{dc}.myworkdayjobs.com"
    api=f"{base}/wday/cxs/{tenant}/{site}/jobs"
    out=[]; offset=0
    for _ in range(20):  # up to 20*20=400 postings
        body=json.dumps({"appliedFacets":{},"limit":20,"offset":offset,"searchText":""}).encode()
        d=_get(api,data=body,headers={"Content-Type":"application/json","Accept":"application/json"})
        posts=d.get("jobPostings",[])
        if not posts: break
        for j in posts:
            if _match(j.get("title")):
                path=j.get("externalPath","")
                out.append((j.get("title",""),j.get("locationsText",""),f"{base}/en-US/{site}{path}"))
        offset+=20
        if offset>=d.get("total",0): break
    return out

def fetch_smartrecruiters(company):
    d=_get(f"https://api.smartrecruiters.com/v1/companies/{company}/postings?limit=100")
    out=[]
    for j in d.get("content",[]):
        if _match(j.get("name")):
            loc=(j.get("location") or {})
            loc_s=", ".join(x for x in [loc.get("city"),loc.get("country")] if x)
            out.append((j.get("name",""),loc_s,
                        f"https://jobs.smartrecruiters.com/{company}/{j.get('id','')}"))
    return out

def fetch_custom(cfg):
    # cfg: {url, items_path(dotted), title_field, url_field, url_prefix?, method?, body?}
    method=cfg.get("method","GET")
    data=json.dumps(cfg["body"]).encode() if (method=="POST" and cfg.get("body")) else None
    hdr={"Content-Type":"application/json"} if data else None
    d=_get(cfg["url"],data=data,headers=hdr)
    for key in (cfg.get("items_path","") or "").split("."):
        if key: d=d.get(key,[]) if isinstance(d,dict) else d
    out=[]
    for j in (d or []):
        title=j.get(cfg["title_field"],"")
        if _match(title):
            u=str(j.get(cfg.get("url_field",""),""))
            if cfg.get("url_prefix") and u and not u.startswith("http"): u=cfg["url_prefix"]+u
            out.append((title,j.get(cfg.get("loc_field",""),""),u))
    return out

def fetch_html(cfg):
    # Fragile fallback. cfg: {url, link_pattern?(regex for href), base?}
    html=_get_text(cfg["url"])
    anchors=re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',html,re.S|re.I)
    out=[]
    for href,text in anchors:
        text=re.sub(r"<[^>]+>","",text).strip()
        if cfg.get("link_pattern") and not re.search(cfg["link_pattern"],href): continue
        if _match(text):
            u=href if href.startswith("http") else cfg.get("base","")+href
            out.append((text,"",u))
    # dedupe
    seen=set(); ded=[]
    for t in out:
        if t[2] in seen: continue
        seen.add(t[2]); ded.append(t)
    return ded

SIMPLE={"greenhouse":fetch_greenhouse,"lever":fetch_lever,"ashby":fetch_ashby}
COMPLEX={"workday":fetch_workday,"smartrecruiters":fetch_smartrecruiters,
         "custom":fetch_custom,"html":fetch_html}

def check_simple(company,ats,token):
    fn=SIMPLE.get(ats.strip().lower())
    if not fn: return None,f"unknown simple ats '{ats}'"
    try: return fn(token.strip()),None
    except urllib.error.HTTPError as e: return None,f"HTTP {e.code} (bad slug?)"
    except urllib.error.URLError as e: return None,f"network: {e.reason}"
    except Exception as e: return None,f"error: {e}"

def check_complex(company,ats,cfg):
    fn=COMPLEX.get(ats.strip().lower())
    if not fn: return None,f"unknown complex ats '{ats}'"
    try: return fn(cfg),None
    except urllib.error.HTTPError as e: return None,f"HTTP {e.code}"
    except urllib.error.URLError as e: return None,f"network: {e.reason}"
    except Exception as e: return None,f"error: {e}"

def show(company,roles):
    if roles is None: return
    if not roles: print(f"  {company}: no matching roles"); return
    print(f"  {company}: {len(roles)} matching")
    for t,l,u in roles: print(f"     - {t}  [{l}]\n       {u}")

def run_csv():
    rows=list(csv.DictReader(open("applications.csv",newline="")))
    todo=[r for r in rows if r.get("ats","").lower() in SIMPLE and r.get("board_token")]
    print(f"[csv] checking {len(todo)} greenhouse/lever/ashby firms\n")
    found=[]
    for r in todo:
        roles,err=check_simple(r["company"],r["ats"],r["board_token"])
        if err: print(f"  {r['company']}: {err}"); continue
        show(r["company"],roles)
        for t,l,u in roles: found.append({"company":r["company"],"title":t,"location":l,"url":u})
    return found

def run_extra():
    try: cfgs=json.load(open("boards_extra.json"))
    except FileNotFoundError: print("[extra] boards_extra.json not found"); return []
    print(f"[extra] checking {len(cfgs)} workday/smartrecruiters/custom/html firms\n")
    found=[]
    for entry in cfgs:
        if entry.get("_skip"): continue
        company=entry["company"]; ats=entry["ats"]
        cfg = entry.get("company_id") if ats=="smartrecruiters" else entry
        if ats=="smartrecruiters": cfg=entry["company_id"]
        roles,err=check_complex(company,ats,cfg)
        if err: print(f"  {company}: {err}"); continue
        show(company,roles)
        for t,l,u in (roles or []): found.append({"company":company,"title":t,"location":l,"url":u})
    return found

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("args",nargs="*")
    ap.add_argument("--from-csv",action="store_true")
    ap.add_argument("--extra",action="store_true")
    ap.add_argument("--all",action="store_true")
    ap.add_argument("--save",action="store_true")
    a=ap.parse_args()
    found=[]
    if a.all or a.from_csv: found+=run_csv()
    if a.all or a.extra: found+=run_extra()
    if a.args:
        ats=a.args[0]
        if ats in SIMPLE:
            show(a.args[1],check_simple(a.args[1],ats,a.args[1])[0])
        elif ats=="workday" and len(a.args)>=4:
            show(a.args[1],check_complex(a.args[1],"workday",
                 {"tenant":a.args[1],"dc":a.args[2],"site":a.args[3]})[0])
        elif ats=="smartrecruiters" and len(a.args)>=2:
            show(a.args[1],check_complex(a.args[1],"smartrecruiters",a.args[1])[0])
        else: print("ad-hoc: greenhouse|lever|ashby <slug>  OR  workday <tenant> <dc> <site>  OR  smartrecruiters <company>")
        return
    if not (a.from_csv or a.extra or a.all): ap.print_help(); return
    if a.save and found:
        json.dump(found,open("found_roles.json","w"),indent=2)
        print(f"\nsaved {len(found)} roles to found_roles.json")

if __name__=="__main__": main()
