import * as THREE from 'three';

export interface MarblePBRTextures {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

/**
 * Generates a realistic PBR texture suite (albedo, roughness, bump) for
 * polished dark Nero Marquina & warm travertine museum marble slabs.
 */
export function createMarbleFloorPBR(): MarblePBRTextures {
  const size = 512;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const actx = albedoCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rctx = roughCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  // Base dark architectural marble
  actx.fillStyle = '#12141a';
  actx.fillRect(0, 0, size, size);

  // Polished glossy surface base (low roughness ~0.18 -> dark grey)
  rctx.fillStyle = '#323232';
  rctx.fillRect(0, 0, size, size);

  // Flat slab surface height
  bctx.fillStyle = '#d8d8d8';
  bctx.fillRect(0, 0, size, size);

  // Soft mineral clouding across slabs
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 110 + 35;

    const grad = actx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(
      0,
      i % 3 === 0 ? 'rgba(214, 199, 178, 0.045)' : i % 3 === 1 ? 'rgba(42, 48, 62, 0.09)' : 'rgba(6, 7, 10, 0.14)'
    );
    grad.addColorStop(1, 'transparent');
    actx.fillStyle = grad;
    actx.fillRect(x - r, y - r, r * 2, r * 2);

    const rGrad = rctx.createRadialGradient(x, y, 0, x, y, r);
    rGrad.addColorStop(0, i % 2 === 0 ? 'rgba(95,95,95,0.25)' : 'rgba(25,25,25,0.25)');
    rGrad.addColorStop(1, 'transparent');
    rctx.fillStyle = rGrad;
    rctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Organic diagonal calcite & champagne-gold marble veins
  for (let v = 0; v < 18; v++) {
    let vx = Math.random() * size;
    let vy = Math.random() * size;
    const isGoldVein = v % 4 === 0;

    actx.beginPath();
    rctx.beginPath();
    bctx.beginPath();
    actx.moveTo(vx, vy);
    rctx.moveTo(vx, vy);
    bctx.moveTo(vx, vy);

    const steps = 16;
    for (let s = 0; s < steps; s++) {
      vx += (Math.random() - 0.35) * 44;
      vy += (Math.random() - 0.35) * 44;
      actx.lineTo(vx, vy);
      rctx.lineTo(vx, vy);
      bctx.lineTo(vx, vy);
    }

    actx.strokeStyle = isGoldVein ? 'rgba(214, 199, 178, 0.14)' : 'rgba(235, 230, 222, 0.06)';
    actx.lineWidth = isGoldVein ? 1.4 : 0.9;
    actx.stroke();

    rctx.strokeStyle = 'rgba(130, 130, 130, 0.35)';
    rctx.lineWidth = 1.6;
    rctx.stroke();

    bctx.strokeStyle = 'rgba(160, 160, 160, 0.35)';
    bctx.lineWidth = 1.2;
    bctx.stroke();
  }

  // Precision beveled slab tile grout lines (matte & recessed)
  const drawGrout = (ctx: CanvasRenderingContext2D, color: string, lw: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.strokeRect(1, 1, size - 2, size - 2);
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
  };

  drawGrout(actx, 'rgba(214, 199, 178, 0.12)', 2.5);
  drawGrout(rctx, '#c8c8c8', 4); // Grout is rough/matte
  drawGrout(bctx, '#282828', 4); // Grout is recessed in bump map

  const setupRepeat = (tex: THREE.CanvasTexture, srgb: boolean) => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 56);
    if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  };

  return {
    map: setupRepeat(new THREE.CanvasTexture(albedoCanvas), true),
    roughnessMap: setupRepeat(new THREE.CanvasTexture(roughCanvas), false),
    bumpMap: setupRepeat(new THREE.CanvasTexture(bumpCanvas), false),
  };
}

