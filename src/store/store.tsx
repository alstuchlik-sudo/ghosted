import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { HistoryEntry, Pipeline, PrepOutput, Profile, Stage } from '../types'
import { makeId } from '../lib/id'
import { buildSeedPipelines, seedProfile } from '../lib/seed'
import { generatePrep } from '../lib/prepGenerator'

// v2: profile shape changed from a free-text cvText field to structured
// bio/experience/education/competencies — bump keys so anyone with old-shape
// data cached gets a clean reseed instead of a blank profile.
const PIPELINES_KEY = 'ghosted:pipelines:v2'
const PROFILE_KEY = 'ghosted:profile:v2'
const SEEDED_KEY = 'ghosted:seeded:v2'

function loadPipelines(): Pipeline[] {
  const raw = localStorage.getItem(PIPELINES_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as Pipeline[]
    } catch {
      return []
    }
  }
  return []
}

function emptyProfile(): Profile {
  return {
    name: '',
    bio: { email: '', phone: '', address: '' },
    careerObjective: '',
    experience: [],
    education: [],
    coreCompetencies: [],
    trainingCertifications: [],
  }
}

function loadProfile(): Profile {
  const raw = localStorage.getItem(PROFILE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.experience)) return parsed as Profile
    } catch {
      // fall through to empty profile
    }
  }
  return emptyProfile()
}

interface StoreValue {
  pipelines: Pipeline[]
  profile: Profile
  addPipeline: (input: {
    company: string
    role: string
    jdText: string
    jdLink: string
    stage: Stage
    nextActionDate: string | null
    nextActionNote: string
  }) => string
  updatePipeline: (id: string, patch: Partial<Pipeline>) => void
  logUpdate: (id: string, note: string, newStage?: Stage) => void
  deletePipeline: (id: string) => void
  generatePrepFor: (id: string) => PrepOutput | null
  updateProfile: (profile: Profile) => void
  resetDemoData: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [pipelines, setPipelines] = useState<Pipeline[]>(() => {
    const existing = loadPipelines()
    if (existing.length > 0 || localStorage.getItem(SEEDED_KEY)) {
      return existing
    }
    return buildSeedPipelines()
  })
  const [profile, setProfile] = useState<Profile>(() => {
    const existing = loadProfile()
    if (existing.experience.length > 0 || existing.careerObjective.trim()) return existing
    if (localStorage.getItem(SEEDED_KEY)) return existing
    return seedProfile
  })

  useEffect(() => {
    localStorage.setItem(PIPELINES_KEY, JSON.stringify(pipelines))
    localStorage.setItem(SEEDED_KEY, '1')
  }, [pipelines])

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  }, [profile])

  const addPipeline: StoreValue['addPipeline'] = useCallback((input) => {
    const now = new Date().toISOString()
    const id = makeId()
    const entry: HistoryEntry = { id: makeId(), date: now, stage: input.stage, note: 'Pipeline created' }
    const pipeline: Pipeline = {
      id,
      company: input.company,
      role: input.role,
      jdText: input.jdText,
      jdLink: input.jdLink,
      stage: input.stage,
      createdAt: now,
      lastUpdatedAt: now,
      lastAdvancedAt: now,
      nextActionDate: input.nextActionDate,
      nextActionNote: input.nextActionNote,
      history: [entry],
      prep: null,
    }
    setPipelines((prev) => [pipeline, ...prev])
    return id
  }, [])

  const updatePipeline: StoreValue['updatePipeline'] = useCallback((id, patch) => {
    setPipelines((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const logUpdate: StoreValue['logUpdate'] = useCallback((id, note, newStage) => {
    const now = new Date().toISOString()
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const stageChanged = newStage && newStage !== p.stage
        const entry: HistoryEntry = { id: makeId(), date: now, stage: newStage ?? p.stage, note }
        return {
          ...p,
          stage: newStage ?? p.stage,
          lastUpdatedAt: now,
          lastAdvancedAt: stageChanged ? now : p.lastAdvancedAt,
          history: [entry, ...p.history],
        }
      }),
    )
  }, [])

  const deletePipeline: StoreValue['deletePipeline'] = useCallback((id) => {
    setPipelines((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const generatePrepFor: StoreValue['generatePrepFor'] = useCallback(
    (id) => {
      const pipeline = pipelines.find((p) => p.id === id)
      if (!pipeline) return null
      const prep = generatePrep(pipeline, profile)
      setPipelines((prev) => prev.map((p) => (p.id === id ? { ...p, prep } : p)))
      return prep
    },
    [pipelines, profile],
  )

  const updateProfile = useCallback((next: Profile) => {
    setProfile(next)
  }, [])

  const resetDemoData = useCallback(() => {
    setPipelines(buildSeedPipelines())
    setProfile(seedProfile)
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      pipelines,
      profile,
      addPipeline,
      updatePipeline,
      logUpdate,
      deletePipeline,
      generatePrepFor,
      updateProfile,
      resetDemoData,
    }),
    [pipelines, profile, addPipeline, updatePipeline, logUpdate, deletePipeline, generatePrepFor, updateProfile, resetDemoData],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
