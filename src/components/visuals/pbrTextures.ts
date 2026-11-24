import * as THREE from 'three';

export interface HardwareTextureSet {
  brushedMetal: THREE.CanvasTexture;
  knurledMetal: THREE.CanvasTexture;
  perforatedAlbedo: THREE.CanvasTexture;
  perforatedBump: THREE.CanvasTexture;
  solarAlbedo: THREE.CanvasTexture;
  solarRoughness: THREE.CanvasTexture;
  opticalCoating: THREE.CanvasTexture;
  oledScreen: THREE.CanvasTexture;
  // Hyperrealistic micro-detail & device UI maps
  beadBlastedBump: THREE.CanvasTexture;
  radialLatheBump: THREE.CanvasTexture;
  lensOpticsPro: THREE.CanvasTexture;
  rj45BankAlbedo: THREE.CanvasTexture;
  rj45BankBump: THREE.CanvasTexture;
  switchOledTex: THREE.CanvasTexture;
  inverterOledTex: THREE.CanvasTexture;
  radioLcdTex: THREE.CanvasTexture;
  biometricUiTex: THREE.CanvasTexture;
  softShadowAO: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function createHardwareTextureSet(): HardwareTextureSet {
  // 1. Directional CNC Brushed Anodized Metal
  const [bCanvas, bCtx] = makeCanvas(512, 512);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y++) {
    const shade = 114 + Math.floor(Math.random() * 28);
    bCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
    bCtx.fillRect(0, y, 512, 1);
  }
  for (let i = 0; i < 800; i++) {
    const y = Math.floor(Math.random() * 512);
    const x = Math.floor(Math.random() * 440);
    const w = 18 + Math.floor(Math.random() * 75);
    const v = Math.random() > 0.5 ? 156 : 98;
    bCtx.fillStyle = `rgba(${v},${v},${v},0.35)`;
    bCtx.fillRect(x, y, w, 1);
  }
  const brushedMetal = new THREE.CanvasTexture(bCanvas);
  brushedMetal.wrapS = THREE.RepeatWrapping;
  brushedMetal.wrapT = THREE.RepeatWrapping;
  brushedMetal.repeat.set(2, 2);
  brushedMetal.colorSpace = THREE.NoColorSpace;

  // 2. Diamond Crosshatch CNC Knurling
  const [kCanvas, kCtx] = makeCanvas(512, 512);
  kCtx.fillStyle = '#2a2a2a';
  kCtx.fillRect(0, 0, 512, 512);
  kCtx.strokeStyle = '#e5e5e5';
  kCtx.lineWidth = 5;
  const step = 16;
  for (let i = -512; i < 1024; i += step) {
    kCtx.beginPath();
    kCtx.moveTo(i, 0);
    kCtx.lineTo(i + 512, 512);
    kCtx.stroke();

    kCtx.beginPath();
    kCtx.moveTo(i, 512);
    kCtx.lineTo(i + 512, 0);
    kCtx.stroke();
  }
  const knurledMetal = new THREE.CanvasTexture(kCanvas);
  knurledMetal.wrapS = THREE.RepeatWrapping;
  knurledMetal.wrapT = THREE.RepeatWrapping;
  knurledMetal.repeat.set(6, 1.5);
  knurledMetal.colorSpace = THREE.NoColorSpace;

  // 3. Staggered Hexagonal Micro-Perforated Acoustic / Airflow Grille
  const [paCanvas, paCtx] = makeCanvas(512, 512);
  const [pbCanvas, pbCtx] = makeCanvas(512, 512);
  paCtx.fillStyle = '#1b1c20';
  paCtx.fillRect(0, 0, 512, 512);
  pbCtx.fillStyle = '#dcdcdc';
  pbCtx.fillRect(0, 0, 512, 512);

