import { IBullet, BaseBullet } from '../entities/Bullet';
import { BallBullet } from '../entities/bullets/BallBullet';
import { ArrowheadBullet } from '../entities/bullets/ArrowheadBullet';
import { OrbBullet } from '../entities/bullets/OrbBullet';
import { RiceBullet } from '../entities/bullets/RiceBullet';
import { ShadowBullet } from '../entities/bullets/ShadowBullet';
import { OrbitingBullet } from '../entities/bullets/OrbitingBullet';
import { BurstShadowBullet } from '../entities/bullets/BurstShadowBullet';
import { StarBullet } from '../entities/bullets/StarBullet';
import { JellybeanBullet } from '../entities/bullets/JellybeanBullet';
import { GravityBullet } from '../entities/bullets/GravityBullet';
import { SunflowerBullet } from '../entities/bullets/SunflowerBullet';
import { BouncingSunflowerBullet } from '../entities/bullets/BouncingSunflowerBullet';
import { LaserTrailBullet } from '../entities/bullets/LaserTrailBullet';
import { IceCubeBullet } from '../entities/bullets/IceCubeBullet';
import { BouncingIceCubeBullet } from '../entities/bullets/BouncingIceCubeBullet';
import { GiantSnowflakeBullet } from '../entities/bullets/GiantSnowflakeBullet';
import { CircleLaserBullet } from '../entities/bullets/CircleLaserBullet';
import {
	SheddingOrbBullet,
	SweepSheddingOrbBullet,
} from '../entities/bullets/SheddingOrbBullet';
import { CannonballBullet } from '../entities/bullets/CannonballBullet';
import { FeatherBullet } from '../entities/bullets/FeatherBullet';
import { ChiBullet, CHI_VARIANT_COUNT } from '../entities/bullets/ChiBullet';
import { FountainRiceBullet } from '../entities/bullets/FountainRiceBullet';
import { SoundManager, SFX } from '../systems/SoundManager';
import { SpiralArrowheadBullet } from '../entities/bullets/SpiralArrowheadBullet';
import { MusicNoteBullet } from '../entities/bullets/MusicNoteBullet';
import { LullabyLaserBullet } from '../entities/bullets/LullabyLaserBullet';
import { PurpleFlowerBullet } from '../entities/bullets/PurpleFlowerBullet';
import {
	BubbleBigBullet,
	BubbleMediumBullet,
	BubbleSmallBullet,
} from '../entities/bullets/BubbleBullet';
import { RockBullet } from '../entities/bullets/RockBullet';
import { InvisibleBullet } from '../entities/bullets/InvisibleBullet';
import {
	BulletColor,
	BALL_SPRITES,
	ORB_SPRITES,
	STAR_SPRITES,
} from '../entities/bullets/BulletSprites';
import { Difficulty } from '../game/GameState';
import { FIELD } from '../game/Constants';

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
	| 'giantsnowflake'
	| 'bubble-big'
	| 'bubble-medium'
	| 'bubble-small'
	| 'feather'
	| 'musicnote'
	| 'purpleflower'
	| 'rock'
	| 'invisible';

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
		| 'circle-fan'
		| 'gravity'
		| 'laser-circle'
		| 'star-shed-orbit'
		| 'sweep-shed-orbit'
		| 'cannonball'
		| 'rain'
		| 'orbiting-spiral'
		| 'lullaby-laser'
		| 'qi-wall'
		| 'rice-thread-spray'
		| 'edge-swarm'
		| 'burst';
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

	// ------------ ORBIT ------------
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

	// ------------ SPEED TRANSITION ------------
	// initSpeed = starting speed at spawn (< speed : accelerates, > speed : decelerates)
	// accelTime = seconds to linearly interpolate from initSpeed to speed
	initSpeed?: number;
	accelTime?: number;

	// ------------ SPEED PROFILE (multi-segment) ------------
	// Overrides initSpeed/accelTime if set. Each segment linearly interpolates from
	// the previous segment's target (or pattern.speed for the first segment) to its
	// own target over its duration. After all segments, velocity stays at the last
	// target.
	speedProfile?: { speed: number; duration: number }[];

	// ------------ NO-BOUNDS GRACE ------------
	// Seconds after spawn during which the bullet ignores screen bounds (it
	// stays alive even when off-screen). Useful for patterns where bullets fly
	// out then return (e.g. velocity reversal via speedProfile).
	noBoundsTime?: number;

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

	// ------------ STAR-SHED-ORBIT ------------
	// angularVel        = orbit angular velocity (rad/s)
	// radialVel         = orbit outward speed (px/s)
	// startAngle        = orbit starting angle for shot 0
	// rotStep           = angle offset added per successive shot (per orb)
	// shedInterval      = seconds between star drops
	// shedCount         = number of stars dropped per orb (despawns after)
	// starActivationDelay = seconds a dropped star stays immobile before accelerating
	// starSpeed         = final radial speed of stars after activation
	// starAccelDuration = seconds to lerp from 0 to starSpeed (smooth acceleration)
	// starBaseAngle     = (sweep variant) absolute direction of the first shed star (rad)
	// starAngleStep     = (sweep variant) angle increment between successive shed stars (rad)
	shedInterval?: number;
	shedCount?: number;
	starActivationDelay?: number;
	starSpeed?: number;
	starAccelDuration?: number;
	starBaseAngle?: number;
	starAngleStep?: number;

	// ------------ CANNONBALL ------------
	// lifetime             = seconds before the cannonball explodes
	// speed                = velocity of the cannonball (aimed at player) (px/s)
	// helixInterval        = seconds between each helix rice shot fired while traveling
	// helixCount           = orange rice bullets per helix shot
	// helixBaseAngle       = starting angle of the helix (rad)
	// helixAngleStep       = angle increment per successive helix shot (rad)
	// helixInitSpeed       = very slow initial speed of helix rice
	// helixTargetSpeed     = speed after acceleration
	// helixAccelDelay      = seconds the rice stays at initSpeed before accelerating
	// helixAccelDuration   = seconds to lerp to targetSpeed
	// laserCount           = number of orange oval lasers fired in a circle on explosion
	// laserSpeed           = radial speed of each explosion laser
	// laserAngleOffset     = starting angle offset for the laser circle (rad)
	lifetime?: number;
	helixInterval?: number;
	helixCount?: number;
	helixBaseAngle?: number;
	helixAngleStep?: number;
	helixInitSpeed?: number;
	helixTargetSpeed?: number;
	helixAccelDelay?: number;
	helixAccelDuration?: number;
	laserCount?: number;
	laserSpeed?: number;
	laserAngleOffset?: number;

	// ------------ ORBITING-SPIRAL ------------
	// Multi-arm spiral firing SpiralArrowheadBullet (purple arrowheads).
	// Each shot fires `count` bullets at the current spiral angle. After firing,
	// each bullet decelerates from `speed` to 0 over `decelDuration`, holds still
	// for `holdDuration`, then orbits around (boss + orbitBiasX, boss + orbitBiasY)
	// at `orbitAngularVel` rad/s for `orbitDuration` seconds before vanishing.
	// On orbit start the sprite color flips from `color` to `finalColor`.
	// count       = number of arms in the spiral
	// maxShots    = shots per arm
	// startAngle  = starting angle of arm 0 (rad)
	// angleStep   = angle increment per shot (signed: positive=CW, negative=CCW)
	// decelDuration, holdDuration, orbitDuration: bullet lifecycle (seconds)
	// orbitBiasX, orbitBiasY: orbit center offset from boss position
	// orbitAngularVel (via angularVel field): rad/s (signed)
	// orbitRadialVel: outward radial speed in px/s; bullets spiral outward
	// orbitGravityDecayTau: time constant for centripetal gravity decay (seconds).
	//   The bullet's velocity is blended toward the ideal orbital velocity with
	//   weight g(t) = exp(-t / tau). Smaller tau = faster release (slingshot).
	// finalColor: bullet color when orbit starts
	decelDuration?: number;
	holdDuration?: number;
	orbitDuration?: number;
	orbitBiasX?: number;
	orbitBiasY?: number;
	orbitRadialVel?: number;
	orbitGravityDecayTau?: number;
	finalColor?: BulletColor;

	// ------------ RAIN ------------
	// Bullets spawn at random x within [rainXMin, rainXMax] at y = rainYSpawn.
	// If rainAngle is set, velocity = (cos(angle), sin(angle)) * speed (allows
	// diagonal rain). Otherwise vy = speed (down), vx = random ±rainDriftMax.
	// Ignores enemy position.
	// count    = bullets spawned per tick
	// cooldown = seconds between ticks
	rainXMin?: number;
	rainXMax?: number;
	rainYSpawn?: number;
	rainDriftMax?: number;
	rainAngle?: number;
	// If true, bullets are evenly spaced across [rainXMin, rainXMax] instead of
	// random x. Each bullet at ((i + 0.5) / count) of the range.
	rainEven?: boolean;

	// ------------ LULLABY-LASER ------------
	// Spawns a LullabyLaserBullet at boss position. Lifecycle:
	//   aimDuration: thin laser tracks player
	//   lockDuration: laser locks at last aim, blinks
	//   fireDuration: laser disappears, fires feathers in locked direction at
	//                 featherRate per second, with random ±featherSpread/2 spread,
	//                 at featherSpeed px/s
	aimDuration?: number;
	lockDuration?: number;
	fireDuration?: number;
	featherRate?: number;
	featherSpeed?: number;
	featherSpread?: number;

	// ------------ BURST ------------
	// count         = bullets per burst
	// burstInterval = seconds between each bullet within the burst
	// cooldown      = seconds between bursts
	// spread        = random angular spread around player aim (radians)
	burstInterval?: number;

	// ------------ RICE-THREAD-SPRAY ------------
	// Each shot spawns one fountain rice. Shots interleave across threads so all
	// threads grow in parallel: shot N -> thread (N % threadCount), rice position
	// floor(N / threadCount) in that thread. The rice color cycles every
	// ricePerColor consecutive rice in a thread, walking through threadColors.
	// To complete the pattern: set maxShots = threadCount * ricePerColor * threadColors.length.
	// startAngle    = first thread direction (rad). Default -PI (left).
	// spreadAngle   = total fan width (rad). Default PI (upper hemisphere).
	// threadCount   = number of threads radiating in the fan
	// ricePerColor  = rice per color band within a thread
	// threadColors  = ordered colors used along a thread (red→purple→blue→...)
	// decelTime     = seconds before gravity takes over (linear decay to 0)
	// gravity       = downward acceleration after decel (px/s^2)
	// vyMax         = terminal fall speed cap (px/s)
	threadCount?: number;
	ricePerColor?: number;
	threadColors?: BulletColor[];
	spreadAngle?: number;
	decelTime?: number;
	decelFloor?: number;
	vyMax?: number;

	// ------------ EDGE-SWARM ------------
	// count         = balls per wave; they tile the rotStep interval uniformly
	// speed         = uniform speed for every ball (capped at 80)
	// startAngle    = base angle of the first wave's first ball
	// rotStep       = angular step per wave. Successive waves keep tiling forward.
	// cooldown      = seconds between waves
	// threadColors  = colors cycled across balls (index = shot*count + ball)
	// spawnMargin   = extra distance (px) beyond the canvas diagonal for spawn ring
	spawnMargin?: number;

	// ------------ QI-WALL ------------
	// One fire() spawns a single wall: a perpendicular line of bullets that crosses
	// the field along a random angle. Walls have a few gaps so the player can slip
	// through. Speed varies per wall. The chi sprite cycles per bullet so adjacent
	// bullets show different symbols.
	// speed         = base wall travel speed
	// speedVariance = half-range of per-wall speed variation
	// wallSpacing   = distance (px) between bullet centers along the wall
	// wallGapCount  = number of gaps per wall
	// wallGapSize   = width (px) of each gap
	// noBoundsTime  = seconds a wall bullet ignores screen bounds (must cover crossing)
	wallSpacing?: number;
	wallGapCount?: number;
	wallGapSize?: number;

	// Optional difficulty filter. If omitted, the pattern fires on all difficulties.
	// If specified, the pattern only fires when the current difficulty is in the list.
	difficulties?: Difficulty[];

	// Optional per-difficulty override of count.
	countByDifficulty?: Partial<Record<Difficulty, number>>;
}

