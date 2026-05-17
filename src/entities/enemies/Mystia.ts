import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { PatternConfig } from '../../patterns/PatternEngine';

export type MystiaPath = 'passing-left' | 'passing-right';

const HORIZONTAL_SPEED = 72;
const RISE_SPEED = 4;
const INVINCIBLE_HP = 999_999;

export class Mystia extends Enemy {
	private path: MystiaPath;

	constructor(
		x: number,
		y: number,
		path: MystiaPath,
		patterns?: PatternConfig[]
	) {
		const sheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bosses/mystia/mystia_spritesheet.png',
			frameX: 36,
			frameY: 36,
			frameCount: 4,
			frameSpeed: 0.12,
			looping: true,
		});

		super(x, y, 36, 36, INVINCIBLE_HP, sheet, createExplosionSheet());

		this.path = path;
		this.scoreValue = 0;
		this.drops = [];
		if (patterns) this.setPatterns(patterns);
	}

	updateMovement(dt: number): void {
		const dir = this.path === 'passing-left' ? 1 : -1;
		this.x += dir * HORIZONTAL_SPEED * dt;
		this.y -= RISE_SPEED * dt;
	}
}
