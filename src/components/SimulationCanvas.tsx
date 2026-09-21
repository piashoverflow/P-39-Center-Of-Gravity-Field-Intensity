import React, { useRef, useEffect } from 'react';
import { P39Mode, FieldGridParams, NullPointParams, CgCmParams, SuperpositionParams } from '../types';

interface SimulationCanvasProps {
  mode: P39Mode;
  isRunning: boolean;
  speed: number;
  fieldParams: FieldGridParams;
  nullParams: NullPointParams;
  cgCmParams: CgCmParams;
  superParams: SuperpositionParams;
  time: number;
  setTime: (updater: (prev: number) => number) => void;
  lang: 'en' | 'bn';
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  mode,
  isRunning,
  speed,
  fieldParams,
  nullParams,
  cgCmParams,
  superParams,
  time,
  setTime,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Positions for draggable masses in field mode
  const m1Pos = useRef({ x: 280, y: 270 });
  const m2Pos = useRef({ x: 580, y: 270 });
  const activeDrag = useRef<'m1' | 'm2' | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1) * speed;
      lastTime = now;

      if (isRunning) {
        setTime((t) => t + dt);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark Cosmic Canvas
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#060714');
      bgGrad.addColorStop(1, '#0c0f24');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 73 + 19) % width;
        const sy = (i * 47 + 31) % height;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      if (mode === 'field_vector_grid') {
        renderFieldGrid(ctx, width, height, fieldParams, lang, m1Pos.current, m2Pos.current);
      } else if (mode === 'null_point_hunter') {
        renderNullPointHunter(ctx, width, height, nullParams, lang);
      } else if (mode === 'cg_vs_cm_divergence') {
        renderCgVsCm(ctx, width, height, cgCmParams, lang);
      } else if (mode === 'superposition_principle') {
        renderSuperposition(ctx, width, height, superParams, lang);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, isRunning, speed, fieldParams, nullParams, cgCmParams, superParams, time, lang, setTime]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'field_vector_grid') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (Math.hypot(x - m1Pos.current.x, y - m1Pos.current.y) < 30) activeDrag.current = 'm1';
    else if (Math.hypot(x - m2Pos.current.x, y - m2Pos.current.y) < 30) activeDrag.current = 'm2';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeDrag.current || mode !== 'field_vector_grid') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(50, Math.min(canvas.width - 50, ((e.clientX - rect.left) / rect.width) * canvas.width));
    const y = Math.max(50, Math.min(canvas.height - 50, ((e.clientY - rect.top) / rect.height) * canvas.height));

    if (activeDrag.current === 'm1') m1Pos.current = { x, y };
    else if (activeDrag.current === 'm2') m2Pos.current = { x, y };
  };

  const handleMouseUp = () => {
    activeDrag.current = null;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={860}
        height={540}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full max-w-4xl h-auto rounded-2xl shadow-2xl border border-slate-800 bg-[#070919] cursor-crosshair"
      />
    </div>
  );
};

