import { env } from '$env/dynamic/private'
import type { ProgramRow } from '$lib/helpers'
import { generateInviteToken, INVITE_TTL_MS } from '$lib/server/auth/invites'
import { clearSession } from '$lib/server/auth/session'
import { db } from '$lib/server/db'
import { credentials, events, invites, users } from '$lib/server/db/schema'
import { revalidatePublicPage } from '$lib/server/revalidate'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

type LinkRow = { href: string; info?: string }

function parseJsonArray<T>(value: FormDataEntryValue | null): T[] {
	if (typeof value !== 'string' || !value) return []
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed) ? (parsed as T[]) : []
	} catch {
		return []
	}
}

// Normalise the submitted event form: trim, drop empty rows, sort dates.
function parseEventForm(form: FormData) {
	const title = (form.get('title') ?? '').toString().trim()
	const dates = [...parseJsonArray<string>(form.get('dates'))].sort()
	const program = parseJsonArray<ProgramRow>(form.get('program'))
		.map((row) => ({ composer: (row.composer ?? '').trim(), title: (row.title ?? '').trim() }))
		.filter((row) => row.composer || row.title)
	const links = parseJsonArray<LinkRow>(form.get('links'))
		.map((row) => ({ href: (row.href ?? '').trim(), info: (row.info ?? '').trim() }))
		.filter((row) => row.href)
		.map((row) => (row.info ? { href: row.href, info: row.info } : { href: row.href }))

	return { title, dates, program, links }
}

export const load: PageServerLoad = async ({ locals }) => {
	const [eventRows, userRows, credentialRows] = await Promise.all([
		db.select().from(events),
		db.select().from(users),
		db.select().from(credentials)
	])

	eventRows.sort((a, b) => (a.dates[0] < b.dates[0] ? 1 : a.dates[0] > b.dates[0] ? -1 : 0))

	const people = userRows
		.map((person) => ({
			id: person.id,
			name: person.name,
			passkeys: credentialRows.filter((cred) => cred.userId === person.id).length
		}))
		.sort((a, b) => a.name.localeCompare(b.name))

	return { events: eventRows, people, user: locals.user }
}

export const actions: Actions = {
	create: async ({ request }) => {
		const { title, dates, program, links } = parseEventForm(await request.formData())
		if (!title) return fail(400, { formError: 'Title is required' })
		if (!dates.length) return fail(400, { formError: 'Select at least one date' })

		await db.insert(events).values({ title, dates, program, links })
		await revalidatePublicPage()

		return { saved: true }
	},

	update: async ({ request }) => {
		const form = await request.formData()
		const id = (form.get('id') ?? '').toString()
		if (!id) return fail(400, { formError: 'Missing event id' })
		const { title, dates, program, links } = parseEventForm(form)
		if (!title) return fail(400, { formError: 'Title is required' })
		if (!dates.length) return fail(400, { formError: 'Select at least one date' })

		await db.update(events).set({ title, dates, program, links, updatedAt: new Date() }).where(eq(events.id, id))
		await revalidatePublicPage()

		return { saved: true }
	},

	delete: async ({ request }) => {
		const id = (await request.formData()).get('id')?.toString()
		if (!id) return fail(400, { formError: 'Missing event id' })

		await db.delete(events).where(eq(events.id, id))
		await revalidatePublicPage()

		return { saved: true }
	},

	invite: async ({ request }) => {
		const name = (await request.formData()).get('name')?.toString().trim()
		if (!name) return fail(400, { peopleError: 'Name is required' })

		const [person] = await db.insert(users).values({ name }).returning()
		const token = generateInviteToken()
		await db.insert(invites).values({
			token,
			userId: person.id,
			expiresAt: new Date(Date.now() + INVITE_TTL_MS)
		})

		return { inviteUrl: `${env.ORIGIN ?? ''}/admin/invite/${token}`, invitedName: name }
	},

	addDevice: async ({ locals }) => {
		if (!locals.user) return fail(401, { peopleError: 'Not logged in' })

		const token = generateInviteToken()
		await db.insert(invites).values({
			token,
			userId: locals.user.id,
			expiresAt: new Date(Date.now() + INVITE_TTL_MS)
		})

		return { inviteUrl: `${env.ORIGIN ?? ''}/admin/invite/${token}`, invitedName: locals.user.name }
	},

	removeUser: async ({ request, locals }) => {
		const id = (await request.formData()).get('id')?.toString()
		if (!id) return fail(400, { peopleError: 'Missing user id' })
		if (locals.user?.id === id) return fail(400, { peopleError: 'You cannot remove yourself' })

		await db.delete(users).where(eq(users.id, id)) // Cascades to credentials + invites

		return { saved: true }
	},

	logout: async ({ cookies }) => {
		clearSession(cookies)
		throw redirect(303, '/admin/login')
	}
}
