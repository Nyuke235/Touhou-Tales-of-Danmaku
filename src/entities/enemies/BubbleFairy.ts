import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { PatternConfig } from '../../patterns/PatternEngine';
import { Patterns } from '../../patterns/PatternLibrary';
import { ENEMY_MOVEMENT } from '../../game/Constants';

export type BubbleFairyPath =
	| 'pass-left'
	| 'pass-right'
	| 'descend-slow'
	| 'swoop-left'
	| 'swoop-right'
	| 'zigzag-down';

const SPEED = ENEMY_MOVEMENT.FAIRY_SPEED;
const SLOW_SPEED = 8;
const PAUSE_DURATION = 1.5;

const PASS_SLOW_ZONE_R = 100;
const PASS_SLOW_ZONE_L = 156;
const DESCEND_SLOW_Y = 110;

const ZIGZAG_FREQ = 2.2;
const SWOOP_TURN_RATE = 0.55;

export class BubbleFairy extends Enemy {
	private readonly path: BubbleFairyPath;
	private timer: number = 0;
	private phase: 0 | 1 | 2 = 0;
	private phaseTimer: number = 0;
	private arcAngle: number = Math.PI * 0.5;

	constructor(
		x: number,
		y: number,
		path: BubbleFairyPath,
		patterns?: PatternConfig[]
	) {
		const sheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/fairies/bubblefairy_spritesheet.png',
			frameX: 32,
			frameY: 32,
			frameCount: 5,
			frameSpeed: 0.12,
			looping: true,
		});
		super(x, y, 32, 32, 10, sheet, createExplosionSheet());
		this.scoreValue = 1000;
		this.path = path;
		this.drops = [
			{ type: 'power', count: 3 },
			{ type: 'point', count: 5 },
		];
		this.setPatterns(
			patterns ?? [
				Patterns.S3_BUBBLEFAIRY_EN,
				Patterns.S3_BUBBLEFAIRY_H,
				Patterns.S3_BUBBLEFAIRY_L,
			]
		);
	}

	updateMovement(dt: number): void {
		this.timer += dt;
		switch (this.path) {
			case 'pass-right':
				this.movePass(dt, 1);
				break;
			case 'pass-left':
				this.movePass(dt, -1);
				break;
			case 'descend-slow':
				this.moveDescend(dt);
				break;
			case 'swoop-left':
				this.moveSwoop(dt, -1);
				break;
			case 'swoop-right':
				this.moveSwoop(dt, 1);
				break;
			case 'zigzag-down':
				this.moveZigzag(dt);
				break;
		}
	}

	private movePass(dt: number, dir: 1 | -1): void {
		if (this.phase === 0) {
			this.x += dir * SPEED * dt;
			const entered =
				dir > 0 ? this.x >= PASS_SLOW_ZONE_R : this.x <= PASS_SLOW_ZONE_L;
			if (entered) {
				this.phase = 1;
				this.phaseTimer = 0;
			}
		} else if (this.phase === 1) {
			this.x += dir * SLOW_SPEED * dt;
			this.phaseTimer += dt;
			if (this.phaseTimer >= PAUSE_DURATION) this.phase = 2;
		} else {
			this.x += dir * SPEED * dt;
		}
	}

	private moveDescend(dt: number): void {
		if (this.phase === 0) {
			this.y += SPEED * dt;
			if (this.y >= DESCEND_SLOW_Y) {
				this.phase = 1;
				this.phaseTimer = 0;
			}
		} else if (this.phase === 1) {
			this.y += SLOW_SPEED * dt;
			this.phaseTimer += dt;
			if (this.phaseTimer >= PAUSE_DURATION) this.phase = 2;
		} else {
			this.y += SPEED * dt;
		}
	}

	private moveSwoop(dt: number, dir: 1 | -1): void {
		const targetAngle = dir > 0 ? Math.PI * 0.25 : Math.PI * 0.75;
		if (dir > 0) {
			this.arcAngle = Math.max(
				targetAngle,
				this.arcAngle - SWOOP_TURN_RATE * dt
			);
		} else {
			this.arcAngle = Math.min(
				targetAngle,
				this.arcAngle + SWOOP_TURN_RATE * dt
			);
		}
		this.x += Math.cos(this.arcAngle) * SPEED * dt;
		this.y += Math.sin(this.arcAngle) * SPEED * dt;
	}

	private moveZigzag(dt: number): void {
		this.y += SPEED * 0.65 * dt;
		this.x += Math.sin(this.timer * ZIGZAG_FREQ) * SPEED * 0.85 * dt;
	}
}
