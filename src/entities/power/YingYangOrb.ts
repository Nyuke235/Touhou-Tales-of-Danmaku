import { IOption } from '../Power';
import { Spritesheet } from '../../utils/Spritesheet';
import { ProjectileManager } from '../../systems/ProjectileManager';
import { HomingAmulet } from '../projectiles/HomingAmulet';

const SIZE = 12;
const SPIN_SPEED = 1.8;

const NORMAL_SPREAD = 0.35;
const FOCUS_SPREAD = 0.08;
const NORMAL_TURN = 2.5;
const FOCUS_TURN = 4.5;

export class YingYangOrb implements IOption {
	x: number = 0;
	y: number = 0;
	private rotation: number;
	private sheet: Spritesheet;

	constructor(initialRotation: number = 0) {
		this.rotation = initialRotation;
		this.sheet = new Spritesheet({
			src: 'assets/sprites/entities/other/yingyang.png',
			frameX: SIZE,
			frameY: SIZE,
			frameCount: 1,
			frameSpeed: 1,
			looping: false,
		});
	}

	update(dt: number): void {
		this.rotation += SPIN_SPEED * dt;
	}

	shoot(
		projectileManager: ProjectileManager,
		getNearestEnemy: (x: number, y: number) => { x: number; y: number } | null,
		px: number,
		focused: boolean
	): void {
		const spread = focused ? FOCUS_SPREAD : NORMAL_SPREAD;
		const turnRate = focused ? FOCUS_TURN : NORMAL_TURN;

		const lateral = this.x < px ? -1 : this.x > px ? 1 : 0;
		const angle = -Math.PI / 2 + lateral * spread;

		projectileManager.addPlayerProjectile(
			new HomingAmulet(this.x, this.y, angle, turnRate, getNearestEnemy)
		);
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		this.sheet.draw(ctx, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
		ctx.restore();
	}
}
