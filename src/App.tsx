import { useEffect, useState, useSyncExternalStore } from 'react'
import { Menu } from 'lucide-react'
import { DemandView } from './DemandView.tsx'
import { NewRequest, type NewRequestInput } from './NewRequest.tsx'
import { seed } from './seed.ts'
import { Sidebar } from './Sidebar.tsx'
import { addEntry, groupByStatus, load, nextId, save, type Demand, type Role } from './store.ts'
import { Logo, pillPrimary } from './ui.tsx'

const VIEW_KEY = 'magix-requests-view'
const DEFAULT_VIEW: { role: Role; names: Record<Role, string> } = {
  role: 'team',
  names: { team: 'Arnaldo', client: "Anthony's team" },
}

function loadView(): typeof DEFAULT_VIEW {
  try {
    return { ...DEFAULT_VIEW, ...JSON.parse(localStorage.getItem(VIEW_KEY) ?? '{}') }
  } catch {
    return DEFAULT_VIEW
  }
}

const subscribeToHash = (onChange: () => void) => {
  addEventListener('hashchange', onChange)
  return () => removeEventListener('hashchange', onChange)
}
const readHash = () => decodeURIComponent(location.hash.slice(1))

export default function App() {
  const [demands, setDemands] = useState(() => load(seed))
  const [view, setView] = useState(loadView)
  const [drawer, setDrawer] = useState(false)
  const [creating, setCreating] = useState(false)
  const hash = useSyncExternalStore(subscribeToHash, readHash)

  const { role, names } = view
  const author = names[role].trim() || DEFAULT_VIEW.names[role]
  const demand = demands.find((item) => item.id === hash) ?? groupByStatus(demands)[0]?.items[0]

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, JSON.stringify(view))
    } catch {
      // The view choice is a convenience; losing it costs one click.
    }
  }, [view])
  useEffect(() => setDrawer(false), [hash])

  // Saves first, so the screen never shows something the browser failed to keep.
  const commit = (next: Demand[]) => {
    const saved = save(next)
    if (saved) setDemands(next)
    return saved
  }

  const create = (input: NewRequestInput) => {
    const id = nextId(demands)
    const created = commit([
      ...demands,
      {
        id,
        title: input.title,
        service: input.service,
        status: 'requested',
        entries: [
          {
            id: crypto.randomUUID(),
            at: new Date().toISOString(),
            author: input.requestedBy,
            role: input.requestedBy === names.team ? 'team' : 'client',
            headline: 'Requested',
            body: input.body,
          },
        ],
      },
    ])
    if (created) {
      location.hash = id
      setCreating(false)
    }
    return created
  }

  const restore = () => {
    if (!confirm('Replace everything with the sample requests? Updates and comments you added will be removed.')) return
    if (commit(seed)) history.replaceState(null, '', location.pathname)
  }

  return (
    <div className="flex h-dvh flex-col md:flex-row">
      <header className="flex shrink-0 items-center gap-3 border-b border-border/40 px-3 py-2.5 md:hidden">
        <button
          aria-label="Open request list"
          onClick={() => setDrawer(true)}
          className="rounded-full p-2 text-foreground hover:bg-foreground/6"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <Logo className="w-24" />
      </header>

      <Sidebar
        demands={demands}
        selectedId={demand?.id}
        role={role}
        name={names[role]}
        open={drawer}
        onClose={() => setDrawer(false)}
        onRole={(next) => setView({ ...view, role: next })}
        onName={(name) => setView({ ...view, names: { ...names, [role]: name } })}
        onNew={() => setCreating(true)}
        onRestore={restore}
      />

      {demand ? (
        <DemandView
          key={demand.id}
          demand={demand}
          role={role}
          author={author}
          onPost={(entry) => commit(addEntry(demands, demand.id, entry))}
        />
      ) : (
        <main className="grid flex-1 place-items-center p-8 text-center">
          <div>
            <p className="text-2xl font-extrabold tracking-[-0.025em]">No requests yet</p>
            {role === 'team' ? (
              <button onClick={() => setCreating(true)} className={`${pillPrimary} mt-5 h-10 px-5 text-sm`}>
                New request
              </button>
            ) : (
              <p className="mt-2 text-muted-foreground">Requests opened by the Magix team will show up here.</p>
            )}
          </div>
        </main>
      )}

      {creating && <NewRequest requester={names.client} onCreate={create} onClose={() => setCreating(false)} />}
    </div>
  )
}
