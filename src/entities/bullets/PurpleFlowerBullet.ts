import { BaseBullet } from '../Bullet';
import { Spritesheet } from '../../utils/Spritesheet';
import { makeSheet } from './BulletSprites';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { FIELD } from '../../game/Constants';

const SIZE = 48;
const SRC = 'assets/sprites/bullets/hostile/purpleflower.png';
const ROTATION_SPEED = 0.6;
const SWEEP_SPEED = 700;
const DESCEND_SPEED = 450;
const PAUSE_DURATION = 1.5;
const DESCEND_AMOUNT = 36;
const TOP_Y = 36;
const BOTTOM_Y = 252;
const LEFT_X = -SIZE / 2 - 4;
const RIGHT_X = FIELD.WIDTH + SIZE / 2 + 4;

type FlowerState = 'pause' | 'sweep' | 'descend';

export class PurpleFlowerBullet extends BaseBullet {
	isTopLayer = true;
	private sheet: Spritesheet;
	private rotation: number = 0;

	private state: FlowerState = 'pause';
	private stateTimer: number = PAUSE_DURATION;
	private targetX: number = 0;
	private targetY: number = 0;
	private nextDir: 'left' | 'right' = 'left';
	private verticalDir: number = 1;

	constructor(x: number = RIGHT_X, y: number = TOP_Y) {
		super(x, y, 0, 0, SIZE, SIZE);
		this.sheet = makeSheet(SRC, SIZE, SIZE);
		this.hitRadius = SIZE / 2 - 6;
	}

	override update(dt: number): void {
		this.rotation += ROTATION_SPEED * dt;

		if (this.state === 'pause') {
			this.stateTimer -= dt;
			if (this.stateTimer <= 0) {
				this.startSweep();
			}
			return;
		}

		if (this.state === 'sweep') {
			const dx = this.targetX - this.x;
			const step = Math.sign(dx) * SWEEP_SPEED * dt;
			if (Math.abs(step) >= Math.abs(dx)) {
				this.x = this.targetX;
				this.startDescent();
			} else {
				this.x += step;
			}
			return;
		}

		const dy = this.targetY - this.y;
		const step = Math.sign(dy) * DESCEND_SPEED * dt;
		if (Math.abs(step) >= Math.abs(dy)) {
			this.y = this.targetY;
			this.startPause();
		} else {
			this.y += step;
		}
	}

	private startPause(): void {
		this.state = 'pause';
		this.stateTimer = PAUSE_DURATION;
	}

	private startSweep(): void {
		this.state = 'sweep';
		this.targetX = this.nextDir === 'left' ? LEFT_X : RIGHT_X;
		this.nextDir = this.nextDir === 'left' ? 'right' : 'left';
		SoundManager.play(SFX.MYSTIA_SWEEP);
	}

	private startDescent(): void {
		let next = this.y + DESCEND_AMOUNT * this.verticalDir;
		if (next > BOTTOM_Y || next < TOP_Y) {
			this.verticalDir = -this.verticalDir;
			next = this.y + DESCEND_AMOUNT * this.verticalDir;
		}
		this.state = 'descend';
		this.targetY = next;
	}

	override render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		this.sheet.draw(ctx, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
		ctx.restore();
	}
}
