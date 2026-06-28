import { dueLabel } from '../../../utils/spacedRepetition.js'
import { shortDate, daysAgoLabel } from '../../../utils/dates.js'
import './ProblemTable.css'

// capitalize a rating value for display ("good" -> "Good").
function ratingLabel(rating) {
  if (!rating) return '—'
  return rating.charAt(0).toUpperCase() + rating.slice(1)
}

/**
 * ProblemTable renders every problem as a spreadsheet row by mapping over the
 * array. each row is clickable and reports its id up through onRowClick.
 */
function ProblemTable({ problems, onRowClick }) {
  if (problems.length === 0) {
    return <p className="table__empty">No problems yet. Add some from the Dashboard.</p>
  }

  return (
    <div className="table__scroll">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Problem</th>
            <th>Difficulty</th>
            <th>Pattern</th>
            <th>List</th>
            <th>Reps</th>
            <th>Last rating</th>
            <th>Last done</th>
            <th>Next due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p, i) => (
            <tr key={p.id} className="table__row" onClick={() => onRowClick(p.id)}>
              <td className="mono table__muted">{i + 1}</td>
              <td className="table__name">
                {p.title}
                {p.notes ? <span className="table__note" title="Has notes">📝</span> : null}
              </td>
              <td>
                <span className={`tag tag--${p.difficulty.toLowerCase()}`}>
                  {p.difficulty}
                </span>
              </td>
              <td className="table__muted">{p.pattern}</td>
              <td className="table__muted">{p.platform}</td>
              <td className="mono">{p.reviewCount || 0}</td>
              <td className={`rating rating--${p.lastRating || 'none'}`}>
                {ratingLabel(p.lastRating)}
              </td>
              <td className="table__muted mono" title={shortDate(p.lastReviewed)}>
                {daysAgoLabel(p.lastReviewed)}
              </td>
              <td className="mono">{dueLabel(p)}</td>
              <td>
                <span className={`status ${p.mastered ? 'status--done' : ''}`}>
                  {p.mastered ? 'Mastered' : 'Learning'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProblemTable
