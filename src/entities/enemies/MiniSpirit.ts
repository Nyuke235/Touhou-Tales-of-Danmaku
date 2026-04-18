import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { PatternConfig } from '../../game/patterns/PatternEngine';
import { Patterns } from '../../game/patterns/PatternLibrary';
import { ENEMY_MOVEMENT } from '../../game/Constants';

export type MiniSpiritPath = 'passing-left' | 'passing-right' | 'straight-down';

export class MiniSpirit extends Enemy {
	private path: MiniSpiritPath;
	private timer: number = 0;
	private speed: number = ENEMY_MOVEMENT.MINI_SPIRIT_SPEED;

	constructor(
		x: number,
		y: number,
		path: MiniSpiritPath,
		patterns?: PatternConfig[]
	) {
		const sheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/spirits/minispirit_spritesheet.png',
			frameX: 16,
			frameY: 16,
			frameCount: 7,
			frameSpeed: 0.12,
			looping: true,
		});

		const explSheet = createExplosionSheet();

		super(x, y, 16, 16, 1, sheet, explSheet);
		this.scoreValue = 2000;
		this.path = path;

		this.setPatterns(patterns ?? [Patterns.S1_ACCEL_NORMAL]);
		this.drops = [{ type: 'point', count: 1 }];
	}

	updateMovement(dt: number): void {
		this.timer += dt;

		switch (this.path) {
			case 'passing-left':
				this.x += this.speed * dt;
				this.y +=
					Math.sin(this.timer * ENEMY_MOVEMENT.SINE_SPEED) *
					ENEMY_MOVEMENT.SPIRIT_SINE_AMPLITUDE *
					dt;
				break;
			case 'passing-right':
				this.x -= this.speed * dt;
				this.y +=
					Math.sin(this.timer * ENEMY_MOVEMENT.SINE_SPEED) *
					ENEMY_MOVEMENT.SPIRIT_SINE_AMPLITUDE *
					dt;
				break;
			case 'straight-down':
				this.y += this.speed * dt;
				break;
		}
	}
}
