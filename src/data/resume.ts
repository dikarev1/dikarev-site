import type { ResumeData, ResumeRole, ResumeContact, ResumeLanguage } from '../types/resume'

const resumeData: ResumeData = {
  profile: {
    name: 'Pavel Dikarev',
    title: 'Product Manager',
    summary:
      'Product Manager with 5+ years of experience in SaaS and eCommerce. Background in Quality Engineering with transition to Product Management. Proven track record of launching new products, running high-impact A/B tests, and building product processes in growing teams. Delivered measurable results including +20% conversion lift in B2B product experiments and 7% increase in qualified lead conversion after launching a new product.'
  },
  roles: [
    {
      title: 'Product Manager',
      company: 'Ecwid by Lightspeed',
      location: 'Tbilisi, Georgia',
      period: 'Dec 2024 – Jul 2025',
      bullets: [
        'Built and established operating processes within a newly formed product team',
        'Led full-cycle product development from discovery to launch',
        'Launched and shipped a new AI-powered E-commerce solution',
        'Increased qualified lead conversion by 7% post-launch',
        'Coordinated cross-functional collaboration across Engineering, Design, and Marketing',
        'Product launch was publicly announced by Lightspeed Commerce in official press release'
      ]
    },
    {
      title: 'Growth Product Manager',
      company: 'Ecwid by Lightspeed',
      location: 'Tbilisi, Georgia',
      period: 'Jun 2024 – Nov 2024',
      bullets: [
        'Designed and executed 9 A/B tests in B2B environment',
        'Achieved +20% conversion uplift (statistically significant)',
        'Contributed to $1M+ reduction in customer acquisition costs',
        'Supported expansion into new business vertical'
      ]
    },
    {
      title: 'Staff Quality Engineer → Senior QA → QA Engineer',
      company: 'Ecwid by Lightspeed',
      location: 'Tbilisi, Georgia',
      period: 'Feb 2020 – Jul 2024',
      bullets: [
        'Promoted from Junior QA → Senior QA → Staff QA through continuous performance growth',
        'Trained and mentored 8 QA engineers (6 passed probation; 2 promoted to leadership roles)',
        'Improved QA processes and delivery predictability',
        'Contributed to best team performance metrics across the company'
      ]
    },
    {
      title: 'Implementation Engineer → Managing Director',
      company: 'InSoft Retail',
      location: 'Ulyanovsk, Russia',
      period: 'Jul 2018 – Dec 2019',
      bullets: [
        'Led on-site integrations and hardware deployment for 7 restaurant and café openings, including a factory serving 1000+ daily visitors',
        'Ensured stable day-to-day operations across 20 active locations',
        'Managed client relationships and post-deployment support',
        'Oversaw operational processes and team coordination as Managing Director'
      ]
    }
  ],
  education: {
    institution: 'Kazan National Research Technical University',
    faculty: 'Faculty of Radio Engineering and Telecommunications',
    specialty: 'Radio-Frequency Engineer',
    period: '2011 – 2015'
  },
  contacts: [
    { type: 'LinkedIn', value: 'pavel-dikarev', href: 'https://linkedin.com/in/pavel-dikarev' },
    { type: 'Phone', value: '+995 599 899 745', href: 'tel:+995599899745' },
    { type: 'Email', value: 'dikarev.ff@gmail.com', href: 'mailto:dikarev.ff@gmail.com' },
    { type: 'Location', value: 'Tbilisi, Georgia' }
  ],
  languages: [
    { name: 'Russian', level: 'Native' },
    { name: 'English', level: 'B2' }
  ]
}

export function getProfile() {
  return { ...resumeData.profile }
}

export function getRoles(): ResumeRole[] {
  return resumeData.roles.map(role => ({ ...role, bullets: [...role.bullets] }))
}

export function getEducation() {
  return { ...resumeData.education }
}

export function getContacts(): ResumeContact[] {
  return resumeData.contacts.map(c => ({ ...c }))
}

export function getLanguages(): ResumeLanguage[] {
  return resumeData.languages.map(l => ({ ...l }))
}
