import { Controls } from '../systems/Controls';
import { EnemyManager } from '../systems/EnemyManager';
import { InputManager } from '../systems/InputManager';
import { ItemManager } from '../systems/ItemManager';
import { MusicManager } from '../systems/MusicManager';
import { ProjectileManager } from '../systems/ProjectileManager';
import { SaveManager } from '../systems/SaveManager';
import { Scene, SceneManager } from '../systems/SceneManager';
import { ScoreManager } from '../systems/ScoreManager';
import { SFX, SoundManager } from '../systems/SoundManager';

import { GameLoop } from '../game/GameLoop';
import { GameState } from '../game/GameState';

import { BossHUD } from './BossHUD';
import { GameHUD } from './GameHUD';
import { GameOverMenu } from './GameOverMenu';
import { PauseMenu } from './PauseMenu';
import { StageClearMenu } from './StageClearMenu';

import { Boss } from '../entities/Boss';
import { Player } from '../entities/Player';
import { BOSS, FIELD, GAME } from '../game/Constants';
import { GrazeEffect } from '../utils/GrazeEffect';
import { BlizzardManager } from '../systems/BlizzardManager';
import { ScrollingBackground } from '../utils/ScrollingBackground';
import { SpellcardBackground } from '../utils/SpellcardBackground';
import { STAGES } from '../stages/stages';
import { buildPlayer } from '../game/PlayerBuilder';
import { SpellcardClearMenu } from './SpellcardClearMenu';
import { SPELLCARD_REGISTRY, SpellcardEntry } from '../game/SpellcardRegistry';
import { SpawnEvent } from '../game/StageScript';

export class GameScene {
	protected sceneManager: SceneManager;
	protected inputManager: InputManager;
	protected enemyManager: EnemyManager;
	protected itemManager: ItemManager;
	protected projectileManager: ProjectileManager;
	protected loop: GameLoop;
	protected player: Player;
	protected ctx: CanvasRenderingContext2D;

	protected stageCard: HTMLElement;

	protected hud: GameHUD = new GameHUD();
	protected bossHUD: BossHUD = new BossHUD();
	protected activeBoss: Boss | null = null;
	protected pauseMenu!: PauseMenu;
	protected gameOverMenu!: GameOverMenu;
	protected stageClearMenu!: StageClearMenu;
	protected spellcardClearMenu!: SpellcardClearMenu;

	protected isActive: boolean = false;
	protected currentStageIndex: number = 0;
	protected startTime: number = 0;
	protected misses: number = 0;
	protected bombsUsed: number = 0;
	protected bombEffect: { x: number; y: number; t: number } | null = null;

	protected background: ScrollingBackground = new ScrollingBackground(
		STAGES[0].backgroundSrc,
		STAGES[0].backgroundSpeed
	);
	protected spellcardBg: SpellcardBackground = new SpellcardBackground();
	protected scoreManager: ScoreManager = new ScoreManager(GameState.difficulty);
	protected grazeEffect: GrazeEffect = new GrazeEffect();
	protected blizzardManager: BlizzardManager = new BlizzardManager();
	lives: number = GAME.INITIAL_LIVES;
	bombs: number = GAME.INITIAL_BOMBS;

