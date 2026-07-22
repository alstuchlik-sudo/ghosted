import type { Pipeline } from '../types'
import { colorClasses, getStatus } from '../lib/status'

export function StatusBadge({ pipeline }: { pipeline: Pipeline }) {
  const status = getStatus(pipeline)
  const c = colorClasses[status.color]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${c.bg} ${c.text} ${c.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {status.label}
    </span>
  )
}

const STAGE_STYLES: Record<string, string> = {
  Applied: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Screening: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  Interview: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  Offer: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Rejected: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

export function StageBadge({ stage }: { stage: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STAGE_STYLES[stage] ?? ''}`}>
      {stage}
    </span>
  )
}
