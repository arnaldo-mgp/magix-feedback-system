// Run with: npm run check
import assert from 'node:assert/strict'
import {
  addEntry,
  finalFiles,
  groupByStatus,
  matches,
  nextId,
  numbered,
  statusLabel,
  type Demand,
  type Entry,
} from './store.ts'

const entry = (id: string, at: string, extra: Partial<Entry> = {}): Entry => ({
  id,
  at,
  author: 'Arnaldo',
  role: 'team',
  body: '',
  ...extra,
})

const demands: Demand[] = [
  {
    id: 'AAC-002',
    title: 'Tesla page',
    service: 'Website',
    status: 'review',
    entries: [
      entry('a', '2026-09-01T10:00:00', { headline: 'Requested', body: 'Old badge' }),
      entry('b', '2026-09-02T10:00:00', { role: 'client', body: 'Looks good' }),
    ],
  },
  {
    id: 'AAC-009',
    title: 'Marin ads',
    service: 'Paid Ads',
    status: 'progress',
    entries: [entry('c', '2026-09-05T10:00:00', { headline: 'Requested' })],
  },
  {
    id: 'AAC-004',
    title: 'Photos',
    service: 'Google Profile',
    status: 'review',
    entries: [entry('d', '2026-09-03T10:00:00', { headline: 'Requested' })],
  },
]

assert.equal(nextId(demands), 'AAC-010')
assert.equal(nextId([]), 'AAC-001')

// Sidebar order, newest activity first, empty groups dropped.
assert.deepEqual(
  groupByStatus(demands).map((group) => [group.status, group.items.map((demand) => demand.id)]),
  [
    ['review', ['AAC-004', 'AAC-002']],
    ['progress', ['AAC-009']],
  ],
)

assert.ok(matches(demands[0], '  old BADGE ', ''))
assert.ok(matches(demands[0], 'aac-002', 'Website'))
assert.ok(!matches(demands[0], '', 'Paid Ads'))
assert.ok(!matches(demands[0], 'sonoma', ''))

assert.deepEqual(
  numbered(demands[0].entries).map((row) => row.n),
  [1, 0],
)

const delivered = entry('e', '2026-09-06T10:00:00', {
  headline: 'Published',
  status: 'delivered',
  files: [
    { name: 'final.pdf', size: 1, url: 'data:,', final: true },
    { name: 'draft.pdf', size: 1, url: 'data:,', final: false },
  ],
})
const after = addEntry(demands, 'AAC-009', delivered)
assert.equal(after[1].status, 'delivered')
assert.equal(after[1].entries.length, 2)
assert.equal(demands[1].status, 'progress', 'addEntry must not mutate')
assert.deepEqual(
  finalFiles(after[1]).map((file) => file.name),
  ['final.pdf'],
)
// A comment carries no status, so the request keeps the one it had.
assert.equal(addEntry(after, 'AAC-009', entry('f', '2026-09-07T10:00:00'))[1].status, 'delivered')

assert.equal(statusLabel('review', 'client'), 'Needs your review')
assert.equal(statusLabel('review', 'team'), 'Waiting on client')

console.log('store checks passed')
