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
              <span className="font-medium text-slate-900 dark:text-slate-100">See a Ghost Risk Score per pipeline</span>{' '}
              — a predictive read on how likely this one is to go quiet, before it actually does.
            </li>
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Get a follow-up drafted for you</span> —
              the moment a pipeline crosses into "Getting quiet" or "Ghosted," a "Draft a follow-up" button appears
              with a ready-to-send email and LinkedIn message.
            </li>
            <li>
              <span className="font-medium text-slate-900 dark:text-slate-100">Generate tailored AI prep</span> per
              pipeline: CV bullets, a cover letter, and interview talking points — built from that pipeline's JD, your
              CV/experience profile, and the pipeline's current stage, not a generic template.
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Ghost Risk Score">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Every open pipeline (Applied, Screening, Interview) gets a 0-100% risk score estimating how likely it is
            to go quiet, shown on its card and detail page along with the top reasons behind the number. It's a
            heuristic, not a fortune-teller — but it's a lot more useful than a flat "N days = stale" timer, because
            it actually weighs the signals that tend to predict ghosting:
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>• How long it's been since your last update on this pipeline (the biggest factor)</li>
            <li>• Stage — earlier stages (Applied) carry more baseline risk than a live Interview loop</li>
            <li>• Role seniority — parsed from the role title (senior/leadership roles tend to have slower,
              multi-stakeholder processes; high-volume entry-level roles get less individual follow-through)</li>
            <li>• How the JD reads — vague language ("fast-paced," "wear many hats"), thin detail, no
              team/reporting info, or no salary listed all correlate with quieter processes</li>
          </ul>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Resolved pipelines (Offer, Rejected) don't get a score — the risk isn't relevant once the outcome is
            known.
          </p>
        </SectionCard>

        <SectionCard title="Auto-drafted follow-ups">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            This closes the loop from "detected" to "sent." As soon as a pipeline's status crosses into{' '}
            <span className="font-medium text-slate-900 dark:text-slate-100">Getting quiet</span> or{' '}
            <span className="font-medium text-slate-900 dark:text-slate-100">Ghosted</span>, a "Follow-up nudge"
            section appears automatically on that pipeline's detail page — you don't have to remember to go looking
            for it. One click on "Draft a follow-up" generates both an email and a short LinkedIn message, tailored
            to the stage and exactly how long it's been since your last contact, in a tone that's neither desperate
            nor passive. Copy, paste, send.
          </p>
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
            Every "AI" feature here — prep generation, the Ghost Risk Score, and follow-up drafts — is a deterministic
            heuristic, not a live model call. No API key, no backend, works offline, costs nothing to demo. That's a
            deliberate choice for this prototype, not a limitation being hidden: each one matches real inputs (the
            JD, your CV/experience profile, time elapsed, stage) against explainable rules, which is the actual
            point — output that's tailored to your specific situation, not a generic template dressed up as AI.
          </p>
        </SectionCard>
      </div>
    </div>
  )
}
