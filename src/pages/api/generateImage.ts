import type { APIRoute } from "astro";
import { ImageGenerator } from "../../lib/ImageGenerator";

import {
  type ImageGeneratorOptions,
  NoiseLevel,
  SupportedFontFamily,
  SupportedFontWeight,
  SupportedImageFormat,
  SupportedPatternType,
} from "../../lib/types";

export const prerender = false;

// Validation helpers
const isValidFontFamily = (value: string): value is SupportedFontFamily =>
  Object.values(SupportedFontFamily).includes(value as any);

const isValidFontWeight = (value: string): value is SupportedFontWeight =>
  Object.values(SupportedFontWeight).includes(value as any);

const isValidImageFormat = (value: string): value is SupportedImageFormat =>
  Object.values(SupportedImageFormat).includes(value as any);

const isValidPatternType = (
  value: string | undefined,
): value is SupportedPatternType | undefined =>
  Object.values(SupportedPatternType).includes(value as any) ||
  value === undefined;

const isValidNoiseLevel = (value: string): value is NoiseLevel =>
  Object.values(NoiseLevel).includes(value as any);

export const GET: APIRoute = async ({ url }) => {
  const params = url.searchParams;

  const fontFamily = params.get("fontFamily") || "readexpro";
  const fontWeight = params.get("fontWeight") || "bold";
  const imageFormat = params.get("imageFormat") || "png";
  const noiseLevel = params.get("noiseLevel") || "medium";
  const patternType = params.get("patternType") || undefined;

  // Validate enums
  if (!isValidFontFamily(fontFamily)) {
    return new Response("Invalid fontFamily", { status: 400 });
  }
  if (!isValidFontWeight(fontWeight)) {
    return new Response("Invalid fontWeight", { status: 400 });
  }
  if (!isValidImageFormat(imageFormat)) {
    return new Response("Invalid imageFormat", { status: 400 });
  }
  if (!isValidNoiseLevel(noiseLevel)) {
    return new Response("Invalid noiseLevel", { status: 400 });
  }
  if (!isValidPatternType(patternType)) {
    return new Response("Invalid patternType", { status: 400 });
  }

  // Parse query parameters with defaults
  const options: ImageGeneratorOptions = {
    text: params.get("text") ?? undefined,
    width: Math.max(
      100,
      Math.min(4000, parseInt(params.get("width") || "1920") || 1920),
    ),
    height: Math.max(
      100,
      Math.min(4000, parseInt(params.get("height") || "1080") || 1080),
    ),
    fontFamily,
    fontWeight,
    primaryColor: params.get("primaryColor") || undefined,
    imageFormat,
    patternType,
    noiseLevel,
    seed:
      params.get("seed") != null
        ? Math.max(0, Math.min(9007199254740990, parseInt(params.get("seed")!)))
        : undefined,
  };

  try {
    const generator = new ImageGenerator(options);
    const imageBuffer = generator.generateImage();

    // Determine content type
    const contentType =
      options.imageFormat === "jpeg" || options.imageFormat === "jpg"
        ? "image/jpeg"
        : options.imageFormat === "webp"
          ? "image/webp"
          : "image/png";

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=0",
      },
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return new Response("Error generating image", { status: 500 });
  }
};
