import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { Patterns } from '../../game/patterns/PatternLibrary';
import { ENEMY_MOVEMENT } from '../../game/Constants';

type Phase = 'entering' | 'waiting' | 'leaving';

const SPEED = ENEMY_MOVEMENT.NENUPHAR_SPEED;
const STOP_Y = ENEMY_MOVEMENT.NENUPHAR_STOP_Y;
const WAIT_DURATION = ENEMY_MOVEMENT.NENUPHAR_WAIT;

export class Nenuphar extends Enemy {
	private phase: Phase = 'entering';
	private waitTimer: number = 0;

	constructor(x: number, y: number) {
		const sheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/spirits/nenupharspirit_spritesheet.png',
			frameX: 24,
			frameY: 24,
			frameCount: 5,
			frameSpeed: 0.12,
			looping: true,
		});

		super(x, y, 24, 24, 24, sheet, createExplosionSheet());

		this.scoreValue = 3000;
		this.setPatterns([
			Patterns.S2_NENUPHAR_ORBS_E,
			Patterns.S2_NENUPHAR_ORBS_N,
			Patterns.S2_NENUPHAR_ORBS_H,
		]);
		this.drops = [
			{ type: 'point', count: 5 },
			{ type: 'power', count: 3 },
		];
	}

	updateMovement(dt: number): void {
		switch (this.phase) {
			case 'entering': {
				this.y += SPEED * dt;
				if (this.y >= STOP_Y) {
					this.y = STOP_Y;
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
				this.y += SPEED * dt;
				break;
			}
		}
	}
}
