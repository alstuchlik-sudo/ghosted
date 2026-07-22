import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/store'
import { PipelineCard } from '../components/PipelineCard'
import { Ghost } from '../components/Ghost'
import { getStatus, type StatusKey } from '../lib/status'
import type { Pipeline } from '../types'

const STATUS_ORDER: StatusKey[] = ['ghosted', 'quiet', 'texted-back', 'active', 'offer', 'rejected']

function statusRank(p: Pipeline) {
  return STATUS_ORDER.indexOf(getStatus(p).key)
}

export function Dashboard() {
  const { pipelines } = useStore()
  const [filter, setFilter] = useState<StatusKey | 'all'>('all')

  const ghostedCount = pipelines.filter((p) => getStatus(p).key === 'ghosted').length
  const quietCount = pipelines.filter((p) => getStatus(p).key === 'quiet').length

  const sorted = useMemo(() => [...pipelines].sort((a, b) => statusRank(a) - statusRank(b)), [pipelines])

  const visible = filter === 'all' ? sorted : sorted.filter((p) => getStatus(p).key === filter)

  if (pipelines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-700 dark:bg-slate-900">
        <Ghost className="h-12 w-12 text-slate-300 dark:text-slate-700" />
        <h2 className="mt-4 text-lg font-semibold">No pipelines yet — a little too quiet in here.</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Add your first application and start tracking before it has the chance to ghost you.
        </p>
        <Link
          to="/pipeline/new"
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          + Add a pipeline
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your pipelines</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {pipelines.length} active application{pipelines.length === 1 ? '' : 's'} being tracked.
          </p>
        </div>
        <Link
          to="/pipeline/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          + Add a pipeline
        </Link>
      </div>

      {(ghostedCount > 0 || quietCount > 0) && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {ghostedCount > 0 && (
            <button
              onClick={() => setFilter(filter === 'ghosted' ? 'all' : 'ghosted')}
              className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                filter === 'ghosted'
                  ? 'border-rose-300 bg-rose-100 dark:border-rose-800 dark:bg-rose-950/60'
                  : 'border-rose-200 bg-rose-50 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:hover:bg-rose-950/60'
              }`}
            >
              <span className="font-semibold text-rose-700 dark:text-rose-300">
                👻 {ghostedCount} pipeline{ghostedCount === 1 ? '' : 's'} just crossed into ghost territory.
              </span>
              <span className="mt-0.5 block text-rose-600/80 dark:text-rose-400/80">Tap to see which ones need a nudge.</span>
            </button>
          )}
          {quietCount > 0 && (
            <button
              onClick={() => setFilter(filter === 'quiet' ? 'all' : 'quiet')}
              className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                filter === 'quiet'
                  ? 'border-amber-300 bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60'
                  : 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:hover:bg-amber-950/60'
              }`}
            >
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                🤫 {quietCount} pipeline{quietCount === 1 ? '' : 's'} getting quiet.
              </span>
              <span className="mt-0.5 block text-amber-600/80 dark:text-amber-400/80">Still time to follow up before it goes cold.</span>
            </button>
          )}
        </div>
      )}

      {filter !== 'all' && (
        <button onClick={() => setFilter('all')} className="mt-3 text-xs font-medium text-slate-500 underline hover:text-slate-700 dark:text-slate-400">
          Clear filter
        </button>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <PipelineCard key={p.id} pipeline={p} />
        ))}
      </div>
    </div>
  )
}
