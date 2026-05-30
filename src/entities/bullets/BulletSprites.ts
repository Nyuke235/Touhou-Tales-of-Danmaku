import { Spritesheet } from '../../utils/Spritesheet';

export type BulletColor =
	| 'blue'
	| 'red'
	| 'yellow'
	| 'purple'
	| 'orange'
	| 'cyan'
	| 'green'
	| 'gray';

export type ColorMap = Partial<Record<BulletColor, string>>;

export const BALL_SPRITES: ColorMap = {
	red: 'assets/sprites/bullets/hostile/ballred.png',
	blue: 'assets/sprites/bullets/hostile/ballblue.png',
	yellow: 'assets/sprites/bullets/hostile/ballyellow.png',
	purple: 'assets/sprites/bullets/hostile/ballpurple.png',
	cyan: 'assets/sprites/bullets/hostile/ballcyan.png',
	green: 'assets/sprites/bullets/hostile/ballgreen.png',
	gray: 'assets/sprites/bullets/hostile/ballgray.png',
};

export const ARROWHEAD_SPRITES: ColorMap = {
	purple: 'assets/sprites/bullets/hostile/arrowheadpurple.png',
	red: 'assets/sprites/bullets/hostile/arrowheadred.png',
	blue: 'assets/sprites/bullets/hostile/arrowheadblue.png',
	cyan: 'assets/sprites/bullets/hostile/arrowheadcyan.png',
	green: 'assets/sprites/bullets/hostile/arrowheadgreen.png',
	yellow: 'assets/sprites/bullets/hostile/arrowheadyellow.png',
};

export const RICE_SPRITES: ColorMap = {
	purple: 'assets/sprites/bullets/hostile/ricepurple.png',
	cyan: 'assets/sprites/bullets/hostile/ricecyan.png',
	yellow: 'assets/sprites/bullets/hostile/riceyellow.png',
	blue: 'assets/sprites/bullets/hostile/riceblue.png',
};

export const ORB_SPRITES: ColorMap = {
	blue: 'assets/sprites/bullets/hostile/orbblue.png',
	yellow: 'assets/sprites/bullets/hostile/orbyellow.png',
	orange: 'assets/sprites/bullets/hostile/orborange.png',
	purple: 'assets/sprites/bullets/hostile/orbpurple.png',
	cyan: 'assets/sprites/bullets/hostile/orbcyan.png',
};

export const STAR_SPRITES: ColorMap = {
	yellow: 'assets/sprites/bullets/hostile/staryellow.png',
};

export const JELLYBEAN_SPRITES: ColorMap = {
	purple: 'assets/sprites/bullets/hostile/jellybeanpurple.png',
	blue: 'assets/sprites/bullets/hostile/jellybeanblue.png',
	cyan: 'assets/sprites/bullets/hostile/jellybeancyan.png',
	green: 'assets/sprites/bullets/hostile/jellybeangreen.png',
	gray: 'assets/sprites/bullets/hostile/jellybeangray.png',
	yellow: 'assets/sprites/bullets/hostile/jellybeanyellow.png',
	orange: 'assets/sprites/bullets/hostile/jellybeanorange.png',
};

export function makeSheet(src: string, w: number, h: number): Spritesheet {
	return new Spritesheet({
		src,
		frameX: w,
		frameY: h,
		frameCount: 1,
		frameSpeed: 1,
		looping: false,
	});
}
