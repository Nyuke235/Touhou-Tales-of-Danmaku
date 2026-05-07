import db from './index.ts';

interface UserRow {
	id: number;
	username: string;
	password: string;
}

const stmt = {
	find: db.prepare<[string], UserRow>('SELECT * FROM users WHERE username = ?'),
	create: db.prepare<[string, string], void>(
		'INSERT INTO users (username, password) VALUES (?, ?)'
	),
};

export const Users = {
	find(username: string): UserRow | undefined {
		return stmt.find.get(username);
	},

	create(username: string, passwordHash: string): number {
		const { lastInsertRowid } = stmt.create.run(username, passwordHash);
		return lastInsertRowid as number;
	},
};
