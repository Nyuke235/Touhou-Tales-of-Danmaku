interface SpritesheetConfig {
	src: string;
	frameX: number;
	frameY: number;
	frameCount: number;
	frameSpeed: number;
	rowY?: number;
	looping?: boolean;
}

export class Spritesheet {
	private sprite: HTMLImageElement;
	private ready: boolean = false;
	private frameIndex: number = 0;
	private frameTimer: number = 0;
	private finished: boolean = false;
	private looping: boolean = true;

	frameX: number;
	frameY: number;
	frameCount: number;
	frameSpeed: number;
	rowY: number;

	constructor(config: SpritesheetConfig) {
		this.frameX = config.frameX;
		this.frameY = config.frameY;
		this.frameCount = config.frameCount;
		this.frameSpeed = config.frameSpeed;
		this.rowY = config.rowY ?? 0;
		this.looping = config.looping ?? true;

		this.sprite = new Image();
		this.sprite.src = config.src;
		this.sprite.onload = () => {
			this.ready = true;
		};
	}

	update(dt: number): void {
		if (this.finished) return;

		this.frameTimer += dt;
		if (this.frameTimer >= this.frameSpeed) {
			this.frameTimer = 0;
			if (this.frameIndex < this.frameCount - 1) {
				this.frameIndex++;
			} else {
				if (this.looping) {
					this.frameIndex = 0;
				} else {
					this.finished = true;
				}
			}
		}
	}

	draw(
		ctx: CanvasRenderingContext2D,
		dx: number,
		dy: number,
		dw: number,
		dh: number
	): void {
		if (!this.ready) return;

		ctx.drawImage(
			this.sprite,
			this.frameIndex * this.frameX,
			this.rowY,
			this.frameX,
			this.frameY,
			dx,
			dy,
			dw,
			dh
		);
	}

	isReady(): boolean {
		return this.ready;
	}

	isFinished(): boolean {
		return this.finished;
	}

	reset(): void {
		this.frameIndex = 0;
		this.frameTimer = 0;
		this.finished = false;
	}
}

export function createExplosionSheet(): Spritesheet {
	return new Spritesheet({
		src: 'assets/sprites/effects/destruction.png',
		frameX: 80,
		frameY: 80,
		frameCount: 8,
		frameSpeed: 0.05,
		looping: false,
	});
}
