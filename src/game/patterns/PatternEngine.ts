import { IBullet, BaseBullet } from '../../entities/Bullet';
import { BallBullet } from '../../entities/bullets/BallBullet';
import { ArrowheadBullet } from '../../entities/bullets/ArrowheadBullet';
import { OrbBullet } from '../../entities/bullets/OrbBullet';
import { RiceBullet } from '../../entities/bullets/RiceBullet';
import { ShadowBullet } from '../../entities/bullets/ShadowBullet';
import { OrbitingBullet } from '../../entities/bullets/OrbitingBullet';
import { BurstShadowBullet } from '../../entities/bullets/BurstShadowBullet';
import { StarBullet } from '../../entities/bullets/StarBullet';
import { JellybeanBullet } from '../../entities/bullets/JellybeanBullet';
import { GravityBullet } from '../../entities/bullets/GravityBullet';
import { SunflowerBullet } from '../../entities/bullets/SunflowerBullet';
import { BouncingSunflowerBullet } from '../../entities/bullets/BouncingSunflowerBullet';
import { LaserTrailBullet } from '../../entities/bullets/LaserTrailBullet';
import { IceCubeBullet } from '../../entities/bullets/IceCubeBullet';
import { BouncingIceCubeBullet } from '../../entities/bullets/BouncingIceCubeBullet';
import { GiantSnowflakeBullet } from '../../entities/bullets/GiantSnowflakeBullet';
import { CircleLaserBullet } from '../../entities/bullets/CircleLaserBullet';
import { BulletColor } from '../../entities/bullets/BulletSprites';
import { Difficulty } from '../GameState';

export type BulletType =
	| 'ball'
	| 'arrowhead'
	| 'orb'
	| 'rice'
	| 'shadow'
	| 'burstshadow'
	| 'star'
	| 'jellybean'
	| 'lasertrail'
	| 'sunflower'
	| 'sunflower_bounce'
	| 'icecube'
	| 'icecube_bounce'
	| 'giantsnowflake';

export interface PatternConfig {
	type:
		| 'circle'
		| 'aimed'
		| 'spread'
		| 'stream'
		| 'helix'
		| 'rose'
		| 'fixed'
		| 'orbit'
		| 'volley'
		| 'volley-spread'
		| 'volley-circle'
		| 'gravity'
		| 'laser-circle';
	bullet?: BulletType;
	color?: BulletColor;
	count?: number;
	speed?: number;

	// aimed / spread
	spread?: number;

	// stream
	streams?: number;

	// timing
	delay?: number;
	cooldown?: number;
	maxShots?: number;

	// ------------ HELIX - MUTLI ARM SPIRAL ------------
	// count      = number of arms
	// sweepAngle = total arc swept across all shots
	// startAngle = initial angle of arm 0
	// angleStep  = rotation per shot (overrides sweepAngle / maxShots).
	//              Usable when maxShots is omitted (infinite loop) to keep
	//              the spiral rotating at a fixed rate per shot.
	sweepAngle?: number;
	startAngle?: number;
	angleStep?: number;

	// ------------  CIRCLE - ROTATING RINGS ------------
	// startAngle    = base rotation of the ring
	// rotStep       = additional rotation applied per successive shot
	// ringAngleStep = angle added to the base angle for each successive shot,
	//                 independently of rotStep. Need a value that is NOT a
	//                 multiple of (2π / count) to ensure rings don't overlap.
	// speedVariance = half-range of random speed variation per bullet (uniform distribution)
	rotStep?: number;
	ringAngleStep?: number;
	speedVariance?: number;

	// ------------ ROSE ------------
	// roseN        = number of arms
	// count        = bullets per arm per shot
	// rotStep      = global rotation added each shot
	// oscAmplitude = half-arc of sinusoidal swing
	// oscFreq      = oscillation frequency
	roseN?: number;
	oscAmplitude?: number;
	oscFreq?: number;

	// ------------ ORBIT - BULLETS ROTATING AROUND SPAWN POINT WHILE DRIFTING OUTWARD ------------
	// angularVel = rotation speed in rad/s (positive = clockwise in canvas)
	// radialVel  = outward drift speed in px/s
	angularVel?: number;
	radialVel?: number;

