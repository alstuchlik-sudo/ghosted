import type { Pipeline, Profile } from '../types'
import { makeId } from './id'

const days = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}
const daysFuture = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const seedProfile: Profile = {
  name: 'Alex Rivera',
  bio: {
    email: 'alex.rivera@example.com',
    phone: '(555) 123-4567',
    address: 'Austin, TX',
  },
  careerObjective:
    'Senior Product Manager with 5 years of experience seeking a role where I can own a core product end-to-end, using customer discovery and experimentation to drive measurable growth.',
  experience: [
    {
      id: makeId(),
      from: '2022',
      to: 'Present',
      employer: 'Loopline',
      role: 'Senior Product Manager',
      description: `Owned the core scheduling product used by 40k+ weekly active users, driving a 22% increase in activation through onboarding redesign
Led cross-functional team of 6 engineers and 2 designers to ship a real-time collaboration feature, reducing customer churn by 8%
Ran quarterly discovery interviews with 30+ customers to prioritize roadmap; introduced a lightweight RICE scoring process adopted company-wide
Partnered with data science to build an experimentation framework (A/B testing) that shaped 12 shipped features`,
    },
    {
      id: makeId(),
      from: '2020',
      to: '2022',
      employer: 'Fintechly',
      role: 'Product Manager',
      description: `Launched a self-serve onboarding flow for SMB customers, cutting time-to-first-value from 9 days to 36 hours
Managed the product backlog for a payments reconciliation tool used by internal finance teams, saving ~15 hours/week of manual work
Collaborated directly with compliance and legal to ship features meeting PCI-DSS requirements
Wrote and maintained PRDs, ran sprint planning, and represented product in exec-level roadmap reviews`,
    },
    {
      id: makeId(),
      from: '2019',
      to: '2020',
      employer: 'BrightHealth',
      role: 'Associate Product Manager',
      description: `Supported the patient intake team, shipping a digital forms product that reduced front-desk paperwork time by 40%
Conducted usability testing sessions and synthesized findings into prioritized backlog items`,
    },
  ],
  education: [
    {
      id: makeId(),
      from: '2015',
      to: '2019',
      college: 'University of Michigan',
      degree: 'B.S. Business Administration',
    },
  ],
  coreCompetencies: [
    'Product strategy',
    'Roadmapping',
    'User research',
    'A/B testing',
    'SQL (intermediate)',
    'Figma',
    'Jira',
    'Stakeholder management',
    'Agile/Scrum',
    'PRD writing',
    'Cross-functional leadership',
    'Data-informed decision making',
  ],
  trainingCertifications: ['Certified Scrum Product Owner (CSPO)', 'Reforge — Product Strategy'],
}

function mkHistory(stage: Pipeline['stage'], daysAgo: number, note: string) {
  return { id: makeId(), date: days(daysAgo), stage, note }
}

export function buildSeedPipelines(): Pipeline[] {
  const p1: Pipeline = {
    id: makeId(),
    company: 'Northwind Analytics',
    role: 'Senior Product Manager',
    jdText: `We're looking for a Senior Product Manager to own our core analytics dashboard product. You'll drive roadmap strategy, run customer discovery, partner with engineering and design on a cross-functional team, and use data (SQL, A/B testing) to prioritize features. Experience with onboarding/activation flows and stakeholder management across exec teams required.`,
    jdLink: '',
    stage: 'Interview',
    createdAt: days(21),
    lastUpdatedAt: days(1),
    lastAdvancedAt: days(1),
    nextActionDate: daysFuture(3),
    nextActionNote: 'Onsite interview — prep talking points on activation work',
    history: [
      mkHistory('Applied', 21, 'Applied via referral from former Loopline colleague'),
      mkHistory('Screening', 15, 'Recruiter screen — 30 min call, discussed comp range'),
      mkHistory('Interview', 1, 'Moved to onsite loop — 4 interviews scheduled'),
    ],
    prep: null,
  }

  const p2: Pipeline = {
    id: makeId(),
    company: 'Fernbank',
    role: 'Product Manager, Payments',
    jdText: `Fernbank is hiring a Product Manager for our Payments team. You'll own reconciliation tooling, work closely with compliance and legal on PCI-DSS requirements, and manage a backlog for internal finance stakeholders. SQL and experimentation experience a plus.`,
    jdLink: '',
    stage: 'Screening',
    createdAt: days(19),
    lastUpdatedAt: days(9),
    lastAdvancedAt: days(9),
    nextActionDate: daysFuture(-2),
    nextActionNote: 'Follow up with recruiter — no word since screen',
    history: [
      mkHistory('Applied', 19, 'Applied through company site'),
      mkHistory('Screening', 9, 'Recruiter screen completed, said "next steps soon"'),
    ],
    prep: null,
  }

  const p3: Pipeline = {
    id: makeId(),
    company: 'Vantable',
    role: 'Product Manager',
    jdText: `Vantable seeks a Product Manager to lead our self-serve SMB onboarding experience. You'll define activation metrics, run usability testing, and partner with design on reducing time-to-value. Prior B2B SaaS onboarding experience strongly preferred.`,
    jdLink: '',
    stage: 'Applied',
    createdAt: days(24),
    lastUpdatedAt: days(24),
    lastAdvancedAt: days(24),
    nextActionDate: null,
    nextActionNote: '',
    history: [mkHistory('Applied', 24, 'Applied cold via job board')],
    prep: null,
  }

  const p4: Pipeline = {
    id: makeId(),
    company: 'Circuit Health',
    role: 'Senior Product Manager, Patient Experience',
    jdText: `Circuit Health is looking for a Senior PM to own patient-facing digital intake products. You'll run discovery with patients and front-desk staff, write PRDs, and lead a cross-functional squad. Healthcare product experience is a strong plus.`,
    jdLink: '',
    stage: 'Screening',
    createdAt: days(30),
    lastUpdatedAt: days(30),
    lastAdvancedAt: days(30),
    nextActionDate: daysFuture(-10),
    nextActionNote: '',
    history: [
      mkHistory('Applied', 30, 'Applied via LinkedIn Easy Apply'),
      mkHistory('Screening', 30, 'Recruiter reached out to schedule screen'),
    ],
    prep: null,
  }

  const p5: Pipeline = {
    id: makeId(),
    company: 'Ashgrove Labs',
    role: 'Product Manager, Growth',
    jdText: `Ashgrove Labs is hiring a Growth PM to own experimentation strategy across acquisition and activation funnels. Heavy A/B testing, SQL, and data-informed decision making required.`,
    jdLink: '',
    stage: 'Rejected',
    createdAt: days(40),
    lastUpdatedAt: days(12),
    lastAdvancedAt: days(12),
    nextActionDate: null,
    nextActionNote: '',
    history: [
      mkHistory('Applied', 40, 'Applied via referral'),
      mkHistory('Screening', 32, 'Recruiter screen'),
      mkHistory('Interview', 20, 'Panel interview with growth team'),
      mkHistory('Rejected', 12, 'Passed — went with someone with more consumer growth experience'),
    ],
    prep: null,
  }

  return [p1, p2, p3, p4, p5]
}
