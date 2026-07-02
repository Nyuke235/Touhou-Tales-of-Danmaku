import { BaseBullet } from '../Bullet';

export class InvisibleBullet extends BaseBullet {
	readonly isShadow = true;
	override damage = 0;

	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, 2, 2);
		this.hitRadius = 0;
	}

	render(): void {}
}
