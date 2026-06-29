#!/usr/bin/env python3
"""Builds applications.csv — the full apply universe.
Run once to (re)generate the seed CSV. Edit the lists below to add/remove firms.
"""
import csv

COLUMNS = [
    "company", "category", "priority", "dev_role_to_search", "expected_tc",
    "ats", "board_token", "careers_url", "status", "date_applied", "referral", "notes",
]

# priority: P1 = best fit + pay (push hardest)  P2 = strong, apply  P3 = safety/optionality  P4 = lottery
# ats/board_token left blank for you to fill (used by board_check.py). status starts as "not_started".
# rows: (company, category, priority, role, tc, notes)
ROWS = [
    # ---------- QUANT: HFT ----------
    ("Hudson River Trading", "quant_hft", "P1", "Core Dev / Algo Dev / SWE", "300-400k", "C++/low-latency. Algo Dev can be eng-heavy — read JD."),
    ("Jump Trading", "quant_hft", "P1", "Software Engineer", "300-400k", "Low-latency/systems heavy."),
    ("Virtu Financial", "quant_hft", "P1", "Software Engineer", "200-300k", ""),
    ("Tower Research", "quant_hft", "P1", "Software Engineer", "200-300k", ""),
    ("HAP Capital", "quant_hft", "P2", "Software Engineer", "200-300k", "Smaller — apply direct."),
    ("Quantlab", "quant_hft", "P1", "Software Engineer", "200-300k", "Houston."),
    ("Headlands", "quant_hft", "P1", "Software Developer", "200-300k", "C++ trading software. NOT Research Developer."),
    # ---------- QUANT: PROP ----------
    ("Jane Street", "quant_prop", "P1", "Software Engineer", "350-400k", "Highest-confidence target. OCaml. ~$300k base."),
    ("Citadel Securities", "quant_prop", "P1", "Software Engineer", "300-400k", "Market maker; huge eng org."),
    ("IMC Trading", "quant_prop", "P1", "Software Engineer", "250-425k", "Conversion offers reported high end."),
    ("Optiver", "quant_prop", "P1", "Software Engineer", "250-350k", "Options market maker."),
    ("Akuna Capital", "quant_prop", "P1", "Software Engineer", "200-300k", "Chicago."),
    ("DRW", "quant_prop", "P1", "Software Developer", "250-350k", "Skip Quant Trading Analyst (trader role)."),
    ("SIG", "quant_prop", "P1", "Software Engineer", "200-300k", ""),
    ("Five Rings", "quant_prop", "P1", "Software Engineer", "250-350k", "NYC."),
    ("Chicago Trading Co (CTC)", "quant_prop", "P1", "Software Engineer", "200-300k", ""),
    ("Old Mission Capital", "quant_prop", "P2", "Software Engineer", "200-300k", "Skip Junior Quant Trader."),
    ("TransMarket Group", "quant_prop", "P2", "Software Engineer", "180-280k", ""),
    ("GTS", "quant_prop", "P2", "Software Engineer", "200-300k", ""),
    ("Volant Trading", "quant_prop", "P2", "Software Engineer", "180-280k", ""),
    ("Flow Traders", "quant_prop", "P2", "Software Engineer", "180-280k", ""),
    ("Radix Trading", "quant_prop", "P2", "Software Developer", "200-300k", ""),
    # ---------- QUANT: SMALLER PROP (recruit direct, often missed by repos) ----------
    ("Wolverine Trading", "quant_prop_small", "P2", "Software Engineer", "180-280k", ""),
    ("Belvedere Trading", "quant_prop_small", "P2", "Software Engineer", "180-260k", ""),
    ("Group One Trading", "quant_prop_small", "P2", "Software Engineer", "180-260k", ""),
    ("Peak6", "quant_prop_small", "P2", "Software Engineer", "180-260k", ""),
    ("XR Trading", "quant_prop_small", "P2", "Software Engineer", "180-260k", ""),
    ("Eagle Seven", "quant_prop_small", "P3", "Software Engineer", "180-260k", ""),
    ("3Red Partners", "quant_prop_small", "P3", "Software Engineer", "180-260k", ""),
    ("Spot Trading", "quant_prop_small", "P3", "Software Engineer", "180-260k", ""),
    ("WH Trading", "quant_prop_small", "P3", "Software Engineer", "180-260k", ""),
    ("DV Trading", "quant_prop_small", "P3", "Software Engineer", "180-260k", ""),
    # ---------- QUANT: MULTI-MANAGER HEDGE FUNDS ----------
    ("Millennium", "quant_hf_mm", "P2", "Software Engineer / Quant Dev", "200-350k", "Central eng + pod-aligned dev."),
    ("Point72 / Cubist", "quant_hf_mm", "P2", "Software Engineer", "200-300k", "Has a formal new-grad Academy."),
    ("Citadel (the fund)", "quant_hf_mm", "P1", "Software Engineer", "300-400k", "Separate from Citadel Securities — apply to both."),
    ("Balyasny", "quant_hf_mm", "P2", "Software Engineer", "200-300k", ""),
    ("ExodusPoint", "quant_hf_mm", "P3", "Software Engineer", "200-300k", ""),
    ("WorldQuant", "quant_hf_mm", "P2", "Software Engineer", "180-280k", "Runs a structured program."),
    ("GSA Capital", "quant_hf_mm", "P2", "Software Engineer", "200-300k", ""),
    ("Tudor", "quant_hf_mm", "P3", "Software Engineer", "200-300k", ""),
    ("Engineers Gate", "quant_hf_mm", "P3", "Software Engineer", "200-300k", ""),
    ("Schonfeld", "quant_hf_mm", "P2", "Software Engineer", "200-300k", ""),
    ("Verition", "quant_hf_mm", "P3", "Software Engineer", "200-300k", ""),
    ("Centiva", "quant_hf_mm", "P3", "Software Engineer", "180-280k", ""),
    ("Walleye", "quant_hf_mm", "P3", "Software Engineer", "180-280k", ""),
    # ---------- QUANT: CENTRALIZED HEDGE FUNDS ----------
    ("DE Shaw", "quant_hf_central", "P1", "Software Engineer / Quant Dev", "250-400k", "Strong central SWE pipeline."),
    ("Two Sigma", "quant_hf_central", "P1", "Software Engineer", "250-350k", "Tech-co-that-trades; strong eng."),
    ("PDT Partners", "quant_hf_central", "P2", "Software Engineer", "200-350k", ""),
    ("RenTec (Renaissance)", "quant_hf_central", "P4", "Software Engineer", "300k+", "Near-closed to new grads. Lottery."),
    ("Bridgewater", "quant_hf_central", "P4", "Software Engineer", "180-260k", "Macro/slower; research-flavored."),
    ("AQR", "quant_hf_central", "P3", "Software Engineer", "180-280k", "Has real eng but slower/quant-research lean."),
    ("Squarepoint", "quant_hf_central", "P2", "Software Engineer", "200-300k", "Systematic; real eng roles."),
    ("Aquatic Capital", "quant_hf_central", "P3", "Software Engineer", "200-300k", ""),
    ("Voleon", "quant_hf_central", "P2", "Software Engineer", "200-300k", "ML-driven; technically deep."),
    ("TGS", "quant_hf_central", "P2", "Software Engineer", "200-300k", ""),
    ("G-Research", "quant_hf_central", "P2", "Software Engineer", "200-300k", "London; strong eng."),
    # ---------- FRONTIER AI LABS ----------
    ("OpenAI", "ai_lab", "P1", "Software Engineer / MTS", "300-500k+", "Equity-heavy; brand + trajectory."),
    ("Anthropic", "ai_lab", "P1", "Software Engineer", "300-450k+", "Steep trajectory even near IPO."),
    ("xAI", "ai_lab", "P1", "Software Engineer", "250-450k", ""),
    ("Google DeepMind", "ai_lab", "P1", "Software Engineer", "250-350k", "Higher band than vanilla Google."),
    ("Thinking Machines Lab", "ai_lab", "P2", "Engineering (MTS)", "high, variable", "Early — more upside, less liquidity."),
    ("SSI", "ai_lab", "P2", "Engineering (MTS)", "high, variable", "Very early/selective."),
    # ---------- STARTUPS: AI INFRA & DEV TOOLS (deep tech + pay + IPO track) ----------
    ("Anysphere (Cursor)", "startup_infra", "P1", "Software Engineer", "250k+", "Hot; pays aggressively; explosive revenue."),
    ("Databricks", "startup_infra", "P1", "Software Engineer", "200-280k", "High new-grad band; near-IPO."),
    ("Modal Labs", "startup_infra", "P2", "Software Engineer", "180-250k+eq", "Serverless GPU infra; deep systems."),
    ("Baseten", "startup_infra", "P2", "Software Engineer", "180-250k+eq", "Inference infra; fast-scaling ($11-13B)."),
    ("Together AI", "startup_infra", "P2", "Software Engineer", "180-250k+eq", "Inference/training infra."),
    ("Fireworks AI", "startup_infra", "P2", "Software Engineer", "180-250k+eq", "Inference infra; technically deep."),
    ("ClickHouse", "startup_infra", "P2", "Software Engineer", "180-260k+eq", "OLAP database; hard systems/C++."),
    ("Crusoe", "startup_infra", "P2", "Software Engineer", "180-250k+eq", "AI cloud/datacenter infra."),
    ("Lambda Labs", "startup_infra", "P3", "Software Engineer", "170-240k+eq", "GPU cloud; IPO-track."),
    ("Exa", "startup_infra", "P3", "Software Engineer", "180-250k+eq", "Search/retrieval infra for AI."),
    ("Poolside", "startup_infra", "P3", "Software Engineer", "high, variable", "Coding model lab; deep tech."),
    ("Factory AI", "startup_infra", "P3", "Software Engineer", "variable+eq", "Agentic coding; technically hard."),
    # ---------- STARTUPS: AI APP LAYER (high growth, lighter tech) ----------
    ("Ramp", "startup_app", "P3", "Software Engineer", "180-250k+eq", "Fintech; strong growth."),
    ("Harvey", "startup_app", "P3", "Software Engineer", "variable+eq", "Legal AI."),
    ("Sierra", "startup_app", "P3", "Software Engineer", "variable+eq", "Agentic CX."),
    ("Decagon", "startup_app", "P3", "Software Engineer", "variable+eq", "AI customer support; growing fast."),
    ("Clay", "startup_app", "P3", "Software Engineer", "variable+eq", "GTM data."),
    ("Glean", "startup_app", "P3", "Software Engineer", "variable+eq", "Enterprise search."),
    ("Wispr Flow", "startup_app", "P3", "Software Engineer", "variable+eq", "~$2B raise, great growth — but light technical moat (voice UI)."),
    ("TextQL", "startup_app", "P4", "Software Engineer", "variable+eq", "Agentic analytics; technically interesting but early/small."),
    ("Applied Intuition", "startup_app", "P3", "Software Engineer", "200-280k+eq", "AV; pays well. Has a defense arm."),
    # ---------- STARTUPS: ROBOTICS / EMBODIED (deepest tech, higher variance) ----------
    ("Physical Intelligence", "startup_robotics", "P3", "Software Engineer", "high, variable", "Robot foundation models; elite team."),
    ("Skild AI", "startup_robotics", "P3", "Software Engineer", "high, variable", "Robotics foundation models."),
    ("Figure", "startup_robotics", "P3", "Software Engineer", "180-260k+eq", "Humanoid robots; very hard tech."),
    # ---------- AI HARDWARE (compiler/kernel/runtime — only if low-level systems is your thing) ----------
    ("Etched", "ai_hardware", "P3", "Software/Compiler Engineer", "180-250k+eq", "Transformer ASIC."),
    ("Positron", "ai_hardware", "P3", "Software/Compiler Engineer", "variable+eq", ""),
    ("Tenstorrent", "ai_hardware", "P3", "Software/Kernel Engineer", "180-250k+eq", ""),
    ("d-Matrix", "ai_hardware", "P3", "Software/Compiler Engineer", "180-250k+eq", ""),
    ("MatX", "ai_hardware", "P3", "Software/Compiler Engineer", "variable+eq", ""),
    ("Lightmatter", "ai_hardware", "P3", "Software Engineer", "180-250k+eq", "Photonic compute."),
    ("Rivos", "ai_hardware", "P3", "Software Engineer", "180-250k+eq", ""),
    # ---------- SAFETY NET / BRAND ----------
    ("Meta", "safety_net", "P2", "Software Engineer (E3)", "190k", "Your return — take it, leverage it."),
    ("Netflix", "safety_net", "P3", "Software Engineer", "300k+ cash", "Rarely hires new grads; high cash if so."),
    ("Nvidia", "safety_net", "P3", "Software Engineer", "150-200k", "Good for AI-hardware-adjacent dev."),
    ("Notion", "safety_net", "P3", "Software Engineer", "180-230k", ""),
    ("Pinterest", "safety_net", "P3", "Software Engineer", "180-230k", ""),
]

def main():
    with open("applications.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        for company, category, priority, role, tc, notes in ROWS:
            w.writerow({
                "company": company, "category": category, "priority": priority,
                "dev_role_to_search": role, "expected_tc": tc,
                "ats": "", "board_token": "", "careers_url": "",
                "status": "not_started", "date_applied": "", "referral": "", "notes": notes,
            })
    print(f"Wrote applications.csv with {len(ROWS)} firms.")

if __name__ == "__main__":
    main()
