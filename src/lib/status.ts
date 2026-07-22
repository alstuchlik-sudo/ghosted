import type { Pipeline, Stage } from '../types'

export type StatusKey = 'texted-back' | 'active' | 'quiet' | 'ghosted' | 'offer' | 'rejected'

export interface StatusInfo {
  key: StatusKey
  label: string
  color: 'teal' | 'amber' | 'coral' | 'blue' | 'slate'
}

export const STALE_QUIET_DAYS = 7
export const STALE_GHOSTED_DAYS = 14
export const TEXTED_BACK_WINDOW_DAYS = 2

function daysSince(iso: string, now: Date): number {
  const then = new Date(iso).getTime()
  return Math.floor((now.getTime() - then) / (1000 * 60 * 60 * 24))
}

// Single source of truth for label text, color, and meaning per status —
// used by getStatus() below, the StatusBadge hover tooltip, and the About
// page's label glossary, so all three never drift out of sync.
export const STATUS_CATALOG: Record<StatusKey, Omit<StatusInfo, 'key'> & { description: string }> = {
  active: {
    label: 'Active',
    color: 'teal',
    description: `Updated within the last ${STALE_QUIET_DAYS} days — still moving normally.`,
  },
  quiet: {
    label: 'Getting quiet',
    color: 'amber',
    description: `No update in ${STALE_QUIET_DAYS}+ days. Not dead yet, but worth a nudge before it goes cold.`,
  },
  ghosted: {
    label: 'Ghosted',
    color: 'coral',
    description: `No update in ${STALE_GHOSTED_DAYS}+ days. Radio silence — time to follow up or let it go.`,
  },
  'texted-back': {
    label: 'They texted back!',
    color: 'blue',
    description: `The stage moved forward in the last ${TEXTED_BACK_WINDOW_DAYS} days — genuine recent movement.`,
  },
  offer: {
    label: 'They said yes!',
    color: 'blue',
    description: 'This pipeline reached the Offer stage.',
  },
  rejected: {
    label: "It's not you, it's them",
    color: 'slate',
    description: 'This pipeline was marked Rejected.',
  },
}

export const STATUS_DESCRIPTIONS: Record<StatusKey, string> = Object.fromEntries(
  (Object.keys(STATUS_CATALOG) as StatusKey[]).map((key) => [key, STATUS_CATALOG[key].description]),
) as Record<StatusKey, string>

export function getStatus(pipeline: Pipeline, now: Date = new Date()): StatusInfo {
  if (pipeline.stage === 'Offer') {
    return { key: 'offer', ...STATUS_CATALOG.offer }
  }
  if (pipeline.stage === 'Rejected') {
    return { key: 'rejected', ...STATUS_CATALOG.rejected }
  }

  const sinceAdvanced = daysSince(pipeline.lastAdvancedAt, now)
  if (sinceAdvanced <= TEXTED_BACK_WINDOW_DAYS) {
    return { key: 'texted-back', ...STATUS_CATALOG['texted-back'] }
  }

  const sinceUpdate = daysSince(pipeline.lastUpdatedAt, now)
  if (sinceUpdate >= STALE_GHOSTED_DAYS) {
    return { key: 'ghosted', ...STATUS_CATALOG.ghosted }
  }
  if (sinceUpdate >= STALE_QUIET_DAYS) {
    return { key: 'quiet', ...STATUS_CATALOG.quiet }
  }
  return { key: 'active', ...STATUS_CATALOG.active }
}

export function isStale(pipeline: Pipeline, now: Date = new Date()): boolean {
  const status = getStatus(pipeline, now)
  return status.key === 'ghosted'
}

export const colorClasses: Record<StatusInfo['color'], { bg: string; text: string; ring: string; dot: string }> = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    ring: 'ring-teal-200 dark:ring-teal-800',
    dot: 'bg-teal-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-800',
    dot: 'bg-amber-500',
  },
  coral: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-800',
    dot: 'bg-rose-500',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    ring: 'ring-blue-200 dark:ring-blue-800',
    dot: 'bg-blue-500',
  },
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-200 dark:ring-slate-700',
    dot: 'bg-slate-400',
  },
}

export function likelihoodColor(value: number): StatusInfo['color'] {
  if (value >= 70) return 'teal'
  if (value >= 40) return 'amber'
  return 'coral'
}

export function nextStage(stage: Stage): Stage | null {
  const order: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer']
  const idx = order.indexOf(stage)
  if (idx === -1 || idx === order.length - 1) return null
  return order[idx + 1]
}
