import './GoalTracker.css'

/**
 * GoalTracker shows progress toward a weekly review goal. the goal value lives
 * in App's state and is passed down with a callback; the number input here is
 * controlled by that prop, so React stays the source of truth.
 */
function GoalTracker({ goal, reviewLog, onGoalChange }) {
  // count reviews logged in the last 7 days.
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const done = reviewLog.filter((iso) => new Date(iso).getTime() >= weekAgo).length
  const percent = goal > 0 ? Math.min(100, Math.round((done / goal) * 100)) : 0

  return (
    <div className="goal">
      <span className="goal__label">Weekly goal</span>
      <span className="goal__count">{done}</span>
      <span className="goal__label">/</span>
      <input
        className="goal__input mono"
        type="number"
        min="1"
        max="200"
        value={goal}
        onChange={(e) => onGoalChange(Number(e.target.value))}
      />
      <span className="goal__label">reviews</span>
      <div className="goal__bar-wrap">
        <div className="goal__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="goal__pct">{percent}%</span>
    </div>
  )
}

export default GoalTracker
