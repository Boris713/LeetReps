import { useState, useEffect } from 'react'
import { dueLabel, INTERVALS } from '../../../utils/spacedRepetition.js'
import { daysAgoLabel } from '../../../utils/dates.js'
import { getPatternStyle, COMMON_PATTERNS } from '../../../utils/patternColors.js'
import './ProblemModal.css'

const LIST_OPTIONS = ['NeetCode 150', 'Blind 75', 'LeetCode', 'Other']
const DIFF_OPTIONS = ['Easy', 'Medium', 'Hard']
const TIME_OPTIONS = ['<10 min', '10-20 min', '20-30 min', '>30 min']

function ProblemModal({ problem, onClose, onUpdateProblem, onRemove }) {
  const [title, setTitle]         = useState(problem.title)
  const [patterns, setPatterns]   = useState(
    problem.patterns?.length ? problem.patterns : problem.pattern ? [problem.pattern] : []
  )
  const [tagInput, setTagInput]   = useState('')
  const [difficulty, setDiff]     = useState(problem.difficulty)
  const [myDiff, setMyDiff]       = useState(problem.myDifficulty || 'Easy')
  const [timeTaken, setTimeTaken] = useState(problem.timeTaken || '<10 min')
  const [lists, setLists]         = useState(
    problem.lists ?? (problem.platform ? [problem.platform] : [])
  )
  const [leetcodeUrl, setLcUrl]   = useState(problem.leetcodeUrl || '')
  const [neetcodeUrl, setNcUrl]   = useState(problem.neetcodeUrl || '')
  const [notes, setNotes]         = useState(problem.notes || '')
  const [saved, setSaved]         = useState(false)

  // close on Escape key.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const addPattern = (raw) => {
    const p = raw.trim().toLowerCase()
    if (p && !patterns.includes(p)) setPatterns(c => [...c, p])
    setTagInput('')
  }
  const removePattern = (p) => setPatterns(c => c.filter(x => x !== p))
  const toggleList    = (l) => setLists(c => c.includes(l) ? c.filter(x => x !== l) : [...c, l])

  const handleSave = () => {
    onUpdateProblem(problem.id, {
      title, patterns, difficulty, myDifficulty: myDiff, timeTaken, lists, leetcodeUrl, neetcodeUrl, notes,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const level    = problem.level ?? 0
  const interval = INTERVALS[Math.min(level, INTERVALS.length - 1)]

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal modal--large" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>

        <input
          className="modal__title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Problem title"
        />

        <div className="modal__sr-stats">
          <span>{problem.reviewCount || 0} reps</span>
          <span className="modal__sr-sep">·</span>
          <span>last: {problem.lastRating ?? '—'}</span>
          <span className="modal__sr-sep">·</span>
          <span>{daysAgoLabel(problem.lastReviewed)}</span>
          <span className="modal__sr-sep">·</span>
          <span className="modal__sr-due">{dueLabel(problem)}</span>
        </div>

        <div className="prop-list">
          <div className="prop-row">
            <span className="prop-label">Difficulty</span>
            <div className="prop-value">
              {DIFF_OPTIONS.map(opt => (
                <button key={opt} type="button"
                  className={`select-chip diff-${opt.toLowerCase()} ${difficulty === opt ? 'is-active' : ''}`}
                  onClick={() => setDiff(opt)}
                >{opt}</button>
              ))}
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">My difficulty</span>
            <div className="prop-value">
              {DIFF_OPTIONS.map(opt => (
                <button key={opt} type="button"
                  className={`select-chip diff-${opt.toLowerCase()} ${myDiff === opt ? 'is-active' : ''}`}
                  onClick={() => setMyDiff(opt)}
                >{opt}</button>
              ))}
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">Time taken</span>
            <div className="prop-value">
              {TIME_OPTIONS.map(opt => (
                <button key={opt} type="button"
                  className={`select-chip ${timeTaken === opt ? 'is-active is-neutral' : ''}`}
                  onClick={() => setTimeTaken(opt)}
                >{opt}</button>
              ))}
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">Level</span>
            <div className="prop-value">
              <div className="level-track">
                {INTERVALS.map((_, i) => (
                  <span key={i} className={`level-dot ${
                    i < level ? 'is-filled' : i === level && !problem.mastered ? 'is-current' : ''
                  }`} />
                ))}
                <span className="level-label">
                  {problem.mastered
                    ? 'mastered'
                    : `rung ${level + 1} of ${INTERVALS.length} · review every ${interval}d`}
                </span>
              </div>
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">Lists</span>
            <div className="prop-value">
              {LIST_OPTIONS.map(opt => (
                <button key={opt} type="button"
                  className={`select-chip ${lists.includes(opt) ? 'is-active is-neutral' : ''}`}
                  onClick={() => toggleList(opt)}
                >{opt}</button>
              ))}
            </div>
          </div>

          <div className="prop-row prop-row--stretch">
            <span className="prop-label">Patterns</span>
            <div className="prop-value prop-value--col">
              <div className="tag-input">
                {patterns.map(p => {
                  const s = getPatternStyle(p)
                  return (
                    <span key={p} className="pattern-pill" style={{ background: s.bg, color: s.color }}>
                      {p}
                      <button type="button" className="pattern-pill__remove" onClick={() => removePattern(p)}>×</button>
                    </span>
                  )
                })}
                <input
                  className="tag-input__field"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addPattern(tagInput) }
                  }}
                  placeholder={patterns.length === 0 ? 'type or pick below…' : ''}
                />
              </div>
              <div className="pattern-chips">
                {COMMON_PATTERNS.map(p => {
                  const s = getPatternStyle(p)
                  const active = patterns.includes(p)
                  return (
                    <button key={p} type="button"
                      className={`pattern-chip ${active ? 'is-active' : ''}`}
                      style={active ? { background: s.bg, color: s.color, borderColor: s.color } : {}}
                      onClick={() => active ? removePattern(p) : addPattern(p)}
                    >{p}</button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">LeetCode</span>
            <div className="prop-value prop-value--url">
              <input
                className="prop-url-input"
                type="url"
                value={leetcodeUrl}
                onChange={e => setLcUrl(e.target.value)}
                placeholder="paste link…"
              />
              {leetcodeUrl && (
                <a href={leetcodeUrl} target="_blank" rel="noreferrer" className="prop-url-link">↗</a>
              )}
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">Video</span>
            <div className="prop-value prop-value--url">
              <input
                className="prop-url-input"
                type="url"
                value={neetcodeUrl}
                onChange={e => setNcUrl(e.target.value)}
                placeholder="NeetCode video link…"
              />
              {neetcodeUrl && (
                <a href={neetcodeUrl} target="_blank" rel="noreferrer" className="prop-url-link">↗</a>
              )}
            </div>
          </div>
        </div>

        <div className="modal__notes-section">
          <span className="modal__notes-label">Notes</span>
          <textarea
            className="modal__notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="key idea, edge cases, where you got stuck…"
            rows={4}
          />
        </div>

        <div className="modal__actions">
          <button className="modal__remove" onClick={() => onRemove(problem.id)}>Remove</button>
          <button className="modal__save" onClick={handleSave}>{saved ? 'Saved ✓' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

export default ProblemModal
