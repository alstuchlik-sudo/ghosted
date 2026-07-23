import type { Pipeline, PrepOutput, Profile, Stage } from '../types'

const SKILL_LEXICON = [
  'product strategy', 'roadmap', 'roadmapping', 'user research', 'customer discovery',
  'a/b testing', 'experimentation', 'sql', 'data-informed', 'onboarding', 'activation',
  'stakeholder management', 'cross-functional', 'agile', 'scrum', 'prd', 'compliance',
  'pci-dss', 'reconciliation', 'payments', 'growth', 'retention', 'churn', 'usability',
  'figma', 'jira', 'backlog', 'discovery', 'exec', 'b2b', 'saas', 'healthcare',
  'patient', 'self-serve', 'time-to-value', 'metrics',
]

export function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase()
  const found = SKILL_LEXICON.filter((term) => lower.includes(term))
  return Array.from(new Set(found))
}

function splitDescriptionLines(description: string): string[] {
  return description
    .split(/\n+/)
    .map((s) => s.replace(/^[-•\s]+/, '').trim())
    .filter((s) => s.length > 15)
}

function isAccomplishmentLine(line: string): boolean {
  // Skills/tools lists read as long comma-separated runs with no verb — exclude them
  // so only real accomplishment bullets are surfaced.
  const commaCount = (line.match(/,/g) ?? []).length
  return commaCount < 4
}

function scoreAgainstKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  return keywords.reduce((score, kw) => (lower.includes(kw) ? score + 1 : score), 0)
}

export interface ExperienceLine {
  text: string
  employer: string
  role: string
}

function collectExperienceLines(profile: Profile): ExperienceLine[] {
  const lines: ExperienceLine[] = []
  for (const exp of profile.experience) {
    for (const text of splitDescriptionLines(exp.description).filter(isAccomplishmentLine)) {
      lines.push({ text, employer: exp.employer, role: exp.role })
    }
  }
  return lines
}

export function pickRelevantExperienceLines(profile: Profile, keywords: string[], count: number): ExperienceLine[] {
  const candidates = collectExperienceLines(profile)
  const ranked = candidates
    .map((line) => ({ line, score: scoreAgainstKeywords(line.text, keywords) }))
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

function buildCvBullets(profile: Profile, keywords: string[], company: string): string[] {
  const relevant = pickRelevantExperienceLines(profile, keywords, 4)
  if (relevant.length === 0) {
    return [
      `Add professional experience with specific, quantified outcomes for a stronger match to the ${company} role.`,
    ]
  }
  return relevant.map((line) => tailorBullet(line.text, keywords, company))
}

const STAGE_LETTER_FOCUS: Record<Stage, string> = {
  Applied: 'why you\'re excited about this specific role and company, establishing fit up front',
  Screening: 'a concise pitch of your relevant impact, tuned for a recruiter skimming for keywords',
  Interview: 'depth — specific, quantified stories that map directly to what the interview loop will probe',
  Offer: 'reaffirming enthusiasm and value as you move into negotiation',
  Rejected: 'nothing — this pipeline has closed, but the letter below is preserved for reference',
}

function buildCoverLetter(pipeline: Pipeline, profile: Profile, topSkillsSource: string[]): string {
  const { company, role } = pipeline
  const topSkills = topSkillsSource.slice(0, 3)
  const skillsPhrase = topSkills.length > 0 ? topSkills.join(', ') : 'product strategy and cross-functional execution'
  const name = profile.name || 'there'
  const latest = profile.experience[0]
  const impactLine = latest
    ? `In my current role as ${latest.role} at ${latest.employer}, I've led cross-functional work through exactly the kind of ambiguity this position seems to call for — running discovery, prioritizing ruthlessly, and using data to settle debates instead of opinions.`
    : `I've led cross-functional work through the kind of ambiguity this position seems to call for — running discovery, prioritizing ruthlessly, and using data to settle debates instead of opinions.`
  const objectiveLine = profile.careerObjective.trim()
    ? `\n\nMore broadly, here's what I'm looking for next: ${profile.careerObjective.trim()}`
    : ''

  return `Dear ${company} Hiring Team,

I'm writing to apply for the ${role} role. What drew me in is how directly this maps to the work I've been doing: ${skillsPhrase} show up repeatedly in the job description, and they're also where I've spent most of my time delivering measurable impact.

${impactLine} I'd bring that same approach to ${company}, focused specifically on ${skillsPhrase}.${objectiveLine}

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

function buildInterviewTalkingPoints(profile: Profile, keywords: string[]): string[] {
  const relevant = pickRelevantExperienceLines(profile, keywords, 3)
  const points = relevant.map((line) => {
    const matched = keywords.find((kw) => line.text.toLowerCase().includes(kw))
    const promptedBy = matched ? ` (maps to their emphasis on "${matched}")` : ''
    return `STAR story from ${line.role} at ${line.employer}: "${line.text}"${promptedBy} — practice the Result number out loud.`
  })
  return points.length > 0
    ? points
    : ['Add professional experience with specific outcomes to generate STAR-story talking points.']
}

export function generatePrep(pipeline: Pipeline, profile: Profile): PrepOutput {
  const jdLower = pipeline.jdText.toLowerCase()
  const lexiconKeywords = extractKeywords(pipeline.jdText)
  const matchedCompetencies = profile.coreCompetencies.filter((c) => jdLower.includes(c.toLowerCase()))
  const keywords = Array.from(new Set([...matchedCompetencies.map((c) => c.toLowerCase()), ...lexiconKeywords]))

  const cvBullets = buildCvBullets(profile, keywords, pipeline.company)
  const coverLetter = buildCoverLetter(
    pipeline,
    profile,
    matchedCompetencies.length > 0 ? matchedCompetencies : lexiconKeywords,
  )

  let talkingPoints: string[]
  if (pipeline.stage === 'Interview') {
    talkingPoints = buildInterviewTalkingPoints(profile, keywords)
  } else {
    talkingPoints = STAGE_TALKING_POINTS[pipeline.stage]
  }

  const relevantCert = profile.trainingCertifications.find((cert) =>
    keywords.some((k) => cert.toLowerCase().includes(k)),
  )
  if (pipeline.stage === 'Interview' && relevantCert) {
    talkingPoints = [
      `You have "${relevantCert}" — worth mentioning given their emphasis in this area.`,
      ...talkingPoints,
    ]
  }

  return {
    generatedAt: new Date().toISOString(),
    stage: pipeline.stage,
    cvBullets,
    coverLetter,
    talkingPoints,
  }
}
