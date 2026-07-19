import { db } from '$lib/server/db'
import type { InviteRow, UserRow } from '$lib/server/db/schema'
import { invites, users } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { randomBytes } from 'node:crypto'

export function generateInviteToken(): string {
	return randomBytes(32).toString('base64url')
}

export const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export async function validInvite(
	token: string | undefined | null
): Promise<{ invite: InviteRow; user: UserRow } | null> {
	if (!token) return null
	const [invite] = await db.select().from(invites).where(eq(invites.token, token))
	if (!invite || invite.usedAt || invite.expiresAt.getTime() < Date.now()) return null

	const [user] = await db.select().from(users).where(eq(users.id, invite.userId))
	if (!user) return null

	return { invite, user }
}