	// ------------ VOLLEY ------------
	// count      = number of bullets in the volley
	// speed      = speed of the slowest (first) bullet
	// deltaSpeed = speed increment per bullet
	//
	// ------------ VOLLEY-SPREAD / VOLLEY-CIRCLE ------------
	// count      = number of lines (directions)
	// streams    = bullets per line (volley depth)
	// speed      = speed of the slowest bullet per line
	// deltaSpeed = speed increment per bullet within each line
	deltaSpeed?: number;

	// ------------ SPEED TRANSITION (accel / decel) ------------
	// initSpeed = starting speed at spawn (< speed : accelerates, > speed : decelerates)
	// accelTime = seconds to linearly interpolate from initSpeed to speed
	initSpeed?: number;
	accelTime?: number;

	// ------------ MORPH ------------
	// morphDelay      = seconds before the bullet transforms
	// morphConfig     = what to spawn at morph time (non-aimed types only)
	// morphDeactivate = whether the parent bullet disappears after morphing (default true)
	morphDelay?: number;
	morphConfig?: MorphConfig;
	morphDeactivate?: boolean;

	// ------------ GRAVITY ------------
	// count   = number of bullets per shot
	// speed   = initial launch speed
	// spread  = angular spread around straight-up
	// gravity = downward acceleration in px/s² (default 150)
	gravity?: number;

	// ------------ LASER-CIRCLE ------------
	// count          = number of laser directions distributed evenly
	// startAngle     = base rotation of the ring
	// rotStep        = additional rotation applied per successive shot
	// warnDuration   = duration of the thin warning laser in seconds (default 1.5)
	// activeDuration = duration of the active laser in seconds (default 0.5)
	// maxFireDelay   = max random stagger before a laser starts its warning phase (default 0.4)
	warnDuration?: number;
	activeDuration?: number;
	maxFireDelay?: number;

	// Optional difficulty filter. If omitted, the pattern fires on all difficulties.
	// If specified, the pattern only fires when the current difficulty is in the list.
	difficulties?: Difficulty[];
}

export interface MorphConfig {
	type: 'circle' | 'fixed' | 'helix' | 'aimed';
	bullet?: BulletType;
	color?: BulletColor;
	count?: number;
	speed?: number;
	startAngle?: number;
	spread?: number;
	// helix only
	shots?: number;
	interval?: number;
	sweepAngle?: number;
	// aimed only
	initSpeed?: number;
	accelTime?: number;
}

export class PatternEngine {
	private timer: number = 0;
	private difficulty: Difficulty;
	private shotCount: number = 0;
	private initialized: boolean = false;
	private lastPx: number = 0;
	private lastPy: number = 0;

	constructor(difficulty: Difficulty) {
		this.difficulty = difficulty;
	}

	isDone(pattern: PatternConfig): boolean {
		if (pattern.difficulties && !pattern.difficulties.includes(this.difficulty))
			return true;
		return pattern.maxShots !== undefined && this.shotCount >= pattern.maxShots;
	}

	update(
		dt: number,
		pattern: PatternConfig,
		ex: number,
		ey: number,
		px: number,
		py: number,
		out: IBullet[]
	): void {
		if (pattern.difficulties && !pattern.difficulties.includes(this.difficulty))
			return;

		this.lastPx = px;
		this.lastPy = py;
		this.timer += dt;

		const cooldown = pattern.cooldown ?? 1.0;

		if (!this.initialized) {
			this.timer = cooldown - (pattern.delay ?? 0);
			this.initialized = true;
		}

		if (this.timer < cooldown) return;
		if (pattern.maxShots !== undefined && this.shotCount >= pattern.maxShots)
			return;

		this.timer = 0;
		this.fire(pattern, ex, ey, px, py, out, this.shotCount);
		this.shotCount++;
	}

	reset(): void {
		this.timer = 0;
		this.shotCount = 0;
		this.initialized = false;
	}

	private spawnRing(
		pattern: PatternConfig,
		out: IBullet[],
		count: number,
		baseAngle: number,
		ex: number,
		ey: number,
		speed: number,
		bullet: BulletType,
		color: BulletColor
	): void {
		const variance = pattern.speedVariance ?? 0;
		for (let i = 0; i < count; i++) {
			const angle = baseAngle + (i / count) * Math.PI * 2;
			const bulletSpeed = speed + (Math.random() * 2 - 1) * variance;
			this.spawnWithAccel(
				pattern,
				bullet,
				ex,
				ey,
				angle,
				bulletSpeed,
				color,
				out
			);
		}
	}

