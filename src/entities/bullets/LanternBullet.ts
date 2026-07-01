import { StaticBullet } from './StaticBullet';
import { IBullet } from '../Bullet';
import { RiceBullet } from './RiceBullet';
import { BallBullet } from './BallBullet';
import { Spritesheet } from '../../utils/Spritesheet';

const FALL_SPEED = 28;

export interface LanternVolleyConfig {
	streams: number;
	count: number;
	speed: number;
	deltaSpeed: number;
}

export class LanternBullet extends StaticBullet {
	static readonly LIGHT_RADIUS = 70;

	constructor(
		x: number,
		y: number,
		arrowheadCount: number,
		arrowheadSpeed: number,
		volley: LanternVolleyConfig | null = null
	) {
		super(
			x,
			y,
			0,
			FALL_SPEED,
			30,
			49,
			'assets/sprites/bullets/hostile/lantern_spritesheet.png'
		);
		this.hitRadius = 10;

		this.sheet = new Spritesheet({
			src: 'assets/sprites/bullets/hostile/lantern_spritesheet.png',
			frameX: 30,
			frameY: 49,
			frameCount: 38,
			frameSpeed: 0.08,
			looping: true,
		});

		const count = arrowheadCount;
		const speed = arrowheadSpeed;
		this.setupMorph(
			0,
			(cx, cy) => {
				const shots: IBullet[] = [];
				for (let i = 0; i < count; i++) {
					const angle = ((2 * Math.PI) / count) * i;
					shots.push(
						new RiceBullet(
							cx,
							cy,
							Math.cos(angle) * speed,
							Math.sin(angle) * speed,
							'yellow'
						)
					);
				}
				if (volley) {
					for (let s = 0; s < volley.streams; s++) {
						const layerSpeed = volley.speed + s * volley.deltaSpeed;
						for (let i = 0; i < volley.count; i++) {
							const angle = ((2 * Math.PI) / volley.count) * i;
							shots.push(
								new BallBullet(
									cx,
									cy,
									Math.cos(angle) * layerSpeed,
									Math.sin(angle) * layerSpeed,
									'yellow'
								)
							);
						}
					}
				}
				return shots;
			},
			false,
			6.0,
			99
		);
	}

	override update(dt: number): void {
		this.sheet.update(dt);
		super.update(dt);
	}
}
