import config from '@payload-config'
import { getPayload } from 'payload'

import { ensureBundledProjectMedia, upsertProjects } from '../src/endpoints/seed/upsert-projects'

const payload = await getPayload({ config })
await ensureBundledProjectMedia(payload)
const count = await upsertProjects(payload)
payload.logger.info(`Seeded ${count} projects with Johannesburg imagery.`)
await payload.destroy()
