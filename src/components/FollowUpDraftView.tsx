import { useState } from 'react'
import type { FollowUpDraft } from '../types'
import { CopyButton } from './PrepOutputView'

type Tab = 'email' | 'linkedin'

export function FollowUpDraftView({ draft }: { draft: FollowUpDraft }) {
  const [tab, setTab] = useState<Tab>('email')

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'email' as Tab, label: 'Email' },
          { key: 'linkedin' as Tab, label: 'LinkedIn message' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-b-2 border-slate-900 text-slate-900 dark:border-white dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === 'email' && (
          <div>
            <div className="flex justify-end">
              <CopyButton text={draft.email} />
            </div>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-2 font-sans text-sm dark:bg-slate-800/60">
              {draft.email}
            </pre>
          </div>
        )}

        {tab === 'linkedin' && (
          <div>
            <div className="flex justify-end">
              <CopyButton text={draft.linkedin} />
            </div>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-2 font-sans text-sm dark:bg-slate-800/60">
              {draft.linkedin}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
