import { Ghost } from '../components/Ghost'
import { STATUS_CATALOG, colorClasses, type StatusKey } from '../lib/status'
import { STAGES } from '../types'

const STATUS_ORDER: StatusKey[] = ['active', 'quiet', 'ghosted', 'texted-back', 'offer', 'rejected']

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function About() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
          <Ghost className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">About Ghosted.</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A job-search tracker for people who are done getting ghosted quietly.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <SectionCard title="What it does">
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Track every pipeline manually</span> —
              company, role, job description, salary, and stage ({STAGES.join(' → ')}).
            </li>
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Log updates and stage changes</span> as
              they happen, with a full history per pipeline.
            </li>
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Set a next-action date</span> so
              follow-ups don't quietly slip.
            </li>
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Rate your own gut feeling</span> — a
              0-100% likelihood score for "is this the one, and can I actually win it."
            </li>
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Favorite and reorder pipelines</span> —
              drag cards to prioritize the ones you care about most, or sort by likelihood to see your best shots
              first.
            </li>
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Get staleness nudges</span> — the
              dashboard flags pipelines that have gone quiet or fully ghosted so nothing slips through.
            </li>
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Generate tailored AI prep</span> per
              pipeline: CV bullets, a cover letter, and interview talking points — built from that pipeline's JD, your
              CV/experience profile, and the pipeline's current stage, not a generic template.
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="What the status labels mean">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every pipeline gets a status badge based on how long it's been since your last update (or, for closed
            pipelines, the stage itself). Hover any badge in the app for this same explanation.
          </p>
          <ul className="mt-3 space-y-2">
            {STATUS_ORDER.map((key) => {
              const status = STATUS_CATALOG[key]
              const c = colorClasses[status.color]
              return (
                <li key={key} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                  <span
                    className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${c.bg} ${c.text} ${c.ring}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                    {status.label}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{status.description}</span>
                </li>
              )
            })}
          </ul>
        </SectionCard>

        <SectionCard title="A note on the AI">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Prep generation in this prototype is a deterministic keyword-matcher, not a live model call — it works
            offline and costs nothing to demo, by design. It matches your job description against your CV/experience
            profile to produce output that's tailored per pipeline and per stage, which is the actual point: prep
            quality should depend on your real history and where you are in that specific process, not just "paste a
            JD, get a cover letter."
          </p>
        </SectionCard>
      </div>
    </div>
  )
}
