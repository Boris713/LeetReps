import StatCards from './StatCards/StatCards.jsx'
import ReviewQueue from './ReviewQueue/ReviewQueue.jsx'
import GoalTracker from './GoalTracker/GoalTracker.jsx'
import { isDue } from '../../utils/spacedRepetition.js'
import './Dashboard.css'

/**
 * Dashboard is a mid-level parent. it receives all data + callbacks from App,
 * derives the "due today" subset, and hands the right pieces to each child.
 */
function Dashboard({ problems, goal, reviewLog, onReview, onGoalChange }) {
  // derived state: which problems are due for review right now.
  const dueProblems = problems.filter((p) => isDue(p))

  return (
    <section className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>
      <StatCards problems={problems} reviewLog={reviewLog} />
      <GoalTracker goal={goal} reviewLog={reviewLog} onGoalChange={onGoalChange} />
      <ReviewQueue problems={dueProblems} onReview={onReview} />
    </section>
  )
}

export default Dashboard
