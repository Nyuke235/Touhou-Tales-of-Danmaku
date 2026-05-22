import { SpawnEventData, buildScript } from '../game/StageScript';
import { Patterns as P } from '../patterns/PatternLibrary';

const RAW_STAGE_3: SpawnEventData[] = [
	// blue/red fairies right -> left, then bubble fairy
	{ time:  3.6, type: 'bubblefairy', x: 272, y: 55, path: 'pass-left' },
	{ time:  5.0, type: 'fairy', x: 272, y:  25, color: 'blue', path: 'diagonal-right', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time:  5.4, type: 'fairy', x: 272, y:  40, color: 'red',  path: 'diagonal-right', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time:  5.8, type: 'fairy', x: 272, y:  25, color: 'blue', path: 'diagonal-right', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time:  6.2, type: 'fairy', x: 272, y:  40, color: 'red',  path: 'diagonal-right', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time:  6.6, type: 'fairy', x: 272, y:  25, color: 'blue', path: 'diagonal-right', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time:  7.0, type: 'fairy', x: 272, y:  40, color: 'red',  path: 'diagonal-right', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time:  7.8, type: 'bubblefairy', x: 272, y: 55, path: 'pass-left' },

	// blue/red fairies left -> right, then bubble fairy
	{ time: 8.6,  type: 'bubblefairy', x: -16, y: 55, path: 'pass-right' },
	{ time: 10.0, type: 'fairy', x: -16, y:  25, color: 'red',  path: 'diagonal-left', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 10.4, type: 'fairy', x: -16, y:  40, color: 'blue', path: 'diagonal-left', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 10.8, type: 'fairy', x: -16, y:  25, color: 'red',  path: 'diagonal-left', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 11.2, type: 'fairy', x: -16, y:  40, color: 'blue', path: 'diagonal-left', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 11.6, type: 'fairy', x: -16, y:  25, color: 'red',  path: 'diagonal-left', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 12.0, type: 'fairy', x: -16, y:  40, color: 'blue', path: 'diagonal-left', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 12.8, type: 'bubblefairy', x: -16, y: 55, path: 'pass-right' },

	// mandragoras + bubble fairies
	{ time: 14.0, type: 'bubblefairy', x: 64, y: -16, path: 'descend-slow' },
	{ time: 14.0, type: 'bubblefairy', x: 192, y: -16, path: 'descend-slow' },
	{ time: 15.0, type: 'mandragora', x: 128, y: -16, patterns: [P.S3_MANDRAGORA_N, P.S3_MANDRAGORA_H, P.S3_MANDRAGORA_L] },

	// swoop bubble fairies + mandragora center
	{ time: 20.5, type: 'bubblefairy', x:  40, y: -16, path: 'swoop-right' },
	{ time: 20.5, type: 'bubblefairy', x: 216, y: -16, path: 'swoop-left'  },
	{ time: 21.5, type: 'bubblefairy', x:  72, y: -16, path: 'swoop-right' },
	{ time: 21.5, type: 'bubblefairy', x: 184, y: -16, path: 'swoop-left'  },
	{ time: 21.5, type: 'mandragora',  x: 128, y: -16, patterns: [P.S3_MANDRAGORA_N, P.S3_MANDRAGORA_H, P.S3_MANDRAGORA_L] },
	{ time: 22.0, type: 'mandragora',  x:  72, y: -16, patterns: [P.S3_MANDRAGORA_N, P.S3_MANDRAGORA_H, P.S3_MANDRAGORA_L] },
	{ time: 22.0, type: 'mandragora',  x: 184, y: -16, patterns: [P.S3_MANDRAGORA_N, P.S3_MANDRAGORA_H, P.S3_MANDRAGORA_L] },

	// fairies straight-down + mandragoras
	{ time: 24.0, type: 'fairy', x:  20, y: -16, color: 'blue',  path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_PURPLE_EN, P.S3_CIRCLE_BALL_PURPLE_H, P.S3_CIRCLE_BALL_PURPLE_L] },
	{ time: 24.4, type: 'fairy', x:  76, y: -16, color: 'red',   path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_GREEN_EN,  P.S3_CIRCLE_BALL_GREEN_H,  P.S3_CIRCLE_BALL_GREEN_L] },
	{ time: 24.8, type: 'fairy', x: 128, y: -16, color: 'blue',  path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_PURPLE_EN, P.S3_CIRCLE_BALL_PURPLE_H, P.S3_CIRCLE_BALL_PURPLE_L] },
	{ time: 25.2, type: 'fairy', x: 180, y: -16, color: 'green', path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_GREEN_EN,  P.S3_CIRCLE_BALL_GREEN_H,  P.S3_CIRCLE_BALL_GREEN_L ] },
	{ time: 25.6, type: 'fairy', x: 236, y: -16, color: 'red',   path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_PURPLE_EN, P.S3_CIRCLE_BALL_PURPLE_H, P.S3_CIRCLE_BALL_PURPLE_L] },
	{ time: 26.0, type: 'mandragora',  x:  40, y: -16, patterns: [P.S3_MANDRAGORA_N, P.S3_MANDRAGORA_H, P.S3_MANDRAGORA_L] },
	{ time: 26.0, type: 'mandragora',  x: 216, y: -16, patterns: [P.S3_MANDRAGORA_N, P.S3_MANDRAGORA_H, P.S3_MANDRAGORA_L] },
	{ time: 26.5, type: 'mandragora',  x:  88, y: -16, patterns: [P.S3_MANDRAGORA_N, P.S3_MANDRAGORA_H, P.S3_MANDRAGORA_L] },
	{ time: 26.5, type: 'mandragora',  x: 168, y: -16, patterns: [P.S3_MANDRAGORA_N, P.S3_MANDRAGORA_H, P.S3_MANDRAGORA_L] },
	{ time: 27.5, type: 'fairy', x:  48, y: -16, color: 'blue',  path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_PURPLE_EN, P.S3_CIRCLE_BALL_PURPLE_H, P.S3_CIRCLE_BALL_PURPLE_L] },
	{ time: 27.9, type: 'fairy', x: 104, y: -16, color: 'red',   path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_GREEN_EN,  P.S3_CIRCLE_BALL_GREEN_H,  P.S3_CIRCLE_BALL_GREEN_L] },
	{ time: 28.3, type: 'fairy', x: 152, y: -16, color: 'blue',  path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_PURPLE_EN, P.S3_CIRCLE_BALL_PURPLE_H, P.S3_CIRCLE_BALL_PURPLE_L] },
	{ time: 28.7, type: 'fairy', x: 208, y: -16, color: 'red',   path: 'straight-down', patterns: [P.S3_CIRCLE_BALL_GREEN_EN,  P.S3_CIRCLE_BALL_GREEN_H,  P.S3_CIRCLE_BALL_GREEN_L] },

	{ time: 30.0, type: 'bubblefairy', x:  64, y: -16, path: 'zigzag-down' },
	{ time: 32.0, type: 'bubblefairy', x: 128, y: -16, path: 'zigzag-down' },
	{ time: 34.0, type: 'bubblefairy', x: 192, y: -16, path: 'zigzag-down' },

	{ time: 36.0, type: 'fairy', x:  48, y: -16, color: 'blue',  path: 'straight-down', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 36.0, type: 'fairy', x: 104, y: -16, color: 'red',   path: 'straight-down', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 36.5, type: 'fairy', x: 152, y: -16, color: 'blue',  path: 'straight-down', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 36.5, type: 'fairy', x: 208, y: -16, color: 'red',   path: 'straight-down', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 38.0, type: 'fairy', x:  48, y: -16, color: 'blue',  path: 'straight-down', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 38.0, type: 'fairy', x: 104, y: -16, color: 'red',   path: 'straight-down', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 38.5, type: 'fairy', x: 152, y: -16, color: 'blue',  path: 'straight-down', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },
	{ time: 38.5, type: 'fairy', x: 208, y: -16, color: 'red',   path: 'straight-down', patterns: [P.S3_FAIRY_AIMED_GREEN_EN, P.S3_FAIRY_AIMED_GREEN_H, P.S3_FAIRY_AIMED_GREEN_L] },

	{ time: 40.1, type: 'mystia', x: -36, y: 60, path: 'passing-left', patterns: [P.S3_MYSTIA_GRAVITY_GREEN, P.S3_MYSTIA_GRAVITY_RED, P.S3_MYSTIA_ARROWHEAD_VOLLEY_EN, P.S3_MYSTIA_ARROWHEAD_VOLLEY_H, P.S3_MYSTIA_ARROWHEAD_VOLLEY_L] },
	{ time: 44.0, type: 'spirit', x: -32, y: 52, variant: 'purple', path: 'passing-left',  patterns: [P.S3_CIRCLE_PURPLE_BALL_A, P.S3_CIRCLE_PURPLE_BALL_B, P.S3_CIRCLE_PURPLE_BALL_C] },
	
	{ time: 51.8, type: 'mystia', x: 288, y: 60, path: 'passing-right', patterns: [P.S3_MYSTIA_GRAVITY_GREEN, P.S3_MYSTIA_GRAVITY_RED, P.S3_MYSTIA_ARROWHEAD_VOLLEY_EN, P.S3_MYSTIA_ARROWHEAD_VOLLEY_H, P.S3_MYSTIA_ARROWHEAD_VOLLEY_L] },
	{ time: 55.5, type: 'spirit', x: 288, y: 52, variant: 'purple', path: 'passing-right',  patterns: [P.S3_CIRCLE_PURPLE_BALL_A, P.S3_CIRCLE_PURPLE_BALL_B, P.S3_CIRCLE_PURPLE_BALL_C] },

	{ time: 64.0, type: 'rumialantern', x: 128, y: -16 },

	{ time: 85.0, type: 'bubblefairy', x: -16, y: 60, path: 'pass-right' },
];

export const STAGE_3 = buildScript(RAW_STAGE_3);
