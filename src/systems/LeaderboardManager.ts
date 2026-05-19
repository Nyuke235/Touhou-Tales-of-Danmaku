import { BackendAPI } from '../utils/BackendAPI';
import { LocalScores } from './LocalScores';

const SLOW_THRESHOLD = 5;

const HEAD_ROW = `<tr>
	<th class="lb-no">No</th>
	<th class="lb-name">Name</th>
	<th class="lb-score">Score(Stage)</th>
	<th class="lb-date">Date</th>
	<th class="lb-slow">Slow</th>
</tr>`;

export class LeaderboardManagement {
	static mode: 'global' | 'local' = 'global';

	static generateLeaderboard = async (): Promise<void> => {
		const head = document.getElementById('board-head');
		const board = document.getElementById('board');
		if (!head || !board) return;

		if (this.mode === 'global') {
			await this.renderGlobal(head, board);
		} else {
			this.renderLocal(head, board);
		}

		this.updateTabs();
	};

	private static updateTabs(): void {
		document.querySelectorAll<HTMLElement>('.lb-tab').forEach(tab => {
			tab.classList.toggle('selected', tab.dataset.mode === this.mode);
		});
	}

	private static async renderGlobal(
		head: HTMLElement,
		board: HTMLElement
	): Promise<void> {
		head.innerHTML = HEAD_ROW;

		const entries = await BackendAPI.getLeaderboard();

		if (!entries.length) {
			board.innerHTML = `<tr><td colspan="5" class="lb-empty">NO VALID SCORES YET</td></tr>`;
			return;
		}

		board.innerHTML = entries
			.map(
				({ name, score, stage, date, slow }, i) => `<tr>
				<td class="lb-no">${i + 1}</td>
				<td class="lb-name">${escapeHtml(name)}</td>
				<td class="lb-score">${score}(${stage})</td>
				<td class="lb-date">${new Date(date).toLocaleDateString('fr-CA')}</td>
				<td class="lb-slow">${slow.toFixed(1)}%</td>
			</tr>`
			)
			.join('');
	}

	private static renderLocal(head: HTMLElement, board: HTMLElement): void {
		head.innerHTML = HEAD_ROW;

		const scores = LocalScores.all();

		if (!scores.length) {
			board.innerHTML = `<tr><td colspan="5" class="lb-empty">NO SCORES YET</td></tr>`;
			return;
		}

		const valid = scores
			.filter(e => e.slow <= SLOW_THRESHOLD)
			.sort((a, b) => b.score - a.score);
		const invalid = scores
			.filter(e => e.slow > SLOW_THRESHOLD)
			.sort((a, b) => b.score - a.score);

		const nameCell = (name?: string) =>
			`<td class="lb-name">${name ? escapeHtml(name) : '-'}</td>`;

		const validRows = valid.map(
			(e, i) => `<tr>
			<td class="lb-no">${i + 1}</td>
			${nameCell(e.name)}
			<td class="lb-score">${e.score}(${e.stage})</td>
			<td class="lb-date">${new Date(e.date).toLocaleDateString('fr-CA')}</td>
			<td class="lb-slow">${e.slow.toFixed(1)}%</td>
		</tr>`
		);

		const invalidRows = invalid.map(
			e => `<tr class="lb-invalid">
			<td class="lb-no">-</td>
			${nameCell(e.name)}
			<td class="lb-score">${e.score}(${e.stage})</td>
			<td class="lb-date">${new Date(e.date).toLocaleDateString('fr-CA')}</td>
			<td class="lb-slow">${e.slow.toFixed(1)}%</td>
		</tr>`
		);

		board.innerHTML = [...validRows, ...invalidRows].join('');
	}
}

function escapeHtml(s: string): string {
	return s.replace(
		/[&<>"']/g,
		c =>
			(
				({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					'"': '&quot;',
					"'": '&#39;',
				}) as Record<string, string>
			)[c]
	);
}
