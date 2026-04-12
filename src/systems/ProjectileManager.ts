import { IProjectile } from '../entities/Projectile';

function compactInPlace(arr: IProjectile[]): void {
	let i = 0;
	while (i < arr.length) {
		if (!arr[i].active) {
			arr[i] = arr[arr.length - 1];
			arr.pop();
		} else {
			i++;
		}
	}
}

function compactParticles(arr: ClearParticle[]): void {
	let i = 0;
	while (i < arr.length) {
		if (arr[i].life <= 0) {
			arr[i] = arr[arr.length - 1];
			arr.pop();
		} else {
			i++;
		}
	}
}

interface ClearParticle {
	x: number;
	y: number;
	life: number;
	size: number;
}

export class ProjectileManager {
	playerProjectiles: IProjectile[] = [];
	enemyProjectiles: IProjectile[] = [];

	private shadowBuf: IProjectile[] = [];

	private clearParticles: ClearParticle[] = [];

	addPlayerProjectile(p: IProjectile): void {
		this.playerProjectiles.push(p);
	}

	addEnemyProjectile(p: IProjectile): void {
		this.enemyProjectiles.push(p);
	}

	update(dt: number): void {
		for (const p of this.playerProjectiles) p.update(dt);

		const spawned: IProjectile[] = [];
		for (const p of this.enemyProjectiles) {
			p.update(dt);
			if (p.pendingSpawns?.length) {
				spawned.push(...p.pendingSpawns);
				p.pendingSpawns.length = 0;
			}
		}
		this.enemyProjectiles.push(...spawned);

		compactInPlace(this.playerProjectiles);
		compactInPlace(this.enemyProjectiles);

		for (const cp of this.clearParticles) cp.life -= dt * 4;
		compactParticles(this.clearParticles);
	}

	clearWithEffect(): void {
		for (const p of this.enemyProjectiles) {
			this.clearParticles.push({ x: p.x, y: p.y, life: 1, size: 7 });
		}
		this.enemyProjectiles.length = 0;
	}

	clearEnemyProjectiles(): void {
		this.enemyProjectiles.length = 0;
	}

	clear(): void {
		this.playerProjectiles.length = 0;
		this.enemyProjectiles.length = 0;
		this.clearParticles.length = 0;
	}

	render(ctx: CanvasRenderingContext2D): void {
		for (const p of this.playerProjectiles) p.render(ctx);

		this.shadowBuf.length = 0;
		for (const p of this.enemyProjectiles) {
			if (p.isShadow) this.shadowBuf.push(p);
			else p.render(ctx);
		}
		for (const p of this.shadowBuf) p.render(ctx);

		for (const cp of this.clearParticles) {
			const r = cp.size * (1 + (1 - cp.life) * 1.5);
			ctx.save();
			ctx.globalAlpha = cp.life * 0.9;
			ctx.fillStyle = '#ffe88a';
			ctx.shadowColor = '#ffcc00';
			ctx.shadowBlur = 4;
			ctx.beginPath();
			ctx.arc(cp.x, cp.y, r, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}
}
