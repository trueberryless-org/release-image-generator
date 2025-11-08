import type { APIRoute } from "astro";
import { ImageGenerator } from "../../lib/ImageGenerator";
import type { ImageGeneratorOptions } from "../../lib/types";
import { NoiseLevel } from "../../lib/types";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const params = url.searchParams;

  // Parse query parameters with defaults
  const options: ImageGeneratorOptions = {
    text: params.get("text") || undefined,
    width: parseInt(params.get("width") || "1200"),
    height: parseInt(params.get("height") || "630"),
    fontFamily: (params.get("fontFamily") || "readexpro") as any,
    fontWeight: (params.get("fontWeight") || "bold") as any,
    primaryColor: params.get("primaryColor") || undefined,
    imageFormat: (params.get("imageFormat") || "png") as any,
    patternType: (params.get("patternType") as any) || undefined,
    noiseLevel: (params.get("noiseLevel") || "medium") as NoiseLevel,
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
