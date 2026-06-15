import { GeneratorParams } from '../types';

export function generateMask(
  width: number,
  height: number,
  params: GeneratorParams
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxAllowedWidth = width * 0.85;
  const baseFontSize = width * 0.12;
  const computedFontSize = baseFontSize * (params.fontSize / 100);

  ctx.font = `${params.fontWeight} ${computedFontSize}px "${params.fontFamily}", sans-serif`;
  const lines = params.text.split('\n');

  let finalFontSize = computedFontSize;
  lines.forEach((line) => {
    const metrics = ctx.measureText(line);
    if (metrics.width > maxAllowedWidth) {
      const ratio = maxAllowedWidth / metrics.width;
      finalFontSize = Math.min(finalFontSize, computedFontSize * ratio);
    }
  });

  ctx.font = `${params.fontWeight} ${finalFontSize}px "${params.fontFamily}", sans-serif`;
  ctx.fillStyle = '#000000';

  const lineHeight = finalFontSize * 1.15;
  const totalHeight = lines.length * lineHeight;
  const startY = height / 2 - totalHeight / 2 + lineHeight / 2;

  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    if (params.fontSpacing !== 0 && 'letterSpacing' in ctx) {
      (ctx as any).letterSpacing = `${(width * params.fontSpacing) / 500}px`;
      ctx.fillText(line, width / 2, y);
    } else {
      ctx.fillText(line, width / 2, y);
    }
  });

  return canvas;
}
