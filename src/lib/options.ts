import type { ImageGeneratorOptions } from "./types";
import {
  NoiseLevel,
  SupportedFontFamily,
  SupportedFontWeight,
  SupportedImageFormat,
  SupportedPatternType,
} from "./types";

export const DEFAULT_WIDTH = 1920;
export const DEFAULT_HEIGHT = 1080;
export const MIN_SIZE = 100;
export const MAX_SIZE = 4000;
export const MAX_SEED = 9007199254740990;

export function parseImageOptions(params: URLSearchParams): ImageOptionsResult {
  const fontFamily = parseEnum(
    SupportedFontFamily,
    params.get("fontFamily") || SupportedFontFamily.readexpro
  );
  if (!fontFamily) return { error: "Invalid fontFamily" };

  const fontWeight = parseEnum(
    SupportedFontWeight,
    params.get("fontWeight") || SupportedFontWeight.bold
  );
  if (!fontWeight) return { error: "Invalid fontWeight" };

  const imageFormat = parseEnum(
    SupportedImageFormat,
    params.get("imageFormat") || SupportedImageFormat.png
  );
  if (!imageFormat) return { error: "Invalid imageFormat" };

  const noiseLevel = parseEnum(
    NoiseLevel,
    params.get("noiseLevel") || NoiseLevel.medium
  );
  if (!noiseLevel) return { error: "Invalid noiseLevel" };

  const patternTypeParam = params.get("patternType") || undefined;
  const patternType =
    patternTypeParam === undefined
      ? undefined
      : parseEnum(SupportedPatternType, patternTypeParam);
  if (patternTypeParam !== undefined && !patternType) {
    return { error: "Invalid patternType" };
  }

  return {
    options: {
      fontFamily,
      fontWeight,
      height: parseSize(params.get("height"), DEFAULT_HEIGHT),
      imageFormat,
      noiseLevel,
      patternType,
      primaryColor: params.get("primaryColor") || undefined,
      seed: parseSeed(params.get("seed")),
      text: params.get("text") ?? undefined,
      width: parseSize(params.get("width"), DEFAULT_WIDTH),
    },
  };
}

function parseEnum<TEnum extends Record<string, string>>(
  enumObject: TEnum,
  value: string
): TEnum[keyof TEnum] | undefined {
  return Object.values(enumObject).find(
    (member): member is TEnum[keyof TEnum] => member === value
  );
}

function parseSize(value: string | null, fallback: number) {
  const size = Number.parseInt(value ?? "", 10) || fallback;

  return Math.max(MIN_SIZE, Math.min(MAX_SIZE, size));
}

function parseSeed(value: string | null) {
  const seed = Number.parseInt(value ?? "", 10);

  return Number.isFinite(seed)
    ? Math.max(0, Math.min(MAX_SEED, seed))
    : undefined;
}

export type ImageOptionsResult =
  { error: string } | { options: ImageGeneratorOptions };
