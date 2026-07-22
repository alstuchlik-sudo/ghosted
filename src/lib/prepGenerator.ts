import type { Pipeline, PrepOutput, Profile, Stage } from '../types'

const SKILL_LEXICON = [
  'product strategy', 'roadmap', 'roadmapping', 'user research', 'customer discovery',
  'a/b testing', 'experimentation', 'sql', 'data-informed', 'onboarding', 'activation',
  'stakeholder management', 'cross-functional', 'agile', 'scrum', 'prd', 'compliance',
  'pci-dss', 'reconciliation', 'payments', 'growth', 'retention', 'churn', 'usability',
  'figma', 'jira', 'backlog', 'discovery', 'exec', 'b2b', 'saas', 'healthcare',
  'patient', 'self-serve', 'time-to-value', 'metrics',
]

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase()
  const found = SKILL_LEXICON.filter((term) => lower.includes(term))
  return Array.from(new Set(found))
}

function splitSentences(text: string): string[] {
  return text
    .split(/\n+/)
    .map((s) => s.replace(/^[-•\s]+/, '').trim())
    .filter((s) => s.length > 20)
}

function scoreBulletAgainstKeywords(bullet: string, keywords: string[]): number {
  const lower = bullet.toLowerCase()
  return keywords.reduce((score, kw) => (lower.includes(kw) ? score + 1 : score), 0)
}

function isAccomplishmentLine(line: string): boolean {
  // Skills/tools lists read as long comma-separated runs with no verb — exclude them
  // so only real accomplishment bullets are surfaced.
  const commaCount = (line.match(/,/g) ?? []).length
  return commaCount < 4
}

function pickRelevantCvLines(cvText: string, keywords: string[], count: number): string[] {
  const lines = splitSentences(cvText).filter((l) => l.startsWith('-') === false).filter(isAccomplishmentLine)
  const bulletLines = splitSentences(cvText).filter((l) => /^[A-Z]/.test(l)).filter(isAccomplishmentLine)
  const candidates = bulletLines.length > 0 ? bulletLines : lines
  const ranked = candidates
    .map((line) => ({ line, score: scoreBulletAgainstKeywords(line, keywords) }))
    .sort((a, b) => b.score - a.score)
  const top = ranked.filter((r) => r.score > 0).slice(0, count)
  if (top.length < count) {
    const rest = ranked.filter((r) => r.score === 0).slice(0, count - top.length)
    return [...top, ...rest].map((r) => r.line)
  }
  return top.map((r) => r.line)
}

function tailorBullet(line: string, keywords: string[], company: string): string {
  const matched = keywords.find((kw) => line.toLowerCase().includes(kw))
  if (matched) {
    return `${line} — directly relevant to ${company}'s focus on ${matched}.`
  }
  return line
}

function buildCvBullets(jdText: string, cvText: string, company: string): string[] {
  const keywords = extractKeywords(jdText)
  const relevant = pickRelevantCvLines(cvText, keywords, 4)
  if (relevant.length === 0) {
    return [
      `Led cross-functional initiatives directly applicable to the ${company} role — add specific CV detail for a stronger match.`,
    ]
  }
  return relevant.map((line) => tailorBullet(line, keywords, company))
}

const STAGE_LETTER_FOCUS: Record<Stage, string> = {
  Applied: 'why you\'re excited about this specific role and company, establishing fit up front',
  Screening: 'a concise pitch of your relevant impact, tuned for a recruiter skimming for keywords',
  Interview: 'depth — specific, quantified stories that map directly to what the interview loop will probe',
  Offer: 'reaffirming enthusiasm and value as you move into negotiation',
  Rejected: 'nothing — this pipeline has closed, but the letter below is preserved for reference',
}

function buildCoverLetter(pipeline: Pipeline, profile: Profile, keywords: string[]): string {
  const { company, role } = pipeline
  const topSkills = keywords.slice(0, 3)
  const skillsPhrase = topSkills.length > 0 ? topSkills.join(', ') : 'product strategy and cross-functional execution'
  const name = profile.name || 'there'

  return `Dear ${company} Hiring Team,

I'm writing to apply for the ${role} role. What drew me in is how directly this maps to the work I've been doing: ${skillsPhrase} show up repeatedly in the job description, and they're also where I've spent most of my last few years delivering measurable impact.

In my current role, I've led cross-functional teams through the kind of ambiguity this position seems to call for — running discovery, prioritizing ruthlessly, and using data to settle debates instead of opinions. I'd bring that same approach to ${company}, focused specifically on ${skillsPhrase}.

I'd welcome the chance to talk through how my background lines up with what your team is building. Thanks for considering my application.

Best,
${name}

(Focus for this stage: ${STAGE_LETTER_FOCUS[pipeline.stage]}.)`
}

const STAGE_TALKING_POINTS: Record<Stage, string[]> = {
  Applied: [
    'Prepare a 60-second "why this company, why now" — reference something specific from their product or recent news, not generic praise.',
    'Have 2-3 questions ready that show you\'ve used or researched the product.',
    'Know your own story arc: why this role is the logical next step, not a lateral sideways move.',
  ],
  Screening: [
    'Lead with your strongest, most quantified outcome in the first 30 seconds — recruiters are skimming for a fit signal.',
    'Be ready to state your comp expectations range confidently, tied to market data.',
    'Confirm logistics (timeline, team, next steps) — it signals organization and genuine interest.',
  ],
  Interview: [],
  Offer: [
    'Come with your target number and the reasoning behind it (market data, competing offers, scope of role).',
    'Ask about the full package, not just base — equity, bonus, PTO, remote policy.',
    'Reaffirm enthusiasm explicitly — negotiating hard doesn\'t mean sounding lukewarm.',
  ],
  Rejected: [
    'If the door seems open, send a short thank-you note asking to stay in touch for future roles.',
    'Log one specific, honest takeaway from this loop — did a particular story land or fall flat?',
    'Don\'t let one "no" slow the pipeline — keep the next application moving today.',
  ],
}

function buildInterviewTalkingPoints(cvText: string, keywords: string[]): string[] {
  const relevant = pickRelevantCvLines(cvText, keywords, 3)
  return relevant.map((line) => {
    const matched = keywords.find((kw) => line.toLowerCase().includes(kw))
    const promptedBy = matched ? ` (maps to their emphasis on "${matched}")` : ''
    return `STAR story: "${line}"${promptedBy} — practice the Result number out loud.`
  })
}

export function generatePrep(pipeline: Pipeline, profile: Profile): PrepOutput {
  const keywords = extractKeywords(pipeline.jdText)
  const cvBullets = buildCvBullets(pipeline.jdText, profile.cvText, pipeline.company)
  const coverLetter = buildCoverLetter(pipeline, profile, keywords)

  let talkingPoints: string[]
  if (pipeline.stage === 'Interview') {
    talkingPoints = buildInterviewTalkingPoints(profile.cvText, keywords)
  } else {
    talkingPoints = STAGE_TALKING_POINTS[pipeline.stage]
  }

  return {
    generatedAt: new Date().toISOString(),
    stage: pipeline.stage,
    cvBullets,
    coverLetter,
    talkingPoints,
  }
}
