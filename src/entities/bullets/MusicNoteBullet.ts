import { BaseBullet } from '../Bullet';
import { Spritesheet } from '../../utils/Spritesheet';

const FRAME_SIZE = 25;
const FRAME_COUNT = 4;
const FLIP_INTERVAL = 0.8;

export class MusicNoteBullet extends BaseBullet {
	private sheet: Spritesheet;
	private flipTimer: number = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, FRAME_SIZE, FRAME_SIZE);
		this.hitRadius = 9;
		this.sheet = new Spritesheet({
			src: 'assets/sprites/bullets/hostile/musicnote_spritesheet.png',
			frameX: FRAME_SIZE,
			frameY: FRAME_SIZE,
			frameCount: FRAME_COUNT,
			frameSpeed: 0.22,
			looping: true,
		});
	}

	override update(dt: number): void {
		this.flipTimer += dt;
		if (this.flipTimer >= FLIP_INTERVAL) {
			this.flipTimer -= FLIP_INTERVAL;
			this.vx = -this.vx;
		}
		this.x += this.vx * dt;
		this.y += this.vy * dt;
		this.sheet.update(dt);
		this.checkBounds();
	}

	override render(ctx: CanvasRenderingContext2D): void {
		this.sheet.draw(
			ctx,
			this.x - FRAME_SIZE / 2,
			this.y - FRAME_SIZE / 2,
			FRAME_SIZE,
			FRAME_SIZE
		);
	}
}
