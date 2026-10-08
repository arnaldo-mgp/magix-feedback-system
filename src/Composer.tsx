import { useState, type FormEvent } from 'react'
import { Paperclip, X } from 'lucide-react'
import { SAVE_ERROR, STATUSES, statusLabel, type Demand, type Entry, type FileRef, type Role, type Status } from './store.ts'
import { cn, formatSize, pillGlass, pillPrimary } from './ui.tsx'

// ponytail: attachments are stored as data URLs in localStorage, so they stay small.
// Lift this cap when files go to real storage in the Member Portal.
const MAX_FILE = 1_500_000

const readAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

export function Composer({
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
  const [mode, setMode] = useState<'update' | 'comment'>('update')
  const [headline, setHeadline] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<Status | ''>('')
  const [files, setFiles] = useState<FileRef[]>([])
  const [final, setFinal] = useState(false)
  const [error, setError] = useState('')
  // Only the team posts timeline updates; the client always comments.
  const isUpdate = role === 'team' && mode === 'update'

  const attach = async (picked: FileList) => {
    const added: FileRef[] = []
    for (const file of picked) {
      if (file.size > MAX_FILE)
        return setError(`${file.name} is ${formatSize(file.size)}. Attach files up to ${formatSize(MAX_FILE)}.`)
      added.push({ name: file.name, size: file.size, url: await readAsDataURL(file), final: false })
    }
    setError('')
    setFiles((current) => [...current, ...added])
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const entry: Entry = { id: crypto.randomUUID(), at: new Date().toISOString(), author, role, body: body.trim() }
    if (isUpdate) {
      entry.headline = headline.trim()
      if (status) entry.status = status
      if (files.length) entry.files = files.map((file) => ({ ...file, final }))
    }
    if (!onPost(entry)) return setError(SAVE_ERROR)
    setHeadline('')
    setBody('')
    setStatus('')
    setFiles([])
    setFinal(false)
    setError('')
  }

  return (
    <form
      onSubmit={submit}
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') event.currentTarget.requestSubmit()
      }}
      className="shrink-0 px-4 pb-4 max-lg:sticky max-lg:bottom-0 max-lg:bg-background/80 max-lg:pt-3 max-lg:backdrop-blur-md sm:px-8 sm:pb-6"
    >
      <div className="mx-auto max-w-[40rem] rounded-3xl border border-border/60 bg-card/70 p-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md transition-colors focus-within:border-primary/70">
        {role === 'team' && (
          <div role="group" aria-label="Post type" className="mb-1 inline-flex rounded-full bg-background/60 p-0.5">
            {(['update', 'comment'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={mode === option}
                onClick={() => setMode(option)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  mode === option ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option === 'update' ? 'Timeline update' : 'Comment'}
              </button>
            ))}
          </div>
        )}

        {isUpdate && (
          <input
            required
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            aria-label="Headline"
            placeholder="Headline, e.g. First draft ready"
            className="w-full bg-transparent px-2 py-1.5 text-base font-bold outline-none placeholder:font-semibold placeholder:text-muted-foreground/60"
          />
        )}
        <textarea
          required={!isUpdate}
          rows={2}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          aria-label={isUpdate ? 'Details' : 'Comment'}
          placeholder={
            isUpdate
              ? 'What was done, in plain terms'
              : role === 'client'
                ? 'Write a comment for the Magix team'
                : "Write a comment for Anthony's team"
          }
          className="block w-full resize-none bg-transparent px-2 py-1.5 text-[0.9375rem] leading-6 outline-none placeholder:text-muted-foreground/60"
        />

        {isUpdate && files.length > 0 && (
          <ul className="flex flex-wrap gap-2 px-1 pb-2">
            {files.map((file, i) => (
              <li
                key={i}
                className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 py-1 pr-1 pl-3 text-xs"
              >
                <span className="max-w-40 truncate font-semibold">{file.name}</span>
                <span className="text-muted-foreground tabular-nums">{formatSize(file.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => setFiles(files.filter((_, index) => index !== i))}
                  className="rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p role="alert" className="px-2 pb-2 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {isUpdate && (
            <>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as Status | '')}
                aria-label="Status"
                className={`${pillGlass} h-9 px-3 text-xs`}
              >
                <option value="">Keep status: {statusLabel(demand.status, role)}</option>
                {STATUSES.filter((option) => option !== demand.status).map((option) => (
                  <option key={option} value={option}>
                    Move to {statusLabel(option, role)}
                  </option>
                ))}
              </select>
              <label className={`${pillGlass} h-9 cursor-pointer px-3 text-xs focus-within:outline-2 focus-within:outline-ring`}>
                <Paperclip className="size-3.5" aria-hidden />
                Attach file
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    if (event.target.files) attach(event.target.files)
                    event.target.value = ''
                  }}
                />
              </label>
              {files.length > 0 && (
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={final}
                    onChange={(event) => setFinal(event.target.checked)}
                    className="size-4 accent-primary"
                  />
                  {files.length === 1 ? 'This is the final file' : 'These are the final files'}
                </label>
              )}
            </>
          )}
          <button type="submit" className={`${pillPrimary} ml-auto h-9 px-4 text-sm`}>
            {isUpdate ? 'Post update' : 'Send comment'}
          </button>
        </div>
      </div>
    </form>
  )
}
