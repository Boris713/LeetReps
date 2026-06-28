import { dueLabel } from '../../../../utils/spacedRepetition.js'
import './ProblemCard.css'

/**
 * ProblemCard is reused in two places via a `mode` prop:
 *  - mode="review": shows Hard / Good / Easy rating buttons (in the queue)
 *  - mode="list":   shows the schedule + a remove button (in the full list)
 * It receives one problem object plus callbacks through props.
 */
function ProblemCard({ problem, mode, onReview, onRemove }) {
  const difficultyClass = `tag tag--${problem.difficulty.toLowerCase()}`

  return (
    <article className="problem">
      <div className="problem__main">
        <div className="problem__row">
          <span className={difficultyClass}>{problem.difficulty}</span>
          <span className="problem__pattern">{problem.pattern}</span>
        </div>

        <h3 className="problem__title mono">{problem.title}</h3>

        <div className="problem__meta">
          <span>{problem.platform}</span>
          {problem.url && (
            <a href={problem.url} target="_blank" rel="noreferrer">
              ▶ NeetCode
            </a>
          )}
          <span className={`problem__due ${problem.mastered ? 'is-mastered' : ''}`}>
            {dueLabel(problem)}
          </span>
        </div>
      </div>

      {mode === 'review' ? (
        <div className="problem__ratings">
          <button
            className="rate rate--hard"
            onClick={() => onReview(problem.id, 'hard')}
          >
            Hard
          </button>
          <button
            className="rate rate--good"
            onClick={() => onReview(problem.id, 'good')}
          >
            Good
          </button>
          <button
            className="rate rate--easy"
            onClick={() => onReview(problem.id, 'easy')}
          >
            Easy
          </button>
        </div>
      ) : (
        <button
          className="problem__remove"
          onClick={() => onRemove(problem.id)}
          aria-label={`Remove ${problem.title}`}
        >
          ✕
        </button>
      )}
    </article>
  )
}

export default ProblemCard
