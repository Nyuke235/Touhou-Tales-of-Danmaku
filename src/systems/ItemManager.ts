import { Item, ItemType } from '../entities/Item';
import { SoundManager, SFX } from './SoundManager';
import { ITEM } from '../game/Constants';

export class ItemManager {
	items: Item[] = [];

	spawn(x: number, y: number, type: ItemType): void {
		this.items.push(new Item(x, y, type));
	}

	spawnLaunched(
		x: number,
		y: number,
		type: ItemType,
		vx: number,
		vy: number
	): void {
		const item = new Item(x, y, type);
		item.launch(vx, vy);
		this.items.push(item);
	}

	dropFromEnemy(
		x: number,
		y: number,
		drops: { type: ItemType; count: number }[]
	): void {
		for (const drop of drops) {
			for (let i = 0; i < drop.count; i++) {
				const item = new Item(x, y, drop.type);
				const vx = (Math.random() - 0.5) * 80;
				const vy = -(70 + Math.random() * 60);
				item.launch(vx, vy);
				this.items.push(item);
			}
		}
	}

	update(
		dt: number,
		px: number,
		py: number,
		canCollect: boolean = true
	): {
		power: number;
		point: number;
		bigpower: number;
		bigpoint: number;
		life: number;
		bomb: number;
	} {
		let collected = {
			power: 0,
			point: 0,
			bigpower: 0,
			bigpoint: 0,
			life: 0,
			bomb: 0,
		};

		const poc = py < ITEM.POC_Y;

		for (const item of this.items) {
			if (!item.active) continue;
			if (poc) item.attracted = true;
			item.update(dt, px, py);

			if (canCollect && item.isCollectedBy(px, py)) {
				item.active = false;
				collected[item.type]++;
				SoundManager.play(SFX.PLAYER_ITEM);
			}
		}

		this.items = this.items.filter(i => i.active);
		return collected;
	}

	render(ctx: CanvasRenderingContext2D): void {
		for (const item of this.items) item.render(ctx);
	}

	clear(): void {
		this.items.length = 0;
	}
}
