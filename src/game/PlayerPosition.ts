// Shared, frame-current player position. GameScene updates this every frame so
// bullets (e.g. tracking lasers) can read the latest player coords without
// threading the player through every update signature.
export const PlayerPosition = { x: 128, y: 240 };
