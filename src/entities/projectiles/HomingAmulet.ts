import { RotatedBullet } from './RotatedBullet';

const SPEED = 260;
const W = 4;
const H = 6;
const SPRITE = 'assets/sprites/projectiles/player/homingamulet.png';

export class HomingAmulet extends RotatedBullet {
	private turnRate: number;
	private getNearestEnemy: (
		x: number,
		y: number
	) => { x: number; y: number } | null;

	constructor(
		x: number,
		y: number,
		angle: number,
		turnRate: number,
		getNearestEnemy: (x: number, y: number) => { x: number; y: number } | null
	) {
		super(x, y, Math.cos(angle) * SPEED, Math.sin(angle) * SPEED, W, H, SPRITE);
		this.damage = 0.15;
		this.turnRate = turnRate;
		this.getNearestEnemy = getNearestEnemy;
	}

	override update(dt: number): void {
		const target = this.getNearestEnemy(this.x, this.y);
		if (target) {
			const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
			const targetAngle = Math.atan2(target.y - this.y, target.x - this.x);
			const currentAngle = Math.atan2(this.vy, this.vx);

			let diff = targetAngle - currentAngle;
			if (diff > Math.PI) diff -= 2 * Math.PI;
			if (diff < -Math.PI) diff += 2 * Math.PI;

			const turn = Math.max(
				-this.turnRate * dt,
				Math.min(this.turnRate * dt, diff)
			);
			const newAngle = currentAngle + turn;
			this.vx = Math.cos(newAngle) * speed;
			this.vy = Math.sin(newAngle) * speed;
		}

		this.angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;
		super.update(dt);
	}
}
