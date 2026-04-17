import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { PatternConfig } from '../../game/patterns/PatternEngine';
import { Patterns } from '../../game/patterns/PatternLibrary';
import { ItemType } from '../Item';
import { ENEMY_MOVEMENT } from '../../game/Constants';

export type FairyColor = 'blue' | 'red' | 'green';
export type FairyPath =
	| 'straight-down'
	| 'curve-left'
	| 'curve-right'
	| 'diagonal-left'
	| 'diagonal-right'
	| 'turn-left'
	| 'turn-right';

const SPRITE: Record<FairyColor, string> = {
	blue: 'assets/sprites/entities/enemies/fairies/bluefairy_spritesheet.png',
	red: 'assets/sprites/entities/enemies/fairies/redfairy_spritesheet.png',
	green: 'assets/sprites/entities/enemies/fairies/greenfairy_spritesheet.png',
};

const DROPS: Record<FairyColor, { type: ItemType; count: number }[]> = {
	blue: [
		{ type: 'power', count: 1 },
		{ type: 'point', count: 1 },
	],
	red: [{ type: 'power', count: 2 }],
	green: [
		{ type: 'bomb', count: 1 },
		{ type: 'point', count: 1 },
	],
};

const ARC_ANGULAR_VEL = 1.8;

export class Fairy extends Enemy {
	private path: FairyPath;
	private timer: number = 0;
	private readonly speed: number = ENEMY_MOVEMENT.FAIRY_SPEED;

	private arcAngle: number = Math.PI / 2;

	constructor(
		x: number,
		y: number,
		color: FairyColor,
		path: FairyPath,
		patterns?: PatternConfig[]
	) {
		const sheet = new Spritesheet({
			src: SPRITE[color],
			frameX: 32,
			frameY: 32,
			frameCount: 5,
			frameSpeed: 0.12,
			looping: true,
		});

		const explSheet = createExplosionSheet();

		super(x, y, 32, 32, 3, sheet, explSheet);
		this.scoreValue = 1000;
		this.path = path;

		this.setPatterns(patterns ?? [Patterns.S1_FAIRY_NORMAL]);
		this.drops = DROPS[color];
	}

	updateMovement(dt: number): void {
		this.timer += dt;

		switch (this.path) {
			case 'straight-down':
				this.y += this.speed * dt;
				break;
			case 'curve-left':
				this.y += this.speed * dt;
				this.x -=
					Math.sin(this.timer * ENEMY_MOVEMENT.SINE_SPEED) *
					ENEMY_MOVEMENT.FAIRY_SINE_AMPLITUDE *
					dt;
				break;
			case 'curve-right':
				this.y += this.speed * dt;
				this.x +=
					Math.sin(this.timer * ENEMY_MOVEMENT.SINE_SPEED) *
					ENEMY_MOVEMENT.FAIRY_SINE_AMPLITUDE *
					dt;
				break;
			case 'diagonal-left':
				this.y += this.speed * 0.3 * dt;
				this.x += this.speed * 1.0 * dt;
				break;
			case 'diagonal-right':
				this.y += this.speed * 0.3 * dt;
				this.x -= this.speed * 1.0 * dt;
				break;
			case 'turn-left':
			case 'turn-right': {
				const dir = this.path === 'turn-right' ? 1 : -1;
				const targetAngle = this.path === 'turn-right' ? Math.PI : 0;
				if (this.timer < 2.0) {
					this.y += this.speed * dt;
				} else {
					if (dir > 0 && this.arcAngle < targetAngle) {
						this.arcAngle = Math.min(
							this.arcAngle + ARC_ANGULAR_VEL * dt,
							targetAngle
						);
					} else if (dir < 0 && this.arcAngle > targetAngle) {
						this.arcAngle = Math.max(
							this.arcAngle - ARC_ANGULAR_VEL * dt,
							targetAngle
						);
					}
					this.x += Math.cos(this.arcAngle) * this.speed * dt;
					this.y += Math.sin(this.arcAngle) * this.speed * dt;
				}
				break;
			}
		}
	}
}
