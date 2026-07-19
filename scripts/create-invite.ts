// Bootstrap the first user + invite locally (avoids a chicken-and-egg with the guard).
//   node --env-file=.env.local --import tsx scripts/create-invite.ts --name "Izabelė"
//   node --env-file=.env.local --import tsx scripts/create-invite.ts --user <userId>
// Hand the printed URL to that person; it registers a passkey and is single-use.
import { neon } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { randomBytes } from 'node:crypto'
import { invites, users } from '../src/lib/server/db/schema'

const db = drizzle(neon(process.env.DATABASE_URL!))

function readArg(flag: string): string | undefined {
	const index = process.argv.indexOf(flag)
	return index >= 0 ? process.argv[index + 1] : undefined
}

const name = readArg('--name')
const userId = readArg('--user')

if (!name && !userId) {
	console.error('Usage:')
	console.error('  --name "Display Name"   invite a new person (creates a users row)')
	console.error('  --user <userId>         add another device for an existing user')
	process.exit(1)
}

let resolvedUserId: string
let resolvedName: string

if (userId) {
	const [user] = await db.select().from(users).where(eq(users.id, userId))
	if (!user) {
		console.error(`No user with id ${userId}`)
		process.exit(1)
	}
	resolvedUserId = user.id
	resolvedName = user.name
} else {
	const [user] = await db.insert(users).values({ name: name! }).returning()
	resolvedUserId = user.id
	resolvedName = user.name
}

const token = randomBytes(32).toString('base64url')
await db.insert(invites).values({
	token,
	userId: resolvedUserId,
	expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
})

const origin = process.env.ORIGIN ?? 'http://localhost:5173'
console.log(`Invite for ${resolvedName} (user ${resolvedUserId}):`)
console.log(`${origin}/admin/invite/${token}`)
