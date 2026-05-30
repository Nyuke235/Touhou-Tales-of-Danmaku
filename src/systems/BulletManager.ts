import { IBullet } from '../entities/Bullet';

function compactInPlace(arr: IBullet[]): void {
	let w = 0;
	for (let r = 0; r < arr.length; r++) {
		if (arr[r].active) {
			if (w !== r) arr[w] = arr[r];
			w++;
		}
	}
	arr.length = w;
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

export class BulletManager {
	playerBullets: IBullet[] = [];
	enemyBullets: IBullet[] = [];

	private shadowBuf: IBullet[] = [];

	private clearParticles: ClearParticle[] = [];

	addPlayerProjectile(p: IBullet): void {
		this.playerBullets.push(p);
	}

	addEnemyProjectile(p: IBullet): void {
		this.enemyBullets.push(p);
	}

	update(dt: number): void {
		for (const p of this.playerBullets) p.update(dt);

		const spawned: IBullet[] = [];
		for (const p of this.enemyBullets) {
			p.update(dt);
			if (p.pendingSpawns?.length) {
				spawned.push(...p.pendingSpawns);
				p.pendingSpawns.length = 0;
			}
		}
		this.enemyBullets.push(...spawned);

		compactInPlace(this.playerBullets);
		compactInPlace(this.enemyBullets);

		for (const cp of this.clearParticles) cp.life -= dt * 4;
		compactParticles(this.clearParticles);
	}

	clearWithEffect(): void {
		for (const p of this.enemyBullets) {
			this.clearParticles.push({ x: p.x, y: p.y, life: 1, size: 7 });
		}
		this.enemyBullets.length = 0;
	}

	clearEnemyProjectiles(): void {
		this.enemyBullets.length = 0;
	}

	clear(): void {
		this.playerBullets.length = 0;
		this.enemyBullets.length = 0;
		this.clearParticles.length = 0;
	}

	render(ctx: CanvasRenderingContext2D): void {
		for (const p of this.playerBullets) p.render(ctx);

		this.shadowBuf.length = 0;
		for (const p of this.enemyBullets) {
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
