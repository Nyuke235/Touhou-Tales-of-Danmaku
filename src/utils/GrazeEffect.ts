interface GrazeSpark {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	size: number;
	hue: number;
}

const SPARK_COUNT = 6;
const SPEED_MIN = 30;
const SPEED_MAX = 90;
const LIFE_MIN = 0.25;
const LIFE_MAX = 0.45;

export class GrazeEffect {
	private sparks: GrazeSpark[] = [];

	spawn(x: number, y: number): void {
		for (let i = 0; i < SPARK_COUNT; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
			const life = LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN);
			this.sparks.push({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				life,
				maxLife: life,
				size: Math.random() < 0.5 ? 1 : 2,
				hue: 40 + Math.random() * 20,
			});
		}
	}

	update(dt: number): void {
		for (let i = this.sparks.length - 1; i >= 0; i--) {
			const s = this.sparks[i];
			s.x += s.vx * dt;
			s.y += s.vy * dt;
			s.life -= dt;
			if (s.life <= 0) this.sparks.splice(i, 1);
		}
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.imageSmoothingEnabled = false;
		for (const s of this.sparks) {
			const t = s.life / s.maxLife;
			const alpha = t;
			ctx.globalAlpha = alpha;
			ctx.fillStyle = `hsl(${s.hue}, 100%, ${55 + t * 30}%)`;
			ctx.fillRect(
				Math.round(s.x - s.size / 2),
				Math.round(s.y - s.size / 2),
				s.size,
				s.size
			);
		}
		ctx.restore();
	}
}