	private static readonly bulletFactory: Partial<
		Record<
			BulletType,
			(
				x: number,
				y: number,
				vx: number,
				vy: number,
				color: BulletColor
			) => BaseBullet
		>
	> = {
		arrowhead: (x, y, vx, vy, color) =>
			new ArrowheadBullet(x, y, vx, vy, color),
		orb: (x, y, vx, vy, color) => new OrbBullet(x, y, vx, vy, color),
		rice: (x, y, vx, vy, color) => new RiceBullet(x, y, vx, vy, color),
		shadow: (x, y, vx, vy) => new ShadowBullet(x, y, vx, vy),
		burstshadow: (x, y, vx, vy) => new BurstShadowBullet(x, y, vx, vy),
		star: (x, y, vx, vy) => new StarBullet(x, y, vx, vy),
		jellybean: (x, y, vx, vy, color) =>
			new JellybeanBullet(x, y, vx, vy, color),
		sunflower: (x, y, vx, vy) => new SunflowerBullet(x, y, vx, vy),
		sunflower_bounce: (x, y, vx, vy) =>
			new BouncingSunflowerBullet(x, y, vx, vy),
		icecube: (x, y, vx, vy) => new IceCubeBullet(x, y, vx, vy),
		icecube_bounce: (x, y, vx, vy) => new BouncingIceCubeBullet(x, y, vx, vy),
		giantsnowflake: (x, y, vx, vy) => new GiantSnowflakeBullet(x, y, vx, vy),
	};

	private spawn(
		bullet: BulletType,
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor
	): BaseBullet {
		const factory = PatternEngine.bulletFactory[bullet];
		return factory
			? factory(x, y, vx, vy, color)
			: new BallBullet(x, y, vx, vy, color);
	}

	private spawnWithAccel(
		pattern: PatternConfig,
		bullet: BulletType,
		x: number,
		y: number,
		angle: number,
		speed: number,
		color: BulletColor,
		out: IBullet[]
	): void {
		const b = this.spawn(
			bullet,
			x,
			y,
			Math.cos(angle) * speed,
			Math.sin(angle) * speed,
			color
		);
		if (pattern.initSpeed !== undefined && pattern.accelTime !== undefined) {
			b.setupAccel(angle, pattern.initSpeed, speed, pattern.accelTime);
		}
		if (pattern.morphDelay !== undefined && pattern.morphConfig !== undefined) {
			const mc = pattern.morphConfig;
			const isHelix = mc.type === 'helix';
			b.setupMorph(
				pattern.morphDelay,
				this.buildMorphFn(mc),
				pattern.morphDeactivate ?? true,
				isHelix ? (mc.interval ?? 0.07) : undefined,
				isHelix ? (mc.shots ?? 12) : undefined
			);
		}
		out.push(b);
	}

	private buildMorphFn(
		mc: MorphConfig
	): (x: number, y: number, shotIndex: number) => IBullet[] {
		return (x, y, shotIndex) => {
			const out: IBullet[] = [];
			const bullet = mc.bullet ?? 'ball';
			const color = mc.color ?? 'blue';
			const speed = mc.speed ?? 80;
			const count = Math.max(1, mc.count ?? 8);

			const spawnB = (angle: number) => {
				const b = this.spawn(
					bullet,
					x,
					y,
					Math.cos(angle) * speed,
					Math.sin(angle) * speed,
					color
				);
				if (mc.initSpeed !== undefined && mc.accelTime !== undefined) {
					b.setupAccel(angle, mc.initSpeed, speed, mc.accelTime);
				}
				return b;
			};

			if (mc.type === 'circle') {
				const baseAngle = mc.startAngle ?? 0;
				for (let i = 0; i < count; i++) {
					out.push(spawnB(baseAngle + (i / count) * Math.PI * 2));
				}
			} else if (mc.type === 'fixed') {
				const baseAngle = mc.startAngle ?? 0;
				const spread = mc.spread ?? 0;
				for (let i = 0; i < count; i++) {
					const angle =
						count > 1
							? baseAngle - spread / 2 + (spread / (count - 1)) * i
							: baseAngle;
					out.push(spawnB(angle));
				}
			} else if (mc.type === 'helix') {
				const shots = mc.shots ?? 12;
				const step = (mc.sweepAngle ?? Math.PI * 2) / shots;
				const baseAngle = (mc.startAngle ?? 0) + shotIndex * step;
				for (let i = 0; i < count; i++) {
					out.push(spawnB(baseAngle + (i / count) * Math.PI * 2));
				}
			} else if (mc.type === 'aimed') {
				const angle = Math.atan2(this.lastPy - y, this.lastPx - x);
				out.push(spawnB(angle));
			}
			return out;
		};
	}