export interface StoneWallPBRTextures {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

/**
 * Generates fluted architectural limestone/travertine museum wall panels with fine relief.
 */
export function createStoneWallPBR(): StoneWallPBRTextures {
  const size = 512;
  const albedo = document.createElement('canvas');
  albedo.width = size;
  albedo.height = size;
  const actx = albedo.getContext('2d')!;

  const bump = document.createElement('canvas');
  bump.width = size;
  bump.height = size;
  const bctx = bump.getContext('2d')!;

  actx.fillStyle = '#181b23';
  actx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Subtle architectural stone block courses + micro-fluting
  for (let x = 0; x < size; x += 32) {
    const grad = actx.createLinearGradient(x, 0, x + 32, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0.22)');
    grad.addColorStop(0.2, 'rgba(214,199,178,0.035)');
    grad.addColorStop(0.8, 'rgba(214,199,178,0.01)');
    grad.addColorStop(1, 'rgba(0,0,0,0.22)');
    actx.fillStyle = grad;
    actx.fillRect(x, 0, 32, size);

    const bGrad = bctx.createLinearGradient(x, 0, x + 32, 0);
    bGrad.addColorStop(0, '#444444');
    bGrad.addColorStop(0.5, '#b8b8b8');
    bGrad.addColorStop(1, '#444444');
    bctx.fillStyle = bGrad;
    bctx.fillRect(x, 0, 32, size);
  }

  // Fine mineral grain speckles
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = Math.random() * 0.045;
    actx.fillStyle = i % 2 === 0 ? `rgba(236, 227, 212, ${a})` : `rgba(0, 0, 0, ${a * 1.8})`;
    actx.fillRect(x, y, Math.random() * 6 + 1, 2);
  }

  // Horizontal architectural panel seams
  actx.strokeStyle = 'rgba(214, 199, 178, 0.09)';
  actx.lineWidth = 2;
  actx.beginPath();
  actx.moveTo(0, 170);
  actx.lineTo(size, 170);
  actx.moveTo(0, 340);
  actx.lineTo(size, 340);
  actx.stroke();

  bctx.strokeStyle = '#222222';
  bctx.lineWidth = 3;
  bctx.beginPath();
  bctx.moveTo(0, 170);
  bctx.lineTo(size, 170);
  bctx.moveTo(0, 340);
  bctx.lineTo(size, 340);
  bctx.stroke();

  const map = new THREE.CanvasTexture(albedo);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(16, 2);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  const bumpMap = new THREE.CanvasTexture(bump);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(16, 2);

  return { map, bumpMap };
}

/**
 * Generates a soft radial gallery spotlight floor pool texture for realistic bounced light.
 */
export function createSpotlightPoolTexture(accentHexCss = '#d6c7b2'): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `${accentHexCss}55`);
  grad.addColorStop(0.4, `${accentHexCss}22`);
  grad.addColorStop(0.75, `${accentHexCss}08`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 6
) {
  const words = text.split(' ');
  let line = '';
  let currY = y;
  let count = 0;
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      count++;
      if (count >= maxLines) {
        ctx.fillText(line.trim() + '…', x, currY);
        return currY + lineHeight;
      }
      ctx.fillText(line.trim(), x, currY);
      line = words[i] + ' ';
      currY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currY);
    currY += lineHeight;
  }
  return currY;
}

export interface ExhibitCanvasOptions {
  code: string;
  title: string;
  subtitle: string;
  body: string;
  bullets?: string[];
  tags?: string[];
  accent?: string;
  bgTop?: string;
  bgBottom?: string;
  centered?: boolean;
  quoteMode?: boolean;
  width?: number;
  height?: number;
}

/**
 * Renders a razor-sharp, museum-grade artwork / curatorial wall panel onto a CanvasTexture
 * with linen matting, realistic overhead gallery spotlight wash, and refined typography.
 */
