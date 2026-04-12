export function scaleGameWindow(): void {
	const gameWindow = document.getElementById('game-window')!;

	const scale = Math.min(window.innerWidth / 400, window.innerHeight / 300);

	gameWindow.style.transform = `scale(${scale})`;
	gameWindow.style.transformOrigin = 'center center';
}

window.addEventListener('resize', scaleGameWindow);
scaleGameWindow();
