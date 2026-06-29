# Interview Prep — Priority Targets (Boris)

Tailored to a dev with low-level/compiler + ML background. Patterns below are from public
guides + recent candidate reports; your recruiter is always the source of truth for your loop.

---

## 1. Quant SWE (Jane Street, HRT, Citadel Securities, Two Sigma, Jump...)

**Shape of the loop:** OA → 1 phone screen → onsite (final). HRT's onsite is ~5–6 interviews;
Jane Street's is a full day of 3–4 long coding rounds (~70 min each, often two interviewers).

**The OA is the real filter.** HRT/Citadel-style OAs are HackerRank/CodeSignal, 2–3 hard problems,
deliberately tighter on time than FAANG — they grade correctness *and* speed. HRT's own reported
OA pass rate is roughly 5–10%. This is the wall most people hit, so over-index your prep here.

**Two distinct styles once you're past the OA:**
- **Jane Street** = collaborative, single-problem-extended. They start you on a base solution and
  layer new requirements on top; the round is about how you *extend and explain* your code, not how
  far you get. Hints are fine and expected. Use your strongest language — they explicitly tell you
  NOT to try OCaml for the first time in the interview, and most SWEs join with no FP background.
  Example prompts reported: implement Connect Four then generalize to Connect-K; implement a Merkle
  tree and extend it. Maps naturally to clean OOP.
- **HRT (and HFT shops)** = harder, systems-flavored. C++ is essentially required for SWE/algo roles.
  Rounds include a technical discussion on **systems/data-structures/problem-solving** (memory, I/O,
  process management — "what's happening under the hood") plus programming rounds. They want idiomatic,
  resource-aware, readable code. Candidates routinely call these harder than FAANG.

**Your edge:** your MTIA/compiler background is *exactly* the systems-level signal HRT-type shops want.
Lean into the low-level fluency — it's rarer than LeetCode grind and differentiates you.

**Prep focus:** DS&A mediums→hards under time pressure (this is your rust-removal), in **C++** for the
HFT shops; plus OS/memory/concurrency fundamentals for the systems discussion rounds.

---

## 2. AI Labs (OpenAI, DeepMind, xAI)

**OpenAI new-grad SWE loop:** OA → coding screen → final (a second coding round + behavioral),
~4–5 stages, wrapping in roughly a month once it starts. Team matching happens **after** the offer.

**The coding is *practical*, not LeetCode-trivia.** Reported pattern: multi-part problems where you
must pass each part's tests before the next unlocks — so get something working fast, don't burn time
pseudocoding early parts. The final coding round is often **object-oriented / class design extended
iteratively** (e.g., a chatbot-interface design that grows), closer to a real engineering task than
classic DSA. Correctness and clean edge-case handling > raw speed. CoderPad-style; tell the recruiter
your language ahead of time. A frequently reported question is implementing an LRU cache.

**System design shows up** even below senior in some loops — production-flavored ("reliability,
fault tolerance, scaling ML workloads"), not "design Instagram."

**"Why OpenAI / how could AI go wrong" comes up in nearly every loop.** Have a genuine, specific
point of view on the mission and on AI safety ready — this is graded, not filler. Same applies to
DeepMind/xAI culturally.

**Project deep-dive:** be ready to go deep on your strongest project (your MTIA coverage pipeline is
a great one) under rapid follow-up — what *you* did, why you made each call, tradeoffs.

**Your edge:** lab SWE work is infra/platform/backend-heavy; your compiler + systems background fits
the "applied engineering" org well, and your ML research gives you credible mission-fit talking points.

---

## 3. Etched / AI-hardware startups (Tenstorrent, d-Matrix, MatX...)

**Expect a bespoke, recruiter-driven process** — early-stage hardware startups don't run a fixed
new-grad loop. For Etched specifically, your recruiter (Ben) said he'd walk you through it; that IS
the process, so ask him directly for: number of rounds, who you meet, coding-vs-systems split, timeline.

**Likely components** (based on the role you're targeting — compiler/runtime):
- A coding round (C++ heavy for systems/compiler roles).
- A systems / low-level discussion — memory model, performance, how hardware and software meet. This
  is where your MTIA work is a direct, almost unfair advantage; talk DWARF, simulator-vs-silicon,
  instrumentation, kernel coverage.
- A deep project conversation on exactly that MTIA work.
- Possibly a compiler/architecture-specific round (IR, codegen, scheduling) if the role is on the
  toolchain.

**Prep focus:** less LeetCode, more "can you reason about a compiler/runtime for an accelerator."
You're closer to ready for this than for a cold quant OA — your day job *is* the prep.

---

## Prep plan (you've got runway — cycles open ~July–Sept; you're rusty but not cold)

1. **Weeks 1–2 — rust removal.** Easy/medium arrays, strings, hashmaps, two-pointers, sliding window.
   Rebuild speed first; don't start at DP. Do these in C++ if you're targeting HFT shops.
2. **Weeks 3–5 — back to your level + past it.** Graphs, DP, then harder mediums/easy-hards under a
   timer. The quant OA bar is a notch above FAANG, so push into tighter time-boxed reps.
3. **Ongoing — systems & language internals.** OS/memory/concurrency for HRT-style rounds; for OpenAI,
   your primary language's internals (iterators/generators/async if Python; RAII/move/templates if C++).
4. **Ongoing — two non-LeetCode tracks:** (a) one crisp, deeply-rehearsed project story (MTIA), with
   answers ready for rapid follow-up; (b) a real "why this mission" answer for the labs.
5. **Light touch — probability refresher** only if any target leans HFT and adds a quant-flavored round.

**Reusability:** strong-SWE prep (DS&A + systems + clean code) is the same prep for quant SWE, lab SWE,
*and* your big-tech fallback. You are not splitting effort across unrelated skill sets.
