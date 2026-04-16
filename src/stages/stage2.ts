import { SpawnEventData, buildScript } from '../game/StageScript';
import { Patterns as P } from '../game/patterns/PatternLibrary';

const RAW_STAGE_2: SpawnEventData[] = [

	// Wave 1 – blue fairies from the top, 5 per side, turn inward
	{ time:  3.0, type: 'fairy', x:  40, y: -16, color: 'blue', path: 'turn-right', patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  3.0, type: 'fairy', x: 216, y: -16, color: 'blue', path: 'turn-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  3.5, type: 'fairy', x:  60, y: -16, color: 'blue', path: 'turn-right', patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  3.5, type: 'fairy', x: 196, y: -16, color: 'blue', path: 'turn-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  4.0, type: 'fairy', x:  80, y: -16, color: 'blue', path: 'turn-right', patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  4.0, type: 'fairy', x: 176, y: -16, color: 'blue', path: 'turn-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  4.5, type: 'fairy', x: 100, y: -16, color: 'blue', path: 'turn-right', patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  4.5, type: 'fairy', x: 156, y: -16, color: 'blue', path: 'turn-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  5.0, type: 'fairy', x: 120, y: -16, color: 'blue', path: 'turn-right', patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  5.0, type: 'fairy', x: 136, y: -16, color: 'blue', path: 'turn-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  5.5, type: 'fairy', x: 120, y: -16, color: 'blue', path: 'turn-right', patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  5.5, type: 'fairy', x: 136, y: -16, color: 'blue', path: 'turn-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  6.0, type: 'fairy', x: 120, y: -16, color: 'blue', path: 'turn-right', patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time:  6.0, type: 'fairy', x: 136, y: -16, color: 'blue', path: 'turn-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },


	// blue spirits descend from each side, stop, then leave downward
	{ time: 9.5, type: 'spirit', x:  64, y: -32, variant: 'blue', path: 'descend', patterns: [P.S2_BLUESPIRIT_ORB_CIRCLE_EASY, P.S2_BLUESPIRIT_ORB_CIRCLE_NORMAL, P.S2_BLUESPIRIT_VOLLEY_CIRCLE_HARD, P.S2_BLUESPIRIT_VOLLEY_CIRCLE_LUNA] },
	{ time: 9.5, type: 'spirit', x: 192, y: -32, variant: 'blue', path: 'descend', patterns: [P.S2_BLUESPIRIT_ORB_CIRCLE_EASY, P.S2_BLUESPIRIT_ORB_CIRCLE_NORMAL, P.S2_BLUESPIRIT_VOLLEY_CIRCLE_HARD, P.S2_BLUESPIRIT_VOLLEY_CIRCLE_LUNA] },
	
	{ time: 9.5,  type: 'fairy', x:  -16, y: 25, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 10.0, type: 'fairy', x:  -16, y: 30, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 10.5, type: 'fairy', x:  -16, y: 35, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 11.0, type: 'fairy', x:  -16, y: 40, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 11.5, type: 'fairy', x:  -16, y: 45, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 12.0, type: 'fairy', x:  -16, y: 50, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 12.5, type: 'fairy', x:  -16, y: 50, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 13.0, type: 'fairy', x:  -16, y: 50, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 13.5, type: 'fairy', x:  -16, y: 50, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 14.5, type: 'fairy', x:  -16, y: 50, color: 'blue', path: 'diagonal-left',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },

	{ time: 15.0, type: 'spirit', x:  34, y: -32, variant: 'blue', path: 'descend', patterns: [P.S2_BLUESPIRIT_ORB_CIRCLE_EASY, P.S2_BLUESPIRIT_ORB_CIRCLE_NORMAL, P.S2_BLUESPIRIT_VOLLEY_CIRCLE_HARD, P.S2_BLUESPIRIT_VOLLEY_CIRCLE_LUNA] },
	{ time: 15.0, type: 'spirit', x: 162, y: -32, variant: 'blue', path: 'descend', patterns: [P.S2_BLUESPIRIT_ORB_CIRCLE_EASY, P.S2_BLUESPIRIT_ORB_CIRCLE_NORMAL, P.S2_BLUESPIRIT_VOLLEY_CIRCLE_HARD, P.S2_BLUESPIRIT_VOLLEY_CIRCLE_LUNA] },
	
	{ time: 15.0, type: 'fairy', x: 272, y: 25, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 15.5, type: 'fairy', x: 272, y: 30, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 16.0, type: 'fairy', x: 272, y: 35, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 16.5, type: 'fairy', x: 272, y: 40, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 17.0, type: 'fairy', x: 272, y: 45, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 17.5, type: 'fairy', x: 272, y: 50, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 18.0, type: 'fairy', x: 272, y: 50, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 18.5, type: 'fairy', x: 272, y: 50, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 19.0, type: 'fairy', x: 272, y: 50, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },
	{ time: 19.5, type: 'fairy', x: 272, y: 50, color: 'blue', path: 'diagonal-right',  patterns: [P.S2_FAIRY_AIMED_CYAN_NORMAL, P.S2_FAIRY_AIMED_CYAN_HARD, P.S2_FAIRY_AIMED_CYAN_LUNA] },

	{ time: 60.0, type: 'spirit', x: -32, y: 60, variant: 'normal', path: 'passing-left' },
];

export const STAGE_2 = buildScript(RAW_STAGE_2);
