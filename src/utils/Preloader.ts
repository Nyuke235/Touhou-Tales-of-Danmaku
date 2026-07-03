type ProgressCallback = (loaded: number, total: number) => void;

const AUDIO_PRELOAD_TIMEOUT_MS = 8000;

export async function preloadAssets(
	imageUrls: readonly string[],
	audioUrls: readonly string[],
	onProgress?: ProgressCallback
): Promise<void> {
	const total = imageUrls.length + audioUrls.length;
	if (total === 0) {
		onProgress?.(0, 0);
		return;
	}

	let loaded = 0;
	const bump = () => onProgress?.(++loaded, total);

	const imagePromises = imageUrls.map(
		url =>
			new Promise<void>(resolve => {
				const img = new Image();
				const done = () => {
					bump();
					resolve();
				};
				img.onload = done;
				img.onerror = done;
				img.src = url;
			})
	);

	const audioPromises = audioUrls.map(
		url =>
			new Promise<void>(resolve => {
				let settled = false;
				const audio = new Audio();
				const done = () => {
					if (settled) return;
					settled = true;
					clearTimeout(timer);
					bump();
					resolve();
				};
				const timer = setTimeout(done, AUDIO_PRELOAD_TIMEOUT_MS);
				audio.addEventListener('canplaythrough', done, { once: true });
				audio.addEventListener('error', done, { once: true });
				audio.preload = 'auto';
				audio.src = url;
				audio.load();
			})
	);

	await Promise.all([...imagePromises, ...audioPromises]);
}
