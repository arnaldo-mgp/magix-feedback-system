export const SERVICES = [
  'Paid Ads',
  'Website',
  'SEO & AI',
  'Google Profile',
  'Social Media',
  'Brand Content',
  'Graphic Design',
] as const
export type Service = (typeof SERVICES)[number]

// In the order the sidebar lists them: what needs the client first.
export const STATUSES = ['review', 'progress', 'requested', 'delivered'] as const
export type Status = (typeof STATUSES)[number]

export type Role = 'team' | 'client'

export type FileRef = { name: string; size: number; url: string; final: boolean }

export type Entry = {
  id: string
  at: string
  author: string
  role: Role
  /** Set on timeline milestones, absent on comments. */
  headline?: string
  body: string
  /** Status the request moved to with this entry. */
  status?: Status
  files?: FileRef[]
}

export type Demand = { id: string; title: string; service: Service; status: Status; entries: Entry[] }

const LABELS: Record<Status, Record<Role, string>> = {
  review: { team: 'Waiting on client', client: 'Needs your review' },
  progress: { team: 'In progress', client: 'In progress' },
  requested: { team: 'Requested', client: 'Requested' },
  delivered: { team: 'Delivered', client: 'Delivered' },
}

export const statusLabel = (status: Status, role: Role) => LABELS[status][role]

export const lastActivity = (demand: Demand) => demand.entries.at(-1)!.at

export const finalFiles = (demand: Demand) =>
  demand.entries.flatMap((entry) => entry.files ?? []).filter((file) => file.final)

export function nextId(demands: Demand[]) {
  const max = Math.max(0, ...demands.map((demand) => Number(demand.id.split('-')[1])))
  return `AAC-${String(max + 1).padStart(3, '0')}`
}

export function matches(demand: Demand, query: string, service: Service | '') {
  if (service && demand.service !== service) return false
  const q = query.trim().toLowerCase()
  if (!q) return true
  const texts = [demand.id, demand.title, ...demand.entries.flatMap((entry) => [entry.headline ?? '', entry.body])]
  return texts.some((text) => text.toLowerCase().includes(q))
}

export function groupByStatus(demands: Demand[]) {
  return STATUSES.map((status) => ({
    status,
    items: demands
      .filter((demand) => demand.status === status)
      .sort((a, b) => Date.parse(lastActivity(b)) - Date.parse(lastActivity(a))),
  })).filter((group) => group.items.length > 0)
}

/** Milestones are numbered in order; comments get 0. */
export function numbered(entries: Entry[]) {
  let n = 0
  return entries.map((entry) => ({ entry, n: entry.headline ? ++n : 0 }))
}

export function addEntry(demands: Demand[], demandId: string, entry: Entry): Demand[] {
  return demands.map((demand) =>
    demand.id === demandId
      ? { ...demand, status: entry.status ?? demand.status, entries: [...demand.entries, entry] }
      : demand,
  )
}

// ponytail: everything lives in this browser's localStorage (about 5 MB, one device).
// Replace load/save with the Member Portal API when this moves there.
const KEY = 'magix-requests-v1'

export const SAVE_ERROR = "Couldn't save. This browser's storage is full: remove an attachment and try again."

export function load(fallback: Demand[]): Demand[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(demands: Demand[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(demands))
    return true
  } catch {
    return false
  }
}
