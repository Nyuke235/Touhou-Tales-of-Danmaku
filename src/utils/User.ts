import { BackendAPI } from './BackendAPI';

export interface ScoreEntry {
	score: number;
	stage: number;
	date: number;
	slow: number;
}

export class User {
	static showUserInfo = async (): Promise<void> => {
		const userInfo = document.getElementById('user-info') as HTMLDivElement;
		const loggedUser = localStorage.getItem('loggedUser');
		if (!loggedUser) return;

		const usernameEl = userInfo.querySelector(
			'.username'
		) as HTMLParagraphElement;
		const highscoreEl = userInfo.querySelector(
			'.highscore'
		) as HTMLParagraphElement;
		const rankEl = userInfo.querySelector('.rank') as HTMLParagraphElement;

		const leaderboard = await BackendAPI.getLeaderboard();
		const entry = leaderboard.find(e => e.username === loggedUser);
		const rank = entry ? leaderboard.indexOf(entry) + 1 : null;

		usernameEl.innerHTML = `<span class="label">USERNAME:</span> <span class="value">${loggedUser}</span>`;
		highscoreEl.innerHTML = `<span class="label">HIGHSCORE:</span> <span class="value">${entry?.score ?? 0}</span>`;
		rankEl.innerHTML = `<span class="label">RANK:</span> <span class="value">${rank ?? 'N/A'}</span>`;
	};
}
