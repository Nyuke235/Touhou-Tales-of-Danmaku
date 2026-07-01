interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	alpha: number;
}

export class FireParticle {
	private particles: Particle[] = [];
	private spawnTimer: number = 0;
	private spawnInterval: number = 0.22;
	private active: boolean = false;

	start(): void {
		this.active = true;
	}

	stop(): void {
		this.active = false;
	}

	update(dt: number, width: number, height: number): void {
		if (this.active) {
			this.spawnTimer += dt;
			while (this.spawnTimer >= this.spawnInterval) {
				this.spawnTimer -= this.spawnInterval;
				this.particles.push({
					x: Math.random() * width,
					y: -4,
					vx: (Math.random() - 0.5) * 6,
					vy: 22 + Math.random() * 20,
					size: 1 + Math.random() * 1.2,
					alpha: 0.55 + Math.random() * 0.35,
				});
			}
		}

		for (const p of this.particles) {
			p.x += p.vx * dt;
			p.y += p.vy * dt;
		}
		this.particles = this.particles.filter(
			p => p.y < height + 4 && p.x > -4 && p.x < width + 4
		);
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.fillStyle = '#ff8c2a';
		for (const p of this.particles) {
			ctx.globalAlpha = p.alpha;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}
}
