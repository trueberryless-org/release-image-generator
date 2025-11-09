import { createCanvas } from "canvas";
import type { CanvasRenderingContext2D } from "canvas";

import { NoiseLevel } from "./types";

export class NoiseGenerator {
  static generateNoise(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    noiseLevel: NoiseLevel,
    random: () => number
  ): void {
    const noiseWidth = Math.max(
      1,
      Math.floor(width / (Math.floor(random() * 5) + 7))
    );
    const noiseHeight = Math.max(
      1,
      Math.floor(height / (Math.floor(random() * 5) + 7))
    );

    const noiseCanvas = createCanvas(noiseWidth, noiseHeight);
    const noiseCtx = noiseCanvas.getContext("2d");
    const imageData = noiseCtx.createImageData(noiseWidth, noiseHeight);

    // Adjust noise intensity based on level
    let intensityMultiplier: number;
    let alpha: number;

    switch (noiseLevel) {
      case NoiseLevel.low:
        intensityMultiplier = 0.5;
        alpha = 15;
        break;
      case NoiseLevel.high:
        intensityMultiplier = 2;
        alpha = 40;
        break;
      case NoiseLevel.medium:
      default:
        intensityMultiplier = 1;
        alpha = 30;
        break;
    }

    for (let y = 0; y < noiseHeight; y++) {
      for (let x = 0; x < noiseWidth; x++) {
        const i = (y * noiseWidth + x) * 4;
        const noise = Math.floor(
          random() *
            Math.min(
              256,
              (width / 100) *
                (height / 100) *
                Math.floor(random() * 3 + 1) *
                intensityMultiplier
            )
        );

        imageData.data[i] = noise; // R
        imageData.data[i + 1] = noise; // G
        imageData.data[i + 2] = noise; // B
        imageData.data[i + 3] = alpha; // A
      }
    }

    noiseCtx.putImageData(imageData, 0, 0);

    // Create pattern and fill
    const pattern = ctx.createPattern(noiseCanvas, "repeat");
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
    }
  }
}
