import { INTERVALS } from '../../utils/spacedRepetition.js'
import './About.css'

/**
 * About is the second view, shown when App's `view` state is "about".
 * It explains the spaced-repetition method the dashboard uses.
 */
function About() {
  const steps = [
    'Solve a problem, then add it with its pattern and NeetCode link.',
    'When it comes due, redo it from scratch — no peeking.',
    'Rate how it felt: Hard, Good, or Easy.',
    'The rating moves the problem along the interval ladder below.',
  ]

  return (
    <section className="about">
      <h2 className="about__title mono">How LeetReps works</h2>
      <p className="about__lead">
        LeetReps schedules each problem so it resurfaces right before you'd
        forget the pattern. Instead of grinding hundreds of problems once, you
        revisit a smaller core set at growing intervals until the approach is
        automatic.
      </p>

      <h3 className="about__subtitle">The loop</h3>
      <ol className="about__steps">
        {steps.map((step, i) => (
          <li key={i}>
            <span className="about__num mono">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      <h3 className="about__subtitle">The interval ladder</h3>
      <div className="about__ladder">
        {INTERVALS.map((days, i) => (
          <span key={i} className="about__rung mono">
            {days}d
          </span>
        ))}
        <span className="about__rung about__rung--done mono">mastered</span>
      </div>
      <p className="about__note">
        Rating a review <strong>Good</strong> advances one rung,
        <strong> Easy</strong> skips ahead two, and <strong>Hard</strong> drops
        you back one so you see it sooner. Your data is saved in your browser.
      </p>
    </section>
  )
}

export default About
