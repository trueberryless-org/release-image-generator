import { createCanvas } from "canvas";
import type { ImageGeneratorOptions } from "./types";
import { SupportedImageFormat } from "./types";
import { ColorGenerator, ColorLimitation } from "./ColorGenerator";
import { BackgroundGenerator } from "./BackgroundGenerator";
import { PatternGenerator } from "./PatternGenerator";
import { NoiseGenerator } from "./NoiseGenerator";
import { TextGenerator } from "./TextGenerator";

export class ImageGenerator {
  private options: ImageGeneratorOptions;
  private randomSeed: number;

  constructor(options: ImageGeneratorOptions) {
    this.options = options;
    this.randomSeed = Math.abs(options.seed ?? Date.now());
  }

  // Seeded random number generator for consistent randomization
  private random = (): number => {
    this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
    return this.randomSeed / 233280;
  };

  generateImage(): Buffer {
    const {
      width,
      height,
      text,
      fontFamily,
      fontWeight,
      primaryColor,
      imageFormat,
      patternType,
      noiseLevel,
    } = this.options;

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Get or generate primary color
    const color = primaryColor
      ? ColorGenerator.parseColor(this.random, primaryColor)
      : ColorGenerator.getRandomColor(
          this.random,
          ColorLimitation.NEUTRAL_LIGHTNESS,
          ColorLimitation.NEUTRAL_SATURATION,
        );

    // Generate layers
    BackgroundGenerator.generateBackground(
      ctx,
      width,
      height,
      this.random,
      color,
    );
    PatternGenerator.generatePattern(
      ctx,
      width,
      height,
      this.random,
      color,
      patternType,
    );
    NoiseGenerator.generateNoise(ctx, width, height, noiseLevel, this.random);

    if (text) {
      TextGenerator.generateText(
        ctx,
        text,
        width,
        height,
        fontFamily,
        fontWeight,
        color,
      );
    }

    // Encode to buffer
    let mimeType: string;
    switch (imageFormat) {
      case SupportedImageFormat.jpeg:
      case SupportedImageFormat.jpg:
        mimeType = "image/jpeg";
        break;
      case SupportedImageFormat.webp:
        mimeType = "image/webp";
        break;
      default:
        mimeType = "image/png";
    }

    return canvas.toBuffer(mimeType as any, { quality: 1.0 });
  }
}
