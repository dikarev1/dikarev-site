export interface ResumeProfile {
  name: string
  title: string
  summary: string
}

export interface ResumeRole {
  title: string
  company: string
  location: string
  period: string
  bullets: string[]
}

export interface ResumeEducation {
  institution: string
  faculty: string
  specialty: string
  period: string
}

export interface ResumeContact {
  type: string
  value: string
  href?: string
}

export interface ResumeLanguage {
  name: string
  level: string
}

export interface ResumeData {
  profile: ResumeProfile
  roles: ResumeRole[]
  education: ResumeEducation
  contacts: ResumeContact[]
  languages: ResumeLanguage[]
}