export function createExhibitPanelTexture(opts: ExhibitCanvasOptions): THREE.CanvasTexture {
  const w = opts.width || 1024;
  const h = opts.height || 720;
  const accent = opts.accent || '#d6c7b2';

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep matte architectural gallery board
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, opts.bgTop || '#171b24');
    bg.addColorStop(0.55, '#11141c');
    bg.addColorStop(1, opts.bgBottom || '#0a0c11');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle museum gallery overhead spotlight cone hitting the top center of the frame
    const spot = ctx.createRadialGradient(w * 0.5, -h * 0.08, 12, w * 0.5, h * 0.1, h * 0.92);
    spot.addColorStop(0, `${accent}3d`);
    spot.addColorStop(0.45, `${accent}12`);
    spot.addColorStop(1, 'transparent');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);

    // Subtle fine museum linen texture lines
    ctx.strokeStyle = 'rgba(255,255,255,0.015)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Architectural matting frame & corner brass inlays
    ctx.strokeStyle = `${accent}66`;
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, w - 48, h - 48);
    ctx.strokeStyle = `${accent}22`;
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Corner L-brackets
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4.5;
    const b = 34;
    const m = 24;
    ctx.beginPath();
    ctx.moveTo(m, m + b); ctx.lineTo(m, m); ctx.lineTo(m + b, m);
    ctx.moveTo(w - m - b, m); ctx.lineTo(w - m, m); ctx.lineTo(w - m, m + b);
    ctx.moveTo(m, h - m - b); ctx.lineTo(m, h - m); ctx.lineTo(m + b, h - m);
    ctx.moveTo(w - m - b, h - m); ctx.lineTo(w - m, h - m); ctx.lineTo(w - m, h - m - b);
    ctx.stroke();

    if (opts.quoteMode) {
      ctx.textAlign = 'center';
      ctx.fillStyle = accent;
      ctx.font = '600 22px monospace';
      ctx.fillText(opts.code.toUpperCase(), w / 2, 118);

      // Small decorative diamond divider
      ctx.fillStyle = accent;
      ctx.fillRect(w / 2 - 42, 140, 84, 2);

      ctx.fillStyle = '#f5f0e8';
      ctx.font = 'italic 54px Georgia, serif';
      wrapText(ctx, opts.title, w / 2, 248, w - 180, 74, 4);

      ctx.fillStyle = accent;
      ctx.font = '600 23px monospace';
      ctx.fillText(opts.subtitle.toUpperCase(), w / 2, h - 135);

      if (opts.body) {
        ctx.fillStyle = 'rgba(213,206,194,0.75)';
        ctx.font = '300 21px sans-serif';
        ctx.fillText(opts.body, w / 2, h - 82);
      }
    } else if (opts.centered) {
      ctx.textAlign = 'center';
      ctx.fillStyle = accent;
      ctx.font = '700 22px monospace';
      ctx.fillText(opts.code.toUpperCase(), w / 2, 122);

      ctx.fillStyle = '#f5f0e8';
      ctx.font = '400 72px Georgia, serif';
      wrapText(ctx, opts.title, w / 2, 235, w - 140, 82, 2);

      ctx.fillStyle = accent;
      ctx.font = '400 28px sans-serif';
      wrapText(ctx, opts.subtitle, w / 2, 395, w - 160, 40, 2);

      ctx.fillStyle = 'rgba(213,206,194,0.84)';
      ctx.font = '300 24px sans-serif';
      wrapText(ctx, opts.body, w / 2, 485, w - 180, 36, 3);

      ctx.strokeStyle = `${accent}70`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 120, h - 112);
      ctx.lineTo(w / 2 + 120, h - 112);
      ctx.stroke();

      ctx.fillStyle = accent;
      ctx.font = '600 20px monospace';
      ctx.fillText('CLICK TO INSPECT  •  SCROLL TO EXPLORE', w / 2, h - 70);
    } else {
      ctx.textAlign = 'left';
      ctx.fillStyle = `${accent}24`;
      ctx.fillRect(68, 66, 275, 42);
      ctx.strokeStyle = `${accent}78`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(68, 66, 275, 42);

      ctx.fillStyle = accent;
      ctx.font = '700 20px monospace';
      ctx.fillText(opts.code.toUpperCase(), 86, 94);

      ctx.fillStyle = '#f5f0e8';
      ctx.font = '400 52px Georgia, serif';
      const afterTitleY = wrapText(ctx, opts.title, 68, 178, w - 136, 60, 2);

      ctx.fillStyle = accent;
      ctx.font = '600 22px monospace';
      const afterSubY = wrapText(ctx, opts.subtitle, 68, afterTitleY + 14, w - 136, 30, 2);

      ctx.strokeStyle = `${accent}3c`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(68, afterSubY + 14);
      ctx.lineTo(w - 68, afterSubY + 14);
      ctx.stroke();

      ctx.fillStyle = 'rgba(213, 206, 194, 0.9)';
      ctx.font = '300 24px sans-serif';
      let nextY = wrapText(ctx, opts.body, 68, afterSubY + 54, w - 136, 34, 4);

      if (opts.bullets && opts.bullets.length > 0) {
        ctx.font = '400 21px sans-serif';
        opts.bullets.slice(0, 4).forEach((blt) => {
          ctx.fillStyle = accent;
          ctx.fillText('▸', 68, nextY + 16);
          ctx.fillStyle = '#ece3d4';
          nextY = wrapText(ctx, blt, 96, nextY + 16, w - 164, 30, 2) + 4;
        });
      }

      if (opts.tags && opts.tags.length > 0) {
        let tx = 68;
        const ty = h - 102;
        ctx.font = '600 18px monospace';
        opts.tags.slice(0, 5).forEach((tag) => {
          const tw = ctx.measureText(tag).width + 26;
          if (tx + tw < w - 68) {
            ctx.fillStyle = 'rgba(12, 14, 19, 0.92)';
            ctx.fillRect(tx, ty, tw, 36);
            ctx.strokeStyle = `${accent}50`;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(tx, ty, tw, 36);
            ctx.fillStyle = accent;
            ctx.fillText(tag, tx + 13, ty + 24);
            tx += tw + 12;
          }
        });
      }

      ctx.fillStyle = 'rgba(214, 199, 178, 0.72)';
      ctx.font = '600 17px monospace';
      ctx.fillText('CLICK EXHIBIT TO FOCUS & INSPECT PLAQUE →', 68, h - 42);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * Generates a backlit architectural Overhead Archway Room Sign plaque.
 */
export function createArchSignTexture(roomNumber: string, roomName: string, accent = '#d6c7b2'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 820;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const bg = ctx.createLinearGradient(0, 0, 820, 140);
    bg.addColorStop(0, '#13161e');
    bg.addColorStop(1, '#0b0d12');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 820, 140);

    ctx.strokeStyle = `${accent}90`;
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, 804, 124);

    ctx.strokeStyle = `${accent}2e`;
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, 788, 108);

    ctx.textAlign = 'center';
    ctx.fillStyle = accent;
    ctx.font = '700 22px monospace';
    ctx.fillText(`—  ROOM ${roomNumber}  —`, 410, 50);

    ctx.fillStyle = '#f5f0e8';
    ctx.font = '400 44px Georgia, serif';
    ctx.fillText(roomName.toUpperCase(), 410, 106);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export type FloatingFrontendKind = 'vertex' | 'jarvis' | 'netflix' | 'portfolio' | 'calculator';

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Generates crisp, realistic high-DPI Frontend UI mockup textures for the
 * Floating 3D Project Objects inside Room 08 (Floating Frontend Showcase).
 */