  const pitch = 18;
  for (let row = 0; row < 512 / pitch + 1; row++) {
    const y = row * pitch;
    const xOff = row % 2 === 0 ? 0 : pitch / 2;
    for (let col = -1; col < 512 / pitch + 1; col++) {
      const x = col * pitch + xOff;
      paCtx.fillStyle = '#2d2f36';
      paCtx.beginPath();
      paCtx.arc(x, y, 5.8, 0, Math.PI * 2);
      paCtx.fill();

      paCtx.fillStyle = '#040406';
      paCtx.beginPath();
      paCtx.arc(x, y, 4.5, 0, Math.PI * 2);
      paCtx.fill();

      pbCtx.fillStyle = '#080808';
      pbCtx.beginPath();
      pbCtx.arc(x, y, 5.2, 0, Math.PI * 2);
      pbCtx.fill();
    }
  }
  const perforatedAlbedo = new THREE.CanvasTexture(paCanvas);
  perforatedAlbedo.wrapS = THREE.RepeatWrapping;
  perforatedAlbedo.wrapT = THREE.RepeatWrapping;
  perforatedAlbedo.repeat.set(3, 3);
  perforatedAlbedo.colorSpace = THREE.SRGBColorSpace;
  perforatedAlbedo.anisotropy = 8;

  const perforatedBump = new THREE.CanvasTexture(pbCanvas);
  perforatedBump.wrapS = THREE.RepeatWrapping;
  perforatedBump.wrapT = THREE.RepeatWrapping;
  perforatedBump.repeat.set(3, 3);
  perforatedBump.colorSpace = THREE.NoColorSpace;

  // 4. Monocrystalline Half-Cut Photovoltaic Solar Wafers
  const [saCanvas, saCtx] = makeCanvas(512, 512);
  const [srCanvas, srCtx] = makeCanvas(512, 512);
  saCtx.fillStyle = '#090d16';
  saCtx.fillRect(0, 0, 512, 512);
  srCtx.fillStyle = '#181818';
  srCtx.fillRect(0, 0, 512, 512);

  const cols = 4;
  const rows = 8;
  const cw = 512 / cols;
  const ch = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = c * cw + 3;
      const y0 = r * ch + 3;
      const w = cw - 6;
      const h = ch - 6;

      const grad = saCtx.createLinearGradient(x0, y0, x0 + w, y0 + h);
      grad.addColorStop(0, '#0f1626');
      grad.addColorStop(0.5, '#0a0f1c');
      grad.addColorStop(1, '#121a2d');
      saCtx.fillStyle = grad;
      saCtx.fillRect(x0, y0, w, h);

      saCtx.fillStyle = 'rgba(200, 214, 240, 0.22)';
      for (let fy = y0 + 6; fy < y0 + h - 4; fy += 8) {
        saCtx.fillRect(x0 + 2, fy, w - 4, 1);
      }

      saCtx.fillStyle = '#EA6B1A';
      saCtx.fillRect(x0 + w * 0.28, y0, 2, h);
      saCtx.fillRect(x0 + w * 0.72, y0, 2, h);

      saCtx.fillStyle = '#b4bcc8';
      for (const [cx, cy] of [
        [x0, y0],
        [x0 + w - 5, y0],
        [x0, y0 + h - 5],
        [x0 + w - 5, y0 + h - 5],
      ]) {
        saCtx.fillRect(cx, cy, 5, 5);
      }

