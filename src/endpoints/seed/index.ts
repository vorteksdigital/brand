import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { createProjectData, projectSeeds } from './project-data'
import { upsertJohannesburgMedia } from './upsert-johannesburg-imagery'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'projects',
  'forms',
  'form-submissions',
  'search',
]

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: { navItems: [] },
      depth: 0,
      context: { disableRevalidate: true },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: { navItems: [] },
      depth: 0,
      context: { disableRevalidate: true },
    }),
  ])

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [demoAuthor] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
        role: 'editor',
      },
    }),
    ...categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  const mediaByFileName = await upsertJohannesburgMedia({ payload, req })
  const getMedia = (fileName: string) => {
    const media = mediaByFileName.get(fileName)
    if (!media) throw new Error(`Missing seeded Johannesburg media: ${fileName}`)
    return media
  }
  const image1Doc = getMedia('johannesburg-sunset-skyline.webp')
  const image2Doc = getMedia('simmonds-street-johannesburg.webp')
  const image3Doc = getMedia('johannesburg-mural-portrait.webp')
  const imageHomeDoc = getMedia('johannesburg-sunset-skyline.webp')

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding projects...`)

  for (const [sortOrder, project] of projectSeeds.entries()) {
    await payload.create({
      collection: 'projects',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: createProjectData(
        project,
        getMedia(project.imageFilename).id,
        sortOrder,
      ),
    })
  }

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'projects',
              url: '/projects',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'services',
              url: '/approach',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'about',
              url: '/about',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'insights',
              url: '/blogs',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'contact',
              url: '/contact',
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'home',
              url: '/',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'projects',
              url: '/projects',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'services',
              url: '/approach',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'about',
              url: '/about',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'insights',
              url: '/blogs',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'contact',
              url: '/contact',
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'site-settings',
      data: {
        defaultDescription:
          'Websites, digital products and bespoke solutions for startups and growing businesses worldwide.',
        defaultSocialImage: image1Doc.id,
        organisation: {
          name: 'Vorteks Digital',
          email: 'info@vorteksdigital.co.za',
        },
        siteName: 'Vorteks Digital',
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}
