import { NETWORK } from '../game/Constants';

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

export interface AuthResult {
	ok: boolean;
	message: string;
	saveData: unknown;
}

export interface SaveResult {
	ok: boolean;
}

export interface LoadResult {
	ok: boolean;
	saveData: unknown;
}

export interface UserRecord {
	username: string;
	saveData: unknown;
}

export const BackendAPI = {
	async auth(username: string, password: string): Promise<AuthResult> {
		if (isTauri()) {
			return invoke('auth', { username, password });
		}
		const res = await fetch(`${NETWORK.SAVE_API}/api/auth`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});
		const data = await res.json();
		return { ok: res.ok, ...data };
	},

	async load(username: string): Promise<LoadResult> {
		if (isTauri()) {
			return invoke('load_data', { username });
		}
		const res = await fetch(`${NETWORK.SAVE_API}/api/load`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username }),
		});
		const data = await res.json();
		return { ok: res.ok, ...data };
	},

	async save(username: string, saveData: unknown): Promise<SaveResult> {
		if (isTauri()) {
			return invoke('save_data', { username, saveData });
		}
		fetch(`${NETWORK.SAVE_API}/api/save`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, saveData }),
			keepalive: true,
		}).catch(e => console.error('Failed to send save data.', e));
		return { ok: true };
	},

	async getUsers(): Promise<UserRecord[]> {
		if (isTauri()) {
			return invoke('get_users');
		}
		try {
			const controller = new AbortController();
			const id = setTimeout(() => controller.abort(), 5000);
			const res = await fetch(`${NETWORK.SAVE_API}/api/users`, {
				signal: controller.signal,
			}).finally(() => clearTimeout(id));
			if (!res.ok) return [];
			return res.json();
		} catch {
			return [];
		}
	},
};
