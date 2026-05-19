import db from './index.ts';

const MAX_TOTAL_SCORES = 10_000;

export interface ScoreRow {
	score: number;
	stage: number;
	date: number;
	slow: number;
}

export interface LeaderboardRow extends ScoreRow {
	name: string;
}

const stmt = {
	insert: db.prepare<[string, number, number, number, number], void>(
		'INSERT INTO scores (name, score, stage, date, slow) VALUES (?, ?, ?, ?, ?)'
	),
	count: db.prepare<[], { count: number }>(
		'SELECT COUNT(*) as count FROM scores'
	),
	deleteOldest: db.prepare<[number], void>(
		'DELETE FROM scores WHERE id IN (SELECT id FROM scores ORDER BY id ASC LIMIT ?)'
	),
	leaderboard: db.prepare<[], LeaderboardRow>(`
		SELECT name, score, stage, date, slow
		FROM scores s
		WHERE slow <= 5
		  AND score = (
				SELECT MAX(score) FROM scores s2
				WHERE s2.name = s.name AND s2.slow <= 5
		  )
		GROUP BY name
		ORDER BY score DESC
		LIMIT 10
	`),
};

export const Scores = {
	insert(
		name: string,
		score: number,
		stage: number,
		date: number,
		slow: number
	): void {
		const { count } = stmt.count.get()!;
		if (count >= MAX_TOTAL_SCORES) {
			stmt.deleteOldest.run(count - MAX_TOTAL_SCORES + 1);
		}
		stmt.insert.run(name, score, stage, date, slow);
	},

	leaderboard(): LeaderboardRow[] {
		return stmt.leaderboard.all();
	},
};
