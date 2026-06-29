import { useState } from 'react'
import ProblemList from '../Dashboard/ProblemList/ProblemList.jsx'
import ProblemModal from './ProblemModal/ProblemModal.jsx'
import AddProblemForm from '../Dashboard/AddProblemForm/AddProblemForm.jsx'
import './Log.css'

/**
 * Log is the third view: a spreadsheet of every problem you've worked on. it
 * owns one piece of local state - which row's modal is open - and passes the
 * selected problem plus callbacks down to the modal.
 */
function Log({ problems, onAddProblem, onUpdateProblem, onRemove }) {
  // useState: the id of the problem whose detail modal is open (null = closed).
  const [selectedId, setSelectedId] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const selected = problems.find((p) => p.id === selectedId) || null

  return (
    <section className="log">
      <div className="log__head">
        <h1 className="log__title">History</h1>
        <button className="log__add-btn" onClick={() => setIsAddOpen(true)}>
          + Add Problem
        </button>
      </div>

      <ProblemList
        problems={problems}
        onCardClick={setSelectedId}
      />

      {isAddOpen && (
        <div className="modal__backdrop" onClick={() => setIsAddOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setIsAddOpen(false)}>✕</button>
            <AddProblemForm
              onAddProblem={(p) => {
                onAddProblem(p)
                setIsAddOpen(false)
              }}
            />
          </div>
        </div>
      )}

      {selected && (
        <ProblemModal
          problem={selected}
          onClose={() => setSelectedId(null)}
          onUpdateProblem={onUpdateProblem}
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
