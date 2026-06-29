import { useState } from 'react'
import { getPatternStyle, COMMON_PATTERNS } from '../../../utils/patternColors.js'
import './AddProblemForm.css'

const LIST_OPTIONS = ['NeetCode 150', 'Blind 75', 'LeetCode', 'Other']

const EMPTY_FORM = {
  title: '',
  difficulty: 'Easy',
  myDifficulty: 'Easy',
  timeTaken: '<10 min',
  leetcodeUrl: '',
  neetcodeUrl: '',
}

/**
 * AddProblemForm is a controlled form: every field's value is read from state,
 * every keystroke updates that state. on submit, the new problem is handed up
 * to App and the fields reset.
 */
function AddProblemForm({ onAddProblem }) {
  const [form, setForm]         = useState(EMPTY_FORM)
  const [patterns, setPatterns] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [lists, setLists]       = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(cur => ({ ...cur, [name]: value }))
  }

  const addPattern = (raw) => {
    const p = raw.trim().toLowerCase()
    if (p && !patterns.includes(p)) setPatterns(cur => [...cur, p])
    setTagInput('')
  }

  const removePattern = (p) => setPatterns(cur => cur.filter(x => x !== p))

  const toggleList = (l) => setLists(cur => cur.includes(l) ? cur.filter(x => x !== l) : [...cur, l])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.title.trim() === '') return

    onAddProblem({
      title: form.title.trim(),
      patterns,
      difficulty: form.difficulty,
      myDifficulty: form.myDifficulty,
      timeTaken: form.timeTaken,
      lists,
      leetcodeUrl: form.leetcodeUrl.trim(),
      neetcodeUrl: form.neetcodeUrl.trim(),
    })

    setForm(EMPTY_FORM)
    setPatterns([])
    setTagInput('')
    setLists([])
  }

  return (
    <form className="addform" onSubmit={handleSubmit}>
      <h2 className="addform__title mono">Add a problem</h2>

      <label className="addform__field">
        <span>Problem title</span>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Valid Parentheses" />
      </label>

      <div className="addform__field">
        <span>Patterns</span>
        <div className="tag-input">
          {patterns.map(p => {
            const s = getPatternStyle(p)
            return (
              <span key={p} className="pattern-pill" style={{ background: s.bg, color: s.color }}>
                {p}
                <button type="button" className="pattern-pill__remove" onClick={() => removePattern(p)}>×</button>
              </span>
            )
          })}
          <input
            className="tag-input__field"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addPattern(tagInput) }
            }}
            placeholder={patterns.length === 0 ? 'type or pick below…' : ''}
          />
        </div>
        <div className="pattern-chips">
          {COMMON_PATTERNS.map(p => {
            const s = getPatternStyle(p)
            const active = patterns.includes(p)
            return (
              <button
                key={p}
                type="button"
                className={`pattern-chip ${active ? 'is-active' : ''}`}
                style={active ? { background: s.bg, color: s.color, borderColor: s.color } : {}}
                onClick={() => active ? removePattern(p) : addPattern(p)}
              >{p}</button>
            )
          })}
        </div>
      </div>

      <div className="addform__pair">
        <label className="addform__field">
          <span>Difficulty</span>
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>
        <label className="addform__field">
          <span>My difficulty</span>
          <select name="myDifficulty" value={form.myDifficulty} onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>
      </div>

      <label className="addform__field">
        <span>Time taken</span>
        <select name="timeTaken" value={form.timeTaken} onChange={handleChange}>
          <option>&lt;10 min</option>
          <option>10-20 min</option>
          <option>20-30 min</option>
          <option>&gt;30 min</option>
        </select>
      </label>

      <div className="addform__field">
        <span>Lists (select all that apply)</span>
        <div className="addform__list-chips">
          {LIST_OPTIONS.map(opt => (
            <button
              key={opt}
              type="button"
              className={`list-chip ${lists.includes(opt) ? 'is-active' : ''}`}
              onClick={() => toggleList(opt)}
            >{opt}</button>
          ))}
        </div>
      </div>

      <label className="addform__field">
        <span>LeetCode link</span>
        <input type="url" name="leetcodeUrl" value={form.leetcodeUrl} onChange={handleChange} placeholder="https://leetcode.com/problems/..." />
      </label>

      <label className="addform__field">
        <span>NeetCode video (optional)</span>
        <input type="url" name="neetcodeUrl" value={form.neetcodeUrl} onChange={handleChange} placeholder="https://neetcode.io/problems/..." />
      </label>

      <button type="submit" className="addform__submit">Add problem</button>
    </form>
  )
}

export default AddProblemForm
