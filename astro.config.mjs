// astro.config.mjs
import netlify from "@astrojs/netlify";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://release-image-generator.trueberryless.org",
  output: "server",
  adapter: netlify(),
  vite: {
    ssr: {
      external: ["canvas"],
    },
  },
});