export interface MorphConfig {
	type: 'circle' | 'fixed' | 'helix' | 'aimed' | 'random' | 'volley-circle';
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
	// volley-circle only
	streams?: number;
	deltaSpeed?: number;
	// circle / volley-circle: rotates baseAngle by rotStep for each successive
	// parent shot (useful when the carrier is a helix so consecutive morphs are
	// slightly rotated relative to each other).
	rotStep?: number;
}

export class PatternEngine {
	private timer: number = 0;
	private difficulty: Difficulty;
	private shotCount: number = 0;
	private initialized: boolean = false;
	private lastPx: number = 0;
	private lastPy: number = 0;
	private inBurst: boolean = false;
	private burstCount: number = 0;
	private burstTimer: number = 0;
	private currentFireShot: number = 0;

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

		if (pattern.type === 'burst') {
			this.updateBurst(dt, pattern, ex, ey, px, py, out);
			return;
		}

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
		this.inBurst = false;
		this.burstCount = 0;
		this.burstTimer = 0;
	}

	private updateBurst(
		dt: number,
		pattern: PatternConfig,
		ex: number,
		ey: number,
		px: number,
		py: number,
		out: IBullet[]
	): void {
		const cooldown = pattern.cooldown ?? 2.0;
		const interval = pattern.burstInterval ?? 0.1;
		const burstSize = Math.max(1, pattern.count ?? 4);

		if (!this.initialized) {
			this.timer = cooldown - (pattern.delay ?? 0);
			this.initialized = true;
		}

		if (this.inBurst) {
			this.burstTimer += dt;
			while (this.burstTimer >= interval && this.burstCount < burstSize) {
				this.burstTimer -= interval;
				this.fire(pattern, ex, ey, px, py, out, this.shotCount++);
				this.burstCount++;
			}
			if (this.burstCount >= burstSize) {
				this.inBurst = false;
				this.timer = 0;
			}
		} else {
			this.timer += dt;
			if (this.timer >= cooldown) {
				this.inBurst = true;
				this.burstCount = 0;
				this.burstTimer = interval;
			}
		}
	}

	private resolveCount(pattern: PatternConfig): number | undefined {
		const override = pattern.countByDifficulty?.[this.difficulty];
		return override ?? pattern.count;
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
		'bubble-big': (x, y, vx, vy) => new BubbleBigBullet(x, y, vx, vy),
		'bubble-medium': (x, y, vx, vy) => new BubbleMediumBullet(x, y, vx, vy),
		'bubble-small': (x, y, vx, vy) => new BubbleSmallBullet(x, y, vx, vy),
		feather: (x, y, vx, vy) => new FeatherBullet(x, y, vx, vy),
		musicnote: (x, y, vx, vy) => new MusicNoteBullet(x, y, vx, vy),
		purpleflower: () => new PurpleFlowerBullet(),
		rock: (x, y, vx, vy) => new RockBullet(x, y, vx, vy),
		invisible: (x, y, vx, vy) => new InvisibleBullet(x, y, vx, vy),
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
		if (pattern.speedProfile !== undefined && pattern.speedProfile.length > 0) {
			b.setupSpeedProfile(
				angle,
				speed,
				pattern.speedProfile.map(s => ({
					targetSpeed: s.speed,
					duration: s.duration,
				}))
			);
		} else if (
			pattern.initSpeed !== undefined &&
			pattern.accelTime !== undefined
		) {
			b.setupAccel(angle, pattern.initSpeed, speed, pattern.accelTime);
		}
		if (pattern.noBoundsTime !== undefined && pattern.noBoundsTime > 0) {
			b.setupNoBounds(pattern.noBoundsTime);
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
		const parentShotIndex = this.currentFireShot;
		return (x, y, shotIndex) => {
			const out: IBullet[] = [];
			const bullet = mc.bullet ?? 'ball';
			const color = mc.color ?? 'blue';
			const speed = mc.speed ?? 80;
			const count = Math.max(1, mc.count ?? 8);

			const spawnB = (angle: number, useSpeed: number = speed) => {
				const b = this.spawn(
					bullet,
					x,
					y,
					Math.cos(angle) * useSpeed,
					Math.sin(angle) * useSpeed,
					color
				);
				if (mc.initSpeed !== undefined && mc.accelTime !== undefined) {
					b.setupAccel(angle, mc.initSpeed, useSpeed, mc.accelTime);
				}
				return b;
			};

			const rotOffset = (mc.rotStep ?? 0) * parentShotIndex;
			if (mc.type === 'volley-circle') {
				const streams = Math.max(1, mc.streams ?? 3);
				const deltaSpeed = mc.deltaSpeed ?? 20;
				const baseAngle = (mc.startAngle ?? 0) + rotOffset;
				for (let l = 0; l < count; l++) {
					const angle = baseAngle + (l / count) * Math.PI * 2;
					for (let i = 0; i < streams; i++) {
						out.push(spawnB(angle, speed + i * deltaSpeed));
					}
				}
			} else if (mc.type === 'circle') {
				const baseAngle = (mc.startAngle ?? 0) + rotOffset;
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
			} else if (mc.type === 'random') {
				for (let i = 0; i < count; i++) {
					out.push(spawnB(Math.random() * Math.PI * 2));
				}
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
		this.currentFireShot = shotCount;
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

				let spriteSrc: string;
				let spriteSize = 12;
				let spinSpeed = 0;
				if (bullet === 'star') {
					spriteSrc = STAR_SPRITES.yellow!;
					spriteSize = 16;
					spinSpeed = 3.0;
				} else if (bullet === 'orb') {
					spriteSrc = ORB_SPRITES[orbitColor] ?? ORB_SPRITES.purple!;
				} else {
					spriteSrc = BALL_SPRITES[orbitColor] ?? BALL_SPRITES.yellow!;
				}

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
								spriteSrc,
								spriteSize,
								spinSpeed
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

			case 'orbiting-spiral': {
				const arms = Math.max(1, pattern.count ?? 4);
				const totalShots = Math.max(1, pattern.maxShots ?? 12);
				const step = pattern.angleStep ?? Math.PI / 2 / totalShots;
				const baseAngle = (pattern.startAngle ?? 0) + shotCount * step;
				const decelDuration = pattern.decelDuration ?? 0.6;
				const holdDuration = pattern.holdDuration ?? 1.0;
				const orbitDuration = pattern.orbitDuration ?? 8.0;
				const orbitAngularVel = pattern.angularVel ?? 1.0;
				const orbitRadialVel = pattern.orbitRadialVel ?? 0;
				const gravityDecayTau = pattern.orbitGravityDecayTau ?? 3.0;
				const orbitCenterX = ex + (pattern.orbitBiasX ?? 0);
				const orbitCenterY = ey + (pattern.orbitBiasY ?? 0);
				const finalColor = pattern.finalColor ?? 'blue';
				for (let i = 0; i < arms; i++) {
					const angle = baseAngle + (i / arms) * Math.PI * 2;
					out.push(
						new SpiralArrowheadBullet(
							ex,
							ey,
							angle,
							speed,
							decelDuration,
							holdDuration,
							orbitCenterX,
							orbitCenterY,
							orbitAngularVel,
							orbitRadialVel,
							orbitDuration,
							gravityDecayTau,
							color,
							finalColor
						)
					);
				}
				break;
			}

			case 'lullaby-laser': {
				out.push(
					new LullabyLaserBullet(ex, ey, {
						aimDuration: pattern.aimDuration ?? 2.0,
						lockDuration: pattern.lockDuration ?? 0.5,
						fireDuration: pattern.fireDuration ?? 1.0,
						featherRate: pattern.featherRate ?? 18,
						featherSpeed: pattern.featherSpeed ?? 130,
						featherSpread: pattern.featherSpread ?? 0.35,
					}) as IBullet
				);
				break;
			}

			case 'rain': {
				const count = Math.max(1, pattern.count ?? 1);
				const xMin = pattern.rainXMin ?? 0;
				const xMax = pattern.rainXMax ?? FIELD.WIDTH;
				const ySpawn = pattern.rainYSpawn ?? -10;
				const driftMax = pattern.rainDriftMax ?? 0;
				const hasAngle = pattern.rainAngle !== undefined;
				const even = pattern.rainEven ?? false;
				for (let i = 0; i < count; i++) {
					const x = even
						? xMin + ((i + 0.5) / count) * (xMax - xMin)
						: xMin + Math.random() * (xMax - xMin);
					let vx: number;
					let vy: number;
					if (hasAngle) {
						vx = Math.cos(pattern.rainAngle!) * speed;
						vy = Math.sin(pattern.rainAngle!) * speed;
					} else {
						vx = (Math.random() * 2 - 1) * driftMax;
						vy = speed;
					}
					out.push(this.spawn(bullet, x, ySpawn, vx, vy, color));
				}
				break;
			}

			case 'cannonball': {
				const angle = Math.atan2(py - ey, px - ex);
				out.push(
					new CannonballBullet(ex, ey, {
						angle,
						lifetime: pattern.lifetime ?? 2.0,
						speed: speed,
						helixInterval: pattern.helixInterval ?? 0.15,
						helixBaseAngle: pattern.helixBaseAngle ?? 0,
						helixAngleStep: pattern.helixAngleStep ?? Math.PI / 12,
						helixCount: Math.max(1, pattern.helixCount ?? 6),
						helixInitSpeed: pattern.helixInitSpeed ?? 8,
						helixTargetSpeed: pattern.helixTargetSpeed ?? 40,
						helixAccelDelay: pattern.helixAccelDelay ?? 1.5,
						helixAccelDuration: pattern.helixAccelDuration ?? 0.5,
						laserCount: pattern.laserCount ?? 8,
						laserSpeed: pattern.laserSpeed ?? 80,
						laserAngleOffset: pattern.laserAngleOffset ?? 0,
					})
				);
				break;
			}

			case 'circle-fan': {
				const lines = Math.max(1, this.resolveCount(pattern) ?? 8);
				const fan = Math.max(1, pattern.streams ?? 3);
				const spreadArc = pattern.spread ?? 0.2;
				const baseAngle =
					(pattern.startAngle ?? 0) + shotCount * (pattern.rotStep ?? 0);
				for (let l = 0; l < lines; l++) {
					const center = baseAngle + (l / lines) * Math.PI * 2;
					for (let i = 0; i < fan; i++) {
						const angle =
							fan > 1
								? center - spreadArc / 2 + (spreadArc / (fan - 1)) * i
								: center;
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

			case 'sweep-shed-orbit': {
				const angularVel = pattern.angularVel ?? Math.PI;
				const radialVel = pattern.radialVel ?? 40;
				const angle =
					(pattern.startAngle ?? 0) + shotCount * (pattern.rotStep ?? 0);
				const shedInterval = pattern.shedInterval ?? 0.25;
				const shedCount = Math.max(1, pattern.shedCount ?? 8);
				const starActivationDelay = pattern.starActivationDelay ?? 2.5;
				const starSpeed = pattern.starSpeed ?? 120;
				const starAccelDuration = pattern.starAccelDuration ?? 0.7;
				const starBaseAngle = pattern.starBaseAngle ?? 0;
				const starAngleStep = pattern.starAngleStep ?? Math.PI / 36;
				out.push(
					new SweepSheddingOrbBullet(
						ex,
						ey,
						angle,
						angularVel,
						radialVel,
						shedInterval,
						shedCount,
						starActivationDelay,
						starSpeed,
						starAccelDuration,
						starBaseAngle,
						starAngleStep
					)
				);
				break;
			}

			case 'star-shed-orbit': {
				const angularVel = pattern.angularVel ?? Math.PI;
				const radialVel = pattern.radialVel ?? 40;
				const angle =
					(pattern.startAngle ?? 0) + shotCount * (pattern.rotStep ?? 0);
				const shedInterval = pattern.shedInterval ?? 0.25;
				const shedCount = Math.max(1, pattern.shedCount ?? 8);
				const starActivationDelay = pattern.starActivationDelay ?? 2.5;
				const starSpeed = pattern.starSpeed ?? 120;
				const starAccelDuration = pattern.starAccelDuration ?? 0.7;
				out.push(
					new SheddingOrbBullet(
						ex,
						ey,
						angle,
						angularVel,
						radialVel,
						shedInterval,
						shedCount,
						starActivationDelay,
						starSpeed,
						starAccelDuration
					)
				);
				break;
			}

			case 'rice-thread-spray': {
				const threadCount = Math.max(1, pattern.threadCount ?? 10);
				const ricePerColor = Math.max(1, pattern.ricePerColor ?? 3);
				const colorList: BulletColor[] = pattern.threadColors ?? [
					'red',
					'purple',
					'blue',
					'cyan',
					'green',
					'yellow',
					'orange',
				];
				const ricePerThread = ricePerColor * colorList.length;
				const totalShots = threadCount * ricePerThread;
				if (shotCount >= totalShots) break;

				const indexInThread = Math.floor(shotCount / threadCount);
				const threadIndex = shotCount % threadCount;
				const colorIndex = Math.floor(indexInThread / ricePerColor);
				const riceColor = colorList[colorIndex];

				const baseAngle = pattern.startAngle ?? -Math.PI;
				const spread = pattern.spreadAngle ?? Math.PI;
				const angleStep = threadCount > 1 ? spread / (threadCount - 1) : 0;
				const angle = baseAngle + threadIndex * angleStep;

				const vx = Math.cos(angle) * speed;
				const vy = Math.sin(angle) * speed;
				const decelTime = pattern.decelTime ?? 1.0;
				const decelFloor = pattern.decelFloor ?? 0;
				const gravityAccel = pattern.gravity ?? 400;
				const vyMax = pattern.vyMax ?? 120;

				const fb = new FountainRiceBullet(
					ex,
					ey,
					vx,
					vy,
					riceColor,
					decelTime,
					decelFloor,
					gravityAccel,
					vyMax
				);
				if (pattern.noBoundsTime !== undefined && pattern.noBoundsTime > 0) {
					fb.setupNoBounds(pattern.noBoundsTime);
				}
				out.push(fb);
				break;
			}

			case 'qi-wall': {
				const angle = Math.random() * Math.PI * 2;
				const variance = pattern.speedVariance ?? 0;
				const wallSpeed = speed + (Math.random() * 2 - 1) * variance;
				const spacing = pattern.wallSpacing ?? 18;
				const gapCount = Math.max(0, pattern.wallGapCount ?? 2);
				const gapSize = pattern.wallGapSize ?? 70;

				const dx = Math.cos(angle);
				const dy = Math.sin(angle);
				const perpX = -dy;
				const perpY = dx;

				const cx = FIELD.WIDTH / 2;
				const cy = FIELD.HEIGHT / 2;
				const fieldRadius = Math.sqrt(cx * cx + cy * cy);
				const margin = 24;

				const entryX = cx - dx * (fieldRadius + margin);
				const entryY = cy - dy * (fieldRadius + margin);

				const halfLen = fieldRadius + margin;
				const numBullets = Math.max(2, Math.floor((halfLen * 2) / spacing));
				const gapHalf = Math.max(1, Math.ceil(gapSize / spacing / 2));
				const gapCenters: number[] = [];
				const usable = numBullets - 2 * gapHalf;
				const segLen = usable / Math.max(1, gapCount);
				for (let g = 0; g < gapCount; g++) {
					const segStart = gapHalf + g * segLen;
					const segEnd = gapHalf + (g + 1) * segLen;
					const innerStart = segStart + gapHalf;
					const innerEnd = segEnd - gapHalf;
					const center =
						innerEnd > innerStart
							? innerStart + Math.random() * (innerEnd - innerStart)
							: (segStart + segEnd) / 2;
					gapCenters.push(Math.floor(center));
				}
				const inGap = (i: number) =>
					gapCenters.some(c => Math.abs(i - c) <= gapHalf);

				const vx = dx * wallSpeed;
				const vy = dy * wallSpeed;
				const variant = Math.floor(Math.random() * CHI_VARIANT_COUNT);
				SoundManager.play(SFX.QI_WALL);
				for (let i = 0; i < numBullets; i++) {
					if (inGap(i)) continue;
					const offset = (i - (numBullets - 1) / 2) * spacing;
					const bx = entryX + perpX * offset;
					const by = entryY + perpY * offset;
					const b = new ChiBullet(bx, by, vx, vy, variant);
					if (pattern.noBoundsTime !== undefined && pattern.noBoundsTime > 0) {
						b.setupNoBounds(pattern.noBoundsTime);
					}
					out.push(b);
				}
				break;
			}

			case 'burst': {
				const spread = pattern.spread ?? 0;
				const angle =
					Math.atan2(py - ey, px - ex) + (Math.random() - 0.5) * spread;
				this.spawnWithAccel(pattern, bullet, ex, ey, angle, speed, color, out);
				break;
			}

			case 'edge-swarm': {
				const count = Math.max(1, this.resolveCount(pattern) ?? 1);
				const colors = pattern.threadColors ?? [
					'red',
					'purple',
					'blue',
					'cyan',
					'green',
					'yellow',
					'orange',
				];
				const ballSpeed = Math.min(80, pattern.speed ?? 60);
				const margin = pattern.spawnMargin ?? 12;
				const rotStep = pattern.rotStep ?? Math.PI / 2;
				const startAngle = pattern.startAngle ?? 0;
				const cx = FIELD.WIDTH / 2;
				const cy = FIELD.HEIGHT / 2;
				const radius = Math.hypot(FIELD.WIDTH / 2, FIELD.HEIGHT / 2) + margin;
				const nb = pattern.noBoundsTime ?? 2.5;
				const baseAngle = startAngle + shotCount * rotStep;
				for (let i = 0; i < count; i++) {
					const colorIdx = (shotCount * count + i) % colors.length;
					const ballColor = colors[colorIdx]!;
					const theta = baseAngle + (i / count) * rotStep;
					const sx = cx + radius * Math.cos(theta);
					const sy = cy + radius * Math.sin(theta);
					const aim = Math.atan2(cy - sy, cx - sx);
					const vx = Math.cos(aim) * ballSpeed;
					const vy = Math.sin(aim) * ballSpeed;
					const b = this.spawn(bullet, sx, sy, vx, vy, ballColor);
					if (nb > 0) b.setupNoBounds(nb);
					out.push(b);
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
