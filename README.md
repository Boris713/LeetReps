# LeetReps - LeetCode Spaced Repetition Tracker

A single-page React dashboard for practicing LeetCode with spaced repetition.
Add problems you've solved, and LeetReps schedules each one to resurface right
before you'd forget it. Redo it, rate how it felt, and the interval grows. Your
data is saved in the browser with no backend needed.

## Run it locally

```bash
npm install
npm run dev
```

```bash
npm run build && npm run preview   # production build
```

## How it works

All state lives in a single App component because Dashboard and Log both need to
read and update the same problems array. App passes data and callbacks down as
props and each child only gets what it needs. Every update flows back up through
a callback, keeping a clean one-way data flow.

The scheduling uses a fixed interval ladder of 1, 3, 7, 14, and 30 days instead
of a heavier algorithm like Anki's FSRS. After a review you rate it Hard, Good,
or Easy, which moves the problem along the ladder. Good advances one rung, Easy
skips two, Hard drops back one. Past the last rung it flips to mastered.

## Assignment requirements

| Requirement                       | Where it lives                                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **5+ functional components**      | Header, Dashboard, ReviewQueue, GoalTracker, AddProblemForm, ProblemList, ProblemCard, Log, ProblemTable, ProblemModal, About (11 total) |
| **Parent → child hierarchy**      | Dashboard/ProblemList/ProblemCard, Log/ProblemTable, Log/ProblemModal                                          |
| **Props (data + callbacks down)** | App → Dashboard/Log → their children                                                                            |
| **useState (3+ uses)**            | view, problems, goal, reviewLog (App) + filter (ProblemList) + selectedId (Log) + form (AddProblemForm) + notes (ProblemModal) |
| **Controlled form**               | AddProblemForm and the notes editor in ProblemModal                                                             |
| **2+ conditional views**          | Dashboard / Log / About switched by view state, no React Router                                                |
| **Dynamic .map()**                | ReviewQueue, ProblemList, ProblemTable, rating buttons in ProblemCard, steps and ladder in About               |
| **CSS styling, responsive**       | per-component .css files + design tokens in index.css                                                           |

## Component tree

```
App
├── Header                        (view switcher: Dashboard / Log / About)
├── Dashboard
│   ├── ReviewQueue               (problems due today → ProblemCard)
│   ├── GoalTracker               (controlled goal input + progress bar)
│   ├── AddProblemForm            (controlled form)
│   └── ProblemList               (filterable card list → ProblemCard)
├── Log
│   ├── ProblemTable              (clickable rows → opens modal)
│   └── ProblemModal              (details + editable notes)
└── About                         (explains the spaced repetition method)
```
