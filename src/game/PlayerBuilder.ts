import { Player } from '../entities/Player';
import { InputManager } from '../systems/InputManager';
import { ProjectileManager } from '../systems/ProjectileManager';
import { Character } from './GameState';
import {
	REIMU,
	MARISA,
	YINGYANG_OFFSETS,
	YINGYANG_FOCUS_OFFSETS,
	HAKKERO_OFFSETS,
	HAKKERO_FOCUS_OFFSETS,
} from './Constants';
import { AmuletProjectile } from '../entities/projectiles/AmuletProjectile';
import { StardustProjectile } from '../entities/projectiles/StardustProjectile';
import { YingYangOrb } from '../entities/power/YingYangOrb';
import { Hakkero } from '../entities/power/Hakkero';

//prettier-ignore
const SPRITE_PATHS: { [character: string]: { [color: string]: string } } = {
	marisa: {
		default: 'assets/sprites/entities/player/marisa/marisa_spritesheet.png',
		green: 'assets/sprites/entities/player/marisa/marisa_green_spritesheet.png',
		purple: 'assets/sprites/entities/player/marisa/marisa_purple_spritesheet.png',
	},
	reimu: {
		default: 'assets/sprites/entities/player/reimu/reimu_spritesheet.png',
		blue: 'assets/sprites/entities/player/reimu/reimu_blue_spritesheet.png',
		green: 'assets/sprites/entities/player/reimu/reimu_green_spritesheet.png',
	},
};

export function buildPlayer(
	inputManager: InputManager,
	projectileManager: ProjectileManager,
	character: Character,
	color: string = 'default'
): Player {
	const spriteSrc =
		SPRITE_PATHS[character]?.[color] ?? SPRITE_PATHS[character]?.default;

	if (character === Character.MARISA) {
		return new Player(inputManager, projectileManager, {
			spriteSrc,
			frameCount: MARISA.FRAMECOUNT,
			speed: MARISA.SPEED,
			focusSpeed: MARISA.FOCUS_SPEED,
			createProjectiles: (x, y) => [
				new StardustProjectile(x - 6, y - 10),
				new StardustProjectile(x + 6, y - 10),
			],
			createOption: () => new Hakkero(),
			optionOffsets: HAKKERO_OFFSETS,
			optionFocusOffsets: HAKKERO_FOCUS_OFFSETS,
		});
	}

	return new Player(inputManager, projectileManager, {
		spriteSrc,
		frameCount: REIMU.FRAMECOUNT,
		speed: REIMU.SPEED,
		focusSpeed: REIMU.FOCUS_SPEED,
		createProjectiles: (x, y) => [
			new AmuletProjectile(x - 6, y - 10),
			new AmuletProjectile(x + 6, y - 10),
		],
		createOption: index => new YingYangOrb((index * Math.PI) / 2),
		optionOffsets: YINGYANG_OFFSETS,
		optionFocusOffsets: YINGYANG_FOCUS_OFFSETS,
	});
}
