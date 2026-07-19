import { env } from '$env/dynamic/private'
import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Lazily instantiated so that merely importing this module (as SvelteKit's build-time
// route analysis does) never calls neon() — it only connects on the first real query,
// by which point DATABASE_URL is present at runtime.
let instance: NeonHttpDatabase<typeof schema> | undefined

function getDb(): NeonHttpDatabase<typeof schema> {
	if (!instance) {
		if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

		instance = drizzle(neon(env.DATABASE_URL), { schema })
	}

	return instance
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
	get(_target, prop, receiver) {
		return Reflect.get(getDb(), prop, receiver)
	}
})
