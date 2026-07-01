export class GateBackground {
	private offscreen: HTMLCanvasElement | null = null;
	private loaded: boolean = false;
	private scaledW: number = 0;
	private scaledH: number = 0;
	private drawX: number = 0;
	private topY: number = 0;
	private speed: number;
	private locked: boolean = false;

	constructor(src: string, speed: number = 25) {
		this.speed = speed;
		const img = new Image();
		img.onload = () => {
			const fieldW = 256;
			const scale = fieldW / img.width;
			this.scaledW = fieldW;
			this.scaledH = Math.round(img.height * scale);
			this.drawX = 0;
			this.offscreen = document.createElement('canvas');
			this.offscreen.width = this.scaledW;
			this.offscreen.height = this.scaledH;
			const octx = this.offscreen.getContext('2d')!;
			octx.imageSmoothingEnabled = true;
			octx.drawImage(img, 0, 0, this.scaledW, this.scaledH);
			this.topY = -this.scaledH;
			this.loaded = true;
		};
		img.src = src;
	}

	update(dt: number): void {
		if (!this.loaded) return;
		if (!this.locked) {
			this.topY += this.speed * dt;
			if (this.topY >= 0) {
				this.topY = 0;
				this.locked = true;
			}
		}
	}

	render(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
		if (!this.loaded || !this.offscreen) return;

		ctx.save();
		ctx.imageSmoothingEnabled = true;
		ctx.drawImage(
			this.offscreen,
			this.drawX,
			this.topY,
			this.scaledW,
			this.scaledH
		);
		ctx.restore();
	}
}
