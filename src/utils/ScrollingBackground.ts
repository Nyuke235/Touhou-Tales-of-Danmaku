export class ScrollingBackground {
	private offscreen: HTMLCanvasElement | null = null;
	private loaded: boolean = false;
	private scrollY: number = 0;
	private speed: number;

	constructor(src: string, speed: number = 30) {
		this.speed = speed;
		const img = new Image();
		img.onload = () => {
			const scale = 256 / img.width;
			const scaledH = Math.round(img.height * scale);
			this.offscreen = document.createElement('canvas');
			this.offscreen.width = 256;
			this.offscreen.height = scaledH;
			const octx = this.offscreen.getContext('2d')!;
			octx.imageSmoothingEnabled = false;
			octx.drawImage(img, 0, 0, 256, scaledH);
			this.loaded = true;
		};
		img.src = src;
	}

	update(dt: number): void {
		if (!this.loaded) return;
		this.scrollY = (this.scrollY + this.speed * dt) % this.offscreen!.height;
	}

	render(ctx: CanvasRenderingContext2D, _width: number, height: number): void {
		if (!this.loaded) return;

		const ih = this.offscreen!.height;
		let y = this.scrollY - ih;

		ctx.save();
		ctx.imageSmoothingEnabled = true;
		while (y < height) {
			ctx.drawImage(this.offscreen!, 0, 0, 256, ih, 0, y, 256, ih + 1);
			y += ih;
		}
		ctx.restore();
	}
}
