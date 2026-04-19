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

export const BALL_SPRITES: {
	blue: string;
	red: string;
	yellow: string;
	purple: string;
	orange?: string;
	cyan?: string;
	green?: string;
	gray?: string;
} = {
	red: 'assets/sprites/projectiles/hostile/ballred.png',
	blue: 'assets/sprites/projectiles/hostile/ballblue.png',
	yellow: 'assets/sprites/projectiles/hostile/ballyellow.png',
	purple: 'assets/sprites/projectiles/hostile/ballpurple.png',
	cyan: 'assets/sprites/projectiles/hostile/ballcyan.png',
	gray: 'assets/sprites/projectiles/hostile/ballgray.png',
};

export const ARROWHEAD_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
	cyan?: string;
	green?: string;
	gray?: string;
} = {
	purple: 'assets/sprites/projectiles/hostile/arrowheadpurple.png',
	red: 'assets/sprites/projectiles/hostile/arrowheadred.png',
	blue: 'assets/sprites/projectiles/hostile/arrowheadblue.png',
	cyan: 'assets/sprites/projectiles/hostile/arrowheadcyan.png',
	green: 'assets/sprites/projectiles/hostile/arrowheadgreen.png',
	yellow: 'assets/sprites/projectiles/hostile/arrowheadyellow.png',
};

export const RICE_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
	cyan?: string;
	green?: string;
	gray?: string;
} = {
	purple: 'assets/sprites/projectiles/hostile/ricepurple.png',
	cyan: 'assets/sprites/projectiles/hostile/ricecyan.png',
};

export const ORB_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
	cyan?: string;
	green?: string;
	gray?: string;
} = {
	blue: 'assets/sprites/projectiles/hostile/orbblue.png',
	yellow: 'assets/sprites/projectiles/hostile/orbyellow.png',
	orange: 'assets/sprites/projectiles/hostile/orborange.png',
	purple: 'assets/sprites/projectiles/hostile/orbpurple.png',
};

export const STAR_SPRITES: {
	yellow: string;
} = {
	yellow: 'assets/sprites/projectiles/hostile/staryellow.png',
};

export const JELLYBEAN_SPRITES: {
	purple: string;
	blue: string;
	cyan: string;
	green?: string;
} = {
	purple: 'assets/sprites/projectiles/hostile/jellybeanpurple.png',
	blue: 'assets/sprites/projectiles/hostile/jellybeanblue.png',
	cyan: 'assets/sprites/projectiles/hostile/jellybeancyan.png',
	green: 'assets/sprites/projectiles/hostile/jellybeangreen.png',
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
