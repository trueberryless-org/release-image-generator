import type { CanvasRenderingContext2D } from "canvas";
import type { Color } from "./types";
import { ColorGenerator } from "./ColorGenerator";

export class BackgroundGenerator {
  static generateBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    primaryColor: Color,
  ): void {
    // Generate new random colors each time (not using primaryColor palette)
    const colorPalette = Array.from({ length: 8 }, () =>
      ColorGenerator.getRandomColor(random),
    ).map((c) => ColorGenerator.colorToRgbString(c));

    // Random corner-to-corner gradient
    const corners = [
      { x1: 0, y1: 0, x2: width, y2: height }, // top-left to bottom-right
      { x1: width, y1: 0, x2: 0, y2: height }, // top-right to bottom-left
      { x1: 0, y1: height, x2: width, y2: 0 }, // bottom-left to top-right
      { x1: width, y1: height, x2: 0, y2: 0 }, // bottom-right to top-left
    ];

    const corner1 = corners[Math.floor(random() * corners.length)];

    // First gradient
    const gradient1 = ctx.createLinearGradient(
      corner1.x1,
      corner1.y1,
      corner1.x2,
      corner1.y2,
    );

    colorPalette.forEach((color, i) => {
      gradient1.addColorStop(i / (colorPalette.length - 1), color);
    });

    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, width, height);

    // Second gradient with more harmonic colors
    const colorPalette2 = ColorGenerator.getRandomPalette(
      primaryColor,
      6,
      30,
      0.3,
    ).map((c) => ColorGenerator.colorToRgbString(c));

    const corner2 = corners[Math.floor(random() * corners.length)];

    const gradient2 = ctx.createLinearGradient(
      corner2.x1,
      corner2.y1,
      corner2.x2,
      corner2.y2,
    );

    colorPalette2.forEach((color, i) => {
      gradient2.addColorStop(i / (colorPalette2.length - 1), color);
    });

    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, width, height);

    // Third gradient (still using palette for harmony)
    const colorPalette3 = ColorGenerator.getRandomPalette(
      primaryColor,
      3,
      40,
      0.2,
    ).map((c) => ColorGenerator.colorToRgbString(c));

    const corner3 = corners[Math.floor(random() * corners.length)];

    const gradient3 = ctx.createLinearGradient(
      corner3.x1,
      corner3.y1,
      corner3.x2,
      corner3.y2,
    );

    colorPalette3.forEach((color, i) => {
      gradient3.addColorStop(i / (colorPalette3.length - 1), color);
    });

    ctx.fillStyle = gradient3;
    ctx.fillRect(0, 0, width, height);
  }
}