// =========================================================================
// MODE 1: FIELD VECTOR GRID
// =========================================================================
function renderFieldGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: FieldGridParams,
  lang: 'en' | 'bn',
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  // Title
  ctx.fillStyle = '#818cf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'মহাকর্ষীয় ক্ষেত্র প্রাবল্যের ভেক্টর গ্রিড: E = -GM/r² r̂'
      : "Gravitational Field Intensity Vector Grid: E = -GM/r² r̂",
    width / 2,
    30
  );

  const step = p.gridResolution; // grid spacing px (e.g. 35)
  const GM1 = p.m1 * 3000;
  const GM2 = p.m2 * 3000;

  // Render Vector Field Grid
  for (let x = 30; x < width - 30; x += step) {
    for (let y = 50; y < height - 70; y += step) {
      const dx1 = p1.x - x;
      const dy1 = p1.y - y;
      const r1Sq = dx1 * dx1 + dy1 * dy1;
      const r1 = Math.sqrt(r1Sq);

      const dx2 = p2.x - x;
      const dy2 = p2.y - y;
      const r2Sq = dx2 * dx2 + dy2 * dy2;
      const r2 = Math.sqrt(r2Sq);

      if (r1 < 22 || r2 < 22) continue; // inside mass

      // Net field vector
      const e1 = GM1 / Math.max(r1Sq, 100);
      const e2 = GM2 / Math.max(r2Sq, 100);

      const ex = (e1 * dx1) / r1 + (e2 * dx2) / r2;
      const ey = (e1 * dy1) / r1 + (e2 * dy2) / r2;
      const eMag = Math.hypot(ex, ey);

      // Arrow length capped
      const arrowLen = Math.min(Math.max(eMag * 0.7, 4), step * 0.85);
      const dirX = ex / (eMag || 1);
      const dirY = ey / (eMag || 1);

      // Intensity Color: faint purple to vibrant cyan
      const alpha = Math.min(Math.max(eMag * 0.04, 0.15), 0.85);
      ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
      ctx.lineWidth = 1.3;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dirX * arrowLen, y + dirY * arrowLen);
      ctx.stroke();

      // Dot arrow head
      ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x + dirX * arrowLen, y + dirY * arrowLen, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw Mass 1
  drawCelestialMass(ctx, p1.x, p1.y, p.m1, 'M₁', '#6366f1', '#4338ca');
  // Draw Mass 2
  drawCelestialMass(ctx, p2.x, p2.y, p.m2, 'M₂', '#ec4899', '#be185d');

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.1, height - 60, width * 0.8, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'প্রতিটি বিন্দুতে তীরচিহ্ন মহাকর্ষীয় প্রাবল্যের দিক ও দৈর্ঘ্য তীব্রতা নির্দেশ করে (M₁ ও M₂ ড্র্যাগ করুন)'
      : 'Vector arrows denote field direction toward masses; arrow length denotes field intensity E (Drag M₁ or M₂)',
    width * 0.12,
    height - 32
  );
}

function drawCelestialMass(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  massVal: number,
  label: string,
  c1: string,
  c2: string
) {
  const r = Math.max(16, Math.min(32, Math.sqrt(massVal) * 4));
  const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 4);
  ctx.fillText(`${massVal} × 10²⁴ kg`, x, y + r + 15);
}