export function createProjectFrontendTexture(kind: FloatingFrontendKind): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  if (kind === 'vertex') {
    canvas.width = 560;
    canvas.height = 980;
  } else if (kind === 'calculator') {
    canvas.width = 720;
    canvas.height = 920;
  } else {
    canvas.width = 1024;
    canvas.height = 640;
  }
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (kind === 'vertex') {
      // VERTEX PHONE X1 — Mobile 3D Showcase Frontend
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#07131a');
      bg.addColorStop(0.5, '#0b1e29');
      bg.addColorStop(1, '#04090e');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Ambient mint/cyan glow
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.38, 12, w * 0.5, h * 0.38, 250);
      glow.addColorStop(0, 'rgba(52, 211, 153, 0.35)');
      glow.addColorStop(0.55, 'rgba(56, 189, 248, 0.14)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Mobile Status Bar + Dynamic Island
      ctx.fillStyle = '#020408';
      drawRoundRect(ctx, w / 2 - 68, 22, 136, 30, 15);
      ctx.fill();
      ctx.fillStyle = '#e2f8f1';
      ctx.font = '700 18px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('9:41', 36, 44);
      ctx.textAlign = 'right';
      ctx.fillText('5G 100%', w - 36, 44);

      // App Navbar
      ctx.textAlign = 'left';
      ctx.fillStyle = '#34d399';
      ctx.font = '700 22px monospace';
      ctx.fillText('VERTEX X1', 36, 108);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      drawRoundRect(ctx, w - 150, 82, 114, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LIVE 3D', w - 93, 105);

      // Hero Title
      ctx.fillStyle = '#34d399';
      ctx.font = '700 16px monospace';
      ctx.fillText('THREE.JS • GSAP • REACT', w / 2, 168);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 46px sans-serif';
      ctx.fillText('TITANIUM', w / 2, 222);
      ctx.fillStyle = '#99f6e4';
      ctx.font = '300 32px Georgia, serif';
      ctx.fillText('Interactive 3D Core', w / 2, 266);

      // Holographic 3D Sphere / Lens Graphic inside Screen
      ctx.strokeStyle = 'rgba(52,211,153,0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w / 2, 435, 118, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(56,189,248,0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(w / 2, 435, 150, 48, 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w / 2, 435, 150, 48, -0.35, 0, Math.PI * 2);
      ctx.stroke();
      const coreGrad = ctx.createRadialGradient(w / 2 - 25, 410, 12, w / 2, 435, 86);
      coreGrad.addColorStop(0, '#ecfdf5');
      coreGrad.addColorStop(0.45, '#10b981');
      coreGrad.addColorStop(1, '#064e3b');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(w / 2, 435, 76, 0, Math.PI * 2);
      ctx.fill();

      // Specs Grid Cards
      const specs = [
        ['60 FPS', 'WebGL Engine'],
        ['GSAP 3', 'Scroll Motion'],
        ['TITANIUM', 'Spatial UI'],
        ['VERCEL', 'Edge Deploy'],
      ];
      specs.forEach((sp, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = 36 + col * 252;
        const cy = 600 + row * 106;
        ctx.fillStyle = 'rgba(15, 23, 34, 0.9)';
        drawRoundRect(ctx, cx, cy, 236, 90, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.38)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = '#34d399';
        ctx.font = '700 22px monospace';
        ctx.fillText(sp[0], cx + 20, cy + 40);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '400 17px sans-serif';
        ctx.fillText(sp[1], cx + 20, cy + 68);
      });

      // Bottom CTA Button
      const ctaGrad = ctx.createLinearGradient(36, 845, w - 36, 845);
      ctaGrad.addColorStop(0, '#34d399');
      ctaGrad.addColorStop(1, '#38bdf8');
      ctx.fillStyle = ctaGrad;
      drawRoundRect(ctx, 36, 845, w - 72, 74, 37);
      ctx.fill();
      ctx.fillStyle = '#041217';
      ctx.font = '700 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CLICK TO LAUNCH LIVE DEMO →', w / 2, 890);
    } else if (kind === 'jarvis') {
      // J.A.R.V.I.S — AI Voice Assistant HUD Frontend
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#040d18');
      bg.addColorStop(1, '#081b2e');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle cyber grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 48) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 48) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }

      // Top Window Bar
      ctx.fillStyle = 'rgba(6, 18, 32, 0.95)';
      ctx.fillRect(0, 0, w, 58);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath(); ctx.moveTo(0, 58); ctx.lineTo(w, 58); ctx.stroke();
      ['#ef4444', '#f59e0b', '#22c55e'].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(32 + i * 24, 29, 7, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('J.A.R.V.I.S // PYTHON AI VOICE ASSISTANT HUD', 120, 36);
      ctx.fillStyle = '#22c55e';
      ctx.textAlign = 'right';
      ctx.fillText('● LISTENING 99.4%', w - 28, 36);

      // Left Circular Arc Reactor Voice Visualizer
      const cx = 270;
      const cy = 335;
      [148, 122, 90, 56].forEach((r, idx) => {
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(56,189,248,0.85)' : 'rgba(129,140,248,0.6)';
        ctx.lineWidth = idx === 1 ? 6 : 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, idx * 0.6, Math.PI * 1.65 + idx * 0.4);
        ctx.stroke();
      });
      const vGlow = ctx.createRadialGradient(cx, cy, 8, cx, cy, 110);
      vGlow.addColorStop(0, 'rgba(103,232,249,0.55)');
      vGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = vGlow;
      ctx.beginPath(); ctx.arc(cx, cy, 110, 0, Math.PI * 2); ctx.fill();

      // Waveform bars inside core
      for (let b = -5; b <= 5; b++) {
        const bh = 24 + Math.cos(b * 0.55) * 34;
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(cx + b * 12 - 3, cy - bh / 2, 6, bh);
      }
      ctx.fillStyle = '#e0f2fe';
      ctx.font = '700 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SPEECH RECOGNITION ACTIVE', cx, cy + 190);

      // Right Command Console Panel
      ctx.fillStyle = 'rgba(7, 20, 36, 0.92)';
      drawRoundRect(ctx, 485, 92, 500, 485, 22);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 17px monospace';
      ctx.fillText('LIVE TRANSCRIPT & AUTOMATION LOG', 515, 134);

      const logs = [
        ['USER >', '"Jarvis, launch my GitHub repos"'],
        ['AI   >', 'Opening github.com/shashank... Done.'],
        ['USER >', '"Run system diagnostics & time"'],
        ['AI   >', 'CPU Optimal • pyttsx3 Voice Ready.'],
        ['USER >', '"Summarize REST API response"'],
        ['AI   >', '200 OK — Synthesizing audio reply...'],
      ];
      logs.forEach((row, i) => {
        const ly = 186 + i * 52;
        ctx.fillStyle = row[0].startsWith('USER') ? '#818cf8' : '#34d399';
        ctx.font = '700 18px monospace';
        ctx.fillText(row[0], 515, ly);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '400 18px monospace';
        ctx.fillText(row[1], 598, ly);
      });

      // Bottom interactive command chips
      ['Weather API', 'Open IDE', 'Voice Search', 'Play Music'].forEach((chip, i) => {
        const bx = 515 + i * 116;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
        drawRoundRect(ctx, bx, 510, 106, 40, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = '#bae6fd';
        ctx.font = '600 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(chip, bx + 53, 535);
      });
    } else if (kind === 'netflix') {
      // NETFLIX UI CLONE — Cinema Streaming Frontend
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, w, h);

      // Hero Movie Banner Backdrop
      const heroGrad = ctx.createLinearGradient(0, 0, w, 360);
      heroGrad.addColorStop(0, '#14060a');
      heroGrad.addColorStop(0.55, '#450a18');
      heroGrad.addColorStop(1, '#181825');
      ctx.fillStyle = heroGrad;
      ctx.fillRect(0, 0, w, 355);

      const cineGlow = ctx.createRadialGradient(w * 0.72, 165, 20, w * 0.72, 165, 290);
      cineGlow.addColorStop(0, 'rgba(229, 9, 20, 0.45)');
      cineGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cineGlow;
      ctx.fillRect(0, 0, w, 355);

      // Navbar
      ctx.fillStyle = '#E50914';
      ctx.font = '900 38px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('NETFLIX', 42, 54);
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.font = '500 18px sans-serif';
      ['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].forEach((nav, i) => {
        ctx.fillText(nav, 224 + i * 116, 48);
      });

      // Featured Show Title & Buttons
      ctx.fillStyle = '#E50914';
      ctx.font = '700 16px monospace';
      ctx.fillText('N  SERIES  •  TRENDING #1', 44, 128);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 54px sans-serif';
      ctx.fillText('CYBER HORIZON', 42, 188);
      ctx.fillStyle = 'rgba(226,232,240,0.85)';
      ctx.font = '400 19px sans-serif';
      ctx.fillText('Responsive Streaming Hub • Hover Carousels • Preview Modals', 44, 226);

      // Play & My List Buttons
      ctx.fillStyle = '#ffffff';
      drawRoundRect(ctx, 44, 256, 152, 48, 8);
      ctx.fill();
      ctx.fillStyle = '#09090b';
      ctx.font = '700 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('▶  Play', 120, 287);

      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      drawRoundRect(ctx, 212, 256, 174, 48, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('+  My List', 299, 287);

      // Trending Carousel Row
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 21px sans-serif';
      ctx.fillText('Trending Now', 44, 392);

      const posters = [
        ['#991b1b', '#f97316', 'QUANTUM'],
        ['#1e3a8a', '#38bdf8', 'NEBULA'],
        ['#581c87', '#ec4899', 'SYNTHIA'],
        ['#064e3b', '#10b981', 'MATRIX X'],
        ['#78350f', '#fbbf24', 'SOLARIS'],
      ];
      posters.forEach((p, i) => {
        const px = 44 + i * 190;
        const py = 414;
        const pg = ctx.createLinearGradient(px, py, px + 174, py + 185);
        pg.addColorStop(0, p[0]);
        pg.addColorStop(1, p[1]);
        ctx.fillStyle = pg;
        drawRoundRect(ctx, px, py, 174, 185, 12);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(px, py + 132, 174, 53);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p[2], px + 87, py + 165);
      });
    } else if (kind === 'portfolio') {
      // CODSOFT PORTFOLIO WEB APP — Browser Laptop Frontend
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#0f172a');
      bg.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Browser Chrome
      ctx.fillStyle = '#090d1a';
      ctx.fillRect(0, 0, w, 52);
      ['#ef4444', '#f59e0b', '#22c55e'].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(28 + i * 22, 26, 7, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = '#1e293b';
      drawRoundRect(ctx, 290, 11, 444, 30, 15);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('https://shashank-portfolio.vercel.app', w / 2, 31);

      // Portfolio Top Navbar
      ctx.textAlign = 'left';
      ctx.fillStyle = '#818cf8';
      ctx.font = '800 26px monospace';
      ctx.fillText('<SJ />', 48, 108);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 18px sans-serif';
      ['About', 'Projects', 'Skills', 'Contact'].forEach((item, i) => {
        ctx.fillText(item, 560 + i * 108, 104);
      });

      // Hero Split Section
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 17px monospace';
      ctx.fillText('RESPONSIVE PORTFOLIO • CODSOFT INTERNSHIP', 48, 178);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 50px sans-serif';
      ctx.fillText('Shashank Jha', 48, 238);
      ctx.fillStyle = '#c7d2fe';
      ctx.font = '400 24px sans-serif';
      ctx.fillText('Frontend Engineer • React, Three.js & Clean UI', 48, 280);

      // Hero CTA Pills
      ctx.fillStyle = '#818cf8';
      drawRoundRect(ctx, 48, 310, 195, 48, 24);
      ctx.fill();
      ctx.fillStyle = '#0b1020';
      ctx.font = '700 17px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VIEW PROJECTS', 145, 340);

      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      drawRoundRect(ctx, 260, 310, 185, 48, 24);
      ctx.stroke();
      ctx.fillStyle = '#e0e7ff';
      ctx.fillText('CONTACT ME', 352, 340);

      // Avatar Emblem on Right
      const avGrad = ctx.createRadialGradient(825, 235, 16, 825, 235, 110);
      avGrad.addColorStop(0, '#818cf8');
      avGrad.addColorStop(0.55, '#38bdf8');
      avGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = avGrad;
      ctx.beginPath(); ctx.arc(825, 235, 110, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(825, 235, 68, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#a5b4fc';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 42px Georgia, serif';
      ctx.fillText('SJ', 825, 249);

      // 3 Mini Project Cards at Bottom
      const miniCards = [
        ['01 // 3D WEB', 'Vertex Phone X1', '#34d399'],
        ['02 // STREAM', 'Netflix UI Hub', '#f43f5e'],
        ['03 // ALGO', 'Sci Calculator', '#f59e0b'],
      ];
      miniCards.forEach((card, i) => {
        const cx = 48 + i * 316;
        const cy = 415;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        drawRoundRect(ctx, cx, cy, 294, 175, 18);
        ctx.fill();
        ctx.strokeStyle = `${card[2]}77`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = card[2];
        ctx.font = '700 16px monospace';
        ctx.fillText(card[0], cx + 22, cy + 44);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 26px sans-serif';
        ctx.fillText(card[1], cx + 22, cy + 92);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '400 16px sans-serif';
        ctx.fillText('HTML5 • CSS3 • JavaScript', cx + 22, cy + 138);
      });
    } else {
      // SCIENTIFIC CALCULATOR SUITE — Glass Tablet Frontend
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#0f131c');
      bg.addColorStop(1, '#191c2b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Top Header
      ctx.fillStyle = '#f59e0b';
      ctx.font = '700 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SCI-CALC PRO // EXPRESSION ENGINE', 44, 58);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('DEG • PRECISION', w - 44, 58);

      // Digital Display Screen
      ctx.fillStyle = '#070a10';
      drawRoundRect(ctx, 40, 88, w - 80, 210, 26);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 28px monospace';
      ctx.fillText('sin(45°) × √144 + π', w - 70, 155);
      ctx.fillStyle = '#fde68a';
      ctx.font = '700 68px monospace';
      ctx.fillText('11.6269', w - 70, 250);

      // Scientific & Numeric Keypad Grid
      const rows = [
        ['sin', 'cos', 'tan', 'log', '√'],
        ['(', ')', 'π', 'C', '÷'],
        ['7', '8', '9', '⌫', '×'],
        ['4', '5', '6', '^', '−'],
        ['1', '2', '3', '%', '+'],
        ['0', '.', 'ANS', '=', '='],
      ];
      rows.forEach((row, rIdx) => {
        const y = 330 + rIdx * 92;
        row.forEach((key, cIdx) => {
          if (rIdx === 5 && cIdx === 4) return;
          const isWideEq = rIdx === 5 && cIdx === 3;
          const bw = isWideEq ? 250 : 118;
          const x = 40 + cIdx * 131;
          const isOp = ['÷', '×', '−', '+'].includes(key);
          const isSci = rIdx === 0;
          ctx.fillStyle = isWideEq
            ? '#f59e0b'
            : isOp
            ? 'rgba(56, 189, 248, 0.22)'
            : isSci
            ? 'rgba(129, 140, 248, 0.2)'
            : 'rgba(30, 41, 59, 0.9)';
          drawRoundRect(ctx, x, y, bw, 76, 18);
          ctx.fill();
          ctx.strokeStyle = isWideEq
            ? '#fcd34d'
            : isOp
            ? 'rgba(56, 189, 248, 0.55)'
            : 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = isWideEq ? '#0b0e14' : isOp ? '#7dd3fc' : isSci ? '#c7d2fe' : '#f8fafc';
          ctx.font = isWideEq ? '800 34px monospace' : '700 26px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(key, x + bw / 2, y + 48);
        });
      });
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
