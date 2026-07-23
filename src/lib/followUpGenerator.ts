import type { FollowUpDraft, Pipeline, Profile, Stage } from '../types'
import { extractKeywords, pickRelevantExperienceLines } from './prepGenerator'

const STAGE_TOUCH_NOUN: Record<Stage, string> = {
  Applied: 'my application',
  Screening: 'our conversation',
  Interview: 'the interview process',
  Offer: 'the offer',
  Rejected: 'the process',
}

function daysSince(iso: string, now: Date): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
}

function buildValueAddLine(pipeline: Pipeline, profile: Profile): string {
  const keywords = extractKeywords(pipeline.jdText)
  const [top] = pickRelevantExperienceLines(profile, keywords, 1)
  if (!top) return ''
  return `Since we last connected, I keep coming back to how this could apply here: "${top.text}"`
}

export function generateFollowUp(pipeline: Pipeline, profile: Profile, now: Date = new Date()): FollowUpDraft {
  const days = daysSince(pipeline.lastUpdatedAt, now)
  const touch = STAGE_TOUCH_NOUN[pipeline.stage]
  const name = profile.name || '[Your name]'
  const valueAdd = buildValueAddLine(pipeline, profile)
  const severe = days >= 14

  const closingLine = severe
    ? "No worries if priorities have shifted on your end — just let me know either way so I can plan accordingly."
    : "Totally understand hiring can take time — just wanted to make sure I'm still on your radar."

  const email = `Subject: Checking in — ${pipeline.role} at ${pipeline.company}

Hi there,

Hope you're doing well. I wanted to follow up on ${touch} for the ${pipeline.role} role — it's been about ${days} day${days === 1 ? '' : 's'} since we last touched base, and I'm still genuinely interested in the opportunity.
${valueAdd ? `\n${valueAdd}\n` : ''}
${closingLine} Happy to answer anything else in the meantime, or hop on a quick call if that's easier.

Best,
${name}`

  const linkedin = `Hi! Following up on the ${pipeline.role} role at ${pipeline.company} — still very interested and wanted to check in on where things stand. ${
    severe ? "No pressure at all, just didn't want to lose touch." : 'Happy to wait, just wanted to stay top of mind.'
  } Thanks!`

  return {
    generatedAt: now.toISOString(),
    email,
    linkedin,
  }
}
