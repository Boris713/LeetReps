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
    patterns: ['array', 'hash map'],
    difficulty: 'Easy',
    myDifficulty: 'Easy',
    timeTaken: '<10 min',
    lists: ['NeetCode 150', 'Blind 75'],
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    level: 1,
    lastReviewed: daysAgo(5),
    mastered: false,
    lastRating: 'good',
    reviewCount: 2,
    notes: 'Remember: store complements in a map as you iterate, one pass.',
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    patterns: ['string', 'sliding window'],
    difficulty: 'Medium',
    myDifficulty: 'Medium',
    timeTaken: '10-20 min',
    lists: ['NeetCode 150'],
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    level: 0,
    lastReviewed: daysAgo(2),
    mastered: false,
    lastRating: 'hard',
    reviewCount: 1,
    notes: 'Kept forgetting to move the left pointer past the duplicate index.',
  },
  {
    id: 3,
    title: 'Coin Change',
    patterns: ['dynamic programming'],
    difficulty: 'Medium',
    myDifficulty: 'Hard',
    timeTaken: '20-30 min',
    lists: ['Blind 75'],
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    level: 2,
    lastReviewed: daysAgo(1),
    mastered: false,
    lastRating: 'good',
    reviewCount: 3,
    notes: '',
  },
]

export default seedProblems
