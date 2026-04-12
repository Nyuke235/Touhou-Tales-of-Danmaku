import { IProjectile } from '../../entities/Projectile';
import { BallBullet } from '../../entities/projectiles/BallBullet';
import { ArrowheadBullet } from '../../entities/projectiles/ArrowheadBullet';
import { AccelBullet } from '../../entities/projectiles/AccelBullet';
import { OrbBullet } from '../../entities/projectiles/OrbBullet';
import { RiceBullet } from '../../entities/projectiles/RiceBullet';
import { ShadowBullet } from '../../entities/projectiles/ShadowBullet';
import { OrbitingBullet } from '../../entities/projectiles/OrbitingBullet';
import { BurstShadowBullet } from '../../entities/projectiles/BurstShadowBullet';
import { StarBullet } from '../../entities/projectiles/StarBullet';
import { HelixBallBullet } from '../../entities/projectiles/HelixBallBullet';
import { BulletColor } from '../../entities/projectiles/BulletSprites';
import { Difficulty } from '../GameState';

export type BulletType =
	| 'ball'
	| 'arrowhead'
	| 'orb'
	| 'rice'
	| 'shadow'
	| 'burstshadow'
	| 'star'
	| 'helixball';

export interface PatternConfig {
	type:
		| 'circle'
		| 'aimed'
		| 'spread'
		| 'stream'
		| 'accel'
		| 'helix'
		| 'rose'
		| 'fixed'
		| 'orbit'
		| 'volley'
		| 'volley-spread'
		| 'volley-circle';
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
	sweepAngle?: number;
	startAngle?: number;

	// ------------  CIRCLE - ROTATING RINGS ------------
	// startAngle = base rotation of the ring
	// rotStep    = additional rotation applied per successive shot
	rotStep?: number;

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

	// Optional difficulty filter. If omitted, the pattern fires on all difficulties.
	// If specified, the pattern only fires when the current difficulty is in the list.
	difficulties?: Difficulty[];
}

export class PatternEngine {
	private timer: number = 0;
	private difficulty: Difficulty;
	private shotCount: number = 0;
	private initialized: boolean = false;

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
		out: IProjectile[]
	): void {
		if (pattern.difficulties && !pattern.difficulties.includes(this.difficulty))
			return;

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
		out: IProjectile[],
		count: number,
		baseAngle: number,
		ex: number,
		ey: number,
		speed: number,
		bullet: BulletType,
		color: BulletColor
	): void {
		for (let i = 0; i < count; i++) {
			const angle = baseAngle + (i / count) * Math.PI * 2;
			out.push(
				this.spawn(
					bullet,
					ex,
					ey,
					Math.cos(angle) * speed,
					Math.sin(angle) * speed,
					color
				)
			);
		}
	}

	private spawn(
		bullet: BulletType,
		x: number,
		y: number,
		vx: number,
		vy: number,
		color: BulletColor
	): IProjectile {
		if (bullet === 'arrowhead') return new ArrowheadBullet(x, y, vx, vy, color);
		if (bullet === 'orb') return new OrbBullet(x, y, vx, vy, color);
		if (bullet === 'rice') return new RiceBullet(x, y, vx, vy, color);
		if (bullet === 'shadow') return new ShadowBullet(x, y, vx, vy);
		if (bullet === 'burstshadow') return new BurstShadowBullet(x, y, vx, vy);
		if (bullet === 'star') return new StarBullet(x, y, vx, vy);
		if (bullet === 'helixball') return new HelixBallBullet(x, y, vx, vy, color);
		return new BallBullet(x, y, vx, vy, color);
	}

	private fire(
		pattern: PatternConfig,
		ex: number,
		ey: number,
		px: number,
		py: number,
		out: IProjectile[],
		shotCount: number
	): void {
		const speed = pattern.speed ?? 80;
		const color = pattern.color ?? 'blue';
		const bullet = pattern.bullet ?? 'ball';

		switch (pattern.type) {
			case 'circle': {
				const count = Math.max(1, pattern.count ?? 8);
				const baseAngle =
					(pattern.startAngle ?? 0) + shotCount * (pattern.rotStep ?? 0);
				this.spawnRing(out, count, baseAngle, ex, ey, speed, bullet, color);
				break;
			}

			case 'aimed': {
				const angle = Math.atan2(py - ey, px - ex);
				out.push(
					this.spawn(
						bullet,
						ex,
						ey,
						Math.cos(angle) * speed,
						Math.sin(angle) * speed,
						color
					)
				);
				break;
			}

			case 'spread': {
				const count = Math.max(1, pattern.count ?? 3);
				const spread = pattern.spread ?? 0.3;
				const base = Math.atan2(py - ey, px - ex);
				for (let i = 0; i < count; i++) {
					const angle = base - spread / 2 + (spread / (count - 1 || 1)) * i;
					out.push(
						this.spawn(
							bullet,
							ex,
							ey,
							Math.cos(angle) * speed,
							Math.sin(angle) * speed,
							color
						)
					);
				}
				break;
			}

			case 'stream': {
				const streams = Math.max(1, pattern.streams ?? 2);
				const base = Math.atan2(py - ey, px - ex);
				const gap = 0.25;
				for (let i = 0; i < streams; i++) {
					const angle = base - (gap * (streams - 1)) / 2 + gap * i;
					out.push(
						this.spawn(
							bullet,
							ex,
							ey,
							Math.cos(angle) * speed,
							Math.sin(angle) * speed,
							color
						)
					);
				}
				break;
			}

			case 'accel': {
				const angle = Math.atan2(py - ey, px - ex);
				out.push(new AccelBullet(ex, ey, angle, speed, color as BulletColor));
				break;
			}

			case 'helix': {
				const arms = Math.max(1, pattern.count ?? 2);
				const totalShots = Math.max(1, pattern.maxShots ?? 1);
				const step = (pattern.sweepAngle ?? Math.PI * 2) / totalShots;
				const baseAngle = (pattern.startAngle ?? 0) + shotCount * step;
				this.spawnRing(out, arms, baseAngle, ex, ey, speed, bullet, color);
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
					out.push(
						new OrbitingBullet(ex, ey, angle, angularVel, radialVel, orbitColor)
					);
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
					out.push(
						this.spawn(
							bullet,
							ex,
							ey,
							Math.cos(angle) * speed,
							Math.sin(angle) * speed,
							color
						)
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
							out.push(
								this.spawn(
									bullet,
									ex,
									ey,
									Math.cos(angle) * speed,
									Math.sin(angle) * speed,
									color
								)
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
				const cosA = Math.cos(angle);
				const sinA = Math.sin(angle);
				for (let i = 0; i < count; i++) {
					const s = speed + i * deltaSpeed;
					out.push(this.spawn(bullet, ex, ey, cosA * s, sinA * s, color));
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
					const cosA = Math.cos(angle);
					const sinA = Math.sin(angle);
					for (let i = 0; i < depth; i++) {
						const s = speed + i * deltaSpeed;
						out.push(this.spawn(bullet, ex, ey, cosA * s, sinA * s, color));
					}
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
					const cosA = Math.cos(angle);
					const sinA = Math.sin(angle);
					for (let i = 0; i < depth; i++) {
						const s = speed + i * deltaSpeed;
						out.push(this.spawn(bullet, ex, ey, cosA * s, sinA * s, color));
					}
				}
				break;
			}
		}
	}
}
