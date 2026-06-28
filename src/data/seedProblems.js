// starter problems shown on first load (before anything is saved to storage).
// `level` is the spaced-repetition rung; `lastReviewed` is an ISO date string.
// dates are staggered so a couple are already due for review on day one.

const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const seedProblems = [
  {
    id: 1,
    title: 'Two Sum',
    pattern: 'Hash Map',
    difficulty: 'Easy',
    platform: 'NeetCode 150',
    url: 'https://neetcode.io/problems/two-integer-sum',
    level: 1,
    lastReviewed: daysAgo(5), // interval at level 1 is 3 days -> overdue
    mastered: false,
    lastRating: 'good',
    reviewCount: 2,
    notes: 'Remember: store complements in a map as you iterate, one pass.',
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    platform: 'NeetCode 150',
    url: 'https://neetcode.io/problems/longest-substring-without-duplicates',
    level: 0,
    lastReviewed: daysAgo(2), // interval at level 0 is 1 day -> due
    mastered: false,
    lastRating: 'hard',
    reviewCount: 1,
    notes: 'Kept forgetting to move the left pointer past the duplicate index.',
  },
  {
    id: 3,
    title: 'Coin Change',
    pattern: 'Dynamic Programming',
    difficulty: 'Medium',
    platform: 'Blind 75',
    url: 'https://neetcode.io/problems/coin-change',
    level: 2,
    lastReviewed: daysAgo(1), // interval at level 2 is 7 days -> not due yet
    mastered: false,
    lastRating: 'good',
    reviewCount: 3,
    notes: '',
  },
]

export default seedProblems
