import { Spritesheet } from '../../utils/Spritesheet';

export type BulletColor = 'blue' | 'red' | 'yellow' | 'purple' | 'orange';

export const BALL_SPRITES: {
	blue: string;
	red: string;
	yellow: string;
	purple: string;
	orange?: string;
} = {
	red: 'assets/sprites/projectiles/hostile/ballred.png',
	blue: 'assets/sprites/projectiles/hostile/ballblue.png',
	yellow: 'assets/sprites/projectiles/hostile/ballyellow.png',
	purple: 'assets/sprites/projectiles/hostile/ballpurple.png',
};

export const ARROWHEAD_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
} = {
	purple: 'assets/sprites/projectiles/hostile/arrowheadpurple.png',
	red: 'assets/sprites/projectiles/hostile/arrowheadred.png',
	blue: 'assets/sprites/projectiles/hostile/arrowheadblue.png',
};

export const RICE_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
} = {
	purple: 'assets/sprites/projectiles/hostile/ricepurple.png',
};

export const ORB_SPRITES: {
	blue?: string;
	red?: string;
	yellow?: string;
	purple?: string;
	orange?: string;
} = {
	yellow: 'assets/sprites/projectiles/hostile/orbyellow.png',
	orange: 'assets/sprites/projectiles/hostile/orborange.png',
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
