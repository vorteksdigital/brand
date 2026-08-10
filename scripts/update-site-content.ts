import config from '@payload-config'
import { getPayload } from 'payload'

import { contactForm } from '../src/endpoints/seed/contact-form'

const payload = await getPayload({ config })

const existingForm = await payload.find({
  collection: 'forms',
  depth: 0,
  limit: 1,
  pagination: false,
  where: { title: { equals: contactForm.title } },
})

if (existingForm.docs[0]) {
  await payload.update({
    collection: 'forms',
    id: existingForm.docs[0].id,
    context: { disableRevalidate: true },
    data: contactForm,
  })
} else {
  await payload.create({
    collection: 'forms',
    context: { disableRevalidate: true },
    data: contactForm,
  })
}

await Promise.all([
  payload.updateGlobal({
    slug: 'header',
    context: { disableRevalidate: true },
    data: {
      navItems: [
        { link: { label: 'projects', type: 'custom', url: '/projects' } },
        { link: { label: 'services', type: 'custom', url: '/approach' } },
        { link: { label: 'about', type: 'custom', url: '/about' } },
        { link: { label: 'insights', type: 'custom', url: '/blogs' } },
        { link: { label: 'contact', type: 'custom', url: '/contact' } },
      ],
    },
  }),
  payload.updateGlobal({
    slug: 'footer',
    context: { disableRevalidate: true },
    data: {
      navItems: [
        { link: { label: 'home', type: 'custom', url: '/' } },
        { link: { label: 'projects', type: 'custom', url: '/projects' } },
        { link: { label: 'services', type: 'custom', url: '/approach' } },
        { link: { label: 'about', type: 'custom', url: '/about' } },
        { link: { label: 'insights', type: 'custom', url: '/blogs' } },
        { link: { label: 'contact', type: 'custom', url: '/contact' } },
      ],
    },
  }),
  payload.updateGlobal({
    slug: 'site-settings',
    context: { disableRevalidate: true },
    data: {
      defaultDescription:
        'Websites, digital products and bespoke solutions for startups and growing businesses worldwide.',
      organisation: {
        name: 'Vorteks Digital',
        email: 'info@vorteksdigital.co.za',
      },
      siteName: 'Vorteks Digital',
    },
  }),
])

payload.logger.info('Updated Vorteks Digital content globals and project enquiry form.')
await payload.destroy()
