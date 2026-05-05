import { SaveManager } from '../systems/SaveManager';
import { BackendAPI } from './BackendAPI';

export async function initAuth() {
	const userLogin = document.getElementById('user-login') as HTMLDivElement;
	const userLogged = document.getElementById('user-logged') as HTMLDivElement;
	const loginBtn = userLogin.querySelector('.login-btn') as HTMLButtonElement;
	const logoutBtn = userLogged.querySelector('.logout-btn') as HTMLButtonElement;
	const usernameInput = document.getElementById('username-input') as HTMLInputElement;
	const passwordInput = document.getElementById('password-input') as HTMLInputElement;

	const savedUser = localStorage.getItem('loggedUser');

	if (savedUser) {
		try {
			const result = await BackendAPI.load(savedUser);
			if (result.ok) {
				SaveManager.loadData(result.saveData, savedUser);
			}
		} catch (e) {
			console.error('Failed to retrieve save data.', e);
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
			const result = await BackendAPI.auth(username, password);

			if (result.ok) {
				localStorage.setItem('loggedUser', username);
				SaveManager.loadData(result.saveData, username);
				window.location.reload();
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error('Communication error:', error);
			alert('Unable to reach the server. Make sure it is running on port 9000.');
		}
	});
}
