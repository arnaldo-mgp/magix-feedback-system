import { Check } from 'lucide-react'
import type { Status } from './store.ts'

export const cn = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ')

// The two buttons of magix-pro.com: solid blue pill and glass pill.
const pill =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full border font-semibold whitespace-nowrap transition-colors disabled:opacity-50'
export const pillPrimary = `${pill} border-primary/50 bg-primary/90 text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-primary`
export const pillGlass = `${pill} border-border/60 bg-foreground/6 text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.07)] backdrop-blur-md hover:bg-foreground/10`

export const field =
  'w-full rounded-xl border border-border/60 bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70'

export const eyebrow = 'text-xs font-semibold tracking-[0.1em] text-primary uppercase'

const short = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const long = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
export const shortDate = (iso: string) => short.format(new Date(iso))
export const longDate = (iso: string) => long.format(new Date(iso))

export const formatSize = (bytes: number) =>
  bytes < 1_000_000 ? `${Math.max(1, Math.round(bytes / 1000))} KB` : `${(bytes / 1_000_000).toFixed(1)} MB`

/** One shape per status, so the list, the header and the timeline speak the same way. */
export function StatusDot({ status, className }: { status: Status; className?: string }) {
  const base = 'grid size-4 shrink-0 place-items-center rounded-full'
  if (status === 'delivered')
    return (
      <span className={cn(base, 'bg-chart-3 text-background', className)}>
        <Check className="size-3" strokeWidth={3.5} aria-hidden />
      </span>
    )
  if (status === 'review')
    return (
      <span className={cn(base, 'bg-destructive/25', className)}>
        <span className="size-2 rounded-full bg-destructive" />
      </span>
    )
  if (status === 'progress')
    return (
      <span className={cn(base, 'border-2 border-primary', className)}>
        <span className="size-1.5 rounded-full bg-primary" />
      </span>
    )
  return <span className={cn(base, 'border-2 border-muted-foreground/60', className)} />
}

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 565.77 100.42" role="img" aria-label="Magix Pro" className={cn('fill-foreground', className)}>
      <path d="M116.53,8.17h15.1l21.09,49.31,21.09-49.31h15.01v66.31h-13.3V31.35l-17.77,43.13h-10.07l-17.86-43.13v43.13h-13.3V8.17Z" />
      <path d="M218.37,21c8.46,0,14.25,3.99,17.39,8.36v-7.51h13.4v52.63h-13.4v-7.7c-3.14,4.56-9.12,8.55-17.48,8.55-13.3,0-23.94-10.93-23.94-27.36s10.64-26.98,24.04-26.98ZM221.79,32.68c-7.12,0-13.87,5.32-13.87,15.29s6.75,15.68,13.87,15.68,13.97-5.51,13.97-15.49-6.65-15.48-13.97-15.48Z" />
      <path d="M278.6,21c8.27,0,14.25,3.8,17.39,8.36v-7.51h13.4v53.01c0,14.25-8.74,25.56-26.03,25.56-14.82,0-25.18-7.41-26.51-19.48h13.21c1.33,4.75,6.27,7.89,12.92,7.89,7.31,0,13.02-4.18,13.02-13.97v-8.17c-3.14,4.56-9.12,8.65-17.39,8.65-13.4,0-24.04-10.93-24.04-27.36s10.64-26.98,24.04-26.98ZM282.02,32.68c-7.12,0-13.87,5.32-13.87,15.29s6.75,15.68,13.87,15.68,13.97-5.51,13.97-15.49-6.65-15.48-13.97-15.48Z" />
      <path d="M316.79,7.79c0-4.37,3.42-7.79,8.17-7.79s8.17,3.42,8.17,7.79-3.52,7.79-8.17,7.79-8.17-3.42-8.17-7.79ZM318.21,21.85h13.3v52.63h-13.3V21.85Z" />
      <path d="M358.68,58.14l-9.6,16.34h-14.25l17.19-26.41-17.39-26.22h15.01l10.74,16.25,9.69-16.25h14.25l-17.29,26.22,17.48,26.41h-15.01l-10.83-16.34Z" />
      <path d="M415.2,49.47h-11.11v25.46h-13.3V8.62h24.42c15.96,0,23.94,9.03,23.94,20.52,0,10.07-6.84,20.33-23.94,20.33ZM414.63,38.74c7.5,0,10.83-3.71,10.83-9.6s-3.33-9.69-10.83-9.69h-10.54v19.29h10.54Z" />
      <path d="M469.25,8.62c15.96,0,23.94,9.22,23.94,20.33,0,8.08-4.46,16.25-15.11,19.1l15.87,26.89h-15.39l-14.63-25.84h-6.27v25.84h-13.3V8.62h24.89ZM468.77,19.64h-11.11v19.48h11.11c7.41,0,10.74-3.9,10.74-9.88s-3.33-9.59-10.74-9.59Z" />
      <path d="M531.85,75.6c-18.72,0-34.01-14.06-34.01-34.01s15.29-33.92,34.01-33.92,33.92,14.06,33.92,33.92-15.11,34.01-33.92,34.01ZM531.85,63.72c11.97,0,20.24-8.65,20.24-22.14s-8.27-21.95-20.24-21.95-20.33,8.46-20.33,21.95,8.27,22.14,20.33,22.14Z" />
      <path d="M0,74.48L81.37,7.67S187.17,74.34,0,74.48Z" />
    </svg>
  )
}
