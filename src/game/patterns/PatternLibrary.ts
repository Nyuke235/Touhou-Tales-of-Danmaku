import { PatternConfig } from './PatternEngine';
import { Difficulty } from '../GameState';

export const Patterns = {

	// PHASE1 ENNEMIES PATTERNS
	S1_FAIRY_NORMAL: {
		type: 'aimed', color: 'purple', speed: 90, delay: 1.0, maxShots: 1,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	S1_FAIRY_HARD: {
		type: 'spread', color: 'purple', speed: 100, delay: 1.0, maxShots: 1,
		count: 3, spread: 0.3,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_FAIRY_LUNA: {
		type: 'volley-spread', color: 'purple', speed: 100, deltaSpeed: 15, delay: 1.0, maxShots: 1,
		count: 3, streams: 5, spread: 0.3,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_ACCEL_NORMAL: {
		type: 'aimed', color: 'yellow', speed: 50, initSpeed: 5, accelTime: 1.125,
		delay: 1.5, cooldown: 0.6, maxShots: 1,
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	S1_ACCEL_HARD: {
		type: 'aimed', color: 'yellow', speed: 50, initSpeed: 10, accelTime: 1.0,
		delay: 1, cooldown: 0.6, maxShots: 2,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_ACCEL_LUNA: {
		type: 'aimed', color: 'yellow', speed: 50, initSpeed: 15, accelTime: 0.875,
		delay: 1, cooldown: 0.5, maxShots: 4,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_SPIRIT_CIRCLE_NORMAL: {
		type: 'circle', bullet: 'arrowhead', color: 'purple',
		count: 16, speed: 90, delay: 3.0, cooldown: 4.0, maxShots: 1,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	S1_SPIRIT_CIRCLE_HARD: {
		type: 'circle', bullet: 'arrowhead', color: 'purple',
		count: 24, speed: 100, delay: 3.0, cooldown: 4.0, maxShots: 1,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_SPIRIT_CIRCLE_LUNA: {
		type: 'circle', bullet: 'arrowhead', color: 'purple',
		count: 32, speed: 110, delay: 3.0, cooldown: 4.0, maxShots: 1,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_FALLING_RICE1_LEFT: {
		type: 'fixed', bullet: 'rice', color: 'purple',
		count: 1, startAngle: Math.PI / 2 - 0.25,
		speed: 90, delay: 0.1, cooldown: 0.2, maxShots: 15,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_FALLING_RICE2_LEFT: {
		type: 'fixed', bullet: 'rice', color: 'purple',
		count: 1, startAngle: Math.PI / 2 - 0.25,
		speed: 80, delay: 0.1, cooldown: 0.1, maxShots: 30,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_FALLING_RICE1_RIGHT: {
		type: 'fixed', bullet: 'rice', color: 'purple',
		count: 1, startAngle: Math.PI / 2 + 0.25,
		speed: 90, delay: 0.1, cooldown: 0.2, maxShots: 15,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_FALLING_RICE2_RIGHT: {
		type: 'fixed', bullet: 'rice', color: 'purple',
		count: 1, startAngle: Math.PI / 2 + 0.25,
		speed: 80, delay: 0.1, cooldown: 0.1, maxShots: 30,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_MOTH_ORB_EASY: {
		type: 'circle', bullet: 'orb', color: 'yellow',
		count: 8, speed: 70, delay: 3.5, cooldown: 0.5, maxShots: 1,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	S1_MOTH_ORB_NORMAL: {
		type: 'circle', bullet: 'orb', color: 'yellow',
		count: 8, speed: 80, delay: 3.5, cooldown: 0.5, maxShots: 2,
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	S1_MOTH_ORB_HARD: {
		type: 'circle', bullet: 'orb', color: 'yellow',
		count: 16, speed: 80, delay: 3.5, cooldown: 0.3, maxShots: 3,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_MOTH_ORB_LUNA: {
		type: 'circle', bullet: 'orb', color: 'yellow',
		count: 16, speed: 90, delay: 3.5, cooldown: 0.2, maxShots: 4,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_AIMED_RICE: {
		type: 'aimed', bullet: 'rice', color: 'purple', speed: 90, delay: 1.0, maxShots: 1,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	S1_SPREAD_RICE: {
		type: 'spread', bullet: 'rice', color: 'purple',
		count: 3, spread: 0.45, speed: 85, delay: 1.2, maxShots: 1,
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	S1_SPREAD_RICE_2: {
		type: 'spread', bullet: 'rice', color: 'purple',
		count: 3, spread: 0.45, speed: 95, delay: 1.2, cooldown: 0.4, maxShots: 2,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_SPREAD_RICE_3: {
		type: 'spread', bullet: 'rice', color: 'purple',
		count: 3, spread: 0.45, speed: 100, delay: 1.2, cooldown: 0.4, maxShots: 3,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_STREAM_BLUE_NORMAL: {
		type: 'stream', bullet: 'ball', color: 'blue',
		streams: 3, speed: 85, delay: 0.8, cooldown: 0.7, maxShots: 2,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	S1_STREAM_BLUE_HARD: {
		type: 'volley-spread', color: 'blue', speed: 100, deltaSpeed: 10, delay: 0.8, maxShots: 1,
		count: 3, streams: 3, spread: 0.35,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_STREAM_BLUE_LUNA: {
		type: 'volley-spread', color: 'blue', speed: 100, deltaSpeed: 15, delay: 0.8, maxShots: 1,
		count: 3, streams: 5, spread: 0.25,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_CIRCLE_BALL_RED_1: {
		type: 'circle', bullet: 'ball', color: 'red',
		count: 12, speed: 75, delay: 2.0, cooldown: 3.0, maxShots: 2,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	S1_CIRCLE_BALL_RED_2: {
		type: 'circle', bullet: 'ball', color: 'red',
		count: 16, speed: 75, delay: 2.0, cooldown: 3.0, maxShots: 2,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_CIRCLE_BALL_RED_3: {
		type: 'circle', bullet: 'ball', color: 'red',
		count: 20, speed: 80, delay: 2.0, cooldown: 3.0, maxShots: 2,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S1_ARROWHEAD_RED_RIGHT: {
		type: 'fixed', bullet: 'arrowhead', color: 'red',
		count: 1, spread: 0.3, startAngle: 0,
		speed: 95, delay: 0.8, cooldown: 0.5, maxShots: 5,
	} as PatternConfig,

	S1_ARROWHEAD_RED_LEFT: {
		type: 'fixed', bullet: 'arrowhead', color: 'red',
		count: 1, spread: 0.3, startAngle: Math.PI,
		speed: 95, delay: 0.8, cooldown: 0.5, maxShots: 5,
	} as PatternConfig,

	S1_SPREAD_ARROWHEAD_BLUE_1: {
		type: 'spread', bullet: 'arrowhead', color: 'blue',
		count: 2, spread: 0.5, speed: 80, delay: 0.4, cooldown: 1.2, maxShots: 2,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	S1_SPREAD_ARROWHEAD_BLUE_2: {
		type: 'spread', bullet: 'arrowhead', color: 'blue',
		count: 3, spread: 0.5, speed: 90, delay: 0.4, cooldown: 1.2, maxShots: 2,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD]
	} as PatternConfig,

	S1_SPREAD_ARROWHEAD_BLUE_3: {
		type: 'spread', bullet: 'arrowhead', color: 'blue',
		count: 5, spread: 0.3, speed: 90, delay: 0.4, cooldown: 1.2, maxShots: 2,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_AIMED_RED: {
		type: 'volley', bullet: 'ball', color: 'red',
		count: 5, speed: 120, deltaSpeed: 5,
		delay: 2.0, cooldown: 2.0, maxShots: 1,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S1_SPIRAL_BALL_RED_1: {
		type: 'helix', bullet: 'ball', color: 'red',
		count: 2, startAngle: 0, sweepAngle: Math.PI * 4,
		speed: 75, cooldown: 0.1, delay: 0.3, maxShots: 36,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	S1_SPIRAL_BALL_RED_2: {
		type: 'helix', bullet: 'ball', color: 'red',
		count: 3, startAngle: 0, sweepAngle: Math.PI * 4,
		speed: 85, cooldown: 0.1, delay: 0.3, maxShots: 36,
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	S1_SPIRAL_BALL_RED_3: {
		type: 'helix', bullet: 'ball', color: 'red',
		count: 3, startAngle: 0, sweepAngle: Math.PI * 4,
		speed: 85, cooldown: 0.06, delay: 0.3, maxShots: 52,
		difficulties: [Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	S1_RED_SPIRIT_BONUS: {
		type: 'spread', bullet: 'arrowhead', color: 'red', speed: 100, delay: 1.5, maxShots: 1,
		count: 5, spread: 0.3,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	// Dark Rumia
	RUMIA_PINWHEEL_1: {
		type: 'helix', bullet: 'ball', color: 'purple',
		count: 3, startAngle: 0, sweepAngle: Math.PI * 2.1,
		speed: 100, cooldown: 0.04, delay: 0.4, maxShots: 40,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_PINWHEEL_2: {
		type: 'helix', bullet: 'ball', color: 'purple',
		count: 3, startAngle: Math.PI / 4, sweepAngle: Math.PI * 2.1,
		speed: 100, cooldown: 0.04, delay: 0.6, maxShots: 40,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_PINWHEEL_SUPER: {
		type: 'helix', bullet: 'ball', color: 'purple',
		count: 3, startAngle: Math.PI * 3 / 4, sweepAngle: Math.PI * 2.1,
		speed: 85, cooldown: 0.03, delay: 1.2, maxShots: 40,
		difficulties: [Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_PINWHEEL_SUPER_2: {
		type: 'helix', bullet: 'ball', color: 'purple',
		count: 3, startAngle: Math.PI * 3 / 4, sweepAngle: Math.PI * 2.1,
		speed: 85, cooldown: 0.03, delay: 1.3, maxShots: 40,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_ORB_RINGS_1: {
		type: 'circle', bullet: 'orb', color: 'yellow',
		count: 12, speed: 55, startAngle: 0, rotStep: Math.PI / 12,
		cooldown: 0.45, delay: 1.4, maxShots: 4,
	} as PatternConfig,

	RUMIA_ORB_RINGS_2: {
		type: 'circle', bullet: 'orb', color: 'orange',
		count: 12, speed: 75, startAngle: Math.PI / 2, rotStep: Math.PI / 12,
		cooldown: 0.45, delay: 1.6, maxShots: 4,
		difficulties: [Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_ROSE_1: {
		type: 'rose', bullet: 'rice', color: 'purple',
		roseN: 4, count: 1,
		speed: 90, startAngle: 0,
		rotStep: 0.07, cooldown: 0.12, delay: 0.5,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	RUMIA_ROSE_2: {
		type: 'rose', bullet: 'rice', color: 'purple',
		roseN: 4, count: 1,
		speed: 100, startAngle: 0,
		rotStep: 0.07, cooldown: 0.09, delay: 0.5,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	RUMIA_ROSE_3: {
		type: 'rose', bullet: 'rice', color: 'purple',
		roseN: 4, count: 1,
		speed: 105, startAngle: 0,
		rotStep: 0.07, cooldown: 0.08, delay: 0.5,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_SHADOW_CIRCLE_1: {
		type: 'circle', bullet: 'shadow',
		count: 4, speed: 40, startAngle: Math.PI / 8, rotStep: Math.PI / 8,
		delay: 2.0, cooldown: 3.0,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	RUMIA_SHADOW_CIRCLE_2: {
		type: 'circle', bullet: 'shadow',
		count: 8, speed: 40, startAngle: Math.PI / 8, rotStep: Math.PI / 8,
		delay: 2.0, cooldown: 3.0,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_VOLLEY_1: {
		type: 'volley', bullet: 'ball', color: 'yellow',
		count: 5, speed: 120, deltaSpeed: 10,
		delay: 1.0, cooldown: 2.0, maxShots: 1,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	RUMIA_VOLLEY_2: {
		type: 'volley-spread', color: 'yellow',
		count: 3, streams: 5, speed: 120, deltaSpeed: 10, spread: 0.3,
		delay: 1.0, cooldown: 1.5, maxShots: 1,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,


	// Rumia phases
	RUMIA_STARWHEEL: {
		type: 'helix', bullet: 'star', color: 'yellow',
		count: 1, startAngle: 0, sweepAngle: Math.PI * 6.0,
		speed: 32, initSpeed: 112, accelTime: 2.0,
		cooldown: 0.03, delay: 0.1, maxShots: 80,
	} as PatternConfig,

	RUMIA_STARWHEEL_CCW: {
		type: 'helix', bullet: 'star', color: 'yellow',
		count: 1, startAngle: 0, sweepAngle: -Math.PI * 6.0,
		speed: 32, initSpeed: 112, accelTime: 2.0,
		cooldown: 0.03, delay: 3.0, maxShots: 80,
	} as PatternConfig,

	RUMIA_JELLYBEAN_SPIRAL_1: {
		type: 'helix', bullet: 'ball', color: 'purple',
		count: 1, startAngle: 0, sweepAngle: Math.PI * 2.0,
		speed: 50, cooldown: 0.09, delay: 0.2, maxShots: 8,
		morphDelay: 1.5, morphDeactivate: true,
		morphConfig: {
			type: 'helix', bullet: 'jellybean',
			count: 1, speed: 60, shots: 6, interval: 0.17,
			startAngle: Math.PI / 4, sweepAngle: Math.PI * 0.75,
		},
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	RUMIA_JELLYBEAN_SPIRAL_2: {
		type: 'helix', bullet: 'ball', color: 'purple',
		count: 1, startAngle: 0, sweepAngle: Math.PI * 2.0,
		speed: 50, cooldown: 0.09, delay: 0.2, maxShots: 8,
		morphDelay: 1.5, morphDeactivate: true,
		morphConfig: {
			type: 'helix', bullet: 'jellybean',
			count: 1, speed: 70, shots: 8, interval: 0.08,
			startAngle: Math.PI / 4, sweepAngle: Math.PI * 0.75,
		},
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	RUMIA_JELLYBEAN_SPIRAL_3: {
		type: 'helix', bullet: 'ball', color: 'purple',
		count: 1, startAngle: 0, sweepAngle: Math.PI * 2.0,
		speed: 50, cooldown: 0.09, delay: 0.2, maxShots: 8,
		morphDelay: 1.5, morphDeactivate: true,
		morphConfig: {
			type: 'helix', bullet: 'jellybean',
			count: 1, speed: 70, shots: 12, interval: 0.07,
			startAngle: Math.PI / 4, sweepAngle: Math.PI * 0.75,
		},
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	RUMIA_JELLYBEAN_SPIRAL_4: {
		type: 'helix', bullet: 'ball', color: 'purple',
		count: 2, startAngle: 0, sweepAngle: Math.PI * 2.0,
		speed: 50, cooldown: 0.09, delay: 0.2, maxShots: 8,
		morphDelay: 1.5, morphDeactivate: true,
		morphConfig: {
			type: 'helix', bullet: 'jellybean',
			count: 1, speed: 70, shots: 10, interval: 0.07,
			startAngle: Math.PI / 4, sweepAngle: Math.PI * 0.75,
		},
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_ORB_RINGS: {
		type: 'circle', bullet: 'orb', color: 'yellow',
		count: 12, speed: 100, initSpeed: 40, accelTime: 2.0, startAngle: 0, rotStep: Math.PI / 2,
		cooldown: 0.3, delay: 6.0, maxShots: 9, ringAngleStep: Math.PI / 7,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	RUMIA_ORB_RINGS_MORE: {
		type: 'circle', bullet: 'orb', color: 'yellow',
		count: 18, speed: 100, initSpeed: 40, accelTime: 2.0, startAngle: 0, rotStep: Math.PI / 2,
		cooldown: 0.3, delay: 6.0, maxShots: 9, ringAngleStep: Math.PI / 8,
		difficulties: [Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_VOLLEY_HARD: {
		type: 'volley-spread', color: 'yellow', speed: 100,
		deltaSpeed: 15, delay: 1.0, cooldown: 1.8, maxShots: 6,
		count: 3, streams: 5, spread: 0.3,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	RUMIA_VOLLEY_LUNATIC: {
		type: 'volley-spread', color: 'yellow', speed: 100,
		deltaSpeed: 15, delay: 1.0, cooldown: 1.8, maxShots: 6,
		count: 5, streams: 6, spread: 0.3,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_SPECTRAL_COMET_EASY: {
		type: 'orbit', bullet: 'lasertrail', color: 'purple',
		count: 6,
		angularVel: Math.PI * 0.22,
		radialVel: 55,
		startAngle: 0,
		rotStep: Math.PI / 6,
		delay: 0.8, cooldown: 2.5,
		difficulties: [Difficulty.EASY],
	} as PatternConfig,

	RUMIA_SPECTRAL_COMET: {
		type: 'orbit', bullet: 'lasertrail', color: 'purple',
		count: 8,
		angularVel: Math.PI * 0.30,
		radialVel: 65,
		startAngle: 0,
		rotStep: Math.PI / 8,
		delay: 0.8, cooldown: 2.5,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD, Difficulty.LUNATIC],
	} as PatternConfig,

	RUMIA_SPECTRAL_COMET_CCW: {
		type: 'orbit', bullet: 'lasertrail', color: 'purple',
		count: 8,
		angularVel: -(Math.PI * 0.30),
		radialVel: 65,
		startAngle: Math.PI / 8,
		rotStep: -(Math.PI / 8),
		delay: 3.0, cooldown: 2.5,
		difficulties: [Difficulty.LUNATIC],
	} as PatternConfig,

	RUMIA_STARWHEEL_LOOP: {
		type: 'helix', bullet: 'star', color: 'yellow',
		count: 1, startAngle: 0,
		angleStep: -(Math.PI * 6.0) / 80,
		speed: 50, initSpeed: 80, accelTime: 2.0, cooldown: 0.04, delay: 0.4,
	} as PatternConfig,

	// Rumia spellcard
	RUMIA_WHEEL_CW_EASY: {
		type: 'orbit', color: 'purple',
		count: 16, angularVel: Math.PI * 0.08, radialVel: 64,
		startAngle: 0, delay: 0.2, cooldown: 1.8,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	RUMIA_WHEEL_CCW_EASY: {
		type: 'orbit', color: 'purple',
		count: 16, angularVel: -(Math.PI * 0.08), radialVel: 64,
		startAngle: Math.PI / 14, delay: 0.2, cooldown: 1.8,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	RUMIA_WHEEL_CW: {
		type: 'orbit', color: 'purple',
		count: 16, angularVel: Math.PI * 0.14, radialVel: 64,
		startAngle: 0, delay: 0.2, cooldown: 1.8,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_WHEEL_CCW: {
		type: 'orbit', color: 'purple',
		count: 16, angularVel: -(Math.PI * 0.14), radialVel: 64,
		startAngle: Math.PI / 14, delay: 0.2, cooldown: 1.8,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_WHEEL_CW_2: {
		type: 'orbit', color: 'purple',
		count: 16, angularVel: Math.PI * 0.14, radialVel: 64,
		startAngle: 0, delay: 0.8, cooldown: 1.8,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_WHEEL_CCW_2: {
		type: 'orbit', color: 'purple',
		count: 16, angularVel: -(Math.PI * 0.14), radialVel: 64,
		startAngle: Math.PI, delay: 0.8, cooldown: 1.8,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_ORB_RINGS_PURPLE: {
		type: 'circle', bullet: 'orb', color: 'purple',
		count: 8, speed: 40, startAngle: 0, rotStep: Math.PI / 2,
		cooldown: 1.2, delay: 0.8, maxShots: 10, ringAngleStep: Math.PI / 8,
		difficulties: [Difficulty.HARD, Difficulty.LUNATIC]
	} as PatternConfig,

	RUMIA_SHADOW_AIMED: {
		type: 'aimed', bullet: 'shadow',
		speed: 40, delay: 1.5, cooldown: 3.0, maxShots: 3,
	} as PatternConfig,

	// Rumia spellcard 2
	RUMIA_BURST_SHADOW_1: {
		type: 'circle', bullet: 'burstshadow',
		count: 5, speed: 4, initSpeed: 40, accelTime: 3.0, startAngle: 0, rotStep: Math.PI / 8,
		delay: 0.1, cooldown: 4.2,
		morphDelay: 3.0,
		morphDeactivate: true,
		morphConfig: {
			type: 'circle',
			bullet: 'rice',
			color: 'purple',
			count: 18,
			speed: 40,
		},
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	RUMIA_BURST_SHADOW_2: {
		type: 'circle', bullet: 'burstshadow',
		count: 5, speed: 4, initSpeed: 90, accelTime: 3.0, startAngle: Math.PI / 8, rotStep: Math.PI / 4,
		delay: 0.1, cooldown: 4.2,
		morphDelay: 3.0,
		morphDeactivate: true,
		morphConfig: {
			type: 'circle',
			bullet: 'rice',
			color: 'purple',
			count: 18,
			speed: 35,
		},
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	RUMIA_BURST_SHADOW_3: {
		type: 'circle', bullet: 'burstshadow',
		count: 5, speed: 4, initSpeed: 40, accelTime: 3.0, startAngle: 0, rotStep: Math.PI / 8,
		delay: 0.1, cooldown: 4.2,
		morphDelay: 3.0,
		morphDeactivate: true,
		morphConfig: {
			type: 'circle',
			bullet: 'rice',
			color: 'purple',
			count: 22,
			speed: 35,
		},
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	RUMIA_BURST_SHADOW_4: {
		type: 'circle', bullet: 'burstshadow',
		count: 5, speed: 4, initSpeed: 90, accelTime: 3.0, startAngle: Math.PI / 8, rotStep: Math.PI / 4,
		delay: 0.1, cooldown: 4.2,
		morphDelay: 3.0,
		morphDeactivate: true,
		morphConfig: {
			type: 'circle',
			bullet: 'rice',
			color: 'purple',
			count: 22,
			speed: 35,
		},
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	RUMIA_BURST_SHADOW_5: {
		type: 'circle', bullet: 'burstshadow',
		count: 6, speed: 4, initSpeed: 40, accelTime: 3.0, startAngle: 0, rotStep: Math.PI / 8,
		delay: 0.1, cooldown: 4.2,
		morphDelay: 3.0,
		morphDeactivate: true,
		morphConfig: {
			type: 'circle',
			bullet: 'rice',
			color: 'purple',
			count: 24,
			speed: 35,
		},
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	RUMIA_BURST_SHADOW_6: {
		type: 'circle', bullet: 'burstshadow',
		count: 6, speed: 4, initSpeed: 90, accelTime: 3.0, startAngle: Math.PI / 8, rotStep: Math.PI / 4,
		delay: 0.1, cooldown: 4.2,
		morphDelay: 3.0,
		morphDeactivate: true,
		morphConfig: {
			type: 'circle',
			bullet: 'rice',
			color: 'purple',
			count: 24,
			speed: 35,
		},
		difficulties: [Difficulty.HARD]
	} as PatternConfig,



	// STAGE 2 PATTERNS

	S2_FAIRY_AIMED_CYAN_NORMAL: {
		type: 'spread', bullet: 'arrowhead', color: 'cyan',
		count: 2, spread: 0.25, speed: 90, delay: 1, cooldown: 1.0, maxShots: 1,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	S2_FAIRY_AIMED_CYAN_HARD: {
		type: 'spread', bullet: 'arrowhead', color: 'cyan',
		count: 3, spread: 0.45, speed: 100, delay: 1, cooldown: 1.0, maxShots: 1,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S2_FAIRY_AIMED_CYAN_LUNA: {
		type: 'spread', bullet: 'arrowhead', color: 'cyan',
		count: 3, spread: 0.4, speed: 110, delay: 1.0, cooldown: 1.0, maxShots: 1,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S2_BLUESPIRIT_ORB_CIRCLE_EASY: {
		type: 'circle', bullet: 'orb', color: 'blue',
		count: 8, speed: 80, delay: 2, cooldown: 0.2, maxShots: 2,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	S2_BLUESPIRIT_ORB_CIRCLE_NORMAL: {
		type: 'circle', bullet: 'orb', color: 'blue',
		count: 10, speed: 80, delay: 2, cooldown: 0.2, maxShots: 4,
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	S2_BLUESPIRIT_VOLLEY_CIRCLE_HARD: {
		type: 'volley-circle', bullet: 'orb', color: 'blue',
		count: 10, streams: 6, speed: 70, deltaSpeed: 15,
		delay: 2, cooldown: 3.5, maxShots: 1,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S2_BLUESPIRIT_VOLLEY_CIRCLE_LUNA: {
		type: 'volley-circle', bullet: 'orb', color: 'blue',
		count: 12, streams: 6, speed: 70, deltaSpeed: 15,
		delay: 2, cooldown: 3.0, maxShots: 1,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S2_SPINNING_JELLY_CIRCLE_E: {
		type: 'circle', bullet: 'jellybean', color: 'blue',
		count: 12, speed: 80, delay: 1.1, maxShots: 1,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	S2_SPINNING_JELLY_CIRCLE_NH: {
		type: 'circle', bullet: 'jellybean', color: 'blue',
		count: 22, speed: 80, delay: 1.1, maxShots: 1,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD]
	} as PatternConfig,

	S2_SPINNING_JELLY_CIRCLE_L: {
		type: 'circle', bullet: 'jellybean', color: 'blue',
		count: 28, speed: 80, delay: 1.1, maxShots: 1,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S2_SSPINNING_JELLY_CIRCLE_E: {
		type: 'circle', bullet: 'jellybean', color: 'cyan',
		count: 12, speed: 80, delay: 1.1, maxShots: 1,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	S2_SSPINNING_JELLY_CIRCLE_NH: {
		type: 'circle', bullet: 'jellybean', color: 'cyan',
		count: 22, speed: 80, delay: 1.1, maxShots: 1,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD]
	} as PatternConfig,

	S2_SSPINNING_JELLY_CIRCLE_L: {
		type: 'circle', bullet: 'jellybean', color: 'cyan',
		count: 28, speed: 80, delay: 1.1, maxShots: 1,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S2_SPINNING_SPREAD: {
		type: 'spread', color: 'blue', speed: 100, delay: 1.0, maxShots: 1,
		count: 2, spread: 0.12,
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	S2_SSPINNING_SPREAD: {
		type: 'spread', color: 'cyan', speed: 100, delay: 1.0, maxShots: 1,
		count: 2, spread: 0.12,
		difficulties: [Difficulty.NORMAL]
	} as PatternConfig,

	S2_SPINNING_VOLLEY_1: {
		type: 'volley-spread', color: 'cyan', speed: 100, deltaSpeed: 10, delay: 1.0, maxShots: 1,
		count: 2, streams: 5, spread: 0.12,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S2_SPINNING_VOLLEY_2: {
		type: 'volley-spread', color: 'cyan', speed: 120, deltaSpeed: 10, delay: 1.0, maxShots: 1,
		count: 4, streams: 5, spread: 0.3,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S2_SSPINNING_VOLLEY_1: {
		type: 'volley-spread', color: 'blue', speed: 100, deltaSpeed: 10, delay: 1.0, maxShots: 1,
		count: 2, streams: 5, spread: 0.12,
		difficulties: [Difficulty.HARD]
	} as PatternConfig,

	S2_SSPINNING_VOLLEY_2: {
		type: 'volley-spread', color: 'blue', speed: 120, deltaSpeed: 10, delay: 1.0, maxShots: 1,
		count: 4, streams: 5, spread: 0.3,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S2_GRAVITY_E: {
		type: 'gravity', color: 'cyan', speed: 30, spread: Math.PI,
		count: 2, gravity: 90, delay: 1.0, cooldown: 1.5, maxShots: 1,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	S2_GRAVITY_NH: {
		type: 'gravity', color: 'cyan', speed: 30, spread: Math.PI,
		count: 2, gravity: 90, delay: 1.0, cooldown: 2.0, maxshots: 2,
		difficulties: [Difficulty.EASY, Difficulty.NORMAL]
	} as PatternConfig,

	S2_GRAVITY_L: {
		type: 'gravity', color: 'cyan', speed: 30, spread: Math.PI,
		count: 3, gravity: 90, delay: 1.0, cooldown: 2.0, maxShots: 3,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,

	S2_SGRAVITY_E: {
		type: 'gravity', color: 'blue', speed: 30, spread: Math.PI,
		count: 2, gravity: 110, delay: 0.5, cooldown: 1.5, maxShots: 2,
		difficulties: [Difficulty.EASY]
	} as PatternConfig,

	S2_SGRAVITY_NH: {
		type: 'gravity', color: 'blue', speed: 30, spread: Math.PI,
		count: 2, gravity: 110, delay: 0.5, cooldown: 1.5, maxshots: 3,
		difficulties: [Difficulty.NORMAL, Difficulty.HARD]
	} as PatternConfig,

	S2_SGRAVITY_L: {
		type: 'gravity', color: 'blue', speed: 30, spread: Math.PI,
		count: 3, gravity: 110, delay: 0.5, cooldown: 1.5, maxShots: 4,
		difficulties: [Difficulty.LUNATIC]
	} as PatternConfig,
};