	constructor(sceneManager: SceneManager, inputManager: InputManager) {
		this.sceneManager = sceneManager;
		this.inputManager = inputManager;
		this.itemManager = new ItemManager();
		this.enemyManager = new EnemyManager();
		this.projectileManager = new ProjectileManager();

		const canvas = document.getElementById('game-canvas')! as HTMLCanvasElement;
		this.ctx = canvas.getContext('2d')!;
		this.ctx.imageSmoothingEnabled = false;

		this.player = buildPlayer(
			this.inputManager,
			this.projectileManager,
			GameState.character,
			GameState.characterColor
		);
		this.loop = new GameLoop(
			dt => this.update(dt),
			() => this.render()
		);

		this.stageCard = document.getElementById('stage-card')!;

		this.pauseMenu = new PauseMenu(inputManager, sceneManager, {
			onResume: () => {
				this.loop.start();
				MusicManager.resume();
			},
			onBackToTitle: () => {
				GameState.highScore = Math.max(
					this.scoreManager.value,
					GameState.highScore
				);
				this.saveCurrentUser();
				this.sceneManager.switchTo(Scene.HOME);
			},
			onRestart: () => {
				GameState.highScore = Math.max(
					this.scoreManager.value,
					GameState.highScore
				);
				this.saveCurrentUser();
				MusicManager.stop();
				this.init(GameState.startingStage);
			},
		});

		this.gameOverMenu = new GameOverMenu(inputManager, sceneManager, {
			onBackToTitle: () => {
				GameState.highScore = Math.max(
					this.scoreManager.value,
					GameState.highScore
				);
				this.saveCurrentUser();
				this.sceneManager.switchTo(Scene.HOME);
			},
			onRestart: () => {
				MusicManager.stop();
				this.init(GameState.startingStage);
			},
		});

		this.stageClearMenu = new StageClearMenu({
			onContinue: () => this.advanceToNextStage(),
		});

		this.spellcardClearMenu = new SpellcardClearMenu(
			inputManager,
			sceneManager,
			{
				onBackToTitle: () => {
					GameState.highScore = Math.max(
						this.scoreManager.value,
						GameState.highScore
					);
					this.saveCurrentUser();
					this.sceneManager.switchTo(Scene.HOME);
				},
				onRestart: () => {
					MusicManager.stop();
					this.init();
				},
			}
		);

		this.bindKeyboard();
	}

	setActive(v: boolean): void {
		this.isActive = v;
	}

	protected bindKeyboard(): void {
		this.inputManager.onKeyDown(code => {
			if (this.sceneManager.getCurrentScene() !== Scene.GAME) return;
			if (!this.isActive) return;
			if (
				code === Controls.BACK &&
				!this.pauseMenu.isActive() &&
				!this.spellcardClearMenu.isActive()
			) {
				this.pause();
			}
			if (
				code === Controls.BOMB &&
				!this.pauseMenu.isActive() &&
				!this.gameOverMenu.isActive() &&
				!this.spellcardClearMenu.isActive() &&
				!this.player.isDead()
			) {
				this.useBomb();
			}
		});
	}

	protected pause(): void {
		this.loop.stop();
		MusicManager.pause();
		SoundManager.play(SFX.UI_PAUSE);
		this.pauseMenu.show();
	}

	init(stageIndex = 0): void {
		const spellcardEntry: SpellcardEntry | null = GameState.spellcardMode
			? (SPELLCARD_REGISTRY[GameState.spellcardGroupIndex]?.spellcards[
					GameState.spellcardEntryIndex
				] ?? null)
			: null;

		if (spellcardEntry) stageIndex = spellcardEntry.stageIndex;

		this.loop.stop();

		this.currentStageIndex = stageIndex;
		this.scoreManager = new ScoreManager(GameState.difficulty);
		this.lives = spellcardEntry ? GAME.THIRDS_PER_GEM : GAME.INITIAL_LIVES;
		this.bombs = spellcardEntry ? 0 : GAME.INITIAL_BOMBS;
		this.misses = 0;
		this.bombsUsed = 0;
		this.bombEffect = null;
		this.startTime = Date.now();
		GameState.power = spellcardEntry ? GameState.maxPower : 0.0;
		GameState.pointItems = 0;
		GameState.graze = 0;
		this.hud.init(GameState.difficulty, this.lives, this.bombs);
		if (spellcardEntry) this.hud.setPower(GameState.power, GameState.maxPower);

		this.spellcardBg.reset();
		this.projectileManager.clear();
		this.itemManager.clear();

		if (this.spellcardClearMenu?.isActive()) this.spellcardClearMenu.hide();

		this.player = buildPlayer(
			this.inputManager,
			this.projectileManager,
			GameState.character,
			GameState.characterColor
		);
		this.player.getNearestEnemy = (x, y) =>
			this.enemyManager.getNearestEnemy(x, y);

		this.activeBoss = null;
		this.bossHUD.hide();

		this.enemyManager.onDrop = (x, y, drops) =>
			this.itemManager.dropFromEnemy(x, y, drops);
		this.enemyManager.onScore = value => this.scoreManager.add(value);
		this.enemyManager.onStageComplete = spellcardEntry
			? undefined
			: () => this.nextStage();

		this.enemyManager.onBossSpawn = boss => {
			this.activeBoss = boss;
			this.bossHUD.show(boss);

			if (spellcardEntry) {
				boss.skipToPhase(spellcardEntry.phaseIndex);
				boss.onReady = () => {
					if (boss.isCurrentSpellCard()) this.spellcardBg.show();
					this.bossHUD.onPhaseChange(boss);
				};
				boss.onPhaseChange = () => {
					this.bossHUD.onPhaseChange(boss);
					if (boss.getNetPhase() > spellcardEntry.phaseIndex) {
						boss.forceKill();
					} else if (boss.isCurrentSpellCard()) {
						this.spellcardBg.show();
					} else {
						this.spellcardBg.hide();
					}
				};
			} else {
				boss.onPhaseChange = () => {
					this.bossHUD.onPhaseChange(boss);
					if (boss.isCurrentSpellCard()) {
						this.spellcardBg.show();
					} else {
						this.spellcardBg.hide();
					}
				};
			}

			boss.onSpellCapture = bonus => {
				this.scoreManager.add(bonus);
				this.hud.setScore(this.scoreManager.value);
			};
			if (boss.music) {
				MusicManager.play(boss.music);
			}
		};

		if (spellcardEntry) {
			this.loadSpellcardStage(stageIndex, spellcardEntry);
		} else {
			this.loadStage(stageIndex);
			this.showStageCard();
		}
		this.loop.start();
	}

