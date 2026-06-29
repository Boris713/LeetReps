import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Log from './components/Log/Log.jsx'
import Companies from './components/Companies/Companies.jsx'
import About from './components/About/About.jsx'
import seedProblems from './data/seedProblems.js'
import { dbLoad, dbSave } from './utils/db.js'
import { nextLevel, isMastered } from './utils/spacedRepetition.js'
import './App.css'

function App() {
  // useState #1 - string "mode" variable that switches the visible view.
  const [view, setView]             = useState('dashboard')

  // useState #2 - false until Supabase data has loaded; shows a spinner meanwhile.
  const [ready, setReady]           = useState(false)

  // useState #3 - the dynamic array of problems.
  const [problems, setProblems]     = useState(seedProblems)

  // useState #4 - the weekly review goal.
  const [goal, setGoal]             = useState(15)

  // useState #5 - a log of review timestamps, used to measure goal progress.
  const [reviewLog, setReviewLog]   = useState([])

  // useState #6 - per-company tracking data (status, notes, referral, dateApplied).
  const [companyData, setCompanyData] = useState({})

  // load all data from Supabase on first render.
  useEffect(() => {
    Promise.all([
      dbLoad('problems',  seedProblems),
      dbLoad('goal',      15),
      dbLoad('log',       []),
      dbLoad('companies', {}),
    ]).then(([p, g, l, c]) => {
      setProblems(p)
      setGoal(g)
      setReviewLog(l)
      setCompanyData(c)
      setReady(true)
    })
  }, [])

  // sync each state slice to Supabase whenever it changes.
  // the `ready` guard prevents overwriting cloud data with defaults during load.
  useEffect(() => { if (ready) dbSave('problems',  problems)    }, [problems,  ready])
  useEffect(() => { if (ready) dbSave('goal',      goal)        }, [goal,      ready])
  useEffect(() => { if (ready) dbSave('log',       reviewLog)   }, [reviewLog, ready])
  useEffect(() => { if (ready) dbSave('companies', companyData) }, [companyData, ready])

  // add a new problem (called by the controlled form).
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
        patterns: [],
        lists: [],
        myDifficulty: 'Easy',
        timeTaken: '<10 min',
        ...problem,
      },
      ...current,
    ])
  }

  // record a review: advance the SR level, reset the clock, log the rep.
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

  // save edits to any problem fields (called from the detail modal).
  const updateProblem = (id, updates) => {
    setProblems((current) =>
      current.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    )
  }

  // save edits to a company entry (status, notes, referral, dateApplied).
  const updateCompany = (name, updates) => {
    setCompanyData((cur) => ({ ...cur, [name]: { ...(cur[name] || {}), ...updates } }))
  }

  // export everything to a single JSON file — commit this to git as a manual backup.
  const exportAll = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      problems,
      goal,
      reviewLog,
      companies: companyData,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `leetreps-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // import from a previously exported backup file.
  const importAll = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.problems)  setProblems(data.problems)
        if (data.goal)      setGoal(data.goal)
        if (data.reviewLog) setReviewLog(data.reviewLog)
        if (data.companies) setCompanyData(data.companies)
      } catch { /* ignore malformed file */ }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (!ready) {
    return <div className="app-loading"><span className="mono">Loading…</span></div>
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} onViewChange={setView} onExport={exportAll} onImport={importAll} />

      <main className="app-main">
        {/* conditional multi-view layout - a state variable, no router. */}
        {view === 'dashboard' && (
          <Dashboard
            problems={problems}
            goal={goal}
            reviewLog={reviewLog}
            onReview={reviewProblem}
            onGoalChange={setGoal}
          />
        )}
        {view === 'history' && (
          <Log
            problems={problems}
            onAddProblem={addProblem}
            onUpdateProblem={updateProblem}
            onRemove={removeProblem}
          />
        )}
        {view === 'companies' && (
          <Companies companyData={companyData} onUpdateCompany={updateCompany} />
        )}
        {view === 'about' && <About />}
      </main>
    </div>
  )
}

export default App
