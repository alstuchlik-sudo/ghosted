import { useState } from 'react'
import { useStore } from '../store/store'

export function Profile() {
  const { profile, updateProfile } = useStore()
  const [name, setName] = useState(profile.name)
  const [cvText, setCvText] = useState(profile.cvText)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateProfile({ name, cvText })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">My CV & experience</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        This is the context the AI prep generator pulls from — the more detail here, the more tailored your CV bullets,
        cover letters, and talking points will be.
      </p>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">CV / experience</label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            rows={18}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="Paste your CV or a summary of your experience, one bullet per line..."
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Save
          </button>
          {saved && <span className="text-sm text-teal-600 dark:text-teal-400">Saved.</span>}
        </div>
      </form>
    </div>
  )
}