// =========================================================================
// MODE 2: NULL POINT (NEUTRAL POINT / LAGRANGE L1) HUNTER
// =========================================================================
function renderNullPointHunter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: NullPointParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'নিরপেক্ষ বিন্দু (Null Point / Lagrange L1): E_net = E₁ - E₂ = 0'
      : "Gravitational Neutral / Null Point: E_net = E₁ - E₂ = 0 (Lagrange Point L1)",
    width / 2,
    30
  );

  const leftX = width * 0.18;
  const rightX = width * 0.82;
  const axisY = height * 0.46;
  const lineLen = rightX - leftX;

  // Earth (Left) & Moon (Right)
  const m1 = p.m1Ratio; // 81
  const m2 = p.m2Ratio; // 1

  // Mathematical Null Point distance from Earth:
  // E1 = E2 => G*M1 / x^2 = G*M2 / (d - x)^2 => x / (d - x) = sqrt(M1/M2)
  const ratioSqrt = Math.sqrt(m1 / m2); // sqrt(81) = 9
  const nullFrac = ratioSqrt / (1 + ratioSqrt); // 9 / 10 = 0.9
  const nullPointX = leftX + nullFrac * lineLen;

  // Current probe position from parameter
  const probeFrac = Math.min(Math.max(p.testMassDisplaced, 0.05), 0.95);
  const probeX = leftX + probeFrac * lineLen;

  // Distances in km
  const totalD = p.totalDistanceKm;
  const d1Km = probeFrac * totalD;
  const d2Km = (1 - probeFrac) * totalD;

  // Field intensities (normalized)
  const e1Mag = (m1 / Math.pow(d1Km / 1000, 2)) * 1e5;
  const e2Mag = (m2 / Math.pow(d2Km / 1000, 2)) * 1e5;
  const isNull = Math.abs(probeX - nullPointX) < 8;

  // Draw Connecting Axis
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(leftX, axisY);
  ctx.lineTo(rightX, axisY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Earth (Left)
  const earthGrad = ctx.createRadialGradient(leftX, axisY, 4, leftX, axisY, 28);
  earthGrad.addColorStop(0, '#60a5fa');
  earthGrad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = earthGrad;
  ctx.beginPath();
  ctx.arc(leftX, axisY, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Earth (M₁)', leftX, axisY + 4);
  ctx.fillText('Mass: 81 M_m', leftX, axisY + 44);

  // Draw Moon (Right)
  const moonGrad = ctx.createRadialGradient(rightX, axisY, 2, rightX, axisY, 14);
  moonGrad.addColorStop(0, '#e2e8f0');
  moonGrad.addColorStop(1, '#64748b');
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(rightX, axisY, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Moon (M₂)', rightX, axisY + 4);
  ctx.fillText('Mass: 1 M_m', rightX, axisY + 30);

  // Draw Null Point Marker on axis
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(nullPointX, axisY - 18);
  ctx.lineTo(nullPointX, axisY + 18);
  ctx.stroke();
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 10px "JetBrains Mono", monospace';
  ctx.fillText('Null Point (L1)', nullPointX, axisY - 24);
  ctx.fillText(`0.90 d`, nullPointX, axisY + 30);

  // Draw Test Probe
  ctx.fillStyle = isNull ? '#22c55e' : '#f59e0b';
  ctx.beginPath();
  ctx.arc(probeX, axisY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (isNull) {
    // Glowing ring
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(probeX, axisY, 18, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw Vector Arrows at Probe
  // E1 vector pointing Left (towards Earth)
  const e1ArrowLen = Math.min(e1Mag * 0.4, 100);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(probeX, axisY - 2);
  ctx.lineTo(probeX - e1ArrowLen, axisY - 2);
  ctx.stroke();
  ctx.fillStyle = '#60a5fa';
  ctx.fillText('E₁ (Earth)', probeX - e1ArrowLen / 2, axisY - 12);

  // E2 vector pointing Right (towards Moon)
  const e2ArrowLen = Math.min(e2Mag * 0.4, 100);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(probeX, axisY + 2);
  ctx.lineTo(probeX + e2ArrowLen, axisY + 2);
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('E₂ (Moon)', probeX + e2ArrowLen / 2, axisY + 18);

  // Bottom HUD
  ctx.fillStyle = isNull ? 'rgba(34, 197, 94, 0.2)' : 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = isNull ? '#22c55e' : '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 76, width * 0.84, 62, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isNull ? '#4ade80' : '#38bdf8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    `Probe: ${(d1Km).toFixed(0)} km from Earth  |  ${(d2Km).toFixed(0)} km from Moon  |  Ratio: ${(d1Km / d2Km).toFixed(2)} : 1`,
    width * 0.1,
    height - 50
  );

  ctx.fillStyle = '#f8fafc';
  ctx.font = '11px "Space Grotesk", sans-serif';
  if (isNull) {
    ctx.fillText(
      lang === 'bn'
        ? '🎯 নিরপেক্ষ বিন্দু অর্জিত! এখানে পৃথিবী ও চাঁদের মহাকর্ষ বলরেখা সমান ও বিপরীতমুখী হওয়ায় নিট প্রাবল্য E_net = 0।'
        : '🎯 Null Point Acquired! Gravitational fields from Earth and Moon are equal and opposite: E_net = 0.',
      width * 0.1,
      height - 28
    );
  } else {
    ctx.fillText(
      lang === 'bn'
        ? `নিট ক্ষেত্র প্রাবল্য: |E_net| = |E₁ - E₂| ≠ 0 (স্লাইডার সরিয়ে নিরপেক্ষ বিন্দু অনুসন্ধান করুন)`
        : `Net Field Intensity: |E_net| = |E₁ - E₂| ≠ 0 (Move slider to reach zero-gravity balance)`,
      width * 0.1,
      height - 28
    );
  }
}

// =========================================================================
// MODE 3: CG VS CM DIVERGENCE IN NON-UNIFORM GRAVITY
// =========================================================================
function renderCgVsCm(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: CgCmParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'ভারকেন্দ্র (CG) বনাম ভরকেন্দ্র (CM): অসম মহাকর্ষীয় ক্ষেত্রে CG সর্বদা CM-এর নিচে থাকে'
      : "Center of Gravity (CG) vs. Center of Mass (CM) Divergence in Non-Uniform Gravity",
    width / 2,
    30
  );

  const baseX = width * 0.35;
  const earthGroundY = height * 0.82;
  const towerH_px = 300;
  const towerW_px = 50;

  // Draw Earth Surface Arc
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(baseX, earthGroundY + 1200, 1200, -Math.PI * 0.6, -Math.PI * 0.4);
  ctx.stroke();

  // Mega-structure Tower (e.g. Space Elevator Tower 1000 km)
  ctx.fillStyle = 'rgba(79, 70, 229, 0.25)';
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(baseX - towerW_px / 2, earthGroundY - towerH_px, towerW_px, towerH_px, 6);
  ctx.fill();
  ctx.stroke();

  // Mathematical Positions:
  // CM for uniform vertical rod: z_cm = H / 2
  const H_km = p.structureHeightKm;
  const R_km = p.earthRadiusKm;
  const z_cm_km = H_km / 2;

  // CG: z_cg = \int z * g(z) dz / \int g(z) dz where g(z) = g0 * R^2 / (R + z)^2
  // Integral 1: \int_0^H z / (R+z)^2 dz = ln(1 + H/R) - H/(R+H)
  // Integral 2: \int_0^H 1 / (R+z)^2 dz = 1/R - 1/(R+H) = H / (R*(R+H))
  // => z_cg = R * [ (1 + R/H) ln(1 + H/R) - 1 ]
  const eta = H_km / R_km;
  const z_cg_km = R_km * ((1 + 1 / eta) * Math.log(1 + eta) - 1);

  const deltaZ_km = z_cm_km - z_cg_km;

  // Pixel mapping from ground (0) to top (towerH_px)
  const cmPxY = earthGroundY - (z_cm_km / H_km) * towerH_px;
  const cgPxY = earthGroundY - (z_cg_km / H_km) * towerH_px;

  // Draw CM Marker (Blue)
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(baseX, cmPxY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`CM (ভরকেন্দ্র): ${z_cm_km.toFixed(1)} km`, baseX + 34, cmPxY + 4);

  // Draw CG Marker (Gold)
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(baseX, cgPxY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillText(`CG (ভারকেন্দ্র): ${z_cg_km.toFixed(1)} km`, baseX + 34, cgPxY + 4);

  // Vertical offset connector between CM and CG
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(baseX - 35, cmPxY);
  ctx.lineTo(baseX - 35, cgPxY);
  ctx.stroke();
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f43f5e';
  ctx.fillText(`Δz = ${deltaZ_km.toFixed(1)} km`, baseX - 42, (cmPxY + cgPxY) / 2 + 4);

  // Right Side Derivation Card
  const cardX = width * 0.65;
  const cardY = 80;
  const cardW = width * 0.32;
  const cardH = 340;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(lang === 'bn' ? 'তত্ত্বীয় ব্যাখ্যা:' : 'Theoretical Insight:', cardX + 16, cardY + 28);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px "JetBrains Mono", monospace';
  const infoLines = [
    `Tower Height H:`,
    `${H_km} km`,
    ``,
    `Center of Mass (CM):`,
    `z_cm = H / 2 = ${z_cm_km.toFixed(1)} km`,
    `(Geometric Centroid)`,
    ``,
    `Center of Gravity (CG):`,
    `z_cg = ${z_cg_km.toFixed(1)} km`,
    ``,
    `Vertical Divergence:`,
    `Δz = ${(deltaZ_km).toFixed(2)} km`,
    ``,
    `Since g(z) ∝ 1/(R+z)²:`,
    `Lower section is heavier,`,
    `pulling CG downward!`,
  ];

  infoLines.forEach((l, i) => {
    ctx.fillText(l, cardX + 16, cardY + 54 + i * 16);
  });

  // Bottom note
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#eab308';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'উপসংহার: সুষম মহাকর্ষীয় ক্ষেত্রে CG ও CM হুবহু একই বিন্দুতে থাকে। কিন্তু অসীম বা মেগা-স্ট্রাকচারে মহাকর্ষের অসমতার কারণে CG নিচে অবস্থান করে।'
      : "Conclusion: In uniform gravity, CG and CM strictly coincide. In a non-uniform inverse-square field, CG always lies below CM.",
    width * 0.1,
    height - 32
  );
}

// =========================================================================
// MODE 4: SUPERPOSITION PRINCIPLE
// =========================================================================
function renderSuperposition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: SuperpositionParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'মহাকর্ষীয় ক্ষেত্র উপরিলেপন নীতি: E_net = E₁ + E₂ + E₃ (ভেক্টর যোগফল)'
      : "Principle of Superposition: E_net = E₁ + E₂ + E₃ (Vector Addition)",
    width / 2,
    30
  );

  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const triangleR = 140;

  // 3 Masses in Equilateral Triangle
  const mNodes = [
    { angle: -Math.PI / 2, label: 'M₁', color: '#6366f1' },
    { angle: -Math.PI / 2 + (2 * Math.PI) / 3, label: 'M₂', color: '#ec4899' },
    { angle: -Math.PI / 2 + (4 * Math.PI) / 3, label: 'M₃', color: '#22c55e' },
  ];

  // Draw Triangle perimeter
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  mNodes.forEach((node, i) => {
    const x = centerX + triangleR * Math.cos(node.angle);
    const y = centerY + triangleR * Math.sin(node.angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Masses
  mNodes.forEach((node) => {
    const x = centerX + triangleR * Math.cos(node.angle);
    const y = centerY + triangleR * Math.sin(node.angle);

    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.label, x, y + 4);
  });

  // Test Mass at Center or displaced by probeAngleDeg
  const probeDist = 35;
  const rad = (p.probeAngleDeg * Math.PI) / 180;
  const probeX = centerX + probeDist * Math.cos(rad);
  const probeY = centerY + probeDist * Math.sin(rad);

  // Compute 3 Field Vectors at Probe
  let netEx = 0;
  let netEy = 0;

  mNodes.forEach((node) => {
    const mx = centerX + triangleR * Math.cos(node.angle);
    const my = centerY + triangleR * Math.sin(node.angle);

    const dx = mx - probeX;
    const dy = my - probeY;
    const dist = Math.hypot(dx, dy);

    const eMag = (p.massValue * 4000) / (dist * dist);
    const ex = (eMag * dx) / dist;
    const ey = (eMag * dy) / dist;

    netEx += ex;
    netEy += ey;

    // Draw individual component vector arrow
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(probeX, probeY);
    ctx.lineTo(probeX + ex * 1.5, probeY + ey * 1.5);
    ctx.stroke();
  });

  // Draw Resultant Vector E_net (Gold)
  const netMag = Math.hypot(netEx, netEy);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(probeX, probeY);
  ctx.lineTo(probeX + netEx * 1.5, probeY + netEy * 1.5);
  ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(probeX + netEx * 1.5, probeY + netEy * 1.5, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText(`E_net`, probeX + netEx * 1.5 + 10, probeY + netEy * 1.5);

  // Draw Probe
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(probeX, probeY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.1, height - 60, width * 0.8, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    `E₁ (Indigo) + E₂ (Pink) + E₃ (Green) = E_net (Gold: |E| = ${netMag.toFixed(2)} N/kg)`,
    width * 0.12,
    height - 34
  );
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    lang === 'bn'
      ? 'উপরিলেপন নীতি প্রমাণ: একাধিক ভরের জন্য কোনো বিন্দুতে নিট প্রাবল্য হলো প্রতিটি ভরের পৃথক প্রাবল্যের ভেক্টর যোগফল।'
      : 'Superposition Law: Net field intensity is the strict vector sum of individual gravitational fields.',
    width * 0.12,
    height - 18
  );
}