	private loadSpellcardStage(stageIndex: number, entry: SpellcardEntry): void {
		const stage = STAGES[stageIndex];
		this.background = new ScrollingBackground(
			stage.backgroundSrc,
			stage.backgroundSpeed
		);
		MusicManager.play(stage.music);
		const script: SpawnEvent[] = [
			{
				time: 0,
				factory: () => entry.bossFactory(),
				spawnX: BOSS.CENTER_X,
				spawnY: -30,
			},
		];
		this.enemyManager.loadScript(script);
		this.blizzardManager.loadScript([]);
	}

	protected loadStage(index: number): void {
		const stage = STAGES[index];
		this.background = new ScrollingBackground(
			stage.backgroundSrc,
			stage.backgroundSpeed
		);
		MusicManager.play(stage.music);
		this.enemyManager.loadScript(stage.script);
		this.blizzardManager.loadScript(stage.blizzard ?? []);
	}

	protected nextStage(): void {
		if (this.currentStageIndex + 1 < STAGES.length) {
			this.stageClearMenu.show({
				score: this.scoreManager.value,
				difficulty: GameState.difficulty,
				playingTime: Date.now() - this.startTime,
				misses: this.misses,
				bombsUsed: this.bombsUsed,
				enemiesDefeated: this.enemyManager.killedCount,
			});
		} else {
			this.triggerEnding();
		}
	}

	protected advanceToNextStage(): void {
		const blackout = document.getElementById('stage-blackout')!;
		blackout.classList.add('fading-in');
		setTimeout(() => {
			this.currentStageIndex++;
			this.projectileManager.clear();
			this.itemManager.clear();
			this.activeBoss = null;
			this.bossHUD.hide();
			this.spellcardBg.reset();
			this.loadStage(this.currentStageIndex);
			this.showStageCard();
			this.loop.start();
			blackout.classList.remove('fading-in');
			blackout.classList.add('fading-out');
			blackout.addEventListener(
				'animationend',
				() => blackout.classList.remove('fading-out'),
				{ once: true }
			);
		}, 500);
	}

	protected triggerEnding(): void {
		this.loop.stop();
		MusicManager.stop();
		this.sceneManager.switchTo(Scene.HOME); // TODO: ending screen
	}

	protected showStageCard(): void {
		const stage = STAGES[this.currentStageIndex];
		document.getElementById('stage-number')!.textContent = stage.number;
		document.getElementById('stage-name')!.textContent = stage.name;
		document.getElementById('stage-description')!.textContent =
			stage.description;

		this.stageCard.classList.remove('active');
		void this.stageCard.offsetWidth;
		this.stageCard.classList.add('active');
		this.stageCard.addEventListener(
			'animationend',
			() => this.stageCard.classList.remove('active'),
			{ once: true }
		);
	}

	protected triggerSpellcardClear(): void {
		this.loop.stop();
		MusicManager.pause();
		this.spellcardClearMenu.show();
	}

