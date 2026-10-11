import type { APIRoute } from "astro";

import { generateImage, getContentType } from "../../lib/image";
import { parseImageOptions } from "../../lib/options";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const result = parseImageOptions(url.searchParams);

  if ("error" in result) {
    return new Response(result.error, { status: 400 });
  }

  const { options } = result;

  try {
    return new Response(new Uint8Array(generateImage(options)), {
      headers: {
        "Cache-Control":
          options.seed === undefined
            ? "public, max-age=0"
            : "public, max-age=86400, immutable",
        "Content-Type": getContentType(options.imageFormat),
      },
    });
  } catch (error) {
    console.error("Image generation error:", error);

    return new Response("Error generating image", { status: 500 });
  }
};
