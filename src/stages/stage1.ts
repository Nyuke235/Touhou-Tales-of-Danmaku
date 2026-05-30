import { SpawnEventData, buildScript } from '../game/StageScript';
import { Patterns as P } from '../patterns/PatternLibrary';

const RAW_STAGE_1: SpawnEventData[] = [

	// Wave 1 – diagonal fairies left/right
	{ time:  3.0, type: 'fairy', x:  -16, y:  20, color: 'blue', path: 'diagonal-left', patterns: [P.S1_FAIRY_EASY, P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA]},
	{ time:  3.8, type: 'fairy', x:  -16, y:  30, color: 'blue', path: 'diagonal-left', patterns: [P.S1_FAIRY_EASY, P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time:  4.6, type: 'fairy', x:  -16, y:  40, color: 'blue', path: 'diagonal-left', patterns: [P.S1_FAIRY_EASY, P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time:  5.4, type: 'fairy', x:  -16, y:  50, color: 'blue', path: 'diagonal-left', patterns: [P.S1_FAIRY_EASY, P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },

	{ time:  7.0, type: 'fairy', x:  272, y:  20, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_EASY, P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time:  7.8, type: 'fairy', x:  272, y:  30, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_EASY, P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time:  8.6, type: 'fairy', x:  272, y:  40, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_EASY, P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time:  9.4, type: 'fairy', x:  272, y:  50, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_EASY, P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },

	// Wave 2 – spirit + mini-spirit following left
	{ time: 13.4, type: 'spirit',     x:  -32, y: 50, variant: 'normal', path: 'passing-left', patterns: [P.S1_SPIRIT_CIRCLE_NORMAL, P.S1_SPIRIT_CIRCLE_HARD, P.S1_SPIRIT_CIRCLE_LUNA, P.S1_SPIRIT_CIRCLE_NORMAL_2, P.S1_SPIRIT_CIRCLE_HARD_2, P.S1_SPIRIT_CIRCLE_LUNA_2, P.S1_SPIRAL_PURPLE_1, P.S1_SPIRAL_PURPLE_2] },
	{ time: 14.0, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 14.4, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 14.8, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 15.2, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 15.6, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 16.0, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 16.4, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 16.8, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 17.2, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 17.6, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 18.0, type: 'minispirit', x:  -32, y: 50, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },

	// Wave 3 – spirit + mini-spirit following right
	{ time: 20.0, type: 'spirit',     x:  288, y: 50, variant: 'normal', path: 'passing-right', patterns: [P.S1_SPIRIT_CIRCLE_NORMAL, P.S1_SPIRIT_CIRCLE_HARD, P.S1_SPIRIT_CIRCLE_LUNA, P.S1_SPIRIT_CIRCLE_NORMAL_2, P.S1_SPIRIT_CIRCLE_HARD_2, P.S1_SPIRIT_CIRCLE_LUNA_2, P.S1_SPIRAL_PURPLE_1, P.S1_SPIRAL_PURPLE_2] },
	{ time: 20.6, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 21.0, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 21.4, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 21.8, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 22.2, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 22.6, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 23.0, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 23.4, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 23.8, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 24.2, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 24.6, type: 'minispirit', x:  288, y: 50, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },

	// Wave 4 – moths
	{ time: 26.0, type: 'moth', x:  70, y: 310, path: 'flying-top', patterns: [P.S1_MOTH_ORB_EASY, P.S1_MOTH_ORB_NORMAL, P.S1_MOTH_ORB_HARD, P.S1_MOTH_ORB_LUNA, P.S1_MOTH_SIDE_LEFT_1_N, P.S1_MOTH_SIDE_LEFT_1_H, P.S1_MOTH_SIDE_LEFT_1_L, P.S1_MOTH_SIDE_RIGHT_1_N, P.S1_MOTH_SIDE_RIGHT_1_H, P.S1_MOTH_SIDE_RIGHT_1_L, P.S1_MOTH_SIDE_LEFT_2_N, P.S1_MOTH_SIDE_LEFT_2_H, P.S1_MOTH_SIDE_LEFT_2_L, P.S1_MOTH_SIDE_RIGHT_2_N, P.S1_MOTH_SIDE_RIGHT_2_H, P.S1_MOTH_SIDE_RIGHT_2_L] },
	{ time: 26.0, type: 'moth', x: 186, y: 310, path: 'flying-top', patterns: [P.S1_MOTH_ORB_EASY, P.S1_MOTH_ORB_NORMAL, P.S1_MOTH_ORB_HARD, P.S1_MOTH_ORB_LUNA, P.S1_MOTH_SIDE_LEFT_1_N, P.S1_MOTH_SIDE_LEFT_1_H, P.S1_MOTH_SIDE_LEFT_1_L, P.S1_MOTH_SIDE_RIGHT_1_N, P.S1_MOTH_SIDE_RIGHT_1_H, P.S1_MOTH_SIDE_RIGHT_1_L, P.S1_MOTH_SIDE_LEFT_2_N, P.S1_MOTH_SIDE_LEFT_2_H, P.S1_MOTH_SIDE_LEFT_2_L, P.S1_MOTH_SIDE_RIGHT_2_N, P.S1_MOTH_SIDE_RIGHT_2_H, P.S1_MOTH_SIDE_RIGHT_2_L] },

	// Wave 5 – crossing aerial fairies
	{ time: 29.4, type: 'fairy', x:  80, y: -16, color: 'blue', path: 'curve-right', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 29.4, type: 'fairy', x: 176, y: -16, color: 'red',  path: 'curve-left',  patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 29.8, type: 'fairy', x:  96, y: -16, color: 'red',  path: 'curve-left',  patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 29.8, type: 'fairy', x: 160, y: -16, color: 'blue', path: 'curve-right', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 30.2, type: 'fairy', x: 112, y: -16, color: 'blue', path: 'curve-right', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 30.2, type: 'fairy', x: 144, y: -16, color: 'red',  path: 'curve-left',  patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 30.6, type: 'fairy', x:  72, y: -16, color: 'red',  path: 'curve-right', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 30.6, type: 'fairy', x: 184, y: -16, color: 'blue', path: 'curve-left',  patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 31.2, type: 'fairy', x:  88, y: -16, color: 'blue', path: 'curve-left',  patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 31.2, type: 'fairy', x: 168, y: -16, color: 'red',  path: 'curve-right', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },

	// Wave 6 – crossing side fairies
	{ time: 33.0, type: 'fairy', x:  -16, y: 20, color: 'blue', path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 33.0, type: 'fairy', x:  272, y: 20, color: 'red',  path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 33.6, type: 'fairy', x:  -16, y: 35, color: 'red',  path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 33.6, type: 'fairy', x:  272, y: 35, color: 'blue', path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 34.2, type: 'fairy', x:  -16, y: 50, color: 'blue', path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 34.2, type: 'fairy', x:  272, y: 50, color: 'red',  path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 34.8, type: 'fairy', x:  -16, y: 25, color: 'red',  path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 34.8, type: 'fairy', x:  272, y: 25, color: 'blue', path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 35.4, type: 'fairy', x:  -16, y: 40, color: 'blue', path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 35.4, type: 'fairy', x:  272, y: 40, color: 'red',  path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 36.0, type: 'fairy', x:  -16, y: 55, color: 'red',  path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 36.0, type: 'fairy', x:  272, y: 55, color: 'blue', path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },

	// Wave 7 – symmetric double spirit + mini spirits following
	{ time: 38.0, type: 'spirit',     x:  -32, y: 50, variant: 'normal', path: 'passing-left', patterns: [P.S1_SPIRIT_CIRCLE_NORMAL, P.S1_SPIRIT_CIRCLE_HARD, P.S1_SPIRIT_CIRCLE_LUNA, P.S1_SPIRIT_CIRCLE_NORMAL_2, P.S1_SPIRIT_CIRCLE_HARD_2, P.S1_SPIRIT_CIRCLE_LUNA_2, P.S1_SPIRAL_PURPLE_1, P.S1_SPIRAL_PURPLE_2] },
	{ time: 38.0, type: 'spirit',     x:  288, y: 50, variant: 'normal', path: 'passing-right', patterns: [P.S1_SPIRIT_CIRCLE_NORMAL, P.S1_SPIRIT_CIRCLE_HARD, P.S1_SPIRIT_CIRCLE_LUNA, P.S1_SPIRIT_CIRCLE_NORMAL_2, P.S1_SPIRIT_CIRCLE_HARD_2, P.S1_SPIRIT_CIRCLE_LUNA_2, P.S1_SPIRAL_PURPLE_1, P.S1_SPIRAL_PURPLE_2] },
	{ time: 38.5, type: 'minispirit', x:  -32, y: 60, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 38.5, type: 'minispirit', x:  288, y: 60, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 38.9, type: 'minispirit', x:  -32, y: 70, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 38.9, type: 'minispirit', x:  288, y: 70, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 39.3, type: 'minispirit', x:  -32, y: 55, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 39.3, type: 'minispirit', x:  288, y: 55, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 39.7, type: 'minispirit', x:  -32, y: 65, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 39.7, type: 'minispirit', x:  288, y: 65, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 40.1, type: 'minispirit', x:  -32, y: 75, path: 'passing-left', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 40.1, type: 'minispirit', x:  288, y: 75, path: 'passing-right', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },

	// Wave 8 – top fairies + red/blue balls
	{ time: 43.0, type: 'fairy', x:  70, y: -16, color: 'red',  path: 'curve-right', patterns: [P.S1_SPREAD_BALL_RED_EN, P.S1_SPREAD_BALL_RED_H, P.S1_SPREAD_BALL_RED_L] },
	{ time: 43.0, type: 'fairy', x: 186, y: -16, color: 'blue', path: 'curve-left',  patterns: [P.S1_SPREAD_BALL_RED_EN, P.S1_SPREAD_BALL_RED_H, P.S1_SPREAD_BALL_RED_L] },
	{ time: 43.5, type: 'fairy', x:  90, y: -16, color: 'blue', path: 'curve-left',  patterns: [P.S1_STREAM_BLUE_NORMAL, P.S1_STREAM_BLUE_HARD, P.S1_STREAM_BLUE_LUNA] },
	{ time: 43.5, type: 'fairy', x: 166, y: -16, color: 'red',  path: 'curve-right', patterns: [P.S1_STREAM_BLUE_NORMAL, P.S1_STREAM_BLUE_HARD, P.S1_STREAM_BLUE_LUNA] },
	{ time: 44.0, type: 'fairy', x: 110, y: -16, color: 'red',  path: 'curve-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 44.0, type: 'fairy', x: 146, y: -16, color: 'blue', path: 'curve-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 44.5, type: 'fairy', x:  80, y: -16, color: 'blue', path: 'curve-right', patterns: [P.S1_STREAM_BLUE_NORMAL, P.S1_STREAM_BLUE_HARD, P.S1_STREAM_BLUE_LUNA] },
	{ time: 44.5, type: 'fairy', x: 176, y: -16, color: 'red',  path: 'curve-left',  patterns: [P.S1_STREAM_BLUE_NORMAL, P.S1_STREAM_BLUE_HARD, P.S1_STREAM_BLUE_LUNA] },

	// Wave 9 – moth + side fairies
	{ time: 47.0, type: 'moth', x: 206, y: 310, path: 'flying-top', patterns: [P.S1_MOTH_ORB_EASY, P.S1_MOTH_ORB_NORMAL, P.S1_MOTH_ORB_HARD, P.S1_MOTH_ORB_LUNA, P.S1_MOTH_SIDE_LEFT_1_N, P.S1_MOTH_SIDE_LEFT_1_H, P.S1_MOTH_SIDE_LEFT_1_L, P.S1_MOTH_SIDE_RIGHT_1_N, P.S1_MOTH_SIDE_RIGHT_1_H, P.S1_MOTH_SIDE_RIGHT_1_L, P.S1_MOTH_SIDE_LEFT_2_N, P.S1_MOTH_SIDE_LEFT_2_H, P.S1_MOTH_SIDE_LEFT_2_L, P.S1_MOTH_SIDE_RIGHT_2_N, P.S1_MOTH_SIDE_RIGHT_2_H, P.S1_MOTH_SIDE_RIGHT_2_L] },
	{ time: 47.0, type: 'fairy', x:  -16, y: 30, color: 'blue', path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 47.0, type: 'fairy', x:  272, y: 30, color: 'red',  path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 47.5, type: 'fairy', x:  -16, y: 45, color: 'red',  path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 47.5, type: 'fairy', x:  272, y: 45, color: 'blue', path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 48.0, type: 'fairy', x:  -16, y: 60, color: 'blue', path: 'diagonal-left',  patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },
	{ time: 48.0, type: 'fairy', x:  272, y: 60, color: 'red',  path: 'diagonal-right', patterns: [P.S1_AIMED_RICE, P.S1_SPREAD_RICE, P.S1_SPREAD_RICE_2, P.S1_SPREAD_RICE_3] },

	// Mid-boss: RumiaDark
	{ time: 54.0, type: 'rumiadark', x: 128, y: -16 },

	// Wave 10 – fairy rush from the right
	{ time: 55.0, type: 'fairy', x: 272, y: 10, color: 'red',  path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 55.0, type: 'fairy', x: 272, y: 28, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 55.3, type: 'fairy', x: 272, y: 15, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 55.3, type: 'fairy', x: 272, y: 42, color: 'red',  path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 55.6, type: 'fairy', x: 272, y: 25, color: 'red',  path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 55.6, type: 'fairy', x: 272, y: 55, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 55.9, type: 'fairy', x: 272, y: 18, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 55.9, type: 'fairy', x: 272, y: 38, color: 'red',  path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 56.2, type: 'fairy', x: 272, y: 12, color: 'red',  path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 56.2, type: 'fairy', x: 272, y: 48, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 56.5, type: 'fairy', x: 272, y: 32, color: 'blue', path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },
	{ time: 56.5, type: 'fairy', x: 272, y: 22, color: 'red',  path: 'diagonal-right', patterns: [P.S1_FAIRY_NORMAL, P.S1_FAIRY_HARD, P.S1_FAIRY_LUNA] },

	// Wave 11 – descending red fairies + mini-spirits (arrowheads)
	{ time: 59.5, type: 'fairy',      x:   8, y: -16, color: 'red', path: 'straight-down', patterns: [P.S1_ARROWHEAD_RED_RIGHT, P.S1_AIMED_RED] },
	{ time: 59.5, type: 'fairy',      x: 248, y: -16, color: 'red', path: 'straight-down', patterns: [P.S1_ARROWHEAD_RED_LEFT, P.S1_AIMED_RED] },
	{ time: 59.5, type: 'minispirit', x: -32, y:  50, path: 'passing-left', patterns: [P.S1_SPREAD_ARROWHEAD_BLUE_1, P.S1_SPREAD_ARROWHEAD_BLUE_2, P.S1_SPREAD_ARROWHEAD_BLUE_3] },
	{ time: 59.5, type: 'minispirit', x: -32, y:  68, path: 'passing-left', patterns: [P.S1_SPREAD_ARROWHEAD_BLUE_1, P.S1_SPREAD_ARROWHEAD_BLUE_2, P.S1_SPREAD_ARROWHEAD_BLUE_3] },
	{ time: 59.9, type: 'fairy',      x:  24, y: -16, color: 'red', path: 'straight-down', patterns: [P.S1_ARROWHEAD_RED_RIGHT, P.S1_AIMED_RED] },
	{ time: 59.9, type: 'fairy',      x: 232, y: -16, color: 'red', path: 'straight-down', patterns: [P.S1_ARROWHEAD_RED_LEFT, P.S1_AIMED_RED] },
	{ time: 59.9, type: 'minispirit', x: -32, y:  58, path: 'passing-left', patterns: [P.S1_SPREAD_ARROWHEAD_BLUE_1, P.S1_SPREAD_ARROWHEAD_BLUE_2, P.S1_SPREAD_ARROWHEAD_BLUE_3] },
	{ time: 60.3, type: 'fairy',      x:  42, y: -16, color: 'red', path: 'straight-down', patterns: [P.S1_ARROWHEAD_RED_RIGHT, P.S1_AIMED_RED] },
	{ time: 60.3, type: 'fairy',      x: 214, y: -16, color: 'red', path: 'straight-down', patterns: [P.S1_ARROWHEAD_RED_LEFT, P.S1_AIMED_RED] },
	{ time: 60.3, type: 'minispirit', x: -32, y:  44, path: 'passing-left', patterns: [P.S1_SPREAD_ARROWHEAD_BLUE_1, P.S1_SPREAD_ARROWHEAD_BLUE_2, P.S1_SPREAD_ARROWHEAD_BLUE_3] },
	{ time: 60.3, type: 'minispirit', x: -32, y:  62, path: 'passing-left', patterns: [P.S1_SPREAD_ARROWHEAD_BLUE_1, P.S1_SPREAD_ARROWHEAD_BLUE_2, P.S1_SPREAD_ARROWHEAD_BLUE_3] },

	// Wave 12 – moths
	{ time: 65.5, type: 'moth', x:  30, y: 310, path: 'flying-top', patterns: [P.S1_MOTH_ORB_EASY, P.S1_MOTH_ORB_NORMAL, P.S1_MOTH_ORB_HARD, P.S1_MOTH_ORB_LUNA, P.S1_MOTH_SIDE_LEFT_1_N, P.S1_MOTH_SIDE_LEFT_1_H, P.S1_MOTH_SIDE_LEFT_1_L, P.S1_MOTH_SIDE_RIGHT_1_N, P.S1_MOTH_SIDE_RIGHT_1_H, P.S1_MOTH_SIDE_RIGHT_1_L, P.S1_MOTH_SIDE_LEFT_2_N, P.S1_MOTH_SIDE_LEFT_2_H, P.S1_MOTH_SIDE_LEFT_2_L, P.S1_MOTH_SIDE_RIGHT_2_N, P.S1_MOTH_SIDE_RIGHT_2_H, P.S1_MOTH_SIDE_RIGHT_2_L] },
	{ time: 65.5, type: 'moth', x: 226, y: 310, path: 'flying-top', patterns: [P.S1_MOTH_ORB_EASY, P.S1_MOTH_ORB_NORMAL, P.S1_MOTH_ORB_HARD, P.S1_MOTH_ORB_LUNA, P.S1_MOTH_SIDE_LEFT_1_N, P.S1_MOTH_SIDE_LEFT_1_H, P.S1_MOTH_SIDE_LEFT_1_L, P.S1_MOTH_SIDE_RIGHT_1_N, P.S1_MOTH_SIDE_RIGHT_1_H, P.S1_MOTH_SIDE_RIGHT_1_L, P.S1_MOTH_SIDE_LEFT_2_N, P.S1_MOTH_SIDE_LEFT_2_H, P.S1_MOTH_SIDE_LEFT_2_L, P.S1_MOTH_SIDE_RIGHT_2_N, P.S1_MOTH_SIDE_RIGHT_2_H, P.S1_MOTH_SIDE_RIGHT_2_L] },

	// Wave 13 – top blue fairies (streams)
	{ time: 69.5, type: 'fairy', x:  64, y: -16, color: 'blue', path: 'straight-down', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 69.5, type: 'fairy', x: 128, y: -16, color: 'blue', path: 'straight-down', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 69.5, type: 'fairy', x: 192, y: -16, color: 'blue', path: 'straight-down', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 69.9, type: 'fairy', x:  96, y: -16, color: 'blue', path: 'straight-down', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 69.9, type: 'fairy', x: 160, y: -16, color: 'blue', path: 'straight-down', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 71.3, type: 'fairy', x:  48, y: -16, color: 'blue', path: 'straight-down', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },
	{ time: 71.3, type: 'fairy', x: 208, y: -16, color: 'blue', path: 'straight-down', patterns: [P.S1_FAIRY_PURPLE_BURST_BRAKE_ENH, P.S1_FAIRY_PURPLE_BURST_BRAKE_L, P.S1_FAIRY_ORB_BURST] },

	// Wave 14 – 2 crossing spirits + mini-spirit rain 
	{ time: 72.5, type: 'spirit',     x:  -32, y: 45, variant: 'normal', path: 'passing-left', patterns: [P.S1_SPIRIT_CIRCLE_NORMAL, P.S1_SPIRIT_CIRCLE_HARD, P.S1_SPIRIT_CIRCLE_LUNA, P.S1_SPIRIT_CIRCLE_NORMAL_2, P.S1_SPIRIT_CIRCLE_HARD_2, P.S1_SPIRIT_CIRCLE_LUNA_2, P.S1_SPIRAL_PURPLE_1, P.S1_SPIRAL_PURPLE_2] },
	{ time: 72.9, type: 'spirit',     x:  288, y: 65, variant: 'normal', path: 'passing-right', patterns: [P.S1_SPIRIT_CIRCLE_NORMAL, P.S1_SPIRIT_CIRCLE_HARD, P.S1_SPIRIT_CIRCLE_LUNA, P.S1_SPIRIT_CIRCLE_NORMAL_2, P.S1_SPIRIT_CIRCLE_HARD_2, P.S1_SPIRIT_CIRCLE_LUNA_2, P.S1_SPIRAL_PURPLE_1, P.S1_SPIRAL_PURPLE_2] },
	{ time: 72.5, type: 'minispirit', x:   38, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 72.7, type: 'minispirit', x:  197, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 72.9, type: 'minispirit', x:   74, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 73.1, type: 'minispirit', x:  221, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 73.3, type: 'minispirit', x:  112, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 73.5, type: 'minispirit', x:   21, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 73.7, type: 'minispirit', x:  163, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 73.9, type: 'minispirit', x:   56, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 74.1, type: 'minispirit', x:  234, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 74.3, type: 'minispirit', x:   91, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 74.5, type: 'minispirit', x:  148, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 74.7, type: 'minispirit', x:   14, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 74.9, type: 'minispirit', x:  209, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 75.1, type: 'minispirit', x:   67, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 75.3, type: 'minispirit', x:  182, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 75.5, type: 'minispirit', x:  128, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 75.7, type: 'minispirit', x:   43, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 75.9, type: 'minispirit', x:  240, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 76.1, type: 'minispirit', x:   99, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },
	{ time: 76.3, type: 'minispirit', x:  172, y: -16, path: 'straight-down', patterns: [P.S1_ACCEL_NORMAL, P.S1_ACCEL_HARD, P.S1_ACCEL_LUNA] },

	// Wave 15 – red spirits in a spiral
	{ time: 78.5, type: 'spirit', x:  -32, y: 52, variant: 'red', path: 'passing-left',  patterns: [P.S1_SPIRAL_BALL_RED_1, P.S1_SPIRAL_BALL_RED_2, P.S1_SPIRAL_BALL_RED_3, P.S1_RED_SPIRIT_BONUS] },
	{ time: 83.5, type: 'spirit', x:  288, y: 52, variant: 'red', path: 'passing-right', patterns: [P.S1_SPIRAL_BALL_RED_1, P.S1_SPIRAL_BALL_RED_2, P.S1_SPIRAL_BALL_RED_3, P.S1_RED_SPIRIT_BONUS] },

	// Final boss: Rumia 
	{ time: 89.0, type: 'rumia', x: 128, y: -16 },
];

export const STAGE_1 = buildScript(RAW_STAGE_1);
