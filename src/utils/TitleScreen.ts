const TRANSITION_DURATION = 700;

export function showTitleScreen(): Promise<void> {
	return new Promise(resolve => {
		const home = document.getElementById('home') as HTMLElement;
		const gameWindow = document.getElementById('game-window') as HTMLElement;
		const pressKey = document.getElementById('press-key') as HTMLElement;

		const dismiss = (e: Event) => {
			e.stopImmediatePropagation();
			document.removeEventListener('keydown', dismiss, { capture: true });

			home.classList.remove('intro');
			gameWindow.style.backgroundPosition = '50% center';
			pressKey.style.animation = 'none';
			pressKey.style.opacity = '0';

			setTimeout(resolve, TRANSITION_DURATION);
		};

		document.addEventListener('keydown', dismiss, { capture: true });
	});
}
