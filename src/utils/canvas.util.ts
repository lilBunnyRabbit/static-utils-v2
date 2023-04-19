export function drawHollowRect(
  ctx: CanvasRenderingContext2D,
  limits: Record<"top" | "left" | "bottom" | "right", number>
) {
  const { top, left, right, bottom } = limits;

  ctx.beginPath();

  ctx.moveTo(0, 0);
  ctx.lineTo(ctx.canvas.width, 0);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
  ctx.lineTo(0, ctx.canvas.height);
  ctx.lineTo(0, 0);
  ctx.closePath();

  ctx.moveTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.lineTo(right, top);
  ctx.lineTo(left, top);
  ctx.closePath();

  ctx.fill();
}
