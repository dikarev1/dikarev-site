export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  bullets: string[];
  isCurrent: boolean;
}

export interface ExperienceSection {
  heading: string;
  subtitle: string;
  items: ExperienceItem[];
}
