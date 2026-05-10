import { Enemy } from '../Enemy';
import { Spritesheet, createExplosionSheet } from '../../utils/Spritesheet';
import { IBullet } from '../Bullet';
import { ShockwaveBullet } from '../bullets/ShockwaveBullet';
import { ENEMY_MOVEMENT } from '../../game/Constants';
import { SoundManager, SFX } from '../../systems/SoundManager';
import { PatternConfig } from '../../patterns/PatternEngine';

type Phase = 'hidden' | 'screaming';

const DESCENT_SPEED = ENEMY_MOVEMENT.MANDRAGORA_SPEED;
const WAKE_DELAY = 3.0;

export class Mandragora extends Enemy {
	private phase: Phase = 'hidden';
	private phaseTimer: number = 0;
	private screamingSheet: Spritesheet;

	constructor(x: number, y: number, patterns?: PatternConfig[]) {
		const hiddenSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/mandragora/mandragora-hidden.png',
			frameX: 32,
			frameY: 32,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});

		super(x, y, 32, 32, 10, hiddenSheet, createExplosionSheet());

		this.screamingSheet = new Spritesheet({
			src: 'assets/sprites/entities/enemies/mandragora/mandragora-screaming.png',
			frameX: 32,
			frameY: 32,
			frameCount: 1,
			frameSpeed: 1,
			looping: true,
		});

		this.scoreValue = 3000;
		this.drops = [
			{ type: 'point', count: 2 },
			{ type: 'power', count: 2 },
		];
		if (patterns) this.setPatterns(patterns);
	}

	update(dt: number, px: number, py: number, enemyBullets: IBullet[]): void {
		if (!this.exploding) {
			this.phaseTimer += dt;
			if (this.phase === 'hidden' && this.phaseTimer >= WAKE_DELAY) {
				this.phase = 'screaming';
				this.sheet = this.screamingSheet;
				SoundManager.play(SFX.MANDRAGORA_SCREAM);
				enemyBullets.push(new ShockwaveBullet(this.x, this.y));
			}
		}
		super.update(dt, px, py, enemyBullets);
	}

	updateMovement(dt: number): void {
		this.y += DESCENT_SPEED * dt;
	}
}
