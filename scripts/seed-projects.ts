import config from '@payload-config'
import { getPayload } from 'payload'

import { upsertMockProjects } from '../src/endpoints/seed/upsert-projects'

const payload = await getPayload({ config })
const count = await upsertMockProjects(payload)
payload.logger.info(`Seeded ${count} mock projects.`)
await payload.destroy()
