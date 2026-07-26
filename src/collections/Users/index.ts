import type { CollectionConfig } from 'payload'

import type { Access, FieldAccess } from 'payload'

const adminOnly: Access = ({ req: { user } }) => user?.role === 'admin'
const adminOnlyField: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
const adminOrSelf: Access = ({ req: { user } }) =>
  user?.role === 'admin' ? true : user ? { id: { equals: user.id } } : false

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      access: {
        update: adminOnlyField,
      },
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
      saveToJWT: true,
    },
  ],
  timestamps: true,
}
