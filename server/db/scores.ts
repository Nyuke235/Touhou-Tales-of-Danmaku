import db from './index.ts';

const MAX_SCORES_PER_USER = 200;

export interface ScoreRow {
	score: number;
	stage: number;
	date: number;
	slow: number;
}

export interface LeaderboardRow extends ScoreRow {
	username: string;
}

const stmt = {
	insert: db.prepare<[number, number, number, number, number], void>(
		'INSERT INTO scores (user_id, score, stage, date, slow) VALUES (?, ?, ?, ?, ?)'
	),
	count: db.prepare<[number], { count: number }>(
		'SELECT COUNT(*) as count FROM scores WHERE user_id = ?'
	),
	forUser: db.prepare<[number], ScoreRow>(
		'SELECT score, stage, date, slow FROM scores WHERE user_id = ? ORDER BY score DESC'
	),
	leaderboard: db.prepare<[], LeaderboardRow>(`
		SELECT u.username, s.score, s.stage, s.date, s.slow
		FROM users u
		JOIN scores s ON s.user_id = u.id
		WHERE s.slow <= 5
		  AND s.score = (
				SELECT MAX(s2.score) FROM scores s2
				WHERE s2.user_id = u.id AND s2.slow <= 5
		  )
		ORDER BY s.score DESC
		LIMIT 10
	`),
};

export const Scores = {
	insert(
		userId: number,
		score: number,
		stage: number,
		date: number,
		slow: number
	): boolean {
		const { count } = stmt.count.get(userId)!;
		if (count >= MAX_SCORES_PER_USER) return false;
		stmt.insert.run(userId, score, stage, date, slow);
		return true;
	},

	forUser(userId: number): ScoreRow[] {
		return stmt.forUser.all(userId);
	},

	leaderboard(): LeaderboardRow[] {
		return stmt.leaderboard.all();
	},
};
