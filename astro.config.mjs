// astro.config.mjs
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

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
