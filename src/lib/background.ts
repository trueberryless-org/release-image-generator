import type { CanvasRenderingContext2D } from "canvas";

import { colorToRgbString, getRandomColor, getRandomPalette } from "./color";
import type { Color } from "./types";

export function generateBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  random: () => number,
  primaryColor: Color
): void {
  const colorPalette = Array.from({ length: 8 }, () =>
    getRandomColor(random)
  ).map((c) => colorToRgbString(c));

  const corners = [
    { x1: 0, y1: 0, x2: width, y2: height },
    { x1: width, y1: 0, x2: 0, y2: height },
    { x1: 0, y1: height, x2: width, y2: 0 },
    { x1: width, y1: height, x2: 0, y2: 0 },
  ];

  const corner1 = pickRandom(corners, random);

  const gradient1 = ctx.createLinearGradient(
    corner1.x1,
    corner1.y1,
    corner1.x2,
    corner1.y2
  );

  colorPalette.forEach((color, i) => {
    gradient1.addColorStop(i / (colorPalette.length - 1), color);
  });

  ctx.fillStyle = gradient1;
  ctx.fillRect(0, 0, width, height);

  const colorPalette2 = getRandomPalette(primaryColor, 6, 30, 0.3).map((c) =>
    colorToRgbString(c)
  );

  const corner2 = pickRandom(corners, random);

  const gradient2 = ctx.createLinearGradient(
    corner2.x1,
    corner2.y1,
    corner2.x2,
    corner2.y2
  );

  colorPalette2.forEach((color, i) => {
    gradient2.addColorStop(i / (colorPalette2.length - 1), color);
  });

  ctx.fillStyle = gradient2;
  ctx.fillRect(0, 0, width, height);

  const colorPalette3 = getRandomPalette(primaryColor, 3, 40, 0.2).map((c) =>
    colorToRgbString(c)
  );

  const corner3 = pickRandom(corners, random);

  const gradient3 = ctx.createLinearGradient(
    corner3.x1,
    corner3.y1,
    corner3.x2,
    corner3.y2
  );

  colorPalette3.forEach((color, i) => {
    gradient3.addColorStop(i / (colorPalette3.length - 1), color);
  });

  ctx.fillStyle = gradient3;
  ctx.fillRect(0, 0, width, height);
}

function pickRandom<T>(items: T[], random: () => number) {
  return items[Math.floor(random() * items.length)] as T;
}
