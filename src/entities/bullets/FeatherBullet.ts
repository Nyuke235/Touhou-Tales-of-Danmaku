import { RotatedBullet } from './RotatedBullet';

const SRC = 'assets/sprites/bullets/hostile/feather.png';
const WIDTH = 8;
const HEIGHT = 20;

export class FeatherBullet extends RotatedBullet {
	constructor(x: number, y: number, vx: number, vy: number) {
		super(x, y, vx, vy, WIDTH, HEIGHT, SRC);
	}
}
