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
    imageAlt: 'Johannesburg skyline glowing in warm evening light',
    imageFilename: 'johannesburg-sunset-skyline.webp',
    services: ['Brand strategy', 'Digital design', 'Motion'],
    slug: 'signal-shift',
    summary: 'A fast, flexible identity and launch platform built for constant movement.',
    title: 'Signal Shift',
    year: 2026,
  },
  {
    client: 'Northstar',
    imageAlt: 'Pedestrians and vehicles on Simmonds Street in central Johannesburg',
    imageFilename: 'simmonds-street-johannesburg.webp',
    services: ['Product design', 'Content design', 'Development'],
    slug: 'clear-systems',
    summary: 'A clearer product story and modular interface for a complex technology platform.',
    title: 'Clear Systems',
    year: 2026,
  },
  {
    client: 'Common Ground',
    imageAlt: 'Reflective glass office towers rising over Sandton',
    imageFilename: 'sandton-glass-towers.webp',
    services: ['Research', 'Experience design', 'Creative direction'],
    slug: 'trust-layer',
    summary: 'A trustworthy digital experience for people navigating emerging AI tools.',
    title: 'Trust Layer',
    year: 2025,
  },
  {
    client: 'Metric',
    imageAlt: 'Glass-fronted modern buildings framed by trees in Melrose Arch',
    imageFilename: 'melrose-arch-modern-building.webp',
    services: ['Web design', 'Conversion strategy', 'Development'],
    slug: 'conversion-engine',
    summary: 'A performance-led website system designed to turn attention into action.',
    title: 'Conversion Engine',
    year: 2025,
  },
  {
    client: 'Fieldwork',
    imageAlt: 'Young woman standing in front of a colourful Johannesburg mural',
    imageFilename: 'johannesburg-mural-portrait.webp',
    services: ['Brand audit', 'Identity', 'Campaign'],
    slug: 'bold-direction',
    summary: 'A bold new direction shaped from the strongest parts of an existing brand.',
    title: 'Bold Direction',
    year: 2024,
  },
  {
    client: 'Loop',
    imageAlt: 'Traffic, buses, and pedestrians moving through central Johannesburg',
    imageFilename: 'joburg-cbd-traffic.webp',
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
