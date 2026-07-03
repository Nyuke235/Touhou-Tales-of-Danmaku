import { showSplash } from './utils/SplashScreen';
import { showTitleScreen } from './utils/TitleScreen';
import { scaleGameWindow } from './utils/ScaleWindow';
import { SceneManager, Scene } from './systems/SceneManager';
import { InputManager } from './systems/InputManager';
import { LocalSettings } from './systems/LocalSettings';
import { LocalScores } from './systems/LocalScores';
import { HomeScene } from './scenes/menu/HomeScene';
import { DifficultyScene } from './scenes/menu/DifficultyScene';
import { CharacterScene } from './scenes/menu/CharacterScene';
import { GameScene } from './scenes/game/GameScene';
import { OptionsScene } from './scenes/menu/OptionsScene';
import { MusicManager, Music } from './systems/MusicManager';
import { KeyConfig } from './scenes/menu/KeyConfigScene';
import { LeaderboardScene } from './scenes/menu/LeaderboardScene';
import { PracticeStageScene } from './scenes/practice/PracticeStageScene';
import { SpellcardStageScene } from './scenes/practice/SpellcardStageScene';
import { SpellcardListScene } from './scenes/practice/SpellcardListScene';
import { MusicRoomScene } from './scenes/menu/MusicRoomScene';
import { SpecialScene } from './scenes/menu/SpecialScene';
import { CreditsScene } from './scenes/menu/CreditsScene';
import { SaveScoreScene } from './scenes/menu/SaveScoreScene';
import { EndingScene } from './scenes/menu/EndingScene';
import { LeaderboardManagement } from './systems/LeaderboardManager';
import { GameState } from './game/GameState';
import { DialogueRegistry } from './stages/DialogueRegistry';
import { preloadAssets } from './utils/Preloader';
import { SPRITE_MANIFEST } from './generated/spriteManifest';
import { isTauri } from './utils/BackendAPI';

localStorage.removeItem('loggedUser');
localStorage.removeItem('sessionToken');

scaleGameWindow();
LocalSettings.load();
GameState.highScore = LocalScores.bestValidScore();
await DialogueRegistry.load();
await LeaderboardManagement.generateLeaderboard();

setInterval(async () => {
	await LeaderboardManagement.generateLeaderboard();
}, 5000);

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
const musicRoomScene = new MusicRoomScene(sceneManager, inputManager);
new SpecialScene(sceneManager, inputManager);
new CreditsScene(sceneManager, inputManager);
new SaveScoreScene(sceneManager, inputManager);
const endingScene = new EndingScene(sceneManager, inputManager);

const splashBar = document.getElementById('splash-loading-bar');
const splashText = document.getElementById('splash-loading-text');
const splashLoading = document.getElementById('splash-loading');
const preloadPromise = preloadAssets(
	SPRITE_MANIFEST,
	isTauri() ? [] : [Music.MENU],
	(loaded, total) => {
		const pct = total === 0 ? 100 : Math.round((loaded / total) * 100);
		if (splashBar) splashBar.style.width = `${pct}%`;
		if (splashText)
			splashText.textContent =
				pct >= 100 ? 'resources loaded' : `loading… ${pct}%`;
	}
);

await showSplash();
await Promise.race([
	preloadPromise,
	new Promise(resolve => setTimeout(resolve, 20000)),
]);
splashLoading?.classList.add('done');

const startMusic = () => {
	MusicManager.play(Music.MENU);
	document.removeEventListener('keydown', startMusic, { capture: true });
};
document.addEventListener('keydown', startMusic, { capture: true });

await showTitleScreen();
inputManager.enable();

const ENTERING_SCENES = new Set<Scene>([
	Scene.HOME,
	Scene.SPECIAL,
	Scene.OPTIONS,
	Scene.CHARACTERS,
	Scene.KEYCONFIG,
	Scene.DIFFICULTY,
	Scene.PRACTICE_STAGE,
	Scene.SPELLCARD_STAGE,
	Scene.SPELLCARD_LIST,
	Scene.SAVE_SCORE,
]);

const playEnteringAnimation = (id: string): void => {
	const el = document.getElementById(id);
	if (!el) return;
	el.classList.remove('outro');
	el.classList.add('entering');
	requestAnimationFrame(() =>
		requestAnimationFrame(() => el.classList.remove('entering'))
	);
};

const originalSwitchTo = sceneManager.switchTo.bind(sceneManager);

sceneManager.switchTo = (scene: Scene) => {
	originalSwitchTo(scene);

	if (scene === Scene.GAME) {
		gameScene.setActive(true);
		gameScene.init(GameState.startingStage);
	} else {
		gameScene.setActive(false);
		gameScene.stop();
		if (scene !== Scene.MUSIC_ROOM) {
			MusicManager.play(Music.MENU);
		}
	}

	if (scene === Scene.MUSIC_ROOM) musicRoomScene.onEnter();
	if (scene === Scene.SPELLCARD_LIST) spellcardListScene.onEnter();
	if (scene === Scene.ENDING) endingScene.onEnter();
	if (scene === Scene.LEADERBOARD) {
		LeaderboardManagement.mode = 'global';
		LeaderboardManagement.generateLeaderboard();
	}

	if (ENTERING_SCENES.has(scene)) playEnteringAnimation(scene);
};
