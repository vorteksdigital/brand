import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'VRTKS Digital', required: true },
    {
      name: 'defaultDescription',
      type: 'textarea',
      required: true,
      defaultValue: 'A modern publishing platform built with Payload CMS and Next.js.',
    },
    { name: 'defaultSocialImage', type: 'upload', relationTo: 'media' },
    {
      name: 'organisation',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'telephone', type: 'text' },
        { name: 'address', type: 'textarea' },
      ],
    },
    {
      name: 'socialProfiles',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
