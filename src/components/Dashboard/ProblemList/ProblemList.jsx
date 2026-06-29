import { useState } from 'react'
import ProblemCard from './ProblemCard/ProblemCard.jsx'
import { isDue } from '../../../utils/spacedRepetition.js'
import './ProblemList.css'

const FILTERS = ['All', 'Due', 'Mastered']

/**
 * ProblemList owns the active filter locally and renders a filtered
 * subset of the problems array.
 */
function ProblemList({ problems, onReview, onRemove, onCardClick }) {
  const [filter, setFilter] = useState('All')

  const visible = problems.filter((p) => {
    if (filter === 'Due') return isDue(p)
    if (filter === 'Mastered') return p.mastered
    return true
  })

  // if onCardClick is provided, cards are in history mode (clickable, no buttons).
  const mode = onCardClick ? 'history' : 'list'

  return (
    <section className="list">
      <div className="list__head">
        <h2 className="list__title mono">All problems</h2>
        <div className="list__filters">
          {FILTERS.map((option) => (
            <button
              key={option}
              className={`list__filter ${filter === option ? 'is-active' : ''}`}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="list__empty">No problems match this filter.</p>
      ) : (
        <div className="list__items">
          {visible.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              mode={mode}
              onReview={onReview}
              onRemove={onRemove}
              onSelect={onCardClick}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProblemList
