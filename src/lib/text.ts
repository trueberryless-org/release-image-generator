import type { CanvasRenderingContext2D } from "canvas";
import { registerFont } from "canvas";
import path from "node:path";

import { colorToRgbString, createColor } from "./color";
import type { Color } from "./types";
import { SupportedFontFamily, SupportedFontWeight } from "./types";

const loadedFonts = new Set<string>();
const TEXT_SCALE_FACTOR = 0.95;

export function generateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
  fontFamily: SupportedFontFamily,
  fontWeight: SupportedFontWeight,
  primaryColor: Color
): void {
  loadFont(fontFamily, fontWeight);

  const fontSize = getMaxFontSize(
    ctx,
    text,
    width - width / 3,
    width > height ? height / 3 : width / 3,
    fontFamily
  );

  ctx.font = `${fontSize}px "${fontFamily}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width * TEXT_SCALE_FACTOR;
  const textHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  const textX = width / 2;
  const textY = height / 2;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.31)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = fontSize / 100;
  ctx.shadowOffsetY = fontSize / 100;
  ctx.fillStyle = "transparent";
  ctx.fillText(text, textX, textY);
  ctx.restore();

  const paddingX = fontSize / 2;
  const paddingY = fontSize / 3;
  const rectX = textX - textWidth / 2 - paddingX;
  const rectY = textY - textHeight / 2 - paddingY;
  const rectWidth = textWidth + paddingX * 2;
  const rectHeight = textHeight + paddingY * 2;
  const borderRadius = fontSize / 4;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = fontSize / 50;
  ctx.shadowOffsetY = fontSize / 50;
  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  roundRect(ctx, rectX, rectY, rectWidth, rectHeight, borderRadius);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  roundRect(ctx, rectX, rectY, rectWidth, rectHeight, borderRadius);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.31)";
  ctx.lineWidth = 4;
  roundRect(ctx, rectX, rectY, rectWidth, rectHeight, borderRadius);
  ctx.stroke();

  const gradient = ctx.createLinearGradient(
    rectX,
    rectY,
    rectX + rectWidth,
    rectY + rectHeight
  );

  gradient.addColorStop(0, "rgb(255, 255, 255)");

  const lightColor = createColor(
    Math.min(1, 0.8 + Math.max(0, (primaryColor.oklch.l - 0.8) * 0.5)),
    0,
    0,
    1
  );
  gradient.addColorStop(1, colorToRgbString(lightColor));

  ctx.fillStyle = gradient;
  ctx.fillText(text, textX, textY);
}

function loadFont(
  fontFamily: SupportedFontFamily,
  fontWeight: SupportedFontWeight
): void {
  const fontKey = `${fontFamily}-${fontWeight}`;
  if (loadedFonts.has(fontKey)) {
    return;
  }

  try {
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      `${fontKey}.ttf`
    );
    registerFont(fontPath, { family: fontFamily, weight: fontWeight });
    loadedFonts.add(fontKey);
  } catch {
    console.warn(
      `Failed to load font ${fontFamily}-${fontWeight}, using default`
    );
  }
}

function getMaxFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  fontFamily: SupportedFontFamily
): number {
  let min = 0;
  let max = maxHeight;
  let current = max;
  let last = -1;

  while (Math.abs(last - current) > 1) {
    ctx.font = `${current}px "${fontFamily}"`;
    const metrics = ctx.measureText(text);
    const width = metrics.width * TEXT_SCALE_FACTOR;

    if (width > maxWidth) {
      max = current;
    } else {
      min = current;
      last = current;
    }

    current = (min + max) / 2;
  }

  return Math.floor(Math.max(10, last));
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}
