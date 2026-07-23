import { useState } from 'react'
import type { PrepOutput } from '../types'

type Tab = 'cv' | 'letter' | 'talking'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export function PrepOutputView({ prep }: { prep: PrepOutput }) {
  const [tab, setTab] = useState<Tab>('cv')

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'cv' as Tab, label: 'CV bullets' },
          { key: 'letter' as Tab, label: 'Cover letter' },
          { key: 'talking' as Tab, label: 'Talking points' },
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
        {tab === 'cv' && (
          <div>
            <div className="flex justify-end">
              <CopyButton text={prep.cvBullets.map((b) => `- ${b}`).join('\n')} />
            </div>
            <ul className="mt-2 space-y-2 text-sm">
              {prep.cvBullets.map((b, i) => (
                <li key={i} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'letter' && (
          <div>
            <div className="flex justify-end">
              <CopyButton text={prep.coverLetter} />
            </div>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-2 font-sans text-sm dark:bg-slate-800/60">
              {prep.coverLetter}
            </pre>
          </div>
        )}

        {tab === 'talking' && (
          <div>
            <div className="flex justify-end">
              <CopyButton text={prep.talkingPoints.map((p) => `- ${p}`).join('\n')} />
            </div>
            <ul className="mt-2 space-y-2 text-sm">
              {prep.talkingPoints.map((p, i) => (
                <li key={i} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
