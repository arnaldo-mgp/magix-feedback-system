import { useLayoutEffect, useRef, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Composer } from './Composer.tsx'
import { finalFiles, numbered, statusLabel, type Demand, type Entry, type FileRef, type Role } from './store.ts'
import { cn, eyebrow, formatSize, longDate, pillGlass, shortDate, StatusDot } from './ui.tsx'

const step = (n: number) => `/${String(n).padStart(2, '0')}`

function FileRow({ file, tagFinal }: { file: FileRef; tagFinal?: boolean }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-snug font-semibold [overflow-wrap:anywhere]">{file.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatSize(file.size)}
          {tagFinal && file.final && <span className="ml-2 font-semibold text-chart-3">Final file</span>}
        </span>
      </span>
      <a
        href={file.url}
        download={file.name}
        aria-label={`Download ${file.name}`}
        className={`${pillGlass} h-8 px-3 text-xs`}
      >
        <Download className="size-3.5" aria-hidden />
        Download
      </a>
    </li>
  )
}

export function DemandView({
  demand,
  role,
  author,
  onPost,
}: {
  demand: Demand
  role: Role
  author: string
  onPost: (entry: Entry) => boolean
}) {
  const rows = numbered(demand.entries)
  const lastId = demand.entries.at(-1)!.id
  const currentId = demand.entries.findLast((entry) => entry.headline)?.id
  const finals = finalFiles(demand)

  const log = useRef<HTMLDivElement>(null)
  // Set when a timeline step is clicked, so the scroll it causes doesn't move the highlight elsewhere.
  const pinned = useRef(false)
  const [activeId, setActiveId] = useState(lastId)

  // Open on the latest entry, like a conversation. Below lg the whole page scrolls instead of the
  // log, so this does nothing there and the request opens on its title, status and final files.
  useLayoutEffect(() => {
    const box = log.current!
    box.scrollTo({ top: box.scrollHeight, behavior: 'instant' })
    setActiveId(lastId)
  }, [lastId])

  const syncActive = () => {
    if (pinned.current) return
    const box = log.current!
    if (box.scrollTop + box.clientHeight >= box.scrollHeight - 4) return setActiveId(lastId)
    const line = box.getBoundingClientRect().top + box.clientHeight * 0.3
    let current = demand.entries[0].id
    for (const el of box.querySelectorAll<HTMLElement>('[data-entry]')) {
      if (el.getBoundingClientRect().top > line) break
      current = el.dataset.entry!
    }
    setActiveId(current)
  }

  const jump = (id: string) => {
    pinned.current = true
    setActiveId(id)
    document.getElementById(`entry-${id}`)?.scrollIntoView({ block: 'start' })
  }
  const release = () => {
    pinned.current = false
  }

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto lg:flex lg:overflow-visible">
      <aside className="flex shrink-0 flex-col border-b border-border/40 lg:w-80 lg:border-r lg:border-b-0 xl:w-[23rem]">
        <header className="px-5 pt-5 pb-5 sm:px-6 lg:pt-8">
          <p className="text-sm font-semibold text-muted-foreground tabular-nums">{demand.id}</p>
          <h1 className="mt-2 text-2xl leading-[1.15] font-extrabold tracking-[-0.025em] text-balance lg:text-[1.75rem]">
            {demand.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="rounded-full border border-border/60 bg-foreground/6 px-3 py-1 text-xs font-semibold">
              {demand.service}
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <StatusDot status={demand.status} />
              {statusLabel(demand.status, role)}
            </span>
          </div>
        </header>

        {finals.length > 0 && (
          <section className="border-t border-border/40 px-5 py-4 sm:px-6">
            <h2 className="text-sm font-bold">Final files</h2>
            <ul className="mt-1">
              {finals.map((file, i) => (
                <FileRow key={i} file={file} />
              ))}
            </ul>
          </section>
        )}

        <section className="hidden min-h-0 flex-1 overflow-y-auto border-t border-border/40 px-4 pt-6 pb-8 lg:block">
          <h2 className={`${eyebrow} px-2`}>(Timeline)</h2>
          <ol className="mt-3">
            {rows.map(({ entry, n }, i) => {
              const last = i === rows.length - 1
              const active = entry.id === activeId
              // Markers are centred 18px down each row. The rail runs centre to centre behind the solid
              // dots, and stops at the edge of the see-through ones (current status, pending delivery).
              const railTop = entry.id === currentId ? 28 : 18
              const railBottom = last ? -10 : rows[i + 1].entry.id === currentId ? -8 : -18
              return (
                <li key={entry.id} className="relative">
                  {!(last && demand.status === 'delivered') && (
                    <span
                      aria-hidden
                      className={cn('absolute left-[17px] w-0.5', last ? 'rail-pending' : 'rail')}
                      style={{ top: railTop, bottom: railBottom, animationDelay: `${i * 90}ms` }}
                    />
                  )}
                  <button
                    onClick={() => jump(entry.id)}
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'flex w-full gap-3 rounded-xl px-2 py-2 text-left transition-colors',
                      active ? 'bg-foreground/6 text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="relative z-10 grid size-5 shrink-0 place-items-center">
                      {entry.id === currentId ? (
                        <StatusDot status={demand.status} />
                      ) : n ? (
                        <span className="size-2.5 rounded-full bg-chart-2" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-muted-foreground/70" />
                      )}
                    </span>
                    {n ? (
                      <span className="min-w-0">
                        <span className="flex gap-3 text-xs tabular-nums">
                          <span className={cn('font-semibold', active && 'text-primary')}>{step(n)}</span>
                          <time dateTime={entry.at}>{shortDate(entry.at)}</time>
                        </span>
                        <span className="mt-0.5 block text-sm leading-snug font-semibold">{entry.headline}</span>
                        <span className="mt-0.5 block text-xs">{entry.author}</span>
                      </span>
                    ) : (
                      <span className="text-xs leading-5">
                        {entry.author} commented on {shortDate(entry.at)}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
            {demand.status !== 'delivered' && (
              <li className="flex items-center gap-3 px-2 py-2 text-sm text-muted-foreground/70">
                <span className="grid size-5 shrink-0 place-items-center">
                  <span className="size-3 rounded-full border border-dashed border-muted-foreground/70" />
                </span>
                Delivery
              </li>
            )}
          </ol>
        </section>
      </aside>

      <section className="flex min-w-0 flex-col lg:min-h-0 lg:flex-1">
        <h2 className={`${eyebrow} mx-auto w-full max-w-[44rem] px-5 pt-5 pb-2 sm:px-8 lg:pt-8`}>(Work log)</h2>
        <div
          ref={log}
          onScroll={syncActive}
          onWheel={release}
          onTouchStart={release}
          onKeyDown={release}
          className="motion-safe:scroll-smooth lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[mask-image:linear-gradient(to_bottom,transparent,black_1.75rem,black_calc(100%-1.25rem),transparent)]"
        >
          <div className="mx-auto max-w-[44rem] px-5 pt-4 pb-4 sm:px-8">
            <div>
              {rows.map(({ entry, n }) =>
                n ? (
                  <article
                    key={entry.id}
                    id={`entry-${entry.id}`}
                    data-entry={entry.id}
                    className="grid scroll-mt-6 grid-cols-[2.75rem_minmax(0,1fr)] border-t border-border/40 py-8 first:border-t-0 first:pt-2"
                  >
                    <span className="pt-1 text-sm font-semibold text-primary tabular-nums">{step(n)}</span>
                    <div>
                      <h3 className="text-xl leading-tight font-bold tracking-tight text-balance">{entry.headline}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{entry.author}</span>,{' '}
                        <time dateTime={entry.at}>{longDate(entry.at)}</time>
                      </p>
                      {entry.body && (
                        <p className="mt-4 text-base leading-7 whitespace-pre-line text-foreground/90">{entry.body}</p>
                      )}
                      {entry.files && (
                        <ul className="mt-4 border-y border-border/40">
                          {entry.files.map((file, i) => (
                            <FileRow key={i} file={file} tagFinal />
                          ))}
                        </ul>
                      )}
                      {entry.status && (
                        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <StatusDot status={entry.status} />
                          Moved to
                          <span className="font-semibold text-foreground">{statusLabel(entry.status, role)}</span>
                        </p>
                      )}
                    </div>
                  </article>
                ) : (
                  <div
                    key={entry.id}
                    id={`entry-${entry.id}`}
                    data-entry={entry.id}
                    className={cn('flex scroll-mt-6 pb-5 pl-11', entry.role === role ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl border px-4 py-3',
                        entry.role === role
                          ? 'rounded-br-md border-primary/35 bg-primary/15'
                          : 'rounded-bl-md border-border/60 bg-card',
                      )}
                    >
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{entry.author}</span>,{' '}
                        <time dateTime={entry.at}>{shortDate(entry.at)}</time>
                      </p>
                      <p className="mt-1 text-[0.9375rem] leading-6 whitespace-pre-line">{entry.body}</p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        <Composer demand={demand} role={role} author={author} onPost={onPost} />
      </section>
    </main>
  )
}
