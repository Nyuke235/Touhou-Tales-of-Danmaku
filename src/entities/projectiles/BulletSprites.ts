import { Spritesheet } from '../../utils/Spritesheet';

export type BulletColor = 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'cyan';

export const BALL_SPRITES: {
	blue: string;
	red: string;
	yellow: string;
	purple: string;
	orange?: string;
	cyan?: string;
} = {
	red: 'assets/sprites/projectiles/hostile/ballred.png',
	blue: 'assets/sprites/projectiles/hostile/ballblue.png',
	yellow: 'assets/sprites/projectiles/hostile/ballyellow.png',
	purple: 'assets/sprites/projectiles/hostile/ballpurple.png',
	cyan: 'assets/sprites/projectiles/hostile/ballcyan.png',
};

export const ARROWHEAD_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
	cyan?: string;
} = {
	purple: 'assets/sprites/projectiles/hostile/arrowheadpurple.png',
	red: 'assets/sprites/projectiles/hostile/arrowheadred.png',
	blue: 'assets/sprites/projectiles/hostile/arrowheadblue.png',
	cyan: 'assets/sprites/projectiles/hostile/arrowheadcyan.png',
};

export const RICE_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
	cyan?: string;
} = {
	purple: 'assets/sprites/projectiles/hostile/ricepurple.png',
};

export const ORB_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
	cyan?: string;
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
} = {
	purple: 'assets/sprites/projectiles/hostile/jellybeanpurple.png',
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
