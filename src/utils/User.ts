import { NETWORK } from '../game/Constants';
import { Controls } from '../systems/Controls';

export interface GameUserData {
	highscore: number;
	date: number;
	controls: Controls;
	volumes: {
		music: number;
		sfx: number;
	};
}

export interface Ranking {
	rank?: string | number;
	highscore?: number;
	date?: string;
}

export class User {
	private _username: string;
	private _password: string;
	private _data: GameUserData;
	private _ranking: Ranking | null;

	constructor(
		username: string,
		password: string,
		data: GameUserData,
		rank: Ranking | null
	) {
		this._username = username;
		this._password = password;
		this._data = data;
		this._ranking = rank;
	}

	get username(): string {
		return this._username;
	}

	get password(): string {
		return this._password;
	}

	get data(): GameUserData {
		return this._data;
	}

	get ranking(): Ranking | null {
		return this._ranking;
	}

	set ranking(rank: Ranking) {
		this._ranking = rank;
	}

	set data(data: GameUserData) {
		this._data = data;
	}

	static async getUser(username: string | null): Promise<User | null> {
		try {
			const response = await fetch(`${NETWORK.SAVE_API}/api/users`);
			if (!response.ok) return null;
			const json = await response.json();
			const userData = json.find((user: any) => user.username === username);

			if (userData) {
				return new User(
					userData.username,
					userData.password,
					userData.saveData,
					null
				);
			}
		} catch {
			console.error('Failed to fetch user data from server.');
		}

		return null;
	}

	static async getAllUser(): Promise<User[] | null> {
		try {
			const response = await fetch(`${NETWORK.SAVE_API}/api/users`);
			if (!response.ok) return null;
			const json = await response.json();

			const users: User[] = json.map(
				(userData: any) =>
					new User(
						userData.username,
						userData.password,
						userData.saveData,
						null
					)
			);

			return users.length > 0 ? users : null;
		} catch {
			console.error('Failed to fetch users from server.');
			return null;
		}
	}

	static showUserInfo = async (): Promise<void> => {
		const userInfo = document.getElementById('user-info') as HTMLDivElement;
		const loggedUser = localStorage.getItem('loggedUser');

		if (!loggedUser) return;

		const username = userInfo.querySelector(
			'.username'
		) as HTMLParagraphElement;
		const highscore = userInfo.querySelector(
			'.highscore'
		) as HTMLParagraphElement;
		const rank = userInfo.querySelector('.rank') as HTMLParagraphElement;

		const user = (await User.getUser(loggedUser)) as User;
		const users = (await User.getAllUser()) as User[];
		users.sort((a, b) => b.data.highscore - a.data.highscore);
		const idx: string | number =
			user.data.highscore > 0
				? users.findIndex(user => user.username === loggedUser) + 1
				: 'N/A';

		username.innerHTML = `<span class="label">USERNAME:</span> <span class="value">${user.username}</span>`;
		highscore.innerHTML = `<span class="label">HIGHSCORE:</span> <span class="value">${user.data.highscore}</span>`;
		rank.innerHTML = `<span class="label">RANK:</span> <span class="value">${idx}</span>`;
	};
}
