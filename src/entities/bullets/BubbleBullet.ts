import { StaticBullet } from './StaticBullet';
import { IBullet } from '../Bullet';

const SPLIT_SPREAD = 0.3;

function splitInto(
	x: number,
	y: number,
	vx: number,
	vy: number,
	factory: (x: number, y: number, vx: number, vy: number) => IBullet
): IBullet[] {
	const angle = Math.atan2(vy, vx);
	const speed = Math.sqrt(vx * vx + vy * vy);
	return [
		factory(
			x,
			y,
			Math.cos(angle - SPLIT_SPREAD) * speed,
			Math.sin(angle - SPLIT_SPREAD) * speed
		),
		factory(
			x,
			y,
			Math.cos(angle + SPLIT_SPREAD) * speed,
			Math.sin(angle + SPLIT_SPREAD) * speed
		),
	];
}

abstract class BubbleBullet extends StaticBullet {
	private bulletHp: number;
	private readonly splitFn:
		| ((x: number, y: number, vx: number, vy: number) => IBullet[])
		| null;

	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		size: number,
		src: string,
		hp: number,
		splitFn:
			| ((x: number, y: number, vx: number, vy: number) => IBullet[])
			| null
	) {
		super(x, y, vx, vy, size, size, src);
		this.bulletHp = hp;
		this.splitFn = splitFn;
	}

	takeDamage(dmg: number): IBullet[] {
		this.bulletHp -= dmg;
		if (this.bulletHp <= 0) {
			this.active = false;
			if (this.splitFn) return this.splitFn(this.x, this.y, this.vx, this.vy);
		}
		return [];
	}
}

export class BubbleBigBullet extends BubbleBullet {
	constructor(x: number, y: number, vx: number, vy: number) {
		super(
			x,
			y,
			vx,
			vy,
			13,
			'assets/sprites/bullets/hostile/bubblebig.png',
			3,
			(bx, by, bvx, bvy) =>
				splitInto(
					bx,
					by,
					bvx,
					bvy,
					(nx, ny, nvx, nvy) => new BubbleMediumBullet(nx, ny, nvx, nvy)
				)
		);
	}
}

export class BubbleMediumBullet extends BubbleBullet {
	constructor(x: number, y: number, vx: number, vy: number) {
		super(
			x,
			y,
			vx,
			vy,
			10,
			'assets/sprites/bullets/hostile/bubblemedium.png',
			2,
			(bx, by, bvx, bvy) =>
				splitInto(
					bx,
					by,
					bvx,
					bvy,
					(nx, ny, nvx, nvy) => new BubbleSmallBullet(nx, ny, nvx, nvy)
				)
		);
	}
}

export class BubbleSmallBullet extends BubbleBullet {
	constructor(x: number, y: number, vx: number, vy: number) {
		super(
			x,
			y,
			vx,
			vy,
			6,
			'assets/sprites/bullets/hostile/bubblesmall.png',
			1,
			null
		);
	}
}
