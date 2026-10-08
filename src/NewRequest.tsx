import { useEffect, useRef, useState, type FormEvent } from 'react'
import { SAVE_ERROR, SERVICES, type Service } from './store.ts'
import { field, pillGlass, pillPrimary } from './ui.tsx'

export type NewRequestInput = { title: string; service: Service; requestedBy: string; body: string }

/** Mounted only while open; closing the dialog (button or Esc) unmounts it. */
export function NewRequest({
  requester,
  onCreate,
  onClose,
}: {
  requester: string
  onCreate: (input: NewRequestInput) => boolean
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState('')
  useEffect(() => dialog.current!.showModal(), [])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const text = (name: string) => String(data.get(name)).trim()
    const created = onCreate({
      title: text('title'),
      service: text('service') as Service,
      requestedBy: text('requestedBy') || requester,
      body: text('body'),
    })
    if (!created) setError(SAVE_ERROR)
  }

  const label = 'block text-sm font-semibold'
  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby="new-request-title"
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-3xl border border-border/60 bg-card p-0 text-foreground backdrop:bg-background/70 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} className="space-y-4 p-6 sm:p-8">
        <h2 id="new-request-title" className="text-2xl font-extrabold tracking-[-0.025em]">
          New request
        </h2>
        <label className={label}>
          Title
          <input name="title" required autoFocus placeholder="Tesla certification page refresh" className={`${field} mt-1.5 font-normal`} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            Service
            <select name="service" className={`${field} mt-1.5 font-normal`}>
              {SERVICES.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Requested by
            <input name="requestedBy" defaultValue={requester} className={`${field} mt-1.5 font-normal`} />
          </label>
        </div>
        <label className={label}>
          What's needed
          <textarea
            name="body"
            required
            rows={5}
            placeholder="The request in the client's own words, or what you noticed and why it matters."
            className={`${field} mt-1.5 resize-none leading-6 font-normal`}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={`${pillGlass} h-10 px-5 text-sm`}>
            Cancel
          </button>
          <button type="submit" className={`${pillPrimary} h-10 px-5 text-sm`}>
            Create request
          </button>
        </div>
      </form>
    </dialog>
  )
}