	private fire(
		pattern: PatternConfig,
		ex: number,
		ey: number,
		px: number,
		py: number,
		out: IBullet[],
		shotCount: number
	): void {
		const speed = pattern.speed ?? 80;
		const color = pattern.color ?? 'blue';
		const bullet = pattern.bullet ?? 'ball';

		switch (pattern.type) {
			case 'circle': {
				const count = Math.max(1, pattern.count ?? 8);
				const baseAngle =
					(pattern.startAngle ?? 0) +
					shotCount * (pattern.rotStep ?? 0) +
					shotCount * (pattern.ringAngleStep ?? 0);
				this.spawnRing(
					pattern,
					out,
					count,
					baseAngle,
					ex,
					ey,
					speed,
					bullet,
					color
				);
				break;
			}

			case 'aimed': {
				const angle = Math.atan2(py - ey, px - ex);
				this.spawnWithAccel(pattern, bullet, ex, ey, angle, speed, color, out);
				break;
			}

			case 'spread': {
				const count = Math.max(1, pattern.count ?? 3);
				const spread = pattern.spread ?? 0.3;
				const base = Math.atan2(py - ey, px - ex);
				for (let i = 0; i < count; i++) {
					const angle = base - spread / 2 + (spread / (count - 1 || 1)) * i;
					if (bullet === 'lasertrail') {
						out.push(
							new LaserTrailBullet(
								ex,
								ey,
								angle,
								pattern.angularVel ?? 0,
								pattern.radialVel ?? speed,
								color
							)
						);
					} else {
						this.spawnWithAccel(
							pattern,
							bullet,
							ex,
							ey,
							angle,
							speed,
							color,
							out
						);
					}
				}
				break;
			}

			case 'stream': {
				const streams = Math.max(1, pattern.streams ?? 2);
				const base = Math.atan2(py - ey, px - ex);
				const gap = 0.25;
				for (let i = 0; i < streams; i++) {
					const angle = base - (gap * (streams - 1)) / 2 + gap * i;
					this.spawnWithAccel(
						pattern,
						bullet,
						ex,
						ey,
						angle,
						speed,
						color,
						out
					);
				}
				break;
			}

			case 'helix': {
				const arms = Math.max(1, pattern.count ?? 2);
				const totalShots = Math.max(1, pattern.maxShots ?? 1);
				const step =
					pattern.angleStep ?? (pattern.sweepAngle ?? Math.PI * 2) / totalShots;
				const baseAngle = (pattern.startAngle ?? 0) + shotCount * step;
				this.spawnRing(
					pattern,
					out,
					arms,
					baseAngle,
					ex,
					ey,
					speed,
					bullet,
					color
				);
				break;
			}

			case 'orbit': {
				const count = Math.max(1, pattern.count ?? 8);
				const angularVel = pattern.angularVel ?? Math.PI;
				const radialVel = pattern.radialVel ?? 40;
				const baseAngle =
					(pattern.startAngle ?? 0) + shotCount * (pattern.rotStep ?? 0);
				const orbitColor = pattern.color ?? 'purple';
				for (let i = 0; i < count; i++) {
					const angle = baseAngle + (i / count) * Math.PI * 2;
					if (bullet === 'lasertrail') {
						out.push(
							new LaserTrailBullet(
								ex,
								ey,
								angle,
								angularVel,
								radialVel,
								orbitColor
							)
						);
					} else {
						out.push(
							new OrbitingBullet(
								ex,
								ey,
								angle,
								angularVel,
								radialVel,
								orbitColor
							)
						);
					}
				}
				break;
			}

			case 'fixed': {
				const count = Math.max(1, pattern.count ?? 1);
				const baseAngle = pattern.startAngle ?? 0;
				const spread = pattern.spread ?? 0;
				for (let i = 0; i < count; i++) {
					const angle =
						count > 1
							? baseAngle - spread / 2 + (spread / (count - 1)) * i
							: baseAngle;
					this.spawnWithAccel(
						pattern,
						bullet,
						ex,
						ey,
						angle,
						speed,
						color,
						out
					);
				}
				break;
			}

			case 'rose': {
				const n = Math.max(1, pattern.roseN ?? 4);
				const perArm = Math.max(1, pattern.count ?? 1);
				const spread = pattern.spread ?? 0.1;
				const rotStep = pattern.rotStep ?? 0.05;
				const startAngle = pattern.startAngle ?? 0;
				for (const sign of [1, -1]) {
					const rotation = startAngle + sign * shotCount * rotStep;
					for (let p = 0; p < n; p++) {
						const armCenter = (p / n) * Math.PI * 2 + rotation;
						for (let b = 0; b < perArm; b++) {
							const offset = perArm > 1 ? (b / (perArm - 1) - 0.5) * spread : 0;
							const angle = armCenter + offset;
							this.spawnWithAccel(
								pattern,
								bullet,
								ex,
								ey,
								angle,
								speed,
								color,
								out
							);
						}
					}
				}
				break;
			}

			case 'volley': {
				const count = Math.max(1, pattern.count ?? 5);
				const deltaSpeed = pattern.deltaSpeed ?? 20;
				const angle = Math.atan2(py - ey, px - ex);
				for (let i = 0; i < count; i++) {
					const s = speed + i * deltaSpeed;
					this.spawnWithAccel(pattern, bullet, ex, ey, angle, s, color, out);
				}
				break;
			}

			case 'volley-spread': {
				const lines = Math.max(1, pattern.count ?? 3);
				const depth = Math.max(1, pattern.streams ?? 5);
				const deltaSpeed = pattern.deltaSpeed ?? 20;
				const spreadArc = pattern.spread ?? 0.3;
				const base = Math.atan2(py - ey, px - ex);
				for (let l = 0; l < lines; l++) {
					const angle =
						lines > 1
							? base - spreadArc / 2 + (spreadArc / (lines - 1)) * l
							: base;
					for (let i = 0; i < depth; i++) {
						const s = speed + i * deltaSpeed;
						this.spawnWithAccel(pattern, bullet, ex, ey, angle, s, color, out);
					}
				}
				break;
			}

			case 'gravity': {
				const count = Math.max(1, pattern.count ?? 5);
				const spread = pattern.spread ?? Math.PI;
				const gravity = pattern.gravity ?? 150;
				const orbitColor = pattern.color ?? 'blue';
				for (let i = 0; i < count; i++) {
					const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
					const b = new GravityBullet(
						ex,
						ey,
						Math.cos(angle) * speed,
						Math.sin(angle) * speed,
						gravity,
						orbitColor
					);
					out.push(b);
				}
				break;
			}

			case 'volley-circle': {
				const lines = Math.max(1, pattern.count ?? 8);
				const depth = Math.max(1, pattern.streams ?? 5);
				const deltaSpeed = pattern.deltaSpeed ?? 20;
				const baseAngle =
					(pattern.startAngle ?? 0) + shotCount * (pattern.rotStep ?? 0);
				for (let l = 0; l < lines; l++) {
					const angle = baseAngle + (l / lines) * Math.PI * 2;
					for (let i = 0; i < depth; i++) {
						const s = speed + i * deltaSpeed;
						this.spawnWithAccel(pattern, bullet, ex, ey, angle, s, color, out);
					}
				}
				break;
			}

			case 'laser-circle': {
				const count = Math.max(1, pattern.count ?? 8);
				const toPlayer = Math.atan2(py - ey, px - ex);
				const arcOffset =
					(pattern.startAngle ?? 0) + shotCount * (pattern.rotStep ?? 0);
				const warnDuration = pattern.warnDuration ?? 1.5;
				const activeDuration = pattern.activeDuration ?? 0.5;
				const maxFireDelay = pattern.maxFireDelay ?? 0.4;
				for (let i = 0; i < count; i++) {
					const t = count > 1 ? i / (count - 1) : 0.5;
					const arcPos =
						(((t * Math.PI + arcOffset) % Math.PI) + Math.PI) % Math.PI;
					const angle = toPlayer - Math.PI / 2 + arcPos;
					const fireDelay = Math.random() * maxFireDelay;
					out.push(
						new CircleLaserBullet(
							ex,
							ey,
							angle,
							fireDelay,
							warnDuration,
							activeDuration,
							color
						)
					);
				}
				break;
			}
		}
	}
}
