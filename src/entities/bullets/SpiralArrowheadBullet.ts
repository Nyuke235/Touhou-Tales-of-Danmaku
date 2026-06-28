import { BaseBullet } from '../Bullet';
import { Spritesheet } from '../../utils/Spritesheet';
import { ARROWHEAD_SPRITES, BulletColor, makeSheet } from './BulletSprites';

const SIZE = 12;

export class SpiralArrowheadBullet extends BaseBullet {
	private sheet: Spritesheet;
	private visualAngle: number;

	private readonly spawnAngle: number;
	private readonly initialSpeed: number;
	private readonly decelDuration: number;
	private readonly holdDuration: number;
	private readonly orbitDuration: number;

	private readonly orbitCenterX: number;
	private readonly orbitCenterY: number;
	private readonly orbitAngularVel: number;
	private readonly orbitRadialVel: number;
	private readonly gravityDecayTau: number;
	private readonly finalColor: BulletColor;

	private elapsed: number = 0;
	private orbitStarted: boolean = false;
	private orbitElapsed: number = 0;

	constructor(
		x: number,
		y: number,
		spawnAngle: number,
		initialSpeed: number,
		decelDuration: number,
		holdDuration: number,
		orbitCenterX: number,
		orbitCenterY: number,
		orbitAngularVel: number,
		orbitRadialVel: number,
		orbitDuration: number,
		gravityDecayTau: number,
		initialColor: BulletColor,
		finalColor: BulletColor
	) {
		super(x, y, 0, 0, SIZE, SIZE);
		this.spawnAngle = spawnAngle;
		this.initialSpeed = initialSpeed;
		this.decelDuration = decelDuration;
		this.holdDuration = holdDuration;
		this.orbitDuration = orbitDuration;
		this.orbitCenterX = orbitCenterX;
		this.orbitCenterY = orbitCenterY;
		this.orbitAngularVel = orbitAngularVel;
		this.orbitRadialVel = orbitRadialVel;
		this.gravityDecayTau = gravityDecayTau;
		this.finalColor = finalColor;

		const src = ARROWHEAD_SPRITES[initialColor] ?? ARROWHEAD_SPRITES.purple!;
		this.sheet = makeSheet(src, SIZE, SIZE);
		this.visualAngle = spawnAngle + Math.PI / 2;
	}

	override update(dt: number): void {
		this.elapsed += dt;

		if (!this.orbitStarted) {
			if (this.elapsed < this.decelDuration) {
				const t = this.elapsed / this.decelDuration;
				const speed = this.initialSpeed * (1 - t);
				this.x += Math.cos(this.spawnAngle) * speed * dt;
				this.y += Math.sin(this.spawnAngle) * speed * dt;
			} else if (this.elapsed < this.decelDuration + this.holdDuration) {
				// holding still
			} else {
				this.orbitStarted = true;
				this.orbitElapsed = 0;
				const src =
					ARROWHEAD_SPRITES[this.finalColor] ?? ARROWHEAD_SPRITES.blue!;
				this.sheet = makeSheet(src, SIZE, SIZE);
			}
			this.checkBounds();
			return;
		}

		this.orbitElapsed += dt;
		const g = Math.exp(-this.orbitElapsed / this.gravityDecayTau);

		const dx = this.x - this.orbitCenterX;
		const dy = this.y - this.orbitCenterY;
		const radius = Math.sqrt(dx * dx + dy * dy);
		const angle = Math.atan2(dy, dx);

		const tangentVx = -Math.sin(angle) * this.orbitAngularVel * radius;
		const tangentVy = Math.cos(angle) * this.orbitAngularVel * radius;
		const radialVx = Math.cos(angle) * this.orbitRadialVel;
		const radialVy = Math.sin(angle) * this.orbitRadialVel;
		const idealVx = tangentVx + radialVx;
		const idealVy = tangentVy + radialVy;

		this.vx = this.vx * (1 - g) + idealVx * g;
		this.vy = this.vy * (1 - g) + idealVy * g;

		this.x += this.vx * dt;
		this.y += this.vy * dt;

		this.visualAngle = Math.atan2(this.vy, this.vx) + Math.PI / 2;

		if (this.orbitElapsed >= this.orbitDuration) {
			this.active = false;
			return;
		}
		this.checkBounds();
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.visualAngle);
		this.sheet.draw(ctx, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
		ctx.restore();
	}
}
