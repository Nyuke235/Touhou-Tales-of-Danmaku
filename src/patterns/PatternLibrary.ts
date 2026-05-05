import { PatternConfig } from './PatternEngine';

const PI = Math.PI;

const ANGLE_FIELDS = new Set([
	'startAngle',
	'sweepAngle',
	'angleStep',
	'rotStep',
	'ringAngleStep',
	'angularVel',
	'spread',
]);

function parseAngle(v: string | number): number {
	if (typeof v === 'number') return v;
	// safe: input comes only from static JSON files bundled at build time
	return new Function('PI', `return ${v}`)(PI) as number;
}

type RawPattern = Record<string, unknown>;

function resolveAngles(obj: RawPattern): RawPattern {
	const out: RawPattern = {};
	for (const [key, value] of Object.entries(obj)) {
		if (
			ANGLE_FIELDS.has(key) &&
			(typeof value === 'string' || typeof value === 'number')
		) {
			out[key] = parseAngle(value as string | number);
		} else if (
			value !== null &&
			typeof value === 'object' &&
			!Array.isArray(value)
		) {
			out[key] = resolveAngles(value as RawPattern);
		} else {
			out[key] = value;
		}
	}
	return out;
}

const modules = import.meta.glob<Record<string, unknown>>('./data/**/*.json', {
	eager: true,
	import: 'default',
});

export const Patterns: Record<string, PatternConfig> = {};
for (const data of Object.values(modules)) {
	for (const [key, value] of Object.entries(data)) {
		Patterns[key] = resolveAngles(
			value as RawPattern
		) as unknown as PatternConfig;
	}
}
