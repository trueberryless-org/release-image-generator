import netlify from "@astrojs/netlify";
import node from "@astrojs/node";
import { defineConfig } from "astro/config";

export default defineConfig({
  adapter: process.env["NETLIFY"]
    ? netlify({ includeFiles: ["./public/fonts/**"] })
    : node({ mode: "standalone" }),
  output: "server",
  site: "https://release-image-generator.netlify.app",
  vite: {
    ssr: {
      external: ["canvas"],
    },
  },
});
