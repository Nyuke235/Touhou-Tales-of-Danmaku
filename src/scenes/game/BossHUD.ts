import { Boss } from '../../entities/Boss';

export class BossHUD {
	private nameEl: HTMLElement;
	private barContainer: HTMLElement;
	private barFill: HTMLElement;
	private barSep: HTMLElement;
	private timerEl: HTMLElement;
	private bonusEl: HTMLElement;

	constructor() {
		this.nameEl = document.getElementById('spell-card-name')!;
		this.barContainer = document.getElementById('boss-health-bar')!;
		const existingFill = this.barContainer.querySelector(
			'.boss-bar-fill'
		) as HTMLElement | null;
		const existingSep = this.barContainer.querySelector(
			'.boss-bar-sep'
		) as HTMLElement | null;
		if (existingFill && existingSep) {
			this.barFill = existingFill;
			this.barSep = existingSep;
		} else {
			this.barFill = document.createElement('div');
			this.barFill.className = 'boss-bar-fill';
			this.barSep = document.createElement('div');
			this.barSep.className = 'boss-bar-sep';
			this.barContainer.appendChild(this.barFill);
			this.barContainer.appendChild(this.barSep);
		}

		const overlay = document.querySelector('.game-overlay') as HTMLElement;
		const existingTimer = document.getElementById(
			'boss-timer'
		) as HTMLElement | null;
		const existingBonus = document.getElementById(
			'spell-bonus'
		) as HTMLElement | null;
		this.timerEl =
			existingTimer ??
			(() => {
				const el = document.createElement('div');
				el.id = 'boss-timer';
				overlay.appendChild(el);
				return el;
			})();
		this.bonusEl =
			existingBonus ??
			(() => {
				const el = document.createElement('div');
				el.id = 'spell-bonus';
				overlay.appendChild(el);
				return el;
			})();

		this.hide();
	}

	show(boss: Boss): void {
		const uiEls = [this.barContainer, this.timerEl];
		for (const el of uiEls) {
			el.style.transition = 'none';
			el.style.opacity = '0';
			el.style.display = 'block';
		}
		this.nameEl.style.display = 'block';
		this.update(boss);
		void this.barContainer.offsetHeight;
		for (const el of uiEls) {
			el.style.transition = 'opacity 2s ease';
			el.style.opacity = '1';
		}
		if (boss.isCurrentSpellCard()) {
			this.triggerSpellcardTitle();
		} else {
			this.nameEl.style.transition = 'none';
			this.nameEl.style.opacity = '0';
			void this.nameEl.offsetWidth;
			this.nameEl.style.transition = 'opacity 2s ease';
			this.nameEl.style.opacity = '1';
		}
	}

	hide(): void {
		const elements = [
			this.barContainer,
			this.nameEl,
			this.timerEl,
			this.bonusEl,
		];
		for (const el of elements) {
			el.style.transition = '';
			el.style.opacity = '1';
			el.style.display = 'none';
		}
		this.nameEl.classList.remove('spellcard-entering');
	}

	update(boss: Boss): void {
		const fill = boss.getBarFill();
		this.barFill.style.width = `${fill * 100}%`;

		const sepFill = boss.getSpellSepFill();
		if (sepFill !== null) {
			this.barSep.style.display = '';
			this.barSep.style.left = `${sepFill * 100}%`;
		} else {
			this.barSep.style.display = 'none';
		}

		const isSpell = boss.isCurrentSpellCard();
		if (isSpell) {
			this.barFill.classList.add('spellcard');
		} else {
			this.barFill.classList.remove('spellcard');
		}

		this.nameEl.textContent = boss.getCurrentPhaseName();
		this.timerEl.textContent = String(boss.getTimer());

		if (isSpell) {
			const bonus = boss.getSpellBonus();
			this.bonusEl.style.display = 'block';
			this.bonusEl.textContent = `BONUS: ${bonus.toLocaleString('fr-FR')}`;
			this.bonusEl.classList.toggle('capture-failed', boss.isCaptureFailed());
		} else {
			this.bonusEl.style.display = 'none';
		}
	}

	onPhaseChange(boss: Boss): void {
		this.update(boss);
		if (boss.isCurrentSpellCard()) {
			this.triggerSpellcardTitle();
		}
	}

	private triggerSpellcardTitle(): void {
		this.nameEl.classList.remove('spellcard-entering');
		this.nameEl.style.opacity = '1';
		void this.nameEl.offsetWidth;
		this.nameEl.classList.add('spellcard-entering');
		setTimeout(() => {
			this.nameEl.classList.remove('spellcard-entering');
		}, 3000);
	}
}
