import config from '@payload-config'
import { getPayload } from 'payload'

import { updateJohannesburgImageRelationships } from '../src/endpoints/seed/upsert-johannesburg-imagery'

const payload = await getPayload({ config })
const result = await updateJohannesburgImageRelationships({ payload })
payload.logger.info(
  `Updated Johannesburg imagery for ${result.posts} posts, ${result.projects} projects, and Site Settings.`,
)
await payload.destroy()
