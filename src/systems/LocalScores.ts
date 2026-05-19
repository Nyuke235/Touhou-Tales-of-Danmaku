const STORAGE_KEY = 'localScores';
const MAX_LOCAL_SCORES = 200;

export interface ScoreEntry {
	score: number;
	stage: number;
	date: number;
	slow: number;
	name?: string;
}

function read(): ScoreEntry[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function write(entries: ScoreEntry[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	} catch (e) {
		console.error('[LocalScores] save failed', e);
	}
}

export const LocalScores = {
	all(): ScoreEntry[] {
		return read();
	},

	add(entry: ScoreEntry): void {
		const entries = read();
		entries.push(entry);
		if (entries.length > MAX_LOCAL_SCORES) {
			entries.splice(0, entries.length - MAX_LOCAL_SCORES);
		}
		write(entries);
	},

	bestValidScore(): number {
		const valid = read().filter(e => e.slow <= 5);
		return valid.length ? Math.max(...valid.map(e => e.score)) : 0;
	},

	tagByDate(date: number, name: string): void {
		const entries = read();
		const target = entries.find(e => e.date === date);
		if (!target) return;
		target.name = name;
		write(entries);
	},
};
