import { eq } from 'drizzle-orm'
import { db } from '$lib/server/db'
import { content } from '$lib/server/db/schema'
import { DEFAULT_BIOGRAPHY } from '$lib/defaultContent'

export const BIOGRAPHY_KEY = 'biography'

// Returns the stored biography, or the default seed text until one is saved.
export async function getBiography(): Promise<string> {
	const [row] = await db.select().from(content).where(eq(content.key, BIOGRAPHY_KEY))

	return row?.value ?? DEFAULT_BIOGRAPHY
}

export async function setBiography(value: string): Promise<void> {
	await db
		.insert(content)
		.values({ key: BIOGRAPHY_KEY, value })
		.onConflictDoUpdate({ target: content.key, set: { value, updatedAt: new Date() } })
}
