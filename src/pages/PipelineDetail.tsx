import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/store'
import { StatusBadge, StageBadge } from '../components/StatusBadge'
import { PrepOutputView } from '../components/PrepOutputView'
import { FollowUpDraftView } from '../components/FollowUpDraftView'
import { LikelihoodBar } from '../components/LikelihoodBar'
import { GhostRiskMeter } from '../components/GhostRiskMeter'
import { FavoriteToggle } from '../components/FavoriteToggle'
import { STAGES, type Stage } from '../types'
import { getStatus, nextStage } from '../lib/status'
import { computeGhostRisk } from '../lib/ghostRisk'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function PipelineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pipelines, logUpdate, deletePipeline, toggleFavorite, generatePrepFor, generateFollowUpFor, profile } =
    useStore()
  const pipeline = pipelines.find((p) => p.id === id)

  const [note, setNote] = useState('')
  const [stageChoice, setStageChoice] = useState<Stage | ''>('')
  const [generating, setGenerating] = useState(false)
  const [drafting, setDrafting] = useState(false)

  if (!pipeline) {
    return <p className="text-sm text-slate-500">Pipeline not found.</p>
  }

  const suggestedNext = nextStage(pipeline.stage)
  const hasCv = profile.experience.length > 0 || profile.careerObjective.trim().length > 0
  const status = getStatus(pipeline)
  const ghostRisk = computeGhostRisk(pipeline)
  const needsNudge = status.key === 'quiet' || status.key === 'ghosted'

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

  async function handleDraftFollowUp() {
    if (!pipeline) return
    setDrafting(true)
    await new Promise((r) => setTimeout(r, 550))
    generateFollowUpFor(pipeline.id)
    setDrafting(false)
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
        <div className="flex items-start gap-3">
          <FavoriteToggle favorite={pipeline.favorite} onToggle={() => toggleFavorite(pipeline.id)} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{pipeline.company}</h1>
            <p className="text-slate-500 dark:text-slate-400">{pipeline.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StageBadge stage={pipeline.stage} />
          <StatusBadge pipeline={pipeline} />
        </div>
      </div>

      {/* Details */}
      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Details</h2>
          <div className="flex items-center gap-4 text-sm">
            <Link
              to={`/pipeline/${pipeline.id}/edit`}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Edit details
            </Link>
            <button onClick={handleDelete} className="text-rose-500 underline hover:text-rose-700">
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Salary</div>
            <div className="mt-1 text-sm">
              {pipeline.salary ? pipeline.salary : <span className="text-slate-400">Not added</span>}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Gut feeling — is this the one?</div>
            <div className="mt-1.5">
              <LikelihoodBar value={pipeline.likelihood} />
            </div>
          </div>
          {ghostRisk.applicable && (
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Ghost risk</div>
              <div className="mt-1.5">
                <GhostRiskMeter risk={ghostRisk} />
              </div>
            </div>
          )}
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Next action</div>
            <div className="mt-1 text-sm">
              {pipeline.nextActionDate ? (
                <>
                  {pipeline.nextActionNote || 'Follow up'} ·{' '}
                  {new Date(pipeline.nextActionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </>
              ) : (
                <span className="text-slate-400">None set</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">JD link</div>
            <div className="mt-1 text-sm">
              {pipeline.jdLink ? (
                <a href={pipeline.jdLink} target="_blank" rel="noreferrer" className="text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400">
                  {pipeline.jdLink}
                </a>
              ) : (
                <span className="text-slate-400">None added</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Job description</div>
          <div className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
            {pipeline.jdText ? pipeline.jdText : <span className="text-slate-400">No JD text added</span>}
          </div>
        </div>
      </section>

      {/* Follow-up nudge — surfaces automatically once this pipeline goes quiet or ghosted */}
      {needsNudge && (
        <section
          className={`mt-6 rounded-xl border p-4 ${
            status.key === 'ghosted'
              ? 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30'
              : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Follow-up nudge</h2>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                {status.key === 'ghosted'
                  ? "This one's gone quiet for a while — here's a draft ready to break the silence."
                  : "This one's getting quiet. Here's a draft ready to send before it goes cold."}
              </p>
            </div>
            <button
              onClick={handleDraftFollowUp}
              disabled={drafting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {drafting ? 'Drafting…' : pipeline.followUpDraft ? 'Redraft' : 'Draft a follow-up'}
            </button>
          </div>

          {pipeline.followUpDraft && (
            <div className="mt-3">
              <FollowUpDraftView draft={pipeline.followUpDraft} />
            </div>
          )}
        </section>
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
