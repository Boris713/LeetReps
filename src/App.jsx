import { useState, useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Log from './components/Log/Log.jsx'
import About from './components/About/About.jsx'
import seedProblems from './data/seedProblems.js'
import { loadState, saveState } from './utils/storage.js'
import { nextLevel, isMastered } from './utils/spacedRepetition.js'
import './App.css'

/**
 * App is the single source of truth. It owns every piece of shared state,
 * persists it to localStorage, and passes data + callbacks DOWN to children
 * through read-only props.
 */
function App() {
  // useState #1 — string "mode" variable that switches the visible view.
  const [view, setView] = useState('dashboard')

  // useState #2 — the dynamic array of problems (loaded from storage if present).
  const [problems, setProblems] = useState(() =>
    loadState('leetreps.problems', seedProblems),
  )

  // useState #3 — the weekly review goal.
  const [goal, setGoal] = useState(() => loadState('leetreps.goal', 15))

  // useState #4 — a log of review timestamps, used to measure goal progress.
  const [reviewLog, setReviewLog] = useState(() =>
    loadState('leetreps.log', []),
  )

  // Persist each slice of state whenever it changes.
  useEffect(() => saveState('leetreps.problems', problems), [problems])
  useEffect(() => saveState('leetreps.goal', goal), [goal])
  useEffect(() => saveState('leetreps.log', reviewLog), [reviewLog])

  // Add a new problem (called by the controlled form).
  const addProblem = (problem) => {
    setProblems((current) => [
      {
        id: Date.now(),
        level: 0,
        lastReviewed: new Date().toISOString(),
        mastered: false,
        lastRating: null,
        reviewCount: 0,
        notes: '',
        ...problem,
      },
      ...current,
    ])
  }

  // Record a review: advance the SR level, reset the clock, log the rep.
  const reviewProblem = (id, rating) => {
    setProblems((current) =>
      current.map((p) => {
        if (p.id !== id) return p
        const level = nextLevel(p.level, rating)
        return {
          ...p,
          level,
          mastered: isMastered(level),
          lastReviewed: new Date().toISOString(),
          lastRating: rating,
          reviewCount: (p.reviewCount || 0) + 1,
        }
      }),
    )
    setReviewLog((log) => [...log, new Date().toISOString()])
  }

  const removeProblem = (id) => {
    setProblems((current) => current.filter((p) => p.id !== id))
  }

  // Save edited notes for a single problem (called from the Log modal).
  const updateNotes = (id, notes) => {
    setProblems((current) =>
      current.map((p) => (p.id === id ? { ...p, notes } : p)),
    )
  }

  return (
    <div className="app-shell">
      <Header view={view} onViewChange={setView} />

      <main className="app-main">
        {/* Conditional multi-view layout — a state variable, no router. */}
        {view === 'dashboard' && (
          <Dashboard
            problems={problems}
            goal={goal}
            reviewLog={reviewLog}
            onAddProblem={addProblem}
            onReview={reviewProblem}
            onRemove={removeProblem}
            onGoalChange={setGoal}
          />
        )}
        {view === 'log' && (
          <Log
            problems={problems}
            onUpdateNotes={updateNotes}
            onRemove={removeProblem}
          />
        )}
        {view === 'about' && <About />}
      </main>

      <footer className="app-footer mono">
        LeetReps · solve it, rate it, see it again right before you forget.
      </footer>
    </div>
  )
}

export default App
