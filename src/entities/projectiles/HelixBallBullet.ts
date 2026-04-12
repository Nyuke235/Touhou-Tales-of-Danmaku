import { BaseProjectile, type IProjectile } from '../Projectile';
import { BallBullet } from './BallBullet';
import { makeSheet } from './BulletSprites';
import { type BulletColor, BALL_SPRITES } from './BulletSprites';
import { Spritesheet } from '../../utils/Spritesheet';

const BURST_DELAY = 1.5;
const HELIX_ARMS = 2;
const HELIX_SHOTS = 12;
const HELIX_INTERVAL = 0.07;
const HELIX_SPEED = 85;
const HELIX_STEP = (Math.PI * 2) / HELIX_SHOTS;

export class HelixBallBullet extends BaseProjectile {
	pendingSpawns: IProjectile[] = [];

	private sheet: Spritesheet;
	private color: BulletColor;
	private life: number = 0;
	private helixTimer: number = 0;
	private helixShot: number = 0;

	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor = 'purple'
	) {
		super(x, y, vx, vy, 12, 12);
		this.color = color;
		this.sheet = makeSheet(BALL_SPRITES.purple, 12, 12);
	}

	override update(dt: number): void {
		this.life += dt;
		super.update(dt);

		if (this.life < BURST_DELAY) return;
		if (this.helixShot >= HELIX_SHOTS) return;

		this.helixTimer += dt;
		while (this.helixTimer >= HELIX_INTERVAL && this.helixShot < HELIX_SHOTS) {
			this.helixTimer -= HELIX_INTERVAL;
			const baseAngle = this.helixShot * HELIX_STEP;
			for (let i = 0; i < HELIX_ARMS; i++) {
				const angle = baseAngle + (i / HELIX_ARMS) * Math.PI * 2;
				this.pendingSpawns.push(
					new BallBullet(
						this.x,
						this.y,
						Math.cos(angle) * HELIX_SPEED,
						Math.sin(angle) * HELIX_SPEED,
						this.color
					)
				);
			}
			this.helixShot++;
		}
	}

	render(ctx: CanvasRenderingContext2D): void {
		this.sheet.draw(ctx, this.x - 6, this.y - 6, 12, 12);
	}
}
