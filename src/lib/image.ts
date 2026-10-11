import { createCanvas } from "canvas";

import { generateBackground } from "./background";
import { ColorLimitation, getRandomColor, parseColor } from "./color";
import { generateNoise } from "./noise";
import { generatePattern } from "./pattern";
import { createRandom } from "./random";
import { generateText } from "./text";
import type { ImageGeneratorOptions } from "./types";
import { SupportedImageFormat } from "./types";

export function generateImage(options: ImageGeneratorOptions): Buffer {
  const {
    fontFamily,
    fontWeight,
    height,
    imageFormat,
    noiseLevel,
    patternType,
    primaryColor,
    text,
    width,
  } = options;

  const random = createRandom(options.seed ?? Date.now());
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const color = primaryColor
    ? parseColor(random, primaryColor)
    : getRandomColor(
        random,
        ColorLimitation.NEUTRAL_LIGHTNESS,
        ColorLimitation.NEUTRAL_SATURATION
      );

  generateBackground(ctx, width, height, random, color);
  generatePattern(ctx, width, height, random, color, patternType);
  generateNoise(ctx, width, height, noiseLevel, random);

  if (text) {
    generateText(ctx, text, width, height, fontFamily, fontWeight, color);
  }

  return isJpeg(imageFormat)
    ? canvas.toBuffer("image/jpeg", { quality: 1 })
    : canvas.toBuffer("image/png");
}

export function getContentType(imageFormat: SupportedImageFormat) {
  return isJpeg(imageFormat) ? "image/jpeg" : "image/png";
}

function isJpeg(imageFormat: SupportedImageFormat) {
  return (
    imageFormat === SupportedImageFormat.jpeg ||
    imageFormat === SupportedImageFormat.jpg
  );
}
