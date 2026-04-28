export function drawFreezeAura(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	radius: number
): void {
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.strokeStyle = 'rgba(120, 220, 255, 0.25)';
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.fillStyle = 'rgba(80, 180, 255, 0.08)';
	ctx.fill();
	ctx.restore();
}
