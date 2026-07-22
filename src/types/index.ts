export type Stage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected'

export const STAGES: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected']

export interface HistoryEntry {
  id: string
  date: string // ISO
  note: string
  stage: Stage
}

export interface PrepOutput {
  generatedAt: string // ISO
  stage: Stage
  cvBullets: string[]
  coverLetter: string
  talkingPoints: string[]
}

export interface Pipeline {
  id: string
  company: string
  role: string
  jdText: string
  jdLink: string
  stage: Stage
  createdAt: string // ISO
  lastUpdatedAt: string // ISO
  lastAdvancedAt: string // ISO — last time the stage moved forward
  nextActionDate: string | null // ISO date, no time
  nextActionNote: string
  history: HistoryEntry[]
  prep: PrepOutput | null
}

export interface Profile {
  name: string
  cvText: string
}
