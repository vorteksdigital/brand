import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateProject: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (req.context.disableRevalidate) return doc

  if (doc._status === 'published' || previousDoc?._status === 'published') {
    req.payload.logger.info('Revalidating projects index and homepage')
    revalidatePath('/')
    revalidatePath('/projects')
  }

  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) {
    revalidatePath('/')
    revalidatePath('/projects')
  }
  return doc
}
