import type { ExperienceItem, ExperienceSection } from "../types/experience";

export const experienceSection: ExperienceSection = {
  heading: "Experience",
  subtitle:
    "A history of high-velocity execution across retail tech and growth-stage startups.",
  items: [
    {
      id: "global-retail-corp",
      period: "2021 — PRESENT",
      role: "Lead Growth Product Manager",
      company: "Global Retail Corp",
      isCurrent: true,
      bullets: [
        "Led a Growth Strike Team of 12 engineers and designers.",
        "Implemented A/B testing framework that increased experiment velocity by 200%.",
        "Architected the referral engine 2.0, cutting CAC by 40% over 6 months.",
      ],
    },
    {
      id: "marketly",
      period: "2018 — 2021",
      role: "Product Manager",
      company: "Marketly E-comm Platform",
      isCurrent: false,
      bullets: [
        "Owned the checkout and payments experience.",
        "Integrated 5+ new payment methods, reducing cart abandonment by 15%.",
      ],
    },
    {
      id: "startup-lab",
      period: "2015 — 2018",
      role: "Associate Product Manager",
      company: "Startup Lab",
      isCurrent: false,
      bullets: [
        "Launched the MVP for a B2C marketplace within 3 months.",
        "Conducted 50+ user interviews and translated findings into product requirements.",
      ],
    },
  ],
};

/**
 * Returns a shallow copy of all experience items so callers cannot mutate
 * the source constant.
 */
export function getExperienceItems(): ExperienceItem[] {
  return [...experienceSection.items];
}

/**
 * Returns the single item marked as current, or null if none exists.
 */
export function getCurrentExperienceItem(): ExperienceItem | null {
  return experienceSection.items.find((item) => item.isCurrent) ?? null;
}

/**
 * Finds an experience item by its unique id.
 * Returns null when the id is not found or is an empty string.
 */
export function findExperienceById(id: string): ExperienceItem | null {
  if (!id) return null;
  return experienceSection.items.find((item) => item.id === id) ?? null;
}

/**
 * Normalises a period string by trimming surrounding whitespace.
 * Returns the string unchanged when trimming has no effect.
 */
export function formatPeriod(period: string): string {
  return period.trim();
}
