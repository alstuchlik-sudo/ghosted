import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/store'
import { STAGES, type Stage } from '../types'

export function PipelineForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { pipelines, addPipeline, updatePipeline } = useStore()
  const existing = isEdit ? pipelines.find((p) => p.id === id) : undefined

  const [company, setCompany] = useState(existing?.company ?? '')
  const [role, setRole] = useState(existing?.role ?? '')
  const [jdText, setJdText] = useState(existing?.jdText ?? '')
  const [jdLink, setJdLink] = useState(existing?.jdLink ?? '')
  const [salary, setSalary] = useState(existing?.salary ?? '')
  const [likelihood, setLikelihood] = useState(existing?.likelihood ?? 50)
  const [stage, setStage] = useState<Stage>(existing?.stage ?? 'Applied')
  const [nextActionDate, setNextActionDate] = useState(existing?.nextActionDate ?? '')
  const [nextActionNote, setNextActionNote] = useState(existing?.nextActionNote ?? '')

  if (isEdit && !existing) {
    return <p className="text-sm text-slate-500">Pipeline not found.</p>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return

    if (isEdit && existing) {
      updatePipeline(existing.id, {
        company: company.trim(),
        role: role.trim(),
        jdText,
        jdLink,
        salary,
        likelihood,
        nextActionDate: nextActionDate || null,
        nextActionNote,
      })
      navigate(`/pipeline/${existing.id}`)
    } else {
      const id = addPipeline({
        company: company.trim(),
        role: role.trim(),
        jdText,
        jdLink,
        salary,
        likelihood,
        stage,
        nextActionDate: nextActionDate || null,
        nextActionNote,
      })
      navigate(`/pipeline/${id}`)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">{isEdit ? 'Edit pipeline' : 'Add a pipeline'}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        The job description matters — it's what makes your AI prep tailored instead of generic.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Northwind Analytics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Senior Product Manager"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Job description</label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="Paste the JD text here — used to tailor your prep."
          />
        </div>

        <div>
          <label className="block text-sm font-medium">JD link (optional)</label>
          <input
            value={jdLink}
            onChange={(e) => setJdLink(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Salary</label>
          <input
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="e.g. $140k–160k, or Not disclosed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Gut feeling: is this the one? <span className="font-normal text-slate-400">({likelihood}%)</span>
          </label>
          <p className="mt-0.5 text-xs text-slate-400">
            Your subjective read on fit + odds of winning it — not a science, just a gut check.
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={likelihood}
            onChange={(e) => setLikelihood(Number(e.target.value))}
            className="mt-2 w-full accent-slate-900 dark:accent-white"
          />
        </div>

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium">Current stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as Stage)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Next action date</label>
            <input
              type="date"
              value={nextActionDate ?? ''}
              onChange={(e) => setNextActionDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Next action note</label>
            <input
              value={nextActionNote}
              onChange={(e) => setNextActionNote(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Follow up with recruiter"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isEdit ? 'Save changes' : 'Add pipeline'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
