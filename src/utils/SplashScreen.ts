const PHASE_DURATION = 3000;
const FADE_DURATION = 500;

export function showSplash(): Promise<void> {
	return new Promise(resolve => {
		const splash = document.getElementById('splash')!;
		const disclaimer = document.getElementById('splash-disclaimer')!;
		const credit = document.getElementById('splash-credit')!;
		const music = document.getElementById('splash-music')!;

		const fadeOutSplash = () => {
			splash.style.opacity = '0';
			setTimeout(() => {
				splash.style.display = 'none';
				resolve();
			}, FADE_DURATION);
		};

		const showPhase3 = () => {
			credit.style.opacity = '0';
			setTimeout(() => {
				music.style.opacity = '1';

				const timer3 = setTimeout(() => {
					cleanup3();
					fadeOutSplash();
				}, PHASE_DURATION);

				const dismiss3 = (e: Event) => {
					e.stopImmediatePropagation();
					clearTimeout(timer3);
					cleanup3();
					fadeOutSplash();
				};
				const cleanup3 = () => {
					document.removeEventListener('keydown', dismiss3);
				};

				document.addEventListener('keydown', dismiss3);
			}, 300);
		};

		const showPhase2 = () => {
			disclaimer.style.opacity = '0';
			setTimeout(() => {
				credit.style.opacity = '1';

				const timer2 = setTimeout(() => {
					cleanup2();
					showPhase3();
				}, PHASE_DURATION);

				const dismiss2 = (e: Event) => {
					e.stopImmediatePropagation();
					clearTimeout(timer2);
					cleanup2();
					showPhase3();
				};
				const cleanup2 = () => {
					document.removeEventListener('keydown', dismiss2);
				};

				document.addEventListener('keydown', dismiss2);
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
		};

		document.addEventListener('keydown', dismiss1);
	});
}
