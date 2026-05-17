import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { PatternConfig } from '../../patterns/PatternEngine';
import { Patterns } from '../../patterns/PatternLibrary';
import { ItemType } from '../Item';
import { ENEMY_MOVEMENT } from '../../game/Constants';
import { type IBullet } from '../Bullet';

export type SpiritVariant = 'normal' | 'red' | 'blue' | 'purple';
export type SpiritPath = 'passing-left' | 'passing-right' | 'descend';

const PURPLE_PHASE_DURATION = 1.5;

type Phase = 'entering' | 'waiting' | 'leaving';

const STOP_X: { 'passing-left': number; 'passing-right': number } = {
	'passing-left': 166,
	'passing-right': 90,
};
const STOP_Y_DESCEND = 120;
const WAIT_DURATION = 2.5;

interface SpiritConfig {
	sprite: string;
	hp: number;
	defaultPattern: PatternConfig;
	drops: { type: ItemType; count: number }[];
}

const VARIANTS: {
	normal: SpiritConfig;
	red: SpiritConfig;
	blue: SpiritConfig;
	purple: SpiritConfig;
} = {
	normal: {
		sprite: 'assets/sprites/entities/enemies/spirits/spirit_spritesheet.png',
		hp: 15,
		defaultPattern: Patterns.S1_SPIRIT_CIRCLE_NORMAL,
		drops: [
			{ type: 'power', count: 2 },
			{ type: 'point', count: 3 },
		],
	},
	red: {
		sprite: 'assets/sprites/entities/enemies/spirits/redspirit_spritesheet.png',
		hp: 30,
		defaultPattern: Patterns.S1_CIRCLE_BALL_RED_1,
		drops: [
			{ type: 'power', count: 3 },
			{ type: 'point', count: 3 },
			{ type: 'bomb', count: 1 },
		],
	},
	blue: {
		sprite:
			'assets/sprites/entities/enemies/spirits/bluespirit_spritesheet.png',
		hp: 22,
		defaultPattern: Patterns.S2_FAIRY_AIMED_CYAN_NORMAL,
		drops: [
			{ type: 'power', count: 2 },
			{ type: 'bigpoint', count: 1 },
			{ type: 'point', count: 4 },
		],
	},
	purple: {
		sprite:
			'assets/sprites/entities/enemies/spirits/purplespirit_spritesheet.png',
		hp: 40,
		defaultPattern: Patterns.S1_SPIRIT_CIRCLE_NORMAL,
		drops: [
			{ type: 'power', count: 3 },
			{ type: 'point', count: 4 },
		],
	},
};

export class Spirit extends Enemy {
	private path: SpiritPath;
	private timer: number = 0;
	private readonly speed: number = ENEMY_MOVEMENT.SPIRIT_SPEED;
	private phase: Phase = 'entering';
	private waitTimer: number = 0;
	private leavingSpeed: number = 0;
	private variant: SpiritVariant;
	private purpleInvincible: boolean = true;
	private purplePhaseTimer: number = 0;

	constructor(
		x: number,
		y: number,
		variant: SpiritVariant,
		path: SpiritPath,
		patterns?: PatternConfig[]
	) {
		const config = VARIANTS[variant];

		const sheet = new Spritesheet({
			src: config.sprite,
			frameX: 32,
			frameY: 32,
			frameCount: 7,
			frameSpeed: 0.12,
			looping: true,
		});

		const explSheet = createExplosionSheet();

		super(x, y, 32, 32, config.hp, sheet, explSheet);
		this.scoreValue = 5000;
		this.path = path;
		this.variant = variant;

		this.setPatterns(patterns ?? [config.defaultPattern]);
		this.drops = config.drops;
	}

	override update(
		dt: number,
		px: number,
		py: number,
		enemyBullets: IBullet[]
	): void {
		if (this.variant === 'purple' && !this.isDying()) {
			this.purplePhaseTimer += dt;
			if (this.purplePhaseTimer >= PURPLE_PHASE_DURATION) {
				this.purplePhaseTimer -= PURPLE_PHASE_DURATION;
				this.purpleInvincible = !this.purpleInvincible;
			}
		}
		super.update(dt, px, py, enemyBullets);
	}

	override checkCollisions(playerBullets: IBullet[]): {
		hits: number;
		killed: boolean;
		damage: number;
	} {
		if (this.variant === 'purple' && this.purpleInvincible) {
			return { hits: 0, killed: false, damage: 0 };
		}
		return super.checkCollisions(playerBullets);
	}

	override render(ctx: CanvasRenderingContext2D): void {
		if (this.variant === 'purple' && this.purpleInvincible && !this.isDying()) {
			ctx.save();
			ctx.globalAlpha = 0.5;
			super.render(ctx);
			ctx.restore();
		} else {
			super.render(ctx);
		}
	}

	updateMovement(dt: number): void {
		this.timer += dt;

		if (this.path === 'descend') {
			switch (this.phase) {
				case 'entering': {
					const dist = STOP_Y_DESCEND - this.y;
					const currentSpeed = Math.min(this.speed, dist * 3);
					this.y += currentSpeed * dt;
					this.x +=
						Math.sin(this.timer * ENEMY_MOVEMENT.SINE_SPEED) *
						ENEMY_MOVEMENT.SPIRIT_SINE_AMPLITUDE *
						dt;
					if (dist < 1) {
						this.y = STOP_Y_DESCEND;
						this.phase = 'waiting';
					}
					break;
				}
				case 'waiting': {
					this.waitTimer += dt;
					if (this.waitTimer >= WAIT_DURATION) this.phase = 'leaving';
					break;
				}
				case 'leaving': {
					this.leavingSpeed = Math.min(
						this.speed,
						this.leavingSpeed + this.speed * 3 * dt
					);
					this.y += this.leavingSpeed * dt;
					this.x +=
						Math.sin(this.timer * ENEMY_MOVEMENT.SINE_SPEED) *
						ENEMY_MOVEMENT.SPIRIT_SINE_AMPLITUDE *
						dt;
					break;
				}
			}
			return;
		}

		const targetX = STOP_X[this.path];
		const dir = this.path === 'passing-left' ? 1 : -1;

		switch (this.phase) {
			case 'entering': {
				const dist = Math.abs(targetX - this.x);
				const currentSpeed = Math.min(this.speed, dist * 3);
				this.x += dir * currentSpeed * dt;
				this.y +=
					Math.sin(this.timer * ENEMY_MOVEMENT.SINE_SPEED) *
					ENEMY_MOVEMENT.SPIRIT_SINE_AMPLITUDE *
					dt;
				if (dist < 1) {
					this.x = targetX;
					this.phase = 'waiting';
				}
				break;
			}
			case 'waiting': {
				this.waitTimer += dt;
				if (this.waitTimer >= WAIT_DURATION) this.phase = 'leaving';
				break;
			}
			case 'leaving': {
				this.leavingSpeed = Math.min(
					this.speed,
					this.leavingSpeed + this.speed * 3 * dt
				);
				this.x += dir * this.leavingSpeed * dt;
				this.y +=
					Math.sin(this.timer * ENEMY_MOVEMENT.SINE_SPEED) *
					ENEMY_MOVEMENT.SPIRIT_SINE_AMPLITUDE *
					dt;
				break;
			}
		}
	}
}
