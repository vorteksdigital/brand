import type { RequiredDataFromCollectionSlug } from 'payload'

type StaticPageInput = {
  description: string
  slug: string
  title: string
}

const createStaticPage = ({
  description,
  slug,
  title,
}: StaticPageInput): RequiredDataFromCollectionSlug<'pages'> => ({
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: title,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: description,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  layout: [],
  meta: {
    description,
    title,
  },
  slug,
  title,
})

export const staticPages: Record<string, RequiredDataFromCollectionSlug<'pages'>> = {
  approach: createStaticPage({
    description: 'Website development, digital products and bespoke solutions from Vorteks Digital.',
    slug: 'approach',
    title: 'Approach',
  }),
  projects: createStaticPage({
    description: 'Approved website, product and bespoke solution work from Vorteks Digital.',
    slug: 'projects',
    title: 'Projects',
  }),
  about: createStaticPage({
    description: 'About Vorteks Digital, a global digital studio established in 2020.',
    slug: 'about',
    title: 'About',
  }),
  contact: createStaticPage({
    description: 'Start a website, product or bespoke digital project with Vorteks Digital.',
    slug: 'contact',
    title: 'Contact',
  }),
}

export const staticPageSlugs = Object.keys(staticPages)
