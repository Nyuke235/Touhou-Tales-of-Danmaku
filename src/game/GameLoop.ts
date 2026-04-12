export class GameLoop {
	private lastTime: number = 0;
	private running: boolean = false;
	private rafId: number = 0;

	private updateFn: (dt: number) => void;
	private renderFn: () => void;

	constructor(update: (dt: number) => void, render: () => void) {
		this.updateFn = update;
		this.renderFn = render;
	}

	start(): void {
		if (this.running) return;
		this.running = true;
		this.lastTime = performance.now();
		this.rafId = requestAnimationFrame(this.loop);
	}

	stop(): void {
		this.running = false;
		cancelAnimationFrame(this.rafId);
	}

	private loop = (timestamp: number): void => {
		if (!this.running) return;

		const delta = Math.min((timestamp - this.lastTime) / 1000, 0.1);
		this.lastTime = timestamp;

		this.updateFn(delta);
		this.renderFn();

		this.rafId = requestAnimationFrame(this.loop);
	};
}
