import db from './index.ts';

export interface SettingsRow {
	controls: string | null;
	music_vol: number;
	sfx_vol: number;
}

export interface SettingsPayload {
	controls: Record<string, string> | null;
	music_vol: number;
	sfx_vol: number;
}

const stmt = {
	get: db.prepare<[number], SettingsRow>(
		'SELECT controls, music_vol, sfx_vol FROM settings WHERE user_id = ?'
	),
	init: db.prepare<[number], void>(
		'INSERT OR IGNORE INTO settings (user_id) VALUES (?)'
	),
	save: db.prepare<[number, string | null, number, number], void>(`
		INSERT INTO settings (user_id, controls, music_vol, sfx_vol) VALUES (?, ?, ?, ?)
		ON CONFLICT(user_id) DO UPDATE SET
			controls  = excluded.controls,
			music_vol = excluded.music_vol,
			sfx_vol   = excluded.sfx_vol
	`),
};

export const Settings = {
	get(userId: number): SettingsPayload | null {
		const row = stmt.get.get(userId);
		if (!row) return null;
		return {
			controls: row.controls ? JSON.parse(row.controls) : null,
			music_vol: row.music_vol,
			sfx_vol: row.sfx_vol,
		};
	},

	init(userId: number): void {
		stmt.init.run(userId);
	},

	save(
		userId: number,
		controls: Record<string, string> | null,
		music_vol: number,
		sfx_vol: number
	): void {
		stmt.save.run(
			userId,
			controls ? JSON.stringify(controls) : null,
			music_vol,
			sfx_vol
		);
	},
};
