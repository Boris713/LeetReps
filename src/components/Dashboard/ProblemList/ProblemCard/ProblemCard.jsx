import { dueLabel } from '../../../../utils/spacedRepetition.js'
import { getPatternStyle } from '../../../../utils/patternColors.js'
import './ProblemCard.css'

/**
 * ProblemCard is reused in two places via a `mode` prop:
 *  - mode="review":  shows Hard / Good / Easy rating buttons (in the queue)
 *  - mode="history": whole card is clickable, opens edit modal
 */
function ProblemCard({ problem, mode, onReview, onSelect }) {
  const patterns = problem.patterns?.length
    ? problem.patterns
    : problem.pattern ? [problem.pattern] : []

  const lists = problem.lists ?? (problem.platform ? [problem.platform] : [])

  return (
    <article
      className={`problem ${mode === 'history' ? 'problem--clickable' : ''}`}
      onClick={mode === 'history' ? () => onSelect(problem.id) : undefined}
    >
      <div className="problem__main">
        <div className="problem__row">
          <span className={`tag tag--${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          {patterns.map(p => {
            const s = getPatternStyle(p)
            return (
              <span key={p} className="pattern-pill" style={{ background: s.bg, color: s.color }}>{p}</span>
            )
          })}
        </div>

        <h3 className="problem__title mono">{problem.title}</h3>

        <div className="problem__meta">
          {lists.map(l => (
            <span key={l} className="problem__list-badge">{l}</span>
          ))}
          {problem.leetcodeUrl && (
            <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
              LeetCode ↗
            </a>
          )}
          <span className={`problem__due ${problem.mastered ? 'is-mastered' : ''}`}>
            {dueLabel(problem)}
          </span>
        </div>
      </div>

      {mode === 'review' && (
        <div className="problem__ratings">
          {['hard', 'good', 'easy'].map(r => (
            <button key={r} className={`rate rate--${r}`} onClick={() => onReview(problem.id, r)}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      )}
    </article>
  )
}

export default ProblemCard
