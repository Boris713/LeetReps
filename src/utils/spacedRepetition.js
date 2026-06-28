// spaced repetition logic for LeetCode problems.
//
// approach: a fixed interval "ladder" plus a confidence rating, which is the
// approach most LeetCode SR tools use (simpler than Anki's SM-2/FSRS, and a
// better fit because coding problems are few and complex). each problem sits on
// a rung (`level`). after you redo it you rate it, which moves you along the
// ladder. the next review is due `intervals[level]` days after you last did it.

// days between reviews at each rung. past the last rung = mastered.
export const INTERVALS = [1, 3, 7, 14, 30]

// move along the ladder based on how the review felt.
//  - hard: drop back a rung (see it sooner)
//  - good: advance one rung
//  - easy: skip ahead two rungs
export function nextLevel(level, rating) {
  if (rating === 'hard') return Math.max(0, level - 1)
  if (rating === 'easy') return level + 2
  return level + 1 // good
}

// a level at or beyond the ladder length means the problem is mastered.
export function isMastered(level) {
  return level >= INTERVALS.length
}

// strip the time component so "due" comparisons are by calendar day.
function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// the date a problem should next be reviewed.
export function nextReviewDate(problem) {
  const days = INTERVALS[Math.min(problem.level, INTERVALS.length - 1)]
  const due = startOfDay(problem.lastReviewed)
  due.setDate(due.getDate() + days)
  return due
}

// whole days until the next review (negative = overdue, 0 = today).
export function daysUntilDue(problem, today = new Date()) {
  const diffMs = nextReviewDate(problem) - startOfDay(today)
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

// a problem is due if it isn't mastered and its review date has arrived.
export function isDue(problem, today = new Date()) {
  if (problem.mastered) return false
  return daysUntilDue(problem, today) <= 0
}

// human-friendly label for a card's schedule.
export function dueLabel(problem) {
  if (problem.mastered) return 'Mastered'
  const days = daysUntilDue(problem)
  if (days < 0) return `Overdue by ${Math.abs(days)}d`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days}d`
}
