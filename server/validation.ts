const MAX_STAGE = 7;
const MAX_SCORE = 9_999_999_999;

export const Validate = {
	name(v: unknown): v is string {
		return typeof v === 'string' && /^[a-zA-Z0-9_-]{3,12}$/.test(v);
	},

	score(v: unknown): v is number {
		return Number.isInteger(v) && (v as number) >= 0 && (v as number) <= MAX_SCORE;
	},

	stage(v: unknown): v is number {
		return Number.isInteger(v) && (v as number) >= 1 && (v as number) <= MAX_STAGE;
	},

	slow(v: unknown): v is number {
		return typeof v === 'number' && isFinite(v) && (v as number) >= 0 && (v as number) <= 100;
	},

	date(v: unknown): v is number {
		return Number.isInteger(v) && (v as number) > 0 && (v as number) <= Date.now() + 60_000;
	},
};
