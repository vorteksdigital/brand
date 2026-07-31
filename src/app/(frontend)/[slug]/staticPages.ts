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
  projects: createStaticPage({
    description: 'Selected work from VRTKS Digital.',
    slug: 'projects',
    title: 'Projects',
  }),
  about: createStaticPage({
    description: 'Learn more about VRTKS Digital.',
    slug: 'about',
    title: 'About',
  }),
  contact: createStaticPage({
    description: 'Get in touch with VRTKS Digital.',
    slug: 'contact',
    title: 'Contact',
  }),
}

export const staticPageSlugs = Object.keys(staticPages)
