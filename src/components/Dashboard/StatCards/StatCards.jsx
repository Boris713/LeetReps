import { isDue, calcStreak } from '../../../utils/spacedRepetition.js'
import './StatCards.css'

function StatCards({ problems, reviewLog }) {
  const streak = calcStreak(reviewLog)
  const due = problems.filter(isDue).length
  const topics = new Set(
    problems.flatMap(p => p.patterns?.length ? p.patterns : p.pattern ? [p.pattern] : [])
  ).size

  const cards = [
    { label: 'Problems Solved', value: problems.length, color: 'green' },
    { label: 'Day Streak',      value: streak,           color: 'orange' },
    { label: 'Due for Review',  value: due,              color: 'blue' },
    { label: 'Topics Covered',  value: topics,           color: 'purple' },
  ]

  return (
    <div className="stat-cards">
      {cards.map(({ label, value, color }) => (
        <div key={label} className="stat-card">
          <span className={`stat-card__dot stat-card__dot--${color}`} />
          <span className="stat-card__value mono">{value}</span>
          <span className="stat-card__label">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default StatCards
