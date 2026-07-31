import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidateProject'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'client', 'year', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultPopulate: {
    client: true,
    featuredImage: true,
    slug: true,
    title: true,
    year: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'client',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      admin: {
        step: 1,
      },
      max: 2100,
      min: 2000,
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'services',
      type: 'array',
      fields: [
        {
          name: 'service',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'projectURL',
      type: 'text',
      admin: {
        description: 'Optional external case-study or live-project URL.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
        step: 1,
      },
      defaultValue: 0,
      index: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) return new Date()
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateProjectDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
