import { Link } from 'react-router-dom'
import type { Pipeline } from '../types'
import { StatusBadge, StageBadge } from './StatusBadge'
import { LikelihoodBar } from './LikelihoodBar'
import { FavoriteToggle } from './FavoriteToggle'
import { useStore } from '../store/store'

function formatDate(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function daysAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (d === 0) return 'today'
  if (d === 1) return '1 day ago'
  return `${d} days ago`
}

export function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  const { toggleFavorite } = useStore()
  const isOverdue = pipeline.nextActionDate && new Date(pipeline.nextActionDate) < new Date(new Date().toDateString())

  return (
    <Link
      to={`/pipeline/${pipeline.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <FavoriteToggle size="sm" favorite={pipeline.favorite} onToggle={() => toggleFavorite(pipeline.id)} />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">{pipeline.company}</h3>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">{pipeline.role}</p>
          </div>
        </div>
        <StatusBadge pipeline={pipeline} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StageBadge stage={pipeline.stage} />
        <span className="text-xs text-slate-400">Updated {daysAgo(pipeline.lastUpdatedAt)}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="truncate text-xs text-slate-500 dark:text-slate-400">{pipeline.salary || 'Salary not added'}</span>
        <LikelihoodBar value={pipeline.likelihood} size="sm" />
      </div>

      {pipeline.nextActionDate && (
        <div className={`mt-3 rounded-lg px-2.5 py-1.5 text-xs ${isOverdue ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300'}`}>
          {isOverdue ? 'Overdue: ' : 'Next: '}
          {pipeline.nextActionNote || 'Next action'} · {formatDate(pipeline.nextActionDate)}
        </div>
      )}
    </Link>
  )
}
