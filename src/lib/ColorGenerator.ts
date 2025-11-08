import type { Color, OklchColor, RgbColor } from "./types";
import { parse, oklch, converter } from "culori";

export enum ColorLimitation {
  ALL = "ALL",
  LIGHTER = "LIGHTER",
  NEUTRAL_LIGHTNESS = "NEUTRAL_LIGHTNESS",
  DARKER = "DARKER",
  SATURATED = "SATURATED",
  NEUTRAL_SATURATION = "NEUTRAL_SATURATION",
  DESATURATED = "DESATURATED",
}

export class ColorGenerator {
  static getRandomColor(...limitations: ColorLimitation[]): Color {
    let saturationRange = { min: 0, max: 0.4 };
    let lightnessRange = { min: 0, max: 1 };

    limitations.forEach((limitation) => {
      switch (limitation) {
        case ColorLimitation.NEUTRAL_SATURATION:
          saturationRange = { min: 0.1, max: 0.3 };
          break;
        case ColorLimitation.SATURATED:
          saturationRange = { min: 0.2, max: 0.4 };
          break;
        case ColorLimitation.DESATURATED:
          saturationRange = { min: 0, max: 0.2 };
          break;
        case ColorLimitation.NEUTRAL_LIGHTNESS:
          lightnessRange = { min: 0.25, max: 0.75 };
          break;
        case ColorLimitation.LIGHTER:
          lightnessRange = { min: 0.5, max: 1 };
          break;
        case ColorLimitation.DARKER:
          lightnessRange = { min: 0, max: 0.5 };
          break;
      }
    });

    const l =
      lightnessRange.min +
      Math.random() * (lightnessRange.max - lightnessRange.min);
    const c =
      saturationRange.min +
      Math.random() * (saturationRange.max - saturationRange.min);
    const h = Math.random() * 360;

    return this.createColor(l, c, h, 1);
  }

  static createColor(
    l: number,
    c: number,
    h: number,
    alpha: number = 1,
  ): Color {
    const oklch = { l, c, h };
    const rgb = this.oklchToRgb(oklch);

    return { oklch, rgb, alpha };
  }

  static parseColor(colorString: string): Color {
    const parsed = parse(colorString);
    if (!parsed) {
      return this.getRandomColor(
        ColorLimitation.NEUTRAL_LIGHTNESS,
        ColorLimitation.NEUTRAL_SATURATION,
      );
    }

    const oklchClr = oklch(parsed);
    return this.createColor(
      oklchClr.l || 0.5,
      oklchClr.c || 0.1,
      oklchClr.h || 0,
      oklchClr.alpha ?? 1,
    );
  }

  static getRandomPalette(
    primaryColor: Color,
    numberOfColors: number = 5,
    spread: number = 20,
    alpha: number = 1,
  ): Color[] {
    const halfPaletteSize = Math.floor(numberOfColors / 2);
    const colors: Color[] = [];

    for (let i = -halfPaletteSize; i <= halfPaletteSize; i++) {
      const shiftedHue = (primaryColor.oklch.h + i * spread + 360) % 360;
      colors.push(
        this.createColor(
          primaryColor.oklch.l,
          primaryColor.oklch.c,
          shiftedHue,
          alpha,
        ),
      );
    }

    return colors;
  }

  static oklchToRgb(oklchClr: OklchColor): RgbColor {
    const toRgb = converter("rgb");
    const oklchString = `oklch(${oklchClr.l} ${oklchClr.c} ${oklchClr.h})`;
    const rgbClr = toRgb(oklchString);

    return {
      r: Math.max(0, Math.min(1, rgbClr?.r ?? 0)),
      g: Math.max(0, Math.min(1, rgbClr?.g ?? 0)),
      b: Math.max(0, Math.min(1, rgbClr?.b ?? 0)),
    };
  }

  static colorToRgbaString(color: Color): string {
    return `rgba(${Math.round(color.rgb.r * 255)}, ${Math.round(color.rgb.g * 255)}, ${Math.round(color.rgb.b * 255)}, ${color.alpha})`;
  }

  static colorToRgbString(color: Color): string {
    return `rgb(${Math.round(color.rgb.r * 255)}, ${Math.round(color.rgb.g * 255)}, ${Math.round(color.rgb.b * 255)})`;
  }
}
