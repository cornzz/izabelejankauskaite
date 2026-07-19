import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').notNull(),
	dates: text('dates').array().notNull(), // ['2026-01-22', ...] YYYY-MM-DD, sorted asc
	program: jsonb('program') // Structured rows; [] = no program
		.$type<{ composer: string; title: string }[]>()
		.notNull()
		.default([]),
	links: jsonb('links').$type<{ href: string; info?: string }[]>().notNull().default([]),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const invites = pgTable('invites', {
	token: text('token').primaryKey(), // 32 random bytes, base64url
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	usedAt: timestamp('used_at', { withTimezone: true }), // null = unused; set on registration
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const credentials = pgTable('credentials', {
	id: text('id').primaryKey(), // credentialID (base64url)
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	publicKey: text('public_key').notNull(), // base64url-encoded public key
	counter: integer('counter').notNull().default(0),
	transports: text('transports').array(), // Optional hint for the login prompt
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export type EventRow = typeof events.$inferSelect
export type UserRow = typeof users.$inferSelect
export type InviteRow = typeof invites.$inferSelect
export type CredentialRow = typeof credentials.$inferSelect
