import { useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import {
  groupByStatus,
  lastActivity,
  matches,
  SERVICES,
  statusLabel,
  type Demand,
  type Role,
  type Service,
} from './store.ts'
import { cn, field, Logo, pillPrimary, shortDate, StatusDot } from './ui.tsx'

export function Sidebar(props: {
  demands: Demand[]
  selectedId?: string
  role: Role
  name: string
  open: boolean
  onClose: () => void
  onRole: (role: Role) => void
  onName: (name: string) => void
  onNew: () => void
  onRestore: () => void
}) {
  const { demands, role } = props
  const [query, setQuery] = useState('')
  const [service, setService] = useState<Service | ''>('')
  const groups = groupByStatus(demands.filter((demand) => matches(demand, query, service)))
  const waiting = demands.filter((demand) => demand.status === 'review').length

  return (
    <>
      {props.open && (
        <div className="fixed inset-0 z-20 bg-background/70 backdrop-blur-sm md:hidden" onClick={props.onClose} />
      )}
      <nav
        aria-label="Requests"
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-[19rem] max-w-[88vw] shrink-0 flex-col border-r border-border/50 bg-sidebar transition-[translate,visibility] duration-200 md:static md:w-64 xl:w-72',
          !props.open && 'max-md:invisible max-md:-translate-x-full',
        )}
      >
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <Logo className="w-28" />
            <button
              aria-label="Close request list"
              onClick={props.onClose}
              className="-mr-2 rounded-full p-2 text-muted-foreground hover:text-foreground md:hidden"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <p className="mt-6 text-lg leading-tight font-extrabold tracking-tight">Anthony's Auto Craft</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === 'client'
              ? waiting
                ? `${waiting} ${waiting === 1 ? 'request needs' : 'requests need'} your review`
                : 'Nothing is waiting on you'
              : waiting
                ? `${waiting} waiting on the client`
                : 'Nothing is waiting on the client'}
          </p>

          {role === 'team' && (
            <button onClick={props.onNew} className={`${pillPrimary} mt-5 h-10 w-full text-sm`}>
              <Plus className="size-4" aria-hidden />
              New request
            </button>
          )}

          <div className="relative mt-3">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search requests"
              placeholder="Search requests"
              className={`${field} rounded-full pl-10`}
            />
          </div>
          <select
            value={service}
            onChange={(event) => setService(event.target.value as Service | '')}
            aria-label="Filter by service"
            className={`${field} mt-2 rounded-full`}
          >
            <option value="">All services</option>
            {SERVICES.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {groups.map(({ status, items }) => (
            <section key={status} className="mt-5 first:mt-1">
              <h2
                className={cn(
                  'flex items-center gap-2 px-2 text-xs font-semibold',
                  status === 'review' ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                <StatusDot status={status} className="scale-[0.8]" />
                {statusLabel(status, role)}
                <span className="ml-auto tabular-nums">{items.length}</span>
              </h2>
              <ul className="mt-1.5 space-y-0.5">
                {items.map((demand) => (
                  <li key={demand.id}>
                    <a
                      href={`#${demand.id}`}
                      aria-current={demand.id === props.selectedId ? 'page' : undefined}
                      className={cn(
                        'block rounded-xl px-3 py-2.5 transition-colors',
                        demand.id === props.selectedId
                          ? 'bg-accent text-foreground'
                          : 'text-foreground/80 hover:bg-foreground/5',
                      )}
                    >
                      <span className="line-clamp-2 text-sm leading-snug font-semibold">{demand.title}</span>
                      <span className="mt-1 flex justify-between gap-3 text-xs text-muted-foreground">
                        <span>{demand.service}</span>
                        <span className="tabular-nums">{shortDate(lastActivity(demand))}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {groups.length === 0 && (
            <div className="px-2 pt-4 text-sm text-muted-foreground">
              {demands.length === 0 ? (
                <p>No requests yet.</p>
              ) : (
                <>
                  <p>No requests match this search.</p>
                  <button
                    onClick={() => {
                      setQuery('')
                      setService('')
                    }}
                    className="mt-2 font-semibold text-foreground underline underline-offset-4"
                  >
                    Show all requests
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-border/50 p-4">
          <div role="group" aria-label="Viewing as" className="flex rounded-full border border-border/60 bg-background/60 p-1">
            {(['team', 'client'] as const).map((option) => (
              <button
                key={option}
                aria-pressed={role === option}
                onClick={() => props.onRole(option)}
                className={cn(
                  'flex-1 rounded-full py-1.5 text-xs font-semibold transition-colors',
                  role === option
                    ? 'bg-primary/90 text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option === 'team' ? 'Magix team' : 'Client view'}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 pl-1 text-xs text-muted-foreground">
            Posting as
            <input
              value={props.name}
              onChange={(event) => props.onName(event.target.value)}
              className="min-w-0 flex-1 rounded-md bg-transparent px-1.5 py-1 font-semibold text-foreground hover:bg-foreground/5"
            />
          </label>
          {role === 'team' && (
            <button
              onClick={props.onRestore}
              className="pl-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Restore sample requests
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
