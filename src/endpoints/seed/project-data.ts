import type { RequiredDataFromCollectionSlug } from 'payload'

export type ProjectSeed = {
  client: string
  imageAlt: string
  imageFilename: string
  services: string[]
  slug: string
  summary: string
  title: string
  year: number
}

export const projectSeeds: ProjectSeed[] = [
  {
    client: 'Aperture',
    imageAlt: 'Abstract violet and orange forms suggesting a fast-moving brand system',
    imageFilename: 'mock-building-brands-that-move-at-digital-speed.webp',
    services: ['Brand strategy', 'Digital design', 'Motion'],
    slug: 'signal-shift',
    summary: 'A fast, flexible identity and launch platform built for constant movement.',
    title: 'Signal Shift',
    year: 2026,
  },
  {
    client: 'Northstar',
    imageAlt: 'Interlocking green and indigo forms becoming a clear visual pathway',
    imageFilename: 'mock-turning-complex-products-into-clear-stories.webp',
    services: ['Product design', 'Content design', 'Development'],
    slug: 'clear-systems',
    summary: 'A clearer product story and modular interface for a complex technology platform.',
    title: 'Clear Systems',
    year: 2026,
  },
  {
    client: 'Common Ground',
    imageAlt: 'Warm gold and electric blue forms surrounding an abstract AI core',
    imageFilename: 'mock-designing-for-trust-in-an-ai-first-world.webp',
    services: ['Research', 'Experience design', 'Creative direction'],
    slug: 'trust-layer',
    summary: 'A trustworthy digital experience for people navigating emerging AI tools.',
    title: 'Trust Layer',
    year: 2025,
  },
  {
    client: 'Metric',
    imageAlt: 'Geometric red and cyan interface layers arranged into a conversion path',
    imageFilename: 'mock-the-anatomy-of-a-high-converting-website.webp',
    services: ['Web design', 'Conversion strategy', 'Development'],
    slug: 'conversion-engine',
    summary: 'A performance-led website system designed to turn attention into action.',
    title: 'Conversion Engine',
    year: 2025,
  },
  {
    client: 'Fieldwork',
    imageAlt: 'Magenta and lime fragments converging into a bold new brand direction',
    imageFilename: 'mock-from-brand-audit-to-bold-new-direction.webp',
    services: ['Brand audit', 'Identity', 'Campaign'],
    slug: 'bold-direction',
    summary: 'A bold new direction shaped from the strongest parts of an existing brand.',
    title: 'Bold Direction',
    year: 2024,
  },
  {
    client: 'Loop',
    imageAlt: 'Flowing pink and blue ribbons suggesting memorable interface motion',
    imageFilename: 'mock-how-motion-makes-digital-experiences-memorable.webp',
    services: ['Motion system', 'Interaction design', 'Art direction'],
    slug: 'motion-memory',
    summary: 'A motion language that gives every product moment a distinct rhythm.',
    title: 'Motion Memory',
    year: 2024,
  },
]

export function createProjectData(
  project: ProjectSeed,
  featuredImage: number,
  sortOrder: number,
): RequiredDataFromCollectionSlug<'projects'> {
  return {
    _status: 'published',
    client: project.client,
    featuredImage,
    publishedAt: new Date(`${project.year}-01-15T10:00:00.000Z`).toISOString(),
    services: project.services.map((service) => ({ service })),
    slug: project.slug,
    sortOrder,
    summary: project.summary,
    title: project.title,
    year: project.year,
  }
}