      srCtx.fillStyle = '#0e0e0e';
      srCtx.fillRect(x0, y0, w, h);
    }
  }
  const solarAlbedo = new THREE.CanvasTexture(saCanvas);
  solarAlbedo.colorSpace = THREE.SRGBColorSpace;
  solarAlbedo.anisotropy = 8;
  const solarRoughness = new THREE.CanvasTexture(srCanvas);
  solarRoughness.colorSpace = THREE.NoColorSpace;

  // 5. Legacy Optical Coating (retained for ProductModel3D compatibility)
  const [ocCanvas, ocCtx] = makeCanvas(512, 512);
  const bg = ocCtx.createRadialGradient(256, 256, 10, 256, 256, 256);
  bg.addColorStop(0, '#04060d');
  bg.addColorStop(0.32, '#0c1f3d');
  bg.addColorStop(0.55, '#19133a');
  bg.addColorStop(0.76, '#0c2c38');
  bg.addColorStop(1, '#050609');
  ocCtx.fillStyle = bg;
  ocCtx.fillRect(0, 0, 512, 512);
  const opticalCoating = new THREE.CanvasTexture(ocCanvas);
  opticalCoating.colorSpace = THREE.SRGBColorSpace;

  // 6. Legacy OLED Screen (retained for ProductModel3D compatibility)
  const [olCanvas, olCtx] = makeCanvas(512, 256);
  olCtx.fillStyle = '#050608';
  olCtx.fillRect(0, 0, 512, 256);
  olCtx.strokeStyle = '#EA6B1A';
  olCtx.lineWidth = 10;
  olCtx.beginPath();
  olCtx.arc(104, 128, 54, -Math.PI * 0.75, Math.PI * 0.45);
  olCtx.stroke();
  const oledScreen = new THREE.CanvasTexture(olCanvas);
  oledScreen.colorSpace = THREE.SRGBColorSpace;

  // 7. Micro-Grain Bead-Blasted Anodized Aluminum Bump (512x512 tiled 4x4)
  const [bbCanvas, bbCtx] = makeCanvas(512, 512);
  const bbImg = bbCtx.createImageData(512, 512);
  const d = bbImg.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = 118 + ((Math.random() * 21) | 0);
    d[i] = n;
    d[i + 1] = n;
    d[i + 2] = n;
    d[i + 3] = 255;
  }
  bbCtx.putImageData(bbImg, 0, 0);
  const beadBlastedBump = new THREE.CanvasTexture(bbCanvas);
  beadBlastedBump.wrapS = THREE.RepeatWrapping;
  beadBlastedBump.wrapT = THREE.RepeatWrapping;
  beadBlastedBump.repeat.set(4, 4);
  beadBlastedBump.colorSpace = THREE.NoColorSpace;

  // 8. Concentric CNC-Turned Radial Lathe Bump (512x512)
  const [rlCanvas, rlCtx] = makeCanvas(512, 512);
  rlCtx.fillStyle = '#808080';
  rlCtx.fillRect(0, 0, 512, 512);
  for (let r = 6; r < 256; r += 2) {
    const v = 105 + Math.floor(Math.sin(r * 0.75) * 24 + Math.random() * 14);
    rlCtx.strokeStyle = `rgb(${v},${v},${v})`;
    rlCtx.lineWidth = 1.4;
    rlCtx.beginPath();
    rlCtx.arc(256, 256, r, 0, Math.PI * 2);
    rlCtx.stroke();
  }
  const radialLatheBump = new THREE.CanvasTexture(rlCanvas);
  radialLatheBump.colorSpace = THREE.NoColorSpace;

  // 9. Pro Multi-Element Optical Lens Assembly (1024x1024)
  const [lpCanvas, lpCtx] = makeCanvas(1024, 1024);
  lpCtx.fillStyle = '#030407';
  lpCtx.fillRect(0, 0, 1024, 1024);

  // Inner optical barrel depth gradient
  const lensBg = lpCtx.createRadialGradient(512, 512, 24, 512, 512, 490);
  lensBg.addColorStop(0, '#040914');
  lensBg.addColorStop(0.24, '#091f44');
  lensBg.addColorStop(0.45, '#19103b');
  lensBg.addColorStop(0.64, '#082936');
  lensBg.addColorStop(0.78, '#0c0d12');
  lensBg.addColorStop(1, '#040406');
  lpCtx.fillStyle = lensBg;
  lpCtx.beginPath();
  lpCtx.arc(512, 512, 490, 0, Math.PI * 2);
  lpCtx.fill();

  // Concentric barrel threads & baffle steps
  for (let r = 345; r <= 475; r += 10) {
    lpCtx.strokeStyle = r % 20 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.65)';
    lpCtx.lineWidth = 2;
    lpCtx.beginPath();
    lpCtx.arc(512, 512, r, 0, Math.PI * 2);
    lpCtx.stroke();
  }

  // White laser-etched optical ring typography around perimeter
  const ringText = 'F1.0  ·  4K COLORVU  ·  ASPHERICAL  ·  2.8mm  ·  SUPER APERTURE  ·  ';
  lpCtx.save();
  lpCtx.translate(512, 512);
  lpCtx.font = '600 18px ui-monospace, SFMono-Regular, Menlo, monospace';
  lpCtx.fillStyle = 'rgba(226, 232, 240, 0.72)';
  lpCtx.textAlign = 'center';
  lpCtx.textBaseline = 'middle';
  const totalChars = ringText.length;
  for (let i = 0; i < totalChars; i++) {
    const angle = (i / totalChars) * Math.PI * 2 - Math.PI / 2;
    lpCtx.save();
    lpCtx.rotate(angle);
    lpCtx.translate(0, -408);
    lpCtx.fillText(ringText[i], 0, 0);
    lpCtx.restore();
  }
  lpCtx.restore();

  // 9-blade polygonal aperture diaphragm
  lpCtx.save();
  lpCtx.translate(512, 512);
  for (let i = 0; i < 9; i++) {
    const a1 = (i / 9) * Math.PI * 2;
    const a2 = ((i + 1.45) / 9) * Math.PI * 2;
    lpCtx.strokeStyle = 'rgba(203, 213, 225, 0.24)';
    lpCtx.lineWidth = 3;
    lpCtx.beginPath();
    lpCtx.moveTo(Math.cos(a1) * 140, Math.sin(a1) * 140);
    lpCtx.lineTo(Math.cos(a2) * 320, Math.sin(a2) * 320);
    lpCtx.stroke();
  }
  lpCtx.restore();

  // Coated optical element rings
  const coatingRings: [number, string, number][] = [
    [332, 'rgba(56, 189, 248, 0.36)', 4],
    [274, 'rgba(168, 85, 247, 0.32)', 5],
    [214, 'rgba(16, 185, 129, 0.34)', 4],
    [146, 'rgba(234, 107, 26, 0.52)', 3],
    [82, 'rgba(99, 102, 241, 0.45)', 3],
  ];
  for (const [rad, col, lw] of coatingRings) {
    lpCtx.strokeStyle = col;
    lpCtx.lineWidth = lw;
    lpCtx.beginPath();
    lpCtx.arc(512, 512, rad, 0, Math.PI * 2);
    lpCtx.stroke();
  }

  // Deep central image sensor reflection
  const coreGlow = lpCtx.createRadialGradient(512, 512, 4, 512, 512, 76);
  coreGlow.addColorStop(0, 'rgba(56, 189, 248, 0.48)');
  coreGlow.addColorStop(0.5, 'rgba(15, 23, 42, 0.85)');
  coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  lpCtx.fillStyle = coreGlow;
  lpCtx.beginPath();
  lpCtx.arc(512, 512, 76, 0, Math.PI * 2);
  lpCtx.fill();

  // Off-axis studio specular highlights
  const sp1 = lpCtx.createRadialGradient(380, 360, 4, 380, 360, 74);
  sp1.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
  sp1.addColorStop(0.35, 'rgba(186, 230, 253, 0.32)');
  sp1.addColorStop(1, 'rgba(255, 255, 255, 0)');
  lpCtx.fillStyle = sp1;
  lpCtx.beginPath();
  lpCtx.arc(380, 360, 74, 0, Math.PI * 2);
  lpCtx.fill();

  const sp2 = lpCtx.createRadialGradient(640, 650, 2, 640, 650, 46);
  sp2.addColorStop(0, 'rgba(255, 237, 213, 0.55)');
  sp2.addColorStop(1, 'rgba(255, 237, 213, 0)');
  lpCtx.fillStyle = sp2;
  lpCtx.beginPath();
  lpCtx.arc(640, 650, 46, 0, Math.PI * 2);
  lpCtx.fill();

  const lensOpticsPro = new THREE.CanvasTexture(lpCanvas);
  lensOpticsPro.colorSpace = THREE.SRGBColorSpace;
  lensOpticsPro.anisotropy = 8;

  // 10. Shielded 16-Port RJ45 Bank Albedo & Bump (1024x256)
  const [rjACanvas, rjACtx] = makeCanvas(1024, 256);
  const [rjBCanvas, rjBCtx] = makeCanvas(1024, 256);
  rjACtx.fillStyle = '#181a20';
  rjACtx.fillRect(0, 0, 1024, 256);
  rjBCtx.fillStyle = '#c8c8c8';
  rjBCtx.fillRect(0, 0, 1024, 256);

  const portCount = 16;
  const slotW = 1024 / portCount;
  for (let i = 0; i < portCount; i++) {
    const sx = i * slotW;
    // Stainless outer EMI shielding frame
    const shieldGrad = rjACtx.createLinearGradient(sx + 4, 24, sx + slotW - 4, 224);
    shieldGrad.addColorStop(0, '#c6cbd4');
    shieldGrad.addColorStop(0.5, '#8f96a3');
    shieldGrad.addColorStop(1, '#aeb5c0');
    rjACtx.fillStyle = shieldGrad;
    drawRoundedRect(rjACtx, sx + 5, 28, slotW - 10, 198, 4);
    rjACtx.fill();

    // Inner recessed dark jack cavity
    rjACtx.fillStyle = '#060709';
    drawRoundedRect(rjACtx, sx + 10, 42, slotW - 20, 152, 3);
    rjACtx.fill();

    // T-notch tab recess at bottom center of jack
    rjACtx.fillStyle = '#020203';
    rjACtx.fillRect(sx + slotW * 0.34, 186, slotW * 0.32, 24);

    // Bump depth for cavity
    rjBCtx.fillStyle = '#121212';
    rjBCtx.fillRect(sx + 10, 42, slotW - 20, 152);
    rjBCtx.fillStyle = '#040404';
    rjBCtx.fillRect(sx + slotW * 0.34, 186, slotW * 0.32, 24);

    // 8 Visible gold contact pins at top inside jack
    rjACtx.fillStyle = '#eab308';
    const pinsArea = slotW - 28;
    const pinStep = pinsArea / 8;
    for (let p = 0; p < 8; p++) {
      rjACtx.fillRect(sx + 15 + p * pinStep, 46, Math.max(2, pinStep * 0.55), 28);
    }

    // Silkscreen port number cleanly at top strip
    rjACtx.fillStyle = 'rgba(226, 232, 240, 0.78)';
    rjACtx.font = '600 13px ui-monospace, monospace';
    rjACtx.textAlign = 'center';
    rjACtx.fillText(String(i + 1).padStart(2, '0'), sx + slotW / 2, 18);
  }
  const rj45BankAlbedo = new THREE.CanvasTexture(rjACanvas);
  rj45BankAlbedo.colorSpace = THREE.SRGBColorSpace;
  rj45BankAlbedo.anisotropy = 8;
  const rj45BankBump = new THREE.CanvasTexture(rjBCanvas);
  rj45BankBump.colorSpace = THREE.NoColorSpace;
  rj45BankBump.anisotropy = 8;

  // 11. Switch LCM Telemetry OLED (512x256)
  const [swCanvas, swCtx] = makeCanvas(512, 256);
  swCtx.fillStyle = '#06080d';
  swCtx.fillRect(0, 0, 512, 256);
  swCtx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  swCtx.lineWidth = 2;
  drawRoundedRect(swCtx, 10, 10, 492, 236, 14);
  swCtx.stroke();

  swCtx.fillStyle = '#38bdf8';
  swCtx.font = '700 22px ui-monospace, monospace';
  swCtx.fillText('USW-PRO-MAX-48', 28, 48);

  swCtx.fillStyle = '#10b981';
  swCtx.beginPath();
  swCtx.arc(462, 40, 8, 0, Math.PI * 2);
  swCtx.fill();

  swCtx.fillStyle = '#f8fafc';
  swCtx.font = '600 32px ui-sans-serif, system-ui, sans-serif';
  swCtx.fillText('PoE++  412W', 28, 102);

  swCtx.fillStyle = '#94a3b8';
  swCtx.font = '500 18px ui-monospace, monospace';
  swCtx.fillText('10G SFP+ UPLINK  ·  720W MAX', 28, 134);

  // Live traffic bars
  for (let i = 0; i < 16; i++) {
    const h = 22 + ((i * 29) % 58);
    swCtx.fillStyle = i > 11 ? '#ea6b1a' : '#38bdf8';
    swCtx.fillRect(28 + i * 28, 224 - h, 18, h);
  }
  const switchOledTex = new THREE.CanvasTexture(swCanvas);
  switchOledTex.colorSpace = THREE.SRGBColorSpace;
  switchOledTex.anisotropy = 8;

  // 12. Hybrid Solar Inverter OLED HUD (512x320)
  const [inCanvas, inCtx] = makeCanvas(512, 320);
  inCtx.fillStyle = '#05070b';
  inCtx.fillRect(0, 0, 512, 320);
  inCtx.strokeStyle = 'rgba(255,255,255,0.12)';
  inCtx.lineWidth = 2;
  drawRoundedRect(inCtx, 12, 12, 488, 296, 16);
  inCtx.stroke();

  inCtx.fillStyle = '#ea6b1a';
  inCtx.font = '700 19px ui-monospace, monospace';
  inCtx.fillText('GROWATT HYBRID · 10KW SPLIT-PHASE', 30, 48);

  // Efficiency ring gauge
  inCtx.strokeStyle = 'rgba(255,255,255,0.12)';
  inCtx.lineWidth = 12;
  inCtx.beginPath();
  inCtx.arc(105, 165, 58, 0, Math.PI * 2);
  inCtx.stroke();

  inCtx.strokeStyle = '#34d399';
  inCtx.lineCap = 'round';
  inCtx.beginPath();
  inCtx.arc(105, 165, 58, -Math.PI * 0.7, Math.PI * 0.8);
  inCtx.stroke();

  inCtx.fillStyle = '#ffffff';
  inCtx.font = '700 26px ui-sans-serif, system-ui, sans-serif';
  inCtx.textAlign = 'center';
  inCtx.fillText('98.2%', 105, 173);

  inCtx.textAlign = 'left';
  inCtx.fillStyle = '#38bdf8';
  inCtx.font = '600 22px ui-monospace, monospace';
  inCtx.fillText('PV    8.42 kW', 208, 120);
  inCtx.fillStyle = '#34d399';
  inCtx.fillText('BAT   96% LiFePO4', 208, 166);
  inCtx.fillStyle = '#f8fafc';
  inCtx.fillText('GRID  240V · 60Hz', 208, 212);

  inCtx.fillStyle = 'rgba(148, 163, 184, 0.7)';
  inCtx.font = '500 15px ui-monospace, monospace';
  inCtx.fillText('DUAL MPPT ACTIVE  ·  ZERO-MS BACKUP', 30, 280);

  const inverterOledTex = new THREE.CanvasTexture(inCanvas);
  inverterOledTex.colorSpace = THREE.SRGBColorSpace;
  inverterOledTex.anisotropy = 8;

  // 13. Hytera Tactical DMR LCD (512x384)
  const [rdCanvas, rdCtx] = makeCanvas(512, 384);
  rdCtx.fillStyle = '#07111e';
  rdCtx.fillRect(0, 0, 512, 384);
  // Top status bar
  rdCtx.fillStyle = '#0f1f36';
  rdCtx.fillRect(0, 0, 512, 54);
  rdCtx.fillStyle = '#34d399';
  for (let b = 0; b < 5; b++) {
    rdCtx.fillRect(26 + b * 12, 36 - b * 5, 8, 8 + b * 5);
  }
  rdCtx.fillStyle = '#38bdf8';
  rdCtx.font = '700 18px ui-monospace, monospace';
  rdCtx.fillText('GPS LOCK · DMR III', 110, 34);
  // Battery icon
  rdCtx.strokeStyle = '#34d399';
  rdCtx.lineWidth = 3;
  rdCtx.strokeRect(430, 16, 48, 22);
  rdCtx.fillStyle = '#34d399';
  rdCtx.fillRect(434, 20, 38, 14);

  rdCtx.fillStyle = '#ea6b1a';
  rdCtx.font = '700 22px ui-monospace, monospace';
  rdCtx.fillText('ZONA 01 · PLANTA NORTE', 28, 108);

  rdCtx.fillStyle = '#ffffff';
  rdCtx.font = '700 44px ui-sans-serif, system-ui, sans-serif';
  rdCtx.fillText('CH 01 · OPERACIONES', 28, 178);

  rdCtx.fillStyle = '#94a3b8';
  rdCtx.font = '500 24px ui-monospace, monospace';
  rdCtx.fillText('450.125 MHz  ·  AES-256', 28, 228);

  // Soft function keys footer
  rdCtx.fillStyle = '#0c1829';
  rdCtx.fillRect(0, 326, 512, 58);
  rdCtx.fillStyle = '#f8fafc';
  rdCtx.font = '600 20px ui-monospace, monospace';
  rdCtx.fillText('MENÚ', 32, 362);
  rdCtx.fillText('CANAL', 216, 362);
  rdCtx.fillText('ALERTA', 402, 362);

  const radioLcdTex = new THREE.CanvasTexture(rdCanvas);
  radioLcdTex.colorSpace = THREE.SRGBColorSpace;
  radioLcdTex.anisotropy = 8;

  // 14. Biometric Terminal Dark Architectural UI (512x640)
  const [bioCanvas, bioCtx] = makeCanvas(512, 640);
  bioCtx.fillStyle = '#06080c';
  bioCtx.fillRect(0, 0, 512, 640);

  bioCtx.fillStyle = '#e2e8f0';
  bioCtx.font = '600 42px ui-sans-serif, system-ui, sans-serif';
  bioCtx.textAlign = 'center';
  bioCtx.fillText('10:42', 256, 78);

  bioCtx.fillStyle = '#64748b';
  bioCtx.font = '500 16px ui-monospace, monospace';
  bioCtx.fillText('VISIBLE LIGHT · WIEGAND IP', 256, 112);

  // Geometric biometric facial scan reticle
  bioCtx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  bioCtx.lineWidth = 3;
  bioCtx.beginPath();
  bioCtx.arc(256, 300, 128, 0, Math.PI * 2);
  bioCtx.stroke();

  // Silhouette guide inside reticle
  bioCtx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
  bioCtx.lineWidth = 4;
  bioCtx.beginPath();
  bioCtx.arc(256, 270, 44, 0, Math.PI * 2);
  bioCtx.stroke();
  bioCtx.beginPath();
  bioCtx.arc(256, 392, 74, Math.PI * 1.15, Math.PI * 1.85);
  bioCtx.stroke();

  // Crisp cyan corner reticle brackets
  bioCtx.strokeStyle = '#38bdf8';
  bioCtx.lineWidth = 6;
  const rx0 = 112;
  const ry0 = 156;
  const rs = 288;
  const bl = 38;
  for (const [cx, cy, dx, dy] of [
    [rx0, ry0, 1, 1],
    [rx0 + rs, ry0, -1, 1],
    [rx0, ry0 + rs, 1, -1],
    [rx0 + rs, ry0 + rs, -1, -1],
  ]) {
    bioCtx.beginPath();
    bioCtx.moveTo(cx + dx * bl, cy);
    bioCtx.lineTo(cx, cy);
    bioCtx.lineTo(cx, cy + dy * bl);
    bioCtx.stroke();
  }

  // Emerald verified badge pill
  bioCtx.fillStyle = 'rgba(16, 185, 129, 0.16)';
  drawRoundedRect(bioCtx, 76, 514, 360, 56, 28);
  bioCtx.fill();
  bioCtx.strokeStyle = '#10b981';
  bioCtx.lineWidth = 2;
  bioCtx.stroke();

  bioCtx.fillStyle = '#34d399';
  bioCtx.font = '700 18px ui-monospace, monospace';
  bioCtx.fillText('ACCESO VERIFICADO · 0.28s', 256, 549);

  const biometricUiTex = new THREE.CanvasTexture(bioCanvas);
  biometricUiTex.colorSpace = THREE.SRGBColorSpace;
  biometricUiTex.anisotropy = 8;

  // 15. Soft Gaussian Contact Shadow AO Disc (512x512)
  const [aoCanvas, aoCtx] = makeCanvas(512, 512);
  const aoGrad = aoCtx.createRadialGradient(256, 256, 12, 256, 256, 240);
  aoGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  aoGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.24)');
  aoGrad.addColorStop(0.78, 'rgba(0, 0, 0, 0.06)');
  aoGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  aoCtx.fillStyle = aoGrad;
  aoCtx.fillRect(0, 0, 512, 512);
  const softShadowAO = new THREE.CanvasTexture(aoCanvas);
  softShadowAO.colorSpace = THREE.SRGBColorSpace;

  return {
    brushedMetal,
    knurledMetal,
    perforatedAlbedo,
    perforatedBump,
    solarAlbedo,
    solarRoughness,
    opticalCoating,
    oledScreen,
    beadBlastedBump,
    radialLatheBump,
    lensOpticsPro,
    rj45BankAlbedo,
    rj45BankBump,
    switchOledTex,
    inverterOledTex,
    radioLcdTex,
    biometricUiTex,
    softShadowAO,
    dispose: () => {
      brushedMetal.dispose();
      knurledMetal.dispose();
      perforatedAlbedo.dispose();
      perforatedBump.dispose();
      solarAlbedo.dispose();
      solarRoughness.dispose();
      opticalCoating.dispose();
      oledScreen.dispose();
      beadBlastedBump.dispose();
      radialLatheBump.dispose();
      lensOpticsPro.dispose();
      rj45BankAlbedo.dispose();
      rj45BankBump.dispose();
      switchOledTex.dispose();
      inverterOledTex.dispose();
      radioLcdTex.dispose();
      biometricUiTex.dispose();
      softShadowAO.dispose();
    },
  };
}
