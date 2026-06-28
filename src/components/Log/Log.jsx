import { useState } from 'react'
import ProblemTable from './ProblemTable/ProblemTable.jsx'
import ProblemModal from './ProblemModal/ProblemModal.jsx'
import './Log.css'

/**
 * Log is the third view: a spreadsheet of every problem you've worked on. It
 * owns one piece of local state — which row's modal is open — and passes the
 * selected problem plus callbacks down to the modal.
 */
function Log({ problems, onUpdateNotes, onRemove }) {
  // useState: the id of the problem whose detail modal is open (null = closed).
  const [selectedId, setSelectedId] = useState(null)

  const selected = problems.find((p) => p.id === selectedId) || null

  return (
    <section className="log">
      <div className="log__head">
        <h2 className="log__title mono">Problem log</h2>
        <span className="log__count">{problems.length} problems</span>
      </div>
      <p className="log__hint">Click any row to view details and edit notes.</p>

      <ProblemTable problems={problems} onRowClick={setSelectedId} />

      {selected && (
        <ProblemModal
          problem={selected}
          onClose={() => setSelectedId(null)}
          onUpdateNotes={onUpdateNotes}
          onRemove={(id) => {
            onRemove(id)
            setSelectedId(null)
          }}
        />
      )}
    </section>
  )
}

export default Log
