import type { CanvasRenderingContext2D } from "canvas";
import { registerFont } from "canvas";
import path from "path";

import { ColorGenerator } from "./ColorGenerator";
import type { Color } from "./types";
import { SupportedFontFamily, SupportedFontWeight } from "./types";

export class TextGenerator {
  static generateText(
    ctx: CanvasRenderingContext2D,
    text: string,
    width: number,
    height: number,
    fontFamily: SupportedFontFamily,
    fontWeight: SupportedFontWeight,
    primaryColor: Color
  ): void {
    // Register font
    this.loadFont(fontFamily, fontWeight);

    // Calculate font size
    const fontSize = this.getMaxFontSize(
      ctx,
      text,
      width - width / 3,
      width > height ? height / 3 : width / 3,
      fontFamily,
      fontWeight
    );

    // Set font
    ctx.font = `${fontSize}px "${fontFamily}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Measure text
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width * 0.95; // Apply text scale
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const textX = width / 2;
    const textY = height / 2;

    // Draw text shadow
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.31)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = fontSize / 100;
    ctx.shadowOffsetY = fontSize / 100;
    ctx.fillStyle = "transparent";
    ctx.fillText(text, textX, textY);
    ctx.restore();

    // Draw glassmorphism background
    const paddingX = fontSize / 2;
    const paddingY = fontSize / 3;
    const rectX = textX - textWidth / 2 - paddingX;
    const rectY = textY - textHeight / 2 - paddingY;
    const rectWidth = textWidth + paddingX * 2;
    const rectHeight = textHeight + paddingY * 2;
    const borderRadius = fontSize / 4;

    // Shadow
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = fontSize / 50;
    ctx.shadowOffsetY = fontSize / 50;
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    this.roundRect(ctx, rectX, rectY, rectWidth, rectHeight, borderRadius);
    ctx.fill();
    ctx.restore();

    // Background
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    this.roundRect(ctx, rectX, rectY, rectWidth, rectHeight, borderRadius);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.31)";
    ctx.lineWidth = 4;
    this.roundRect(ctx, rectX, rectY, rectWidth, rectHeight, borderRadius);
    ctx.stroke();

    // Create gradient for text
    const gradient = ctx.createLinearGradient(
      rectX,
      rectY,
      rectX + rectWidth,
      rectY + rectHeight
    );

    gradient.addColorStop(0, "rgb(255, 255, 255)");

    const lightColor = ColorGenerator.createColor(
      Math.min(1, 0.8 + Math.max(0, (primaryColor.oklch.l - 0.8) * 0.5)),
      0,
      0,
      1
    );
    gradient.addColorStop(1, ColorGenerator.colorToRgbString(lightColor));

    // Draw text with gradient
    ctx.fillStyle = gradient;
    ctx.fillText(text, textX, textY);
  }

  private static loadFont(
    fontFamily: SupportedFontFamily,
    fontWeight: SupportedFontWeight
  ): void {
    try {
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        `${fontFamily}-${fontWeight}.ttf`
      );
      registerFont(fontPath, { family: fontFamily, weight: fontWeight });
    } catch (error) {
      // Fallback to default font if loading fails
      console.warn(
        `Failed to load font ${fontFamily}-${fontWeight}, using default`
      );
    }
  }

  private static getMaxFontSize(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxHeight: number,
    fontFamily: SupportedFontFamily,
    fontWeight: SupportedFontWeight
  ): number {
    let min = 0;
    let max = maxHeight;
    let current = max;
    let last = -1;

    while (Math.abs(last - current) > 1) {
      ctx.font = `${current}px "${fontFamily}"`;
      const metrics = ctx.measureText(text);
      const width = metrics.width * 0.95;

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

  private static roundRect(
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
}
