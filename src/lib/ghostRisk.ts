import type { Pipeline, Stage } from '../types'
import type { StatusInfo } from './status'

export interface GhostRiskResult {
  score: number // 0-100, higher = more likely to go quiet/ghost
  reasons: string[] // top contributing factors, plain English
  applicable: boolean // false for resolved pipelines (Offer/Rejected)
}

const STAGE_BASELINE: Partial<Record<Stage, number>> = {
  Applied: 30,
  Screening: 20,
  Interview: 10,
}

const STAGE_REASON: Partial<Record<Stage, string>> = {
  Applied: "Applied stage — most applications never get a response",
  Screening: 'Early in the process — screens can stall before a real decision',
  Interview: "Mid-interview — least likely stage to ghost, but it happens",
}

const SENIOR_TERMS = ['senior', 'staff', 'principal', 'lead', 'director', 'vp', 'vice president', 'head of', 'chief']
const JUNIOR_TERMS = ['junior', 'associate', 'coordinator', 'entry level', 'entry-level', 'intern']
const VAGUE_MARKERS = [
  'fast-paced', 'wear many hats', 'other duties as assigned', 'rockstar', 'ninja',
  'fast-growing', 'dynamic environment', 'go-getter', 'self-starter',
]
const TEAM_SIGNALS = ['team of', 'reporting to', 'you will report', 'you\'ll report', 'manager', 'squad', 'pod']

function daysSince(iso: string, now: Date): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
}

export function computeGhostRisk(pipeline: Pipeline, now: Date = new Date()): GhostRiskResult {
  if (pipeline.stage === 'Offer' || pipeline.stage === 'Rejected') {
    return { score: 0, reasons: ['Pipeline resolved — ghost risk no longer applies.'], applicable: false }
  }

  const contributions: { points: number; reason: string }[] = []
  const roleLower = pipeline.role.toLowerCase()
  const jdLower = pipeline.jdText.toLowerCase()

  const baseline = STAGE_BASELINE[pipeline.stage] ?? 20
  contributions.push({ points: baseline, reason: STAGE_REASON[pipeline.stage] ?? 'Open pipeline' })

  const daysStale = daysSince(pipeline.lastUpdatedAt, now)
  const timeFactor = Math.min(daysStale * 3, 40)
  if (timeFactor > 0) {
    contributions.push({
      points: timeFactor,
      reason: `${daysStale} day${daysStale === 1 ? '' : 's'} since your last update`,
    })
  }

  if (SENIOR_TERMS.some((t) => roleLower.includes(t))) {
    contributions.push({ points: 8, reason: 'Senior/leadership role — these processes tend to have more stakeholders and stall more' })
  } else if (JUNIOR_TERMS.some((t) => roleLower.includes(t))) {
    contributions.push({ points: 5, reason: 'Entry-level role — high applicant volume often means less individual follow-through' })
  }

  const vagueHits = VAGUE_MARKERS.filter((m) => jdLower.includes(m)).length
  if (vagueHits > 0) {
    contributions.push({ points: Math.min(vagueHits * 3, 9), reason: 'JD leans on vague phrases ("fast-paced", "wear many hats", etc.)' })
  }

  if (pipeline.jdText.trim().length > 0 && pipeline.jdText.trim().length < 200) {
    contributions.push({ points: 10, reason: 'JD is thin on detail' })
  }

  if (pipeline.jdText.trim().length > 0 && !TEAM_SIGNALS.some((t) => jdLower.includes(t))) {
    contributions.push({ points: 5, reason: 'No team or reporting structure mentioned in the JD' })
  }

  if (!pipeline.salary.trim() || /not disclosed/i.test(pipeline.salary)) {
    contributions.push({ points: 5, reason: 'No salary listed — lower transparency correlates with slower/quieter processes' })
  }

  const score = Math.max(0, Math.min(100, contributions.reduce((sum, c) => sum + c.points, 0)))
  const reasons = [...contributions]
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map((c) => c.reason)

  return { score, reasons, applicable: true }
}

export function ghostRiskColor(score: number): StatusInfo['color'] {
  if (score >= 65) return 'coral'
  if (score >= 35) return 'amber'
  return 'teal'
}
