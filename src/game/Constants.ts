export const FIELD = {
	WIDTH: 256,
	HEIGHT: 280,
} as const;

export const PLAYER = {
	SHOOT_COOLDOWN: 0.08,
	BLINK_INTERVAL: 0.08,
	DEAD_DURATION: 1.0,
	INVINCIBLE_DURATION: 2.5,
	SPAWN_X: FIELD.WIDTH / 2, // 128
	SPAWN_Y: FIELD.HEIGHT - 40, // 240
	HITBOX_RADIUS: 1,
	GRAZE_RADIUS: 16,
	MAX_POWER: 4.0,
	DIAGONAL_FACTOR: 0.707,
} as const;

export const REIMU = {
	SPEED: 150,
	FOCUS_SPEED: 60,
	FRAMECOUNT: 19,
} as const;

export const MARISA = {
	SPEED: 180,
	FOCUS_SPEED: 70,
	FRAMECOUNT: 6,
} as const;

export const ITEM = {
	FALL_SPEED: 40,
	ATTRACT_SPEED: 300,
	COLLECT_RADIUS: 15,
	POC_Y: FIELD.HEIGHT / 4, // collection line
} as const;

export const ENEMY = {
	OOB_MARGIN: 40,
} as const;

export const NETWORK = {
	SAVE_API:
		typeof window !== 'undefined'
			? `http://${window.location.hostname}:9000`
			: 'http://localhost:9000',
	ASSET_BASE:
		typeof window !== 'undefined'
			? `http://${window.location.hostname}:8000`
			: 'http://localhost:8000',
} as const;

export const AUDIO = {
	MUSIC_VOLUME: 0.7,
	SFX_VOLUME: 0.8,
	POOL_SIZE: 4,
} as const;

export const GAME = {
	INITIAL_LIVES: 6,
	INITIAL_BOMBS: 6,
	MAX_LIVES: 24,
	MAX_BOMBS: 24,
	THIRDS_PER_GEM: 3,
	BOMB_DURATION: 0.3,
	BOMB_DAMAGE: 100,
	BOMB_EFFECT_SIZE: 380,
	POWER_PER_ITEM: 0.02,
	POWER_PER_BIG: 1.0,
	POWER_LOST_ON_DEATH: 1.0,
} as const;

export const BOSS = {
	CENTER_X: FIELD.WIDTH / 2,
	CENTER_Y: 60,
	DEST_WAIT: 1.0,
	LEAVE_SPEED: 300,
	HURT_SIZE: 96,
	RETURN_LERP: 4.5,
	PHASE_WAIT: 2.0,
	SPELL_BONUS_INITIAL: 8_000_000,
	SPELL_BONUS_DECAY: 200_000,
} as const;

export const ENEMY_MOVEMENT = {
	SINE_SPEED: 2,
	FAIRY_SPEED: 65,
	FAIRY_SINE_AMPLITUDE: 40,
	SPIRIT_SPEED: 90,
	SPIRIT_SINE_AMPLITUDE: 30,
	MINI_SPIRIT_SPEED: 60,
	SPINNING_SPEED: 300,
	SPINNING_CURVE_SPEED: 25,
} as const;

export const BOSS_ENTRY = {
	ENTRY_SPEED: 90,
	FTM_Y_LERP: 1.5,
	RETURN_LERP: 1.2,
} as const;

export const HAKKERO_OFFSETS: [number, number][][] = [
	[],
	[[0, -28]],
	[
		[-28, 0],
		[28, 0],
	],
	[
		[-24, 0],
		[0, -28],
		[24, 0],
	],
	[
		[-30, 0],
		[-10, 0],
		[10, 0],
		[30, 0],
	],
];

export const HAKKERO_FOCUS_OFFSETS: [number, number][][] = [
	[],
	[[0, -24]],
	[
		[0, -30],
		[0, -18],
	],
	[
		[0, -32],
		[0, -22],
		[0, -12],
	],
	[
		[0, -34],
		[0, -24],
		[0, -14],
		[0, -4],
	],
];

export const YINGYANG_OFFSETS: [number, number][][] = [
	[],
	[[0, -28]],
	[
		[-28, 0],
		[28, 0],
	],
	[
		[0, -30],
		[-26, 15],
		[26, 15],
	],
	[
		[-24, -20],
		[24, -20],
		[-24, 16],
		[24, 16],
	],
];

export const YINGYANG_FOCUS_OFFSETS: [number, number][][] = [
	[],
	[[0, -20]],
	[
		[-16, -4],
		[16, -4],
	],
	[
		[0, -22],
		[-14, 10],
		[14, 10],
	],
	[
		[-16, -14],
		[16, -14],
		[-16, 8],
		[16, 8],
	],
];
