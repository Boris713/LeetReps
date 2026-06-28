import { useState, useEffect } from 'react'
import { dueLabel, INTERVALS } from '../../../utils/spacedRepetition.js'
import { shortDate, daysAgoLabel } from '../../../utils/dates.js'
import './ProblemModal.css'

function ratingLabel(rating) {
  if (!rating) return '—'
  return rating.charAt(0).toUpperCase() + rating.slice(1)
}

/**
 * ProblemModal pops up when a table row is clicked. the notes textarea is a
 * controlled input (its value lives in local state); save sends the text up to
 * App via onUpdateNotes. Esc or a backdrop click closes it.
 */
function ProblemModal({ problem, onClose, onUpdateNotes, onRemove }) {
  // controlled notes field, seeded from the problem's saved notes.
  const [notes, setNotes] = useState(problem.notes || '')
  const [saved, setSaved] = useState(false)

  // close on Escape key.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSave = () => {
    onUpdateNotes(problem.id, notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const stats = [
    { label: 'Reps', value: problem.reviewCount || 0 },
    { label: 'Last rating', value: ratingLabel(problem.lastRating) },
    { label: 'Last done', value: daysAgoLabel(problem.lastReviewed) },
    { label: 'Next due', value: dueLabel(problem) },
    {
      label: 'Level',
      value: problem.mastered
        ? 'Mastered'
        : `${problem.level + 1} of ${INTERVALS.length}`,
    },
  ]

  return (
    <div className="modal__backdrop" onClick={onClose}>
      {/* stop clicks inside the dialog from closing it. */}
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal__row">
          <span className={`tag tag--${problem.difficulty.toLowerCase()}`}>
            {problem.difficulty}
          </span>
          <span className="modal__pattern">{problem.pattern}</span>
        </div>
        <h2 className="modal__title mono">{problem.title}</h2>
        <p className="modal__sub">
          {problem.platform}
          {problem.url && (
            <>
              {' · '}
              <a href={problem.url} target="_blank" rel="noreferrer">
                ▶ NeetCode video
              </a>
            </>
          )}
          {' · last reviewed '}
          {shortDate(problem.lastReviewed)}
        </p>

        <div className="modal__stats">
          {stats.map((s) => (
            <div className="modal__stat" key={s.label}>
              <span className="modal__stat-value mono">{s.value}</span>
              <span className="modal__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <label className="modal__notes-label">
          Notes
          <textarea
            className="modal__notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key idea, edge cases, where you got stuck…"
            rows={5}
          />
        </label>

        <div className="modal__actions">
          <button
            className="modal__remove"
            onClick={() => onRemove(problem.id)}
          >
            Remove
          </button>
          <button className="modal__save" onClick={handleSave}>
            {saved ? 'Saved ✓' : 'Save notes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProblemModal
