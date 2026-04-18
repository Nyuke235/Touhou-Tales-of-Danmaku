import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { PatternConfig } from '../../game/patterns/PatternEngine';
import { Patterns } from '../../game/patterns/PatternLibrary';

export type MothPath = 'flying-top';

type Phase = 'entering' | 'waiting' | 'leaving';

const STOP_Y = 65;
const WAIT_DURATION = 3.0;
const ENTER_SPEED = 80;
const LEAVE_SPEED = 100;

export class Moth extends Enemy {
	private phase: Phase = 'entering';
	private waitTimer: number = 0;
	private leavingSpeed: number = 0;

	constructor(
		x: number,
		y: number,
		_path: MothPath,
		patterns?: PatternConfig[]
	) {
		const sheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/bugs/moth_spritesheet.png',
			frameX: 32,
			frameY: 32,
			frameCount: 3,
			frameSpeed: 0.12,
			looping: true,
		});

		const explSheet = createExplosionSheet();

		super(x, y, 32, 32, 20, sheet, explSheet);
		this.scoreValue = 8000;

		this.setPatterns(patterns ?? [Patterns.S1_MOTH_ORB_EASY]);
		this.drops = [
			{ type: 'power', count: 3 },
			{ type: 'point', count: 4 },
		];
	}

	updateMovement(dt: number): void {
		switch (this.phase) {
			case 'entering': {
				this.y -= ENTER_SPEED * dt;
				if (this.y <= STOP_Y) {
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
				this.leavingSpeed = Math.min(
					LEAVE_SPEED,
					this.leavingSpeed + LEAVE_SPEED * 3 * dt
				);
				this.y -= this.leavingSpeed * dt;
				break;
			}
		}
	}
}
