const PALETTE = [
  { bg: 'rgba(180, 160, 55, 0.2)',  color: '#c8b040' },
  { bg: 'rgba(55, 175, 95, 0.2)',   color: '#38aa58' },
  { bg: 'rgba(125, 75, 200, 0.2)',  color: '#8a55d4' },
  { bg: 'rgba(200, 105, 45, 0.2)',  color: '#cc6c28' },
  { bg: 'rgba(55, 115, 210, 0.2)',  color: '#3878d4' },
  { bg: 'rgba(200, 55, 65, 0.2)',   color: '#cc363e' },
  { bg: 'rgba(45, 165, 175, 0.2)',  color: '#28a4b0' },
  { bg: 'rgba(170, 55, 155, 0.2)',  color: '#b03898' },
  { bg: 'rgba(95, 165, 55, 0.2)',   color: '#5aa828' },
  { bg: 'rgba(165, 115, 35, 0.2)',  color: '#aa7820' },
]

function hashIndex(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff
  return h % PALETTE.length
}

export function getPatternStyle(pattern) {
  return PALETTE[hashIndex(pattern.toLowerCase().trim())]
}

export const COMMON_PATTERNS = [
  'array', 'string', 'hash map', 'two pointers', 'sliding window',
  'binary search', 'linked list', 'stack/queue', 'binary tree',
  'binary search tree', 'graph', 'dfs', 'bfs', 'dynamic programming',
  'recursion', 'backtracking', 'heap', 'trie', 'bit manipulation',
  'math', 'matrix', 'greedy', 'intervals', 'design', 'sort', 'set',
]
