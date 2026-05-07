import { randomBytes } from 'crypto';
import db from './index.ts';

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface SessionRow {
	token: string;
	user_id: number;
	created_at: number;
}

const stmt = {
	find: db.prepare<[string], SessionRow>(
		'SELECT * FROM sessions WHERE token = ?'
	),
	create: db.prepare<[string, number, number], void>(
		'INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)'
	),
	deleteExpired: db.prepare<[number], void>(
		'DELETE FROM sessions WHERE created_at < ?'
	),
	deleteForUser: db.prepare<[number], void>(
		'DELETE FROM sessions WHERE user_id = ?'
	),
	deleteToken: db.prepare<[string], void>(
		'DELETE FROM sessions WHERE token = ?'
	),
};

export const Sessions = {
	create(userId: number): string {
		const token = randomBytes(32).toString('hex');
		stmt.create.run(token, userId, Date.now());
		return token;
	},

	find(token: string): SessionRow | undefined {
		stmt.deleteExpired.run(Date.now() - TOKEN_TTL_MS);
		return stmt.find.get(token);
	},

	deleteForUser(userId: number): void {
		stmt.deleteForUser.run(userId);
	},

	deleteToken(token: string): void {
		stmt.deleteToken.run(token);
	},
};
