import { useState } from 'react'
import { useStore } from '../store/store'
import { ChipEditor } from '../components/ChipEditor'
import { makeId } from '../lib/id'
import type { EducationEntry, ExperienceEntry, Profile as ProfileType } from '../types'

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950'

function ExperienceCard({
  entry,
  onChange,
  onRemove,
}: {
  entry: ExperienceEntry
  onChange: (patch: Partial<ExperienceEntry>) => void
  onRemove: () => void
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-start justify-between gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          <input
            value={entry.from}
            onChange={(e) => onChange({ from: e.target.value })}
            placeholder="From (e.g. 2022)"
            className={inputClass}
          />
          <input
            value={entry.to}
            onChange={(e) => onChange({ to: e.target.value })}
            placeholder="To (e.g. Present)"
            className={inputClass}
          />
          <input
            value={entry.employer}
            onChange={(e) => onChange({ employer: e.target.value })}
            placeholder="Employer"
            className={`${inputClass} sm:col-span-2`}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove experience"
          className="mt-1 text-slate-400 hover:text-rose-600"
        >
          ×
        </button>
      </div>
      <input
        value={entry.role}
        onChange={(e) => onChange({ role: e.target.value })}
        placeholder="Role / title"
        className={`${inputClass} mt-2`}
      />
      <textarea
        value={entry.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="What did you do? One accomplishment per line works best for tailored prep."
        rows={4}
        className={`${inputClass} mt-2`}
      />
    </div>
  )
}

function EducationCard({
  entry,
  onChange,
  onRemove,
}: {
  entry: EducationEntry
  onChange: (patch: Partial<EducationEntry>) => void
  onRemove: () => void
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-start justify-between gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          <input
            value={entry.from}
            onChange={(e) => onChange({ from: e.target.value })}
            placeholder="From (e.g. 2015)"
            className={inputClass}
          />
          <input
            value={entry.to}
            onChange={(e) => onChange({ to: e.target.value })}
            placeholder="To (e.g. 2019)"
            className={inputClass}
          />
          <input
            value={entry.college}
            onChange={(e) => onChange({ college: e.target.value })}
            placeholder="College / school"
            className={`${inputClass} sm:col-span-2`}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove education"
          className="mt-1 text-slate-400 hover:text-rose-600"
        >
          ×
        </button>
      </div>
      <input
        value={entry.degree}
        onChange={(e) => onChange({ degree: e.target.value })}
        placeholder="Degree"
        className={`${inputClass} mt-2`}
      />
    </div>
  )
}

export function Profile() {
  const { profile, updateProfile } = useStore()
  const [draft, setDraft] = useState<ProfileType>(profile)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateProfile(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function addExperience() {
    setDraft((prev) => ({
      ...prev,
      experience: [...prev.experience, { id: makeId(), from: '', to: '', employer: '', role: '', description: '' }],
    }))
  }
  function updateExperience(id: string, patch: Partial<ExperienceEntry>) {
    setDraft((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }
  function removeExperience(id: string) {
    setDraft((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }))
  }

  function addEducation() {
    setDraft((prev) => ({
      ...prev,
      education: [...prev.education, { id: makeId(), from: '', to: '', college: '', degree: '' }],
    }))
  }
  function updateEducation(id: string, patch: Partial<EducationEntry>) {
    setDraft((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }
  function removeEducation(id: string) {
    setDraft((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }))
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">My CV & experience</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        This is the context the AI prep generator pulls from — the more detail here, the more tailored your CV
        bullets, cover letters, and talking points will be.
      </p>

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <SectionCard title="Name">
          <input
            value={draft.name}
            onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </SectionCard>

        <SectionCard title="Bio" description="Email, phone number, and address — all optional.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="email"
              value={draft.bio.email}
              onChange={(e) => setDraft((prev) => ({ ...prev, bio: { ...prev.bio, email: e.target.value } }))}
              placeholder="Email"
              className={inputClass}
            />
            <input
              value={draft.bio.phone}
              onChange={(e) => setDraft((prev) => ({ ...prev, bio: { ...prev.bio, phone: e.target.value } }))}
              placeholder="Phone number"
              className={inputClass}
            />
            <input
              value={draft.bio.address}
              onChange={(e) => setDraft((prev) => ({ ...prev, bio: { ...prev.bio, address: e.target.value } }))}
              placeholder="Address"
              className={`${inputClass} sm:col-span-2`}
            />
          </div>
        </SectionCard>

        <SectionCard title="Career objective" description="What are you seeking next?">
          <textarea
            value={draft.careerObjective}
            onChange={(e) => setDraft((prev) => ({ ...prev, careerObjective: e.target.value }))}
            rows={3}
            placeholder="e.g. A senior PM role where I can own a product 0-to-1 and drive activation through experimentation."
            className={inputClass}
          />
        </SectionCard>

        <SectionCard title="Professional experience">
          <div className="space-y-3">
            {draft.experience.map((entry) => (
              <ExperienceCard
                key={entry.id}
                entry={entry}
                onChange={(patch) => updateExperience(entry.id, patch)}
                onRemove={() => removeExperience(entry.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="mt-3 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            + Add experience
          </button>
        </SectionCard>

        <SectionCard title="Education">
          <div className="space-y-3">
            {draft.education.map((entry) => (
              <EducationCard
                key={entry.id}
                entry={entry}
                onChange={(patch) => updateEducation(entry.id, patch)}
                onRemove={() => removeEducation(entry.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="mt-3 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            + Add education
          </button>
        </SectionCard>

        <SectionCard title="Core competencies">
          <ChipEditor
            items={draft.coreCompetencies}
            onChange={(items) => setDraft((prev) => ({ ...prev, coreCompetencies: items }))}
            placeholder="e.g. Product strategy"
          />
        </SectionCard>

        <SectionCard title="Training and certification">
          <ChipEditor
            items={draft.trainingCertifications}
            onChange={(items) => setDraft((prev) => ({ ...prev, trainingCertifications: items }))}
            placeholder="e.g. Certified Scrum Product Owner"
          />
        </SectionCard>

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
