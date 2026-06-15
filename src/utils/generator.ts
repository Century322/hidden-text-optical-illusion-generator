import { GeneratorParams } from '../types';

export function generateOpticalIllusion(
  maskCanvas: HTMLCanvasElement,
  params: GeneratorParams,
  width: number,
  height: number
): HTMLCanvasElement {
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) return outputCanvas;

  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return outputCanvas;

  const maskData = maskCtx.getImageData(0, 0, width, height);
  const maskPixels = maskData.data;

  const s = width / 1080;

  const STRIPE_WIDTH = 7 * s;
  const STRIPE_SPACING = 18 * s;
  const FOLD_LENGTH = 54 * s;
  const FOLD_DX = 47 * s;
  const ZIGZAG_AMPLITUDE = FOLD_DX / 2;
  const ZIGZAG_PERIOD = FOLD_LENGTH * 2;
  const WHITE_BORDER = (params.whiteBorder || 0) * s;

  const fgColor = params.colorForeground || '#000000';
  const bgColor = params.colorBackground || '#ffffff';

  function isOnText(px: number, py: number): boolean {
    const ix = Math.min(width - 1, Math.max(0, Math.round(px)));
    const iy = Math.min(height - 1, Math.max(0, Math.round(py)));
    const idx = (iy * width + ix) * 4;
    const g = (maskPixels[idx] + maskPixels[idx + 1] + maskPixels[idx + 2]) / 3;
    return g < 128;
  }

  function zigzagOffset(y: number): number {
    const phase = ((y / ZIGZAG_PERIOD) % 1 + 1) % 1;
    if (phase < 0.5) {
      return ZIGZAG_AMPLITUDE * (-1 + 4 * phase);
    } else {
      return ZIGZAG_AMPLITUDE * (3 - 4 * phase);
    }
  }

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const extraStripes = Math.ceil(FOLD_DX / STRIPE_SPACING) + 3;
  const numStripes = Math.ceil(width / STRIPE_SPACING) + extraStripes * 2;
  const startIdx = -extraStripes;

  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  function buildZigzagPath(baseX: number): Path2D {
    const path = new Path2D();
    path.moveTo(baseX + zigzagOffset(0), 0);
    for (let y = FOLD_LENGTH; y <= height; y += FOLD_LENGTH) {
      path.lineTo(baseX + zigzagOffset(y), y);
    }
    const lastFold = Math.floor(height / FOLD_LENGTH) * FOLD_LENGTH;
    if (lastFold < height) {
      path.lineTo(baseX + zigzagOffset(height), height);
    }
    return path;
  }

  for (let si = startIdx; si < numStripes; si++) {
    const baseX = si * STRIPE_SPACING;
    const zigzagPath = buildZigzagPath(baseX);

    if (WHITE_BORDER > 0) {
      ctx.strokeStyle = bgColor;
      ctx.lineWidth = STRIPE_WIDTH + WHITE_BORDER * 2;
      ctx.stroke(zigzagPath);
    }

    ctx.strokeStyle = fgColor;
    ctx.lineWidth = STRIPE_WIDTH;
    ctx.stroke(zigzagPath);
  }

  const gapWidth = STRIPE_SPACING - STRIPE_WIDTH - WHITE_BORDER * 2;
  const microW = Math.max(1, gapWidth * 0.22);
  const microH = Math.max(1, gapWidth * 0.35);
  const microGapY = Math.max(1, gapWidth * 0.3);

  ctx.fillStyle = fgColor;

  for (let gi = startIdx; gi < numStripes; gi++) {
    const gapCenterBaseIdx = gi + 0.5;

    let inText = false;
    let textStartY = 0;

    for (let y = 0; y < height; y += 1) {
      const gapX = gapCenterBaseIdx * STRIPE_SPACING + zigzagOffset(y);
      const onText = isOnText(gapX, y);

      if (onText && !inText) {
        inText = true;
        textStartY = y;
      } else if (!onText && inText) {
        inText = false;
        drawMicroStrokesInGap(gapCenterBaseIdx, textStartY, y - textStartY);
      }
    }

    if (inText) {
      drawMicroStrokesInGap(gapCenterBaseIdx, textStartY, height - textStartY);
    }
  }

  function drawMicroStrokesInGap(gapBaseIdx: number, startY: number, runLen: number) {
    let y = startY;
    while (y < startY + runLen) {
      const gapX = gapBaseIdx * STRIPE_SPACING + zigzagOffset(y);

      const hash = Math.sin(y * 127.1 + gapBaseIdx * 311.7) * 43758.5453;
      const frac = hash - Math.floor(hash);
      const variation = 0.6 + 0.8 * Math.abs(frac);
      const segLen = microH * variation;

      ctx.fillRect(gapX - microW / 2, y, microW, segLen);

      const gapVariation = 0.5 + 0.5 * Math.abs(Math.sin(y * 0.073 + gapBaseIdx * 0.19));
      y += segLen + microGapY * gapVariation;
    }
  }

  return outputCanvas;
}
