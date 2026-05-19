import { NETWORK } from '../game/Constants';
import { ScoreEntry } from '../systems/LocalScores';

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

export interface LeaderboardEntry {
	name: string;
	score: number;
	stage: number;
	date: number;
	slow: number;
}

export interface SaveScoreResult {
	ok: boolean;
	message?: string;
}

export const BackendAPI = {
	async saveScore(name: string, entry: ScoreEntry): Promise<SaveScoreResult> {
		const payload = {
			name,
			score: entry.score,
			stage: entry.stage,
			date: entry.date,
			slow: entry.slow,
		};
		if (isTauri()) {
			try {
				const r = await invoke<{ ok: boolean; message?: string }>(
					'save_score',
					payload
				);
				return r;
			} catch (e) {
				return { ok: false, message: String(e) };
			}
		}
		try {
			const res = await fetch(`${NETWORK.SAVE_API}/api/save-score`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const r = await res.json();
			return { ok: r.ok ?? res.ok, message: r.message };
		} catch {
			return { ok: false, message: 'Unable to reach the server.' };
		}
	},

	async getLeaderboard(): Promise<LeaderboardEntry[]> {
		if (isTauri()) {
			try {
				return await invoke<LeaderboardEntry[]>('get_leaderboard');
			} catch {
				return [];
			}
		}
		try {
			const res = await fetch(`${NETWORK.SAVE_API}/api/leaderboard`);
			if (!res.ok) return [];
			return res.json();
		} catch {
			return [];
		}
	},
};
