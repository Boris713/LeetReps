import './GoalTracker.css'

/**
 * GoalTracker shows progress toward a weekly review goal. The goal value lives
 * in App's state and is passed down with a callback; the number input here is
 * controlled by that prop, so React stays the source of truth.
 */
function GoalTracker({ goal, reviewLog, onGoalChange }) {
  // Count reviews logged in the last 7 days.
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const doneThisWeek = reviewLog.filter(
    (iso) => new Date(iso).getTime() >= weekAgo,
  ).length

  const percent = goal > 0 ? Math.min(100, Math.round((doneThisWeek / goal) * 100)) : 0

  return (
    <section className="goal">
      <h2 className="goal__title mono">Weekly goal</h2>

      <div className="goal__stat">
        <span className="goal__done mono">{doneThisWeek}</span>
        <span className="goal__slash">/</span>
        <input
          className="goal__input mono"
          type="number"
          min="1"
          max="200"
          value={goal}
          onChange={(e) => onGoalChange(Number(e.target.value))}
        />
        <span className="goal__unit">reviews</span>
      </div>

      <div className="goal__bar">
        <div className="goal__fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="goal__hint">{percent}% of this week's target</p>
    </section>
  )
}

export default GoalTracker
