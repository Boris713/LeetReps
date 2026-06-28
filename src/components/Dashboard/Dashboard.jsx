import ReviewQueue from './ReviewQueue/ReviewQueue.jsx'
import GoalTracker from './GoalTracker/GoalTracker.jsx'
import AddProblemForm from './AddProblemForm/AddProblemForm.jsx'
import ProblemList from './ProblemList/ProblemList.jsx'
import { isDue } from '../../utils/spacedRepetition.js'
import './Dashboard.css'

/**
 * Dashboard is a mid-level parent. It receives all data + callbacks from App,
 * derives the "due today" subset, and hands the right pieces to each child.
 */
function Dashboard({
  problems,
  goal,
  reviewLog,
  onAddProblem,
  onReview,
  onRemove,
  onGoalChange,
}) {
  // Derived state: which problems are due for review right now.
  const dueProblems = problems.filter((p) => isDue(p))

  return (
    <section className="dashboard">
      {/* Hero: today's review queue. */}
      <ReviewQueue problems={dueProblems} onReview={onReview} />

      <div className="dashboard__grid">
        <div className="dashboard__side">
          <GoalTracker
            goal={goal}
            reviewLog={reviewLog}
            onGoalChange={onGoalChange}
          />
          <AddProblemForm onAddProblem={onAddProblem} />
        </div>

        <ProblemList
          problems={problems}
          onReview={onReview}
          onRemove={onRemove}
        />
      </div>
    </section>
  )
}

export default Dashboard
