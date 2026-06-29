import { useState } from 'react'
import COMPANIES, { CATEGORY_LABELS, CATEGORY_ORDER } from '../../data/companies.js'
import './Companies.css'

const PIPELINE = ['not_started', 'applied', 'oa', 'phone', 'onsite', 'offer']
const TERMINAL = ['rejected', 'ghosted', 'on_hold', 'withdrawn', 'accepted']
const ALL_STATUSES = [...PIPELINE, ...TERMINAL]

const STATUS_LABEL = {
  not_started: 'Not started',
  applied:     'Applied',
  oa:          'OA',
  phone:       'Phone',
  onsite:      'Onsite',
  offer:       'Offer',
  rejected:    'Rejected',
  ghosted:     'Ghosted',
  on_hold:     'On hold',
  withdrawn:   'Withdrawn',
  accepted:    'Accepted',
}

// ── company modal ─────────────────────────────────────────────────────────────

function CompanyModal({ company, data, onClose, onUpdate }) {
  const [status, setStatus]       = useState(data.status || 'not_started')
  const [dateApplied, setDate]    = useState(data.dateApplied || '')
  const [referral, setReferral]   = useState(data.referral || '')
  const [notes, setNotes]         = useState(data.notes || '')
  const [saved, setSaved]         = useState(false)

  const handleSave = () => {
    onUpdate({ status, dateApplied, referral, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const showDate = !['not_started', 'on_hold'].includes(status)

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal modal--large" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="co-modal__title">{company.name}</h2>
        {company.hint && <p className="co-modal__hint">{company.hint}</p>}

        <div className="prop-list">
          <div className="prop-row">
            <span className="prop-label">Category</span>
            <div className="prop-value">
              <span className="co-meta-chip">{CATEGORY_LABELS[company.category]}</span>
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">Priority</span>
            <div className="prop-value">
              <span className={`priority-badge priority--${company.priority.toLowerCase()}`}>{company.priority}</span>
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">TC range</span>
            <div className="prop-value">
              <span className="co-tc">{company.tc}</span>
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">Status</span>
            <div className="prop-value prop-value--wrap">
              {PIPELINE.map(s => (
                <button key={s} type="button"
                  className={`select-chip status-opt status-opt--${s} ${status === s ? 'is-active' : ''}`}
                  onClick={() => setStatus(s)}
                >{STATUS_LABEL[s]}</button>
              ))}
            </div>
          </div>

          <div className="prop-row">
            <span className="prop-label">Terminal</span>
            <div className="prop-value prop-value--wrap">
              {TERMINAL.map(s => (
                <button key={s} type="button"
                  className={`select-chip status-opt status-opt--${s} ${status === s ? 'is-active' : ''}`}
                  onClick={() => setStatus(s)}
                >{STATUS_LABEL[s]}</button>
              ))}
            </div>
          </div>

          {showDate && (
            <div className="prop-row">
              <span className="prop-label">Date applied</span>
              <div className="prop-value">
                <input className="prop-url-input" type="date" value={dateApplied} onChange={e => setDate(e.target.value)} />
              </div>
            </div>
          )}

          <div className="prop-row">
            <span className="prop-label">Referral</span>
            <div className="prop-value">
              <input className="prop-url-input" type="text" value={referral}
                onChange={e => setReferral(e.target.value)} placeholder="contact name or none" />
            </div>
          </div>

          {company.careersUrl && (
            <div className="prop-row">
              <span className="prop-label">Careers</span>
              <div className="prop-value prop-value--url">
                <a href={company.careersUrl} target="_blank" rel="noreferrer" className="prop-url-link">
                  {company.careersUrl}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="modal__notes-section">
          <span className="modal__notes-label">Notes</span>
          <textarea className="modal__notes" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="interview prep notes, contacts, deadlines…" rows={4} />
        </div>

        <div className="modal__actions">
          <button className="modal__remove" onClick={onClose}>Cancel</button>
          <button className="modal__save" onClick={handleSave}>{saved ? 'Saved ✓' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

// ── company row ───────────────────────────────────────────────────────────────

function CompanyRow({ company, status, onClick }) {
  return (
    <button className="company-row" onClick={onClick}>
      <span className={`priority-badge priority--${company.priority.toLowerCase()}`}>{company.priority}</span>
      <span className="company-row__name">{company.name}</span>
      <span className="company-row__tc">{company.tc}</span>
      <span className={`status-chip status--${status}`}>{STATUS_LABEL[status]}</span>
    </button>
  )
}

// ── main view ─────────────────────────────────────────────────────────────────

function Companies({ companyData, onUpdateCompany }) {
  const [openModal, setOpenModal]   = useState(null)
  const [collapsed, setCollapsed]   = useState({})
  const [filter, setFilter]         = useState('all')
  const [search, setSearch]         = useState('')

  const getStatus = (name) => companyData[name]?.status || 'not_started'

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(companyData, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `leetreps-companies-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        Object.entries(data).forEach(([name, updates]) => onUpdateCompany(name, updates))
      } catch { /* ignore malformed file */ }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const applied   = COMPANIES.filter(c => ALL_STATUSES.slice(1).includes(getStatus(c.name))).length
  const inProcess = COMPANIES.filter(c => ['oa', 'phone', 'onsite'].includes(getStatus(c.name))).length
  const offers    = COMPANIES.filter(c => ['offer', 'accepted'].includes(getStatus(c.name))).length

  const filtered = COMPANIES.filter(c => {
    if (filter === 'p1'     && c.priority !== 'P1') return false
    if (filter === 'active' && !['applied', 'oa', 'phone', 'onsite', 'offer', 'accepted'].includes(getStatus(c.name))) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const list = filtered.filter(c => c.category === cat)
    if (list.length) acc[cat] = list
    return acc
  }, {})

  const toggleCollapse = (cat) => setCollapsed(s => ({ ...s, [cat]: !s[cat] }))

  return (
    <div className="companies">
      <div className="companies__header">
        <h1>Companies</h1>
        <div className="companies__stats">
          <span>{COMPANIES.length} tracked</span>
          <span className="co-sep">·</span>
          <span className="co-stat co-stat--applied">{applied} applied</span>
          <span className="co-sep">·</span>
          <span className="co-stat co-stat--process">{inProcess} in process</span>
          <span className="co-sep">·</span>
          <span className="co-stat co-stat--offer">{offers} {offers === 1 ? 'offer' : 'offers'}</span>
        </div>
      </div>

      <div className="companies__backup">
        <button className="backup-btn" onClick={handleExport}>Export JSON</button>
        <label className="backup-btn backup-btn--import">
          Import JSON
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
      </div>

      <div className="companies__toolbar">
        <div className="companies__filters">
          {[['all', 'All'], ['p1', 'P1 only'], ['active', 'Active']].map(([key, label]) => (
            <button key={key}
              className={`filter-btn ${filter === key ? 'is-active' : ''}`}
              onClick={() => setFilter(key)}
            >{label}</button>
          ))}
        </div>
        <input
          className="companies__search"
          placeholder="search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="companies__groups">
        {CATEGORY_ORDER.map(cat => {
          if (!grouped[cat]) return null
          const list = grouped[cat]
          const activeCount = list.filter(c =>
            ['applied', 'oa', 'phone', 'onsite', 'offer', 'accepted'].includes(getStatus(c.name))
          ).length
          const isCollapsed = !!collapsed[cat]

          return (
            <section key={cat} className="company-group">
              <button className="company-group__header" onClick={() => toggleCollapse(cat)}>
                <span className="company-group__chevron">{isCollapsed ? '▶' : '▼'}</span>
                <span className="company-group__label">{CATEGORY_LABELS[cat]}</span>
                <span className="company-group__count">{list.length}</span>
                {activeCount > 0 && (
                  <span className="company-group__active">{activeCount} active</span>
                )}
              </button>

              {!isCollapsed && (
                <div className="company-group__rows">
                  {list.map(company => (
                    <CompanyRow
                      key={company.name}
                      company={company}
                      status={getStatus(company.name)}
                      onClick={() => setOpenModal(company)}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {openModal && (
        <CompanyModal
          company={openModal}
          data={companyData[openModal.name] || {}}
          onClose={() => setOpenModal(null)}
          onUpdate={(updates) => {
            onUpdateCompany(openModal.name, updates)
            setOpenModal(null)
          }}
        />
      )}
    </div>
  )
}

export default Companies
