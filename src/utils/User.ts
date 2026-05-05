import { BackendAPI, UserRecord } from './BackendAPI';
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
	private _data: GameUserData;
	private _ranking: Ranking | null;

	constructor(username: string, data: GameUserData, rank: Ranking | null) {
		this._username = username;
		this._data = data;
		this._ranking = rank;
	}

	get username(): string {
		return this._username;
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
		const users = await BackendAPI.getUsers();
		const record = users.find((u: UserRecord) => u.username === username);
		return record
			? new User(record.username, record.saveData as GameUserData, null)
			: null;
	}

	static async getAllUser(): Promise<User[] | null> {
		const users = await BackendAPI.getUsers();
		if (!users.length) return null;
		return users.map(
			(u: UserRecord) => new User(u.username, u.saveData as GameUserData, null)
		);
	}

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

		const [user, users] = await Promise.all([
			User.getUser(loggedUser),
			User.getAllUser(),
		]);
		if (!user || !users) return;

		users.sort((a, b) => b.data.highscore - a.data.highscore);
		const idx: string | number =
			user.data.highscore > 0
				? users.findIndex(u => u.username === loggedUser) + 1
				: 'N/A';

		usernameEl.innerHTML = `<span class="label">USERNAME:</span> <span class="value">${user.username}</span>`;
		highscoreEl.innerHTML = `<span class="label">HIGHSCORE:</span> <span class="value">${user.data.highscore}</span>`;
		rankEl.innerHTML = `<span class="label">RANK:</span> <span class="value">${idx}</span>`;
	};
}
