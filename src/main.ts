import { showSplash } from './utils/SplashScreen';
import { showTitleScreen } from './utils/TitleScreen';
import { scaleGameWindow } from './utils/ScaleWindow';
import { SceneManager, Scene } from './systems/SceneManager';
import { InputManager } from './systems/InputManager';
import { HomeScene } from './scenes/HomeScene';
import { DifficultyScene } from './scenes/DifficultyScene';
import { CharacterScene } from './scenes/CharacterScene';
import { GameScene } from './scenes/GameScene';
import { OptionsScene } from './scenes/OptionsScene';
import { MusicManager, Music } from './systems/MusicManager';
import { initAuth } from './utils/Auth';
import { KeyConfig } from './scenes/KeyConfigScene';
import { LeaderboardScene } from './scenes/LeaderboardScene';
import { PracticeStageScene } from './scenes/PracticeStageScene';
import { SpellcardStageScene } from './scenes/SpellcardStageScene';
import { SpellcardListScene } from './scenes/SpellcardListScene';
import { LeaderboardManagement } from './systems/LeaderboardManager';
import { User } from './utils/User';
import { GameState } from './game/GameState';

scaleGameWindow();
initAuth();
await LeaderboardManagement.generateLeaderboard();
await User.showUserInfo();

setInterval(async () => {
	await LeaderboardManagement.generateLeaderboard();
	await User.showUserInfo();
}, 1000);

const sceneManager = new SceneManager();
const inputManager = new InputManager();
const gameScene = new GameScene(sceneManager, inputManager);

new HomeScene(sceneManager, inputManager);
new DifficultyScene(sceneManager, inputManager);
new CharacterScene(sceneManager, inputManager);
new OptionsScene(sceneManager, inputManager);
new KeyConfig(sceneManager, inputManager);
new LeaderboardScene(sceneManager, inputManager);
new PracticeStageScene(sceneManager, inputManager);
const spellcardListScene = new SpellcardListScene(sceneManager, inputManager);
new SpellcardStageScene(sceneManager, inputManager);

await showSplash();

const startMusic = () => {
	MusicManager.play(Music.MENU);
	document.removeEventListener('keydown', startMusic, { capture: true });
	document.removeEventListener('click', startMusic, { capture: true });
};
document.addEventListener('keydown', startMusic, { capture: true });
document.addEventListener('click', startMusic, { capture: true });

await showTitleScreen();

const originalSwitchTo = sceneManager.switchTo.bind(sceneManager);

sceneManager.switchTo = (scene: Scene) => {
	originalSwitchTo(scene);
	if (scene === Scene.GAME) {
		gameScene.setActive(true);
		gameScene.init(GameState.startingStage);
	} else {
		gameScene.setActive(false);
		gameScene.stop();
		MusicManager.play(Music.MENU);
	}
	if (scene === Scene.HOME) {
		const home = document.getElementById('home')!;
		home.classList.remove('outro');
		home.classList.add('entering');
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				home.classList.remove('entering');
			})
		);
	}
	if (scene === Scene.OPTIONS) {
		const options = document.getElementById('options')!;
		options.classList.remove('outro');
		options.classList.add('entering');
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				options.classList.remove('entering');
			})
		);
	}
	if (scene === Scene.CHARACTERS) {
		const characters = document.getElementById('characters')!;
		characters.classList.remove('outro');
		characters.classList.add('entering');
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				characters.classList.remove('entering');
			})
		);
	}
	if (scene === Scene.KEYCONFIG) {
		const keyconfig = document.getElementById('keyconfig')!;
		keyconfig.classList.remove('outro');
		keyconfig.classList.add('entering');
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				keyconfig.classList.remove('entering');
			})
		);
	}
	if (scene === Scene.DIFFICULTY) {
		const difficulty = document.getElementById('difficulty')!;
		difficulty.classList.remove('outro');
		difficulty.classList.add('entering');
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				difficulty.classList.remove('entering');
			})
		);
	}
	if (scene === Scene.PRACTICE_STAGE) {
		const practiceStage = document.getElementById('practice-stage')!;
		practiceStage.classList.remove('outro');
		practiceStage.classList.add('entering');
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				practiceStage.classList.remove('entering');
			})
		);
	}
	if (scene === Scene.SPELLCARD_STAGE) {
		const el = document.getElementById('spellcard-stage')!;
		el.classList.remove('outro');
		el.classList.add('entering');
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				el.classList.remove('entering');
			})
		);
	}
	if (scene === Scene.SPELLCARD_LIST) {
		spellcardListScene.onEnter();
		const el = document.getElementById('spellcard-list')!;
		el.classList.remove('outro');
		el.classList.add('entering');
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				el.classList.remove('entering');
			})
		);
	}
};
