import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const home = ({ metaImage }: HomeArgs): RequiredDataFromCollectionSlug<'pages'> => ({
  _status: 'published',
  hero: {
    type: 'none',
  },
  layout: [],
  meta: {
    description:
      'Websites, digital products and bespoke solutions for startups and growing businesses worldwide.',
    image: metaImage.id,
    title: 'Websites, Digital Products & Bespoke Solutions',
  },
  slug: 'home',
  title: 'Home',
})