	stop(): void {
		this.loop.stop();
		if (this.pauseMenu?.isActive()) this.pauseMenu.hide();
		if (this.gameOverMenu?.isActive()) this.gameOverMenu.hide();
		if (this.spellcardClearMenu?.isActive()) this.spellcardClearMenu.hide();
	}

	protected update(dt: number): void {
		this.updateBossState();
		this.updateBombEffect(dt);

		this.background.update(dt);
		this.spellcardBg.update(dt);
		this.blizzardManager.update(dt);
		this.player.update(dt);
		if (this.blizzardManager.windPushX !== 0 && !this.player.isDead()) {
			const hw = this.player.width / 2;
			this.player.x = Math.max(
				hw,
				Math.min(
					FIELD.WIDTH - hw,
					this.player.x + this.blizzardManager.windPushX * dt
				)
			);
		}
		this.projectileManager.update(dt);
		this.enemyManager.update(
			dt,
			this.player.x,
			this.player.y,
			this.projectileManager.playerProjectiles,
			this.projectileManager.enemyProjectiles
		);

		this.checkPlayerCollisions();
		this.grazeEffect.update(dt);

		const collected = this.itemManager.update(
			dt,
			this.player.x,
			this.player.y,
			!this.player.isDead()
		);
		this.processCollectedItems(collected);
	}

	protected updateBossState(): void {
		if (!this.activeBoss) return;

		if (!this.activeBoss.active) {
			this.bossHUD.hide();
			this.spellcardBg.hide();
			this.activeBoss = null;
			if (GameState.spellcardMode) {
				this.triggerSpellcardClear();
			}
			return;
		}

		if (this.activeBoss.requestClearWithEffect) {
			this.projectileManager.clearWithEffect();
			this.activeBoss.requestClearWithEffect = false;
		}
		this.bossHUD.update(this.activeBoss);
	}

	protected updateBombEffect(dt: number): void {
		if (!this.bombEffect) return;
		this.bombEffect.t += dt;
		if (this.bombEffect.t >= GAME.BOMB_DURATION) this.bombEffect = null;
	}

	protected processCollectedItems(
		collected: ReturnType<ItemManager['update']>
	): void {
		if (collected.power > 0 || collected.bigpower > 0) {
			const prevFloor = Math.floor(GameState.power);
			if (collected.power > 0) {
				GameState.power = Math.min(
					GameState.maxPower,
					GameState.power + GAME.POWER_PER_ITEM * collected.power
				);
				this.scoreManager.add(ScoreManager.POWER * collected.power);
			}
			if (collected.bigpower > 0) {
				GameState.power = Math.min(
					GameState.maxPower,
					GameState.power + GAME.POWER_PER_BIG * collected.bigpower
				);
				this.scoreManager.add(ScoreManager.BIG_POWER * collected.bigpower);
			}
			if (Math.floor(GameState.power) > prevFloor) {
				SoundManager.play(SFX.PLAYER_1UP);
			}
			this.hud.setPower(GameState.power, GameState.maxPower);
			if (this.scoreManager.value > GameState.highScore)
				GameState.highScore = this.scoreManager.value;
		}

		if (collected.point > 0) {
			GameState.pointItems += collected.point;
			this.scoreManager.add(ScoreManager.POINT * collected.point);
		}
		if (collected.bigpoint > 0) {
			GameState.pointItems += 8 * collected.bigpoint;
			this.scoreManager.add(ScoreManager.BIG_POINT * collected.bigpoint);
		}
		if (collected.point > 0 || collected.bigpoint > 0) {
			this.hud.setPointItems(GameState.pointItems);
		}

		this.hud.setScore(this.scoreManager.value);
		if (collected.life > 0) {
			this.lives = Math.min(GAME.MAX_LIVES, this.lives + collected.life);
			this.hud.setLives(this.lives);
		}
		if (collected.bomb > 0) {
			this.bombs = Math.min(GAME.MAX_BOMBS, this.bombs + collected.bomb);
			this.hud.setBombs(this.bombs);
		}
	}

