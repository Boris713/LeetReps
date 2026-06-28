import ProblemCard from '../ProblemList/ProblemCard/ProblemCard.jsx'
import './ReviewQueue.css'

/**
 * ReviewQueue renders the problems that are due today by mapping over the array
 * it receives. Each one is a ProblemCard in "review" mode (rating buttons on).
 */
function ReviewQueue({ problems, onReview }) {
  return (
    <section className="queue">
      <div className="queue__head">
        <h2 className="queue__title mono">Due for review</h2>
        <span className="queue__count">{problems.length} today</span>
      </div>

      {problems.length === 0 ? (
        <p className="queue__empty">
          Nothing due right now. Add a problem or come back tomorrow.
        </p>
      ) : (
        <div className="queue__list">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              mode="review"
              onReview={onReview}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ReviewQueue
