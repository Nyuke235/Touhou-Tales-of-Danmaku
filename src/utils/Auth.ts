import { SaveManager } from '../systems/SaveManager';
import { NETWORK } from '../game/Constants';

export async function initAuth() {
	const userLogin = document.getElementById('user-login') as HTMLDivElement;
	const userLogged = document.getElementById('user-logged') as HTMLDivElement;
	const loginBtn = userLogin.querySelector('.login-btn') as HTMLButtonElement;
	const logoutBtn = userLogged.querySelector(
		'.logout-btn'
	) as HTMLButtonElement;
	const usernameInput = document.getElementById(
		'username-input'
	) as HTMLInputElement;
	const passwordInput = document.getElementById(
		'password-input'
	) as HTMLInputElement;

	const savedUser = localStorage.getItem('loggedUser');

	if (savedUser) {
		try {
			const response = await fetch(`${NETWORK.SAVE_API}/api/load`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: savedUser }),
			});

			if (response.ok) {
				const data = await response.json();
				SaveManager.loadData(data.saveData, savedUser);
			}
		} catch (e) {
			console.error('Failed to retrieve save data from server.', e);
		}

		userLogin.style.display = 'none';
		userLogged.style.display = 'block';

		logoutBtn.addEventListener('click', () => {
			localStorage.removeItem('loggedUser');
			window.location.reload();
		});

		return;
	}

	loginBtn.addEventListener('click', async () => {
		const username = usernameInput.value.trim();
		const password = passwordInput.value.trim();
		if (!username || !password) return;

		try {
			const response = await fetch(`${NETWORK.SAVE_API}/api/auth`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem('loggedUser', username);
				SaveManager.loadData(data.saveData, username);
				window.location.reload();
			} else {
				alert(data.message);
			}
		} catch (error) {
			console.error('Communication error:', error);
			alert(
				'Unable to reach the server. Make sure it is running on port 9000.'
			);
		}
	});
}
