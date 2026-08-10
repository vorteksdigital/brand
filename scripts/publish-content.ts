import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

for (const collection of ['posts', 'projects'] as const) {
  const records = await payload.find({
    collection,
    depth: 0,
    draft: true,
    limit: 1000,
    pagination: false,
    where: {
      and: [
        { title: { exists: true } },
        { title: { not_equals: '' } },
        { slug: { exists: true } },
        { slug: { not_equals: '' } },
      ],
    },
  })

  for (const record of records.docs) {
    await payload.update({
      collection,
      id: record.id,
      context: { disableRevalidate: true },
      data: { _status: 'published' },
    })
  }

  payload.logger.info(`Published ${records.docs.length} ${collection} records.`)
}

await payload.destroy()
