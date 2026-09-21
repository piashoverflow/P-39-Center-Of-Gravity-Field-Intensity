export const G_UNIVERSAL = 6.67430e-11;
export const R_EARTH_KM = 6371;

export function fmtNum(val: number, decimals: number = 2): string {
  if (!isFinite(val)) return '0.00';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtSci(val: number, decimals: number = 2): string {
  if (!isFinite(val) || val === 0) return '0.00';
  const exponent = Math.floor(Math.log10(Math.abs(val)));
  const mantissa = val / Math.pow(10, exponent);
  return `${mantissa.toFixed(decimals)} × 10^{${exponent}}`;
}

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  label?: string,
  headLen: number = 10
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  const length = Math.hypot(dx, dy);

  if (length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * Math.cos(angle - Math.PI / 6),
    toY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLen * Math.cos(angle + Math.PI / 6),
    toY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  if (label) {
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillStyle = color;
    const midX = (fromX + toX) / 2 + Math.cos(angle + Math.PI / 2) * 12;
    const midY = (fromY + toY) / 2 + Math.sin(angle + Math.PI / 2) * 12;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, midX, midY);
  }
  ctx.restore();
}

// Calculate Center of Gravity yCG in non-uniform field g(y) = g0 * R^2 / (R+y)^2
export function calculateYCG(H: number, R: number = R_EARTH_KM): number {
  if (H <= 0) return 0;
  const x = H / R;
  // Analytical integration of integral(y/(R+y)^2 dy) / integral(1/(R+y)^2 dy)
  // = R * ( (1 + x) * ln(1 + x) - x ) / x
  const term1 = (1 + x) * Math.log(1 + x) - x;
  const yCG = (R * term1) / x;
  return yCG;
}
