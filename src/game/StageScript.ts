import { Enemy } from '../entities/Enemy';
import { Fairy } from '../entities/enemies/Fairy';
import { Spirit } from '../entities/enemies/Spirit';
import { MiniSpirit } from '../entities/enemies/MiniSpirit';
import { Moth } from '../entities/enemies/Moth';
import { Spinning } from '../entities/enemies/Spinning';
import { Rumia } from '../entities/enemies/bosses/Rumia';
import { RumiaDark } from '../entities/enemies/bosses/RumiaDark';
import type { FairyColor, FairyPath } from '../entities/enemies/Fairy';
import type { SpiritVariant, SpiritPath } from '../entities/enemies/Spirit';
import type { MiniSpiritPath } from '../entities/enemies/MiniSpirit';
import type { MothPath } from '../entities/enemies/Moth';
import type { SpinningColor, SpinningPath } from '../entities/enemies/Spinning';
import type { PatternConfig } from './patterns/PatternEngine';

export interface SpawnEvent {
	time: number;
	factory: () => Enemy;
	spawnX?: number;
	spawnY?: number;
}

export type SpawnEventData =
	| {
			time: number;
			type: 'fairy';
			x: number;
			y: number;
			color: FairyColor;
			path: FairyPath;
			patterns?: PatternConfig[];
	  }
	| {
			time: number;
			type: 'spirit';
			x: number;
			y: number;
			variant: SpiritVariant;
			path: SpiritPath;
			patterns?: PatternConfig[];
	  }
	| {
			time: number;
			type: 'minispirit';
			x: number;
			y: number;
			path: MiniSpiritPath;
			patterns?: PatternConfig[];
	  }
	| {
			time: number;
			type: 'moth';
			x: number;
			y: number;
			path: MothPath;
			patterns?: PatternConfig[];
	  }
	| {
			time: number;
			type: 'spinning';
			x: number;
			y: number;
			color: SpinningColor;
			path: SpinningPath;
			patterns?: PatternConfig[];
	  }
	| { time: number; type: 'rumia'; x: number; y: number }
	| { time: number; type: 'rumiadark'; x: number; y: number };

export function buildScript(data: SpawnEventData[]): SpawnEvent[] {
	return data.map(d => ({
		time: d.time,
		spawnX: d.x,
		spawnY: d.y,
		factory: (): Enemy => {
			switch (d.type) {
				case 'fairy':
					return new Fairy(d.x, d.y, d.color, d.path, d.patterns);
				case 'spirit':
					return new Spirit(d.x, d.y, d.variant, d.path, d.patterns);
				case 'minispirit':
					return new MiniSpirit(d.x, d.y, d.path, d.patterns);
				case 'moth':
					return new Moth(d.x, d.y, d.path, d.patterns);
				case 'spinning':
					return new Spinning(d.x, d.y, d.color, d.path, d.patterns);
				case 'rumia':
					return new Rumia(d.x, d.y);
				case 'rumiadark':
					return new RumiaDark(d.x, d.y);
			}
		},
	}));
}
