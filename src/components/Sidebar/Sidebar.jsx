import './Sidebar.css'

const NAV = [
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'history',    label: 'History' },
  { id: 'companies',  label: 'Companies' },
  { id: 'about',      label: 'About' },
]

function Sidebar({ view, onViewChange, onExport, onImport }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo mono">LR</span>
        <span className="sidebar__name">Leet<strong>Reps</strong></span>
      </div>

      <nav className="sidebar__nav">
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            className={`sidebar__item ${view === id ? 'is-active' : ''}`}
            onClick={() => onViewChange(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar__backup">
        <p className="sidebar__backup-label">Data backup</p>
        <button className="sidebar__backup-btn" onClick={onExport}>Export</button>
        <label className="sidebar__backup-btn">
          Import
          <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
        </label>
      </div>
    </aside>
  )
}

export default Sidebar
