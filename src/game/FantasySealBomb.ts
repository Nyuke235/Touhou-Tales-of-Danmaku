import { SealProjectile, SealColor } from '../entities/bullets/SealProjectile';
import { Enemy } from '../entities/Enemy';
import { EnemyManager } from '../systems/EnemyManager';

const SEAL_COUNT = 12;
const SEAL_COLORS: SealColor[] = ['red', 'blue', 'green'];
const ORBIT_ANGULAR_VEL = 2.6;
const ORBIT_DURATION = 1.3;
const LAUNCH_INTERVAL = 0.22;

export const FANTASY_SEAL_DURATION =
	ORBIT_DURATION + LAUNCH_INTERVAL * SEAL_COUNT;

export class FantasySealBomb {
	private seals: SealProjectile[] = [];
	private elapsed: number = 0;
	private launchedCount: number = 0;
	private launchTimer: number = 0;

	constructor() {
		for (let i = 0; i < SEAL_COUNT; i++) {
			const color = SEAL_COLORS[i % SEAL_COLORS.length];
			const angle = (i / SEAL_COUNT) * Math.PI * 2;
			this.seals.push(new SealProjectile(color, angle));
		}
	}

	update(
		dt: number,
		reimuX: number,
		reimuY: number,
		enemies: EnemyManager
	): void {
		this.elapsed += dt;

		for (const s of this.seals)
			s.updateOrbit(dt, reimuX, reimuY, ORBIT_ANGULAR_VEL);

		if (this.launchedCount < SEAL_COUNT && this.elapsed >= ORBIT_DURATION) {
			this.launchTimer += dt;
			while (
				this.launchedCount < SEAL_COUNT &&
				this.launchTimer >= LAUNCH_INTERVAL
			) {
				this.launchTimer -= LAUNCH_INTERVAL;
				const seal = this.seals[this.launchedCount];
				const target = enemies.getNearestActiveEnemy(seal.x, seal.y);
				seal.launch(target);
				this.launchedCount++;
			}
		}

		const applyDamage = (target: Enemy, damage: number): void => {
			enemies.dealDirectDamage(target, damage);
		};
		for (const s of this.seals) s.updateSeek(dt, applyDamage);
	}

	render(ctx: CanvasRenderingContext2D): void {
		for (const s of this.seals) s.render(ctx);
	}

	isDone(): boolean {
		return this.seals.every(s => s.isDone());
	}
}
