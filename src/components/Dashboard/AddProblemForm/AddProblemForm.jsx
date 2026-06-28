import { useState } from 'react'
import './AddProblemForm.css'

const EMPTY_FORM = {
  title: '',
  pattern: '',
  difficulty: 'Easy',
  platform: 'NeetCode 150',
  url: '',
}

/**
 * AddProblemForm is a CONTROLLED form: every field's value is read from the
 * `form` state object, and every keystroke updates that state via onChange.
 * On submit, the new problem is handed up to App and the fields reset.
 */
function AddProblemForm({ onAddProblem }) {
  const [form, setForm] = useState(EMPTY_FORM)

  // One change handler keyed by each input's `name` attribute.
  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (form.title.trim() === '') return // require a title

    onAddProblem({
      title: form.title.trim(),
      pattern: form.pattern.trim() || 'General',
      difficulty: form.difficulty,
      platform: form.platform,
      url: form.url.trim(),
    })

    setForm(EMPTY_FORM) // clear the controlled fields
  }

  return (
    <form className="addform" onSubmit={handleSubmit}>
      <h2 className="addform__title mono">Add a problem</h2>

      <label className="addform__field">
        <span>Problem title</span>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Valid Parentheses"
        />
      </label>

      <label className="addform__field">
        <span>Pattern</span>
        <input
          type="text"
          name="pattern"
          value={form.pattern}
          onChange={handleChange}
          placeholder="e.g. Stack"
        />
      </label>

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
          <span>List</span>
          <select name="platform" value={form.platform} onChange={handleChange}>
            <option>NeetCode 150</option>
            <option>Blind 75</option>
            <option>LeetCode</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <label className="addform__field">
        <span>NeetCode video link</span>
        <input
          type="url"
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://neetcode.io/problems/..."
        />
      </label>

      <button type="submit" className="addform__submit">
        Add problem
      </button>
    </form>
  )
}

export default AddProblemForm
