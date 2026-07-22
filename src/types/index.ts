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
  salary: string
  likelihood: number // 0-100, subjective gut feeling of fit + odds of winning it
  favorite: boolean
  stage: Stage
  createdAt: string // ISO
  lastUpdatedAt: string // ISO
  lastAdvancedAt: string // ISO — last time the stage moved forward
  nextActionDate: string | null // ISO date, no time
  nextActionNote: string
  history: HistoryEntry[]
  prep: PrepOutput | null
}

export interface BioInfo {
  email: string
  phone: string
  address: string
}

export interface ExperienceEntry {
  id: string
  from: string
  to: string
  employer: string
  role: string
  description: string
}

export interface EducationEntry {
  id: string
  from: string
  to: string
  college: string
  degree: string
}

export interface Profile {
  name: string
  bio: BioInfo
  careerObjective: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  coreCompetencies: string[]
  trainingCertifications: string[]
}
