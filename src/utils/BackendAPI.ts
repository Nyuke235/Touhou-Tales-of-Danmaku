import { NETWORK } from '../game/Constants';
import { ScoreEntry } from './User';

type TauriInternals = {
	invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;
};

export const isTauri = (): boolean =>
	typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export function invoke<T>(
	cmd: string,
	args?: Record<string, unknown>
): Promise<T> {
	const internals = (
		window as unknown as { __TAURI_INTERNALS__: TauriInternals }
	).__TAURI_INTERNALS__;
	return internals.invoke<T>(cmd, args);
}

function authHeaders(): Record<string, string> {
	const token = localStorage.getItem('sessionToken');
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface NormalizedSaveData {
	controls: Record<string, string> | null;
	music_vol: number;
	sfx_vol: number;
	scores: ScoreEntry[];
}

export interface AuthResult {
	ok: boolean;
	message: string;
	data: NormalizedSaveData | null;
}

export interface LeaderboardEntry {
	username: string;
	score: number;
	stage: number;
	date: number;
	slow: number;
}

export interface UserRecord {
	username: string;
	saveData: unknown;
}

export const BackendAPI = {
	async auth(username: string, password: string): Promise<AuthResult> {
		if (isTauri()) {
			const r = await invoke<{ ok: boolean; message: string; saveData: any }>(
				'auth',
				{ username, password }
			);
			return {
				ok: r.ok,
				message: r.message,
				data: r.saveData
					? {
							controls: r.saveData.controls ?? null,
							music_vol: r.saveData.volumes?.music ?? 0.7,
							sfx_vol: r.saveData.volumes?.sfx ?? 0.8,
							scores: Array.isArray(r.saveData.scores) ? r.saveData.scores : [],
						}
					: null,
			};
		}
		const res = await fetch(`${NETWORK.SAVE_API}/api/auth`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});
		const r = await res.json();
		if (r.token) localStorage.setItem('sessionToken', r.token);
		return {
			ok: r.ok ?? res.ok,
			message: r.message ?? '',
			data:
				r.settings != null || r.scores != null
					? {
							controls: r.settings?.controls ?? null,
							music_vol: r.settings?.music_vol ?? 0.7,
							sfx_vol: r.settings?.sfx_vol ?? 0.8,
							scores: Array.isArray(r.scores) ? r.scores : [],
						}
					: null,
		};
	},

	async loadUserData(
		username: string
	): Promise<{ ok: boolean; data: NormalizedSaveData | null }> {
		if (isTauri()) {
			const r = await invoke<{ ok: boolean; saveData: any }>('load_data', {
				username,
			});
			return {
				ok: r.ok,
				data: r.saveData
					? {
							controls: r.saveData.controls ?? null,
							music_vol: r.saveData.volumes?.music ?? 0.7,
							sfx_vol: r.saveData.volumes?.sfx ?? 0.8,
							scores: Array.isArray(r.saveData.scores) ? r.saveData.scores : [],
						}
					: null,
			};
		}
		try {
			const res = await fetch(`${NETWORK.SAVE_API}/api/user-data`, {
				headers: authHeaders(),
			});
			const r = await res.json();
			return {
				ok: r.ok ?? res.ok,
				data:
					r.settings != null || r.scores != null
						? {
								controls: r.settings?.controls ?? null,
								music_vol: r.settings?.music_vol ?? 0.7,
								sfx_vol: r.settings?.sfx_vol ?? 0.8,
								scores: Array.isArray(r.scores) ? r.scores : [],
							}
						: null,
			};
		} catch {
			return { ok: false, data: null };
		}
	},

	async saveSettings(
		_username: string,
		controls: Record<string, string>,
		music_vol: number,
		sfx_vol: number
	): Promise<void> {
		if (isTauri()) {
			invoke('save_data', {
				username: _username,
				saveData: { controls, volumes: { music: music_vol, sfx: sfx_vol } },
			}).catch(e => console.error('[Save]', e));
			return;
		}
		fetch(`${NETWORK.SAVE_API}/api/save-settings`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...authHeaders() },
			body: JSON.stringify({ controls, music_vol, sfx_vol }),
			keepalive: true,
		}).catch(e => console.error('[Save settings]', e));
	},

	async saveScore(username: string, entry: ScoreEntry): Promise<void> {
		if (isTauri()) {
			invoke('save_score', { username, ...entry }).catch(e =>
				console.error('[Save score]', e)
			);
			return;
		}
		fetch(`${NETWORK.SAVE_API}/api/save-score`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...authHeaders() },
			body: JSON.stringify(entry),
			keepalive: true,
		}).catch(e => console.error('[Save score]', e));
	},

	async logout(): Promise<void> {
		if (isTauri()) return;
		const token = localStorage.getItem('sessionToken');
		if (!token) return;
		fetch(`${NETWORK.SAVE_API}/api/session`, {
			method: 'DELETE',
			headers: authHeaders(),
			keepalive: true,
		}).catch(() => {});
	},

	async getLeaderboard(): Promise<LeaderboardEntry[]> {
		if (isTauri()) {
			const users: UserRecord[] = await invoke('get_users');
			const entries: LeaderboardEntry[] = [];
			for (const u of users) {
				const data = u.saveData as any;
				const valid: ScoreEntry[] = (data?.scores ?? []).filter(
					(s: ScoreEntry) => s.slow <= 5
				);
				if (!valid.length) continue;
				const best = valid.reduce((a, b) => (a.score >= b.score ? a : b));
				entries.push({ username: u.username, ...best });
			}
			return entries.sort((a, b) => b.score - a.score).slice(0, 10);
		}
		try {
			const res = await fetch(`${NETWORK.SAVE_API}/api/leaderboard`);
			if (!res.ok) return [];
			return res.json();
		} catch {
			return [];
		}
	},

	async getScores(username: string): Promise<ScoreEntry[]> {
		if (isTauri()) {
			const r = await invoke<{ ok: boolean; saveData: any }>('load_data', {
				username,
			});
			return Array.isArray(r.saveData?.scores) ? r.saveData.scores : [];
		}
		try {
			const res = await fetch(
				`${NETWORK.SAVE_API}/api/scores/${encodeURIComponent(username)}`
			);
			if (!res.ok) return [];
			return res.json();
		} catch {
			return [];
		}
	},
};
