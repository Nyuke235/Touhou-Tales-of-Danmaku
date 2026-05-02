import { SpawnEventData, buildScript } from '../game/StageScript';

const RAW_STAGE_3: SpawnEventData[] = [
	{ time: 5.0, type: 'bubblefairy', x: -16, y: 60, path: 'pass-right' },

	{ time: 85.0, type: 'bubblefairy', x: -16, y: 60, path: 'pass-right' },
];

export const STAGE_3 = buildScript(RAW_STAGE_3);