	protected checkPlayerCollisions(): void {
		const hitByProjectile = this.player.checkCollisions(
			this.projectileManager.enemyProjectiles
		);
		const hitByEnemy = this.enemyManager.checkBodyCollisions(
			this.player.x,
			this.player.y,
			this.player.hitboxRadius,
			this.player.isVulnerable()
		);

		if (!hitByProjectile && !hitByEnemy) {
			const grazeCount = this.player.checkGraze(
				this.projectileManager.enemyProjectiles
			);
			if (grazeCount > 0) {
				GameState.graze += grazeCount;
				this.scoreManager.add(ScoreManager.GRAZE * grazeCount);
				this.hud.setGraze(GameState.graze);
				this.hud.setScore(this.scoreManager.value);
				if (this.scoreManager.value > GameState.highScore)
					GameState.highScore = this.scoreManager.value;
				SoundManager.play(SFX.PLAYER_GRAZE);
				this.grazeEffect.spawn(this.player.x, this.player.y);
			}
			return;
		}

		this.activeBoss?.failSpellCapture();

		const deathX = this.player.x;
		const deathY = this.player.y;
		this.player.hit();
		this.misses++;
		this.lives = Math.max(0, this.lives - GAME.THIRDS_PER_GEM);

		const powerBefore = GameState.power;
		GameState.power = Math.max(0.0, GameState.power - GAME.POWER_LOST_ON_DEATH);
		if (powerBefore >= 1.0) {
			this.itemManager.dropFromEnemy(deathX, deathY, [
				{ type: 'bigpower', count: 1 },
			]);
		}

		this.hud.setLives(this.lives);
		this.hud.setPower(GameState.power, GameState.maxPower);

		if (this.lives === 0) {
			this.loop.stop();
			MusicManager.pause();
			setTimeout(() => this.triggerGameOver(), 1500);
		}
	}

	protected useBomb(): void {
		if (this.bombs < GAME.THIRDS_PER_GEM) return;
		this.bombs -= GAME.THIRDS_PER_GEM;
		this.bombsUsed++;
		this.hud.setBombs(this.bombs);
		SoundManager.play(SFX.PLAYER_BOMB);
		this.activeBoss?.failSpellCapture();
		this.enemyManager.applyBomb(GAME.BOMB_DAMAGE);
		this.projectileManager.clearWithEffect();
		this.bombEffect = { x: this.player.x, y: this.player.y, t: 0 };
	}

	protected render(): void {
		const ctx = this.ctx;
		ctx.clearRect(0, 0, FIELD.WIDTH, FIELD.HEIGHT);
		this.background.render(ctx, FIELD.WIDTH, FIELD.HEIGHT);
		this.spellcardBg.render(ctx, FIELD.WIDTH, FIELD.HEIGHT);

		const focused = this.inputManager.isHeld(Controls.FOCUS);
		this.enemyManager.render(ctx);
		this.itemManager.render(ctx);
		this.player.render(ctx, focused);
		this.grazeEffect.render(ctx);
		this.projectileManager.render(ctx);
		this.blizzardManager.render(ctx);
		this.renderBombEffect(ctx);
	}

	protected renderBombEffect(
		ctx: CanvasRenderingContext2D,
		effect = this.bombEffect
	): void {
		if (!effect) return;
		const { x, y, t } = effect;
		const progress = t / GAME.BOMB_DURATION;
		const halfSize = progress * GAME.BOMB_EFFECT_SIZE;
		const alpha = Math.max(0, 1 - progress);
		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
		ctx.fillRect(x - halfSize, y - halfSize, halfSize * 2, halfSize * 2);
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 3;
		ctx.strokeRect(x - halfSize, y - halfSize, halfSize * 2, halfSize * 2);
		ctx.restore();
	}

	private saveCurrentUser(): void {
		const currentUser = localStorage.getItem('loggedUser');
		if (currentUser) SaveManager.save(currentUser);
	}

	protected triggerGameOver(): void {
		SoundManager.play(SFX.GAME_OVER);
		const score = this.scoreManager.value;
		const highScore = GameState.highScore;
		GameState.highScore = score > highScore ? score : highScore;
		this.saveCurrentUser();
		this.gameOverMenu.show({
			score: this.scoreManager.value,
			difficulty: GameState.difficulty,
			playingTime: Date.now() - this.startTime,
			misses: this.misses,
			bombsUsed: this.bombsUsed,
			enemiesDefeated: this.enemyManager.killedCount,
		});
	}
}
