import { User } from '../utils/User';

export class LeaderboardManagement {
	private static DISPLAY_LIMIT = 10;

	static generateLeaderboard = async (): Promise<void> => {
		const board = document.querySelector('#board')!;
		const users = await User.getAllUser();
		let html = '';

		if (users) {
			users.sort(
				(a, b) =>
					b.data.highscore - a.data.highscore || a.data.date - b.data.date
			);

			const top10Users = users.slice(0, this.DISPLAY_LIMIT);

			for (const [i, user] of top10Users.entries()) {
				user.ranking = {
					rank: i + 1,
					highscore: user.data.highscore,
					date: new Date(user.data.date).toLocaleDateString(),
				};

				if (user.data.highscore > 0) {
					html += `<tr>
							<td class="ranking">${user.ranking.rank}</td>
							<td class="username">${user.username}</td>
							<td class="highscore">${user.ranking.highscore}</td>
							<td class="time">${user.ranking.date}</td>
						</tr>`;
				}
			}

			board.innerHTML = html;
		}
	};
}
