import { StaticBullet } from './StaticBullet';

const CHI_WIDTH = 13;
const CHI_HEIGHT = 14;
const CHI_VARIANT_COUNT = 6;

function chiSrc(variant: number): string {
	const v =
		((variant % CHI_VARIANT_COUNT) + CHI_VARIANT_COUNT) % CHI_VARIANT_COUNT;
	return `assets/sprites/bullets/hostile/chi${v + 1}.png`;
}

export class ChiBullet extends StaticBullet {
	constructor(x: number, y: number, vx: number, vy: number, variant: number) {
		super(x, y, vx, vy, CHI_WIDTH, CHI_HEIGHT, chiSrc(variant));
	}
}

export { CHI_VARIANT_COUNT };
