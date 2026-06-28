import './Header.css'

/**
 * Header is stateless — it receives the current view plus a callback via props,
 * and calls the callback to switch views.
 */
function Header({ view, onViewChange }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo mono" aria-hidden="true">{'</>'}</span>
        <div>
          <h1 className="header__title mono">LeetReps</h1>
          <p className="header__tagline">Spaced repetition for coding patterns.</p>
        </div>
      </div>

      <nav className="header__nav">
        <button
          className={`header__tab ${view === 'dashboard' ? 'is-active' : ''}`}
          onClick={() => onViewChange('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`header__tab ${view === 'log' ? 'is-active' : ''}`}
          onClick={() => onViewChange('log')}
        >
          Log
        </button>
        <button
          className={`header__tab ${view === 'about' ? 'is-active' : ''}`}
          onClick={() => onViewChange('about')}
        >
          About
        </button>
      </nav>
    </header>
  )
}

export default Header
