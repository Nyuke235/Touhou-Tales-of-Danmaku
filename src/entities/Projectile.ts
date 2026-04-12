import { FIELD } from '../game/Constants';

export interface IProjectile {
	x: number;
	y: number;
	active: boolean;
	hitRadius: number;
	damage: number;
	isShadow?: boolean;
	grazed?: boolean;
	pendingSpawns?: IProjectile[];
	update(dt: number): void;
	render(ctx: CanvasRenderingContext2D): void;
}

export abstract class BaseProjectile implements IProjectile {
	x: number;
	y: number;
	vx: number;
	vy: number;
	active: boolean = true;
	damage: number = 1;

	protected width: number;
	protected height: number;
	hitRadius: number;

	protected static readonly FIELD_W = FIELD.WIDTH;
	protected static readonly FIELD_H = FIELD.HEIGHT;

	private accelAngle?: number;
	private accelInitSpeed?: number;
	private accelTargetSpeed?: number;
	private accelDuration?: number;
	private accelElapsed: number = 0;

	pendingSpawns?: IProjectile[];
	private morphFn?: (x: number, y: number, shotIndex: number) => IProjectile[];
	private morphDelay?: number;
	private morphElapsed: number = 0;
	private morphStarted: boolean = false;
	private morphDeactivate: boolean = true;
	private morphInterval?: number;
	private morphMaxShots?: number;
	private morphTimer: number = 0;
	private morphShotCount: number = 0;

	constructor(
		x: number,
		y: number,
		vx: number,
		vy: number,
		width: number,
		height: number
	) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.width = width;
		this.height = height;
		this.hitRadius = Math.min(width, height) / 2 - 2;
	}

	setupAccel(
		angle: number,
		initSpeed: number,
		targetSpeed: number,
		duration: number
	): void {
		this.accelAngle = angle;
		this.accelInitSpeed = initSpeed;
		this.accelTargetSpeed = targetSpeed;
		this.accelDuration = duration;
		this.accelElapsed = 0;
		this.vx = Math.cos(angle) * initSpeed;
		this.vy = Math.sin(angle) * initSpeed;
	}

	setupMorph(
		delay: number,
		spawnFn: (x: number, y: number, shotIndex: number) => IProjectile[],
		deactivate: boolean = true,
		interval?: number,
		maxShots?: number
	): void {
		this.morphDelay = delay;
		this.morphFn = spawnFn;
		this.morphDeactivate = deactivate;
		this.morphInterval = interval;
		this.morphMaxShots = maxShots;
		this.morphElapsed = 0;
		this.morphTimer = 0;
		this.morphShotCount = 0;
		this.morphStarted = false;
	}

	update(dt: number) {
		if (
			this.accelDuration !== undefined &&
			this.accelElapsed < this.accelDuration
		) {
			this.accelElapsed += dt;
			const t = Math.min(1, this.accelElapsed / this.accelDuration);
			const speed =
				this.accelInitSpeed! +
				(this.accelTargetSpeed! - this.accelInitSpeed!) * t;
			this.vx = Math.cos(this.accelAngle!) * speed;
			this.vy = Math.sin(this.accelAngle!) * speed;
		}

		if (this.morphFn !== undefined) {
			if (!this.morphStarted) {
				this.morphElapsed += dt;
				if (this.morphElapsed >= this.morphDelay!) {
					this.morphStarted = true;
					this.morphTimer = 0;
				}
			}

			if (this.morphStarted) {
				if (
					this.morphInterval !== undefined &&
					this.morphMaxShots !== undefined
				) {
					this.morphTimer += dt;
					while (
						this.morphTimer >= this.morphInterval &&
						this.morphShotCount < this.morphMaxShots
					) {
						this.morphTimer -= this.morphInterval;
						this.pushMorphSpawns(
							this.morphFn(this.x, this.y, this.morphShotCount)
						);
						this.morphShotCount++;
					}
					if (this.morphShotCount >= this.morphMaxShots) {
						this.morphFn = undefined;
						if (this.morphDeactivate) this.active = false;
					}
				} else {
					this.pushMorphSpawns(this.morphFn(this.x, this.y, 0));
					this.morphFn = undefined;
					if (this.morphDeactivate) this.active = false;
				}
			}
		}

		this.x += this.vx * dt;
		this.y += this.vy * dt;
		this.checkBounds();
	}

	private pushMorphSpawns(spawns: IProjectile[]): void {
		if (spawns.length === 0) return;
		if (!this.pendingSpawns) this.pendingSpawns = [];
		this.pendingSpawns.push(...spawns);
	}

	checkBounds(): void {
		if (
			this.x + this.width < 0 ||
			this.x - this.width > BaseProjectile.FIELD_W ||
			this.y + this.height < 0 ||
			this.y - this.height > BaseProjectile.FIELD_H
		) {
			this.active = false;
		}
	}

	abstract render(ctx: CanvasRenderingContext2D): void;
}
