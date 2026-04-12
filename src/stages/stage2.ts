import { SpawnEventData, buildScript } from '../game/StageScript';

const RAW_STAGE_2: SpawnEventData[] = [



	{ time: 60.0, type: 'spirit', x: -32, y: 60, variant: 'normal', path: 'passing-left' },
];

export const STAGE_2 = buildScript(RAW_STAGE_2);
