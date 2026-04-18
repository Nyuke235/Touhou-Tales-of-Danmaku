import { FIELD } from '../game/Constants';
import { SoundManager, SFX } from './SoundManager';

export interface BlizzardEvent {
	time: number;
	duration: number;
	direction: 'left' | 'right';
	intensity?: number;
}

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	size: number;
}

const WIND_PUSH_SPEED = 20;
const FADE_DURATION = 1.0;

export class BlizzardManager {
	private events: BlizzardEvent[] = [];
	private timer: number = 0;
	private eventIndex: number = 0;
	private particles: Particle[] = [];
	private spawnAccum: number = 0;

	private active: {
		direction: 'left' | 'right';
		intensity: number;
		elapsed: number;
		duration: number;
	} | null = null;

	windPushX: number = 0;

	loadScript(events: BlizzardEvent[]): void {
		this.events = [...events].sort((a, b) => a.time - b.time);
		this.timer = 0;
		this.eventIndex = 0;
		this.particles = [];
		this.spawnAccum = 0;
		this.active = null;
		this.windPushX = 0;
	}

	update(dt: number, paused: boolean = false): void {
		if (!paused) this.timer += dt;

		while (
			this.eventIndex < this.events.length &&
			this.events[this.eventIndex].time <= this.timer
		) {
			const ev = this.events[this.eventIndex];
			this.active = {
				direction: ev.direction,
				intensity: ev.intensity ?? 0.5,
				elapsed: 0,
				duration: ev.duration,
			};
			this.eventIndex++;
			SoundManager.playAmbient(SFX.BLIZZARD, 1.1);
		}

		if (this.active) {
			this.active.elapsed += dt;

			const envelope = this.computeEnvelope(
				this.active.elapsed,
				this.active.duration
			);
			const dir = this.active.direction === 'right' ? 1 : -1;
			this.windPushX = dir * WIND_PUSH_SPEED * this.active.intensity * envelope;

			const spawnRate = 45 * this.active.intensity * envelope;
			this.spawnAccum += spawnRate * dt;
			const count = Math.floor(this.spawnAccum);
			this.spawnAccum -= count;
			for (let i = 0; i < count; i++) {
				this.spawnParticle(this.active.direction, this.active.intensity);
			}

			if (this.active.elapsed >= this.active.duration) {
				this.active = null;
				this.windPushX = 0;
				SoundManager.stopAmbient(SFX.BLIZZARD);
			}
		}

		for (const p of this.particles) {
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.life -= dt;
		}
		this.particles = this.particles.filter(p => p.life > 0);
	}

	private computeEnvelope(elapsed: number, duration: number): number {
		if (elapsed < FADE_DURATION) return elapsed / FADE_DURATION;
		if (elapsed > duration - FADE_DURATION)
			return Math.max(0, (duration - elapsed) / FADE_DURATION);
		return 1;
	}

	private spawnParticle(direction: 'left' | 'right', intensity: number): void {
		const dir = direction === 'right' ? 1 : -1;
		const speed = 120 + Math.random() * 200 * intensity;
		const life = 0.5 + Math.random() * 1.0;
		const r = Math.random();
		const size = r < 0.5 ? 1 : r < 0.85 ? 2 : 3;
		this.particles.push({
			x: direction === 'right' ? -4 : FIELD.WIDTH + 4,
			y: Math.random() * FIELD.HEIGHT,
			vx: dir * speed,
			vy: 20 + Math.random() * 40,
			life,
			maxLife: life,
			size,
		});
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.particles.length === 0) return;
		ctx.save();
		ctx.fillStyle = '#dff4ff';
		for (const p of this.particles) {
			ctx.globalAlpha = (p.life / p.maxLife) * 0.95;
			ctx.fillRect(p.x, p.y, p.size, p.size);
		}
		ctx.restore();
	}

	reset(): void {
		SoundManager.stopAmbient(SFX.BLIZZARD);
		this.loadScript([]);
	}
}
