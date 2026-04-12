const PHASE_DURATION = 3000;
const FADE_DURATION = 500;

export function showSplash(): Promise<void> {
	return new Promise(resolve => {
		const splash = document.getElementById('splash')!;
		const disclaimer = document.getElementById('splash-disclaimer')!;
		const credit = document.getElementById('splash-credit')!;

		const fadeOutSplash = () => {
			splash.style.opacity = '0';
			setTimeout(() => {
				splash.style.display = 'none';
				resolve();
			}, FADE_DURATION);
		};

		const showPhase2 = () => {
			disclaimer.style.opacity = '0';
			setTimeout(() => {
				credit.style.opacity = '1';

				const timer2 = setTimeout(() => {
					cleanup2();
					fadeOutSplash();
				}, PHASE_DURATION);

				const dismiss2 = (e: Event) => {
					e.stopImmediatePropagation();
					clearTimeout(timer2);
					cleanup2();
					fadeOutSplash();
				};
				const cleanup2 = () => {
					document.removeEventListener('keydown', dismiss2);
					document.removeEventListener('click', dismiss2);
				};

				document.addEventListener('keydown', dismiss2);
				document.addEventListener('click', dismiss2);
			}, 300);
		};

		const timer1 = setTimeout(() => {
			cleanup1();
			showPhase2();
		}, PHASE_DURATION);

		const dismiss1 = (e: Event) => {
			e.stopImmediatePropagation();
			clearTimeout(timer1);
			cleanup1();
			showPhase2();
		};
		const cleanup1 = () => {
			document.removeEventListener('keydown', dismiss1);
			document.removeEventListener('click', dismiss1);
		};

		document.addEventListener('keydown', dismiss1);
		document.addEventListener('click', dismiss1);
	});
}
