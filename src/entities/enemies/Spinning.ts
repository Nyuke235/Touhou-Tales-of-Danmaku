import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { PatternConfig } from '../../patterns/PatternEngine';
import { Patterns } from '../../patterns/PatternLibrary';
import { ItemType } from '../Item';
import { FIELD } from '../../game/Constants';

export type SpinningColor = 'blue' | 'red';
export type SpinningPath =
	| 'left-to-right'
	| 'right-to-left'
	| 'left-quarter'
	| 'right-quarter';

type Phase = 'entering' | 'waiting' | 'leaving';

const STOP_CENTER = FIELD.WIDTH / 2;
const STOP_QUARTER_LEFT = FIELD.WIDTH / 4;
const STOP_QUARTER_RIGHT = (FIELD.WIDTH * 3) / 4;
const WAIT_DURATION = 1.5;
const ENTER_SPEED = 300;
const LEAVE_SPEED = 300;
const CURVE_SPEED = 25;

function resolveStop(path: SpinningPath): number {
	if (path === 'left-quarter') return STOP_QUARTER_LEFT;
	if (path === 'right-quarter') return STOP_QUARTER_RIGHT;
	return STOP_CENTER;
}

interface SpinningConfig {
	sprite: string;
	hp: number;
	drops: { type: ItemType; count: number }[];
}

const VARIANTS: Record<SpinningColor, SpinningConfig> = {
	blue: {
		sprite:
			'assets/sprites/entities/enemies/spinning/spinningblue_spritesheet.png',
		hp: 13,
		drops: [
			{ type: 'power', count: 2 },
			{ type: 'point', count: 3 },
		],
	},
	red: {
		sprite:
			'assets/sprites/entities/enemies/spinning/spinningred_spritesheet.png',
		hp: 13,
		drops: [
			{ type: 'power', count: 3 },
			{ type: 'point', count: 2 },
		],
	},
};

export class Spinning extends Enemy {
	private phase: Phase = 'entering';
	private waitTimer: number = 0;
	private leavingSpeed: number = 0;
	private readonly enterDir: number;
	private readonly leaveDir: number;
	private readonly stopX: number;

	constructor(
		x: number,
		y: number,
		color: SpinningColor,
		path: SpinningPath,
		patterns?: PatternConfig[]
	) {
		const config = VARIANTS[color];

		const sheet = new Spritesheet({
			src: config.sprite,
			frameX: 24,
			frameY: 24,
			frameCount: 4,
			frameSpeed: 0.1,
			looping: true,
		});

		const explSheet = createExplosionSheet();

		super(x, y, 24, 24, config.hp, sheet, explSheet);
		this.scoreValue = 6000;
		this.stopX = resolveStop(path);

		if (path === 'left-quarter') {
			this.enterDir = 1;
			this.leaveDir = -1;
		} else if (path === 'right-quarter') {
			this.enterDir = -1;
			this.leaveDir = 1;
		} else {
			this.enterDir = path === 'left-to-right' ? 1 : -1;
			this.leaveDir = this.enterDir;
		}

		this.setPatterns(patterns ?? [Patterns.S1_FAIRY_NORMAL]);
		this.drops = config.drops;
	}

	updateMovement(dt: number): void {
		switch (this.phase) {
			case 'entering': {
				const dist = Math.abs(this.stopX - this.x);
				const currentSpeed = Math.min(ENTER_SPEED, dist * 12);
				this.x += this.enterDir * currentSpeed * dt;
				this.y -= CURVE_SPEED * dt;
				if (dist < 1) {
					this.x = this.stopX;
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
					LEAVE_SPEED,
					this.leavingSpeed + LEAVE_SPEED * 8 * dt
				);
				this.x += this.leaveDir * this.leavingSpeed * dt;
				this.y += CURVE_SPEED * dt;
				break;
			}
		}
	}
}
