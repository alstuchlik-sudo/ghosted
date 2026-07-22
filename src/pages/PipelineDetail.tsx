import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/store'
import { StatusBadge, StageBadge } from '../components/StatusBadge'
import { PrepOutputView } from '../components/PrepOutputView'
import { STAGES, type Stage } from '../types'
import { nextStage } from '../lib/status'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function PipelineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pipelines, logUpdate, deletePipeline, generatePrepFor, profile } = useStore()
  const pipeline = pipelines.find((p) => p.id === id)

  const [note, setNote] = useState('')
  const [stageChoice, setStageChoice] = useState<Stage | ''>('')
  const [generating, setGenerating] = useState(false)

  if (!pipeline) {
    return <p className="text-sm text-slate-500">Pipeline not found.</p>
  }

  const suggestedNext = nextStage(pipeline.stage)
  const hasCv = profile.cvText.trim().length > 0

  function handleLogUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!pipeline) return
    const finalNote = note.trim() || (stageChoice ? `Moved to ${stageChoice}` : 'Update logged')
    logUpdate(pipeline.id, finalNote, stageChoice || undefined)
    setNote('')
    setStageChoice('')
  }

  async function handleGenerate() {
    if (!pipeline) return
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 550))
    generatePrepFor(pipeline.id)
    setGenerating(false)
  }

  function handleDelete() {
    if (!pipeline) return
    if (confirm(`Delete the ${pipeline.company} pipeline? This can't be undone.`)) {
      deletePipeline(pipeline.id)
      navigate('/')
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        ← All pipelines
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{pipeline.company}</h1>
          <p className="text-slate-500 dark:text-slate-400">{pipeline.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <StageBadge stage={pipeline.stage} />
          <StatusBadge pipeline={pipeline} />
        </div>
      </div>

      <div className="mt-2 flex gap-3 text-sm">
        <Link to={`/pipeline/${pipeline.id}/edit`} className="text-slate-500 underline hover:text-slate-700 dark:text-slate-400">
          Edit details
        </Link>
        {pipeline.jdLink && (
          <a href={pipeline.jdLink} target="_blank" rel="noreferrer" className="text-slate-500 underline hover:text-slate-700 dark:text-slate-400">
            View JD link
          </a>
        )}
        <button onClick={handleDelete} className="text-rose-500 underline hover:text-rose-700">
          Delete
        </button>
      </div>

      {pipeline.nextActionDate && (
        <div className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800/60">
          Next action: <span className="font-medium">{pipeline.nextActionNote || 'Follow up'}</span> ·{' '}
          {new Date(pipeline.nextActionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      )}

      {/* Log update */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Log an update</h2>
        <form onSubmit={handleLogUpdate} className="mt-3 space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="What happened? e.g. 'Recruiter called, scheduling onsite.'"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={stageChoice}
              onChange={(e) => setStageChoice(e.target.value as Stage | '')}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Keep stage: {pipeline.stage}</option>
              {STAGES.filter((s) => s !== pipeline.stage).map((s) => (
                <option key={s} value={s}>
                  Move to {s}
                  {s === suggestedNext ? ' (next)' : ''}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Log update
            </button>
          </div>
        </form>
      </section>

      {/* AI Prep */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">AI prep</h2>
          <button
            onClick={handleGenerate}
            disabled={generating || !hasCv}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? 'Generating…' : pipeline.prep ? 'Regenerate prep' : 'Generate prep'}
          </button>
        </div>
        {!hasCv && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            Add your CV/experience on the{' '}
            <Link to="/profile" className="underline">
              My CV
            </Link>{' '}
            page first — prep generation uses it to tailor output.
          </p>
        )}
        <p className="mt-1 text-xs text-slate-400">
          Tailored using this pipeline's JD + your CV, for the current stage: <span className="font-medium">{pipeline.stage}</span>.
        </p>

        <div className="mt-3">
          {pipeline.prep ? (
            <PrepOutputView prep={pipeline.prep} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No prep generated yet for this pipeline.
            </div>
          )}
        </div>
      </section>

      {/* History */}
      <section className="mt-6">
        <h2 className="font-semibold">History</h2>
        <ol className="mt-3 space-y-3 border-l border-slate-200 pl-4 dark:border-slate-800">
          {pipeline.history.map((h) => (
            <li key={h.id} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-slate-400" />
              <div className="text-sm">
                <span className="font-medium">{h.stage}</span> · <span className="text-slate-400">{formatDateTime(h.date)}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{h.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
