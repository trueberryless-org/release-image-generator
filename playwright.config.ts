import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  forbidOnly: Boolean(process.env["CI"]),
  fullyParallel: true,
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  reporter: process.env["CI"]
    ? [["github"], ["html", { open: "never" }]]
    : "list",
  retries: process.env["CI"] ? 2 : 0,
  testDir: "tests/e2e",
  use: { baseURL, screenshot: "only-on-failure", trace: "on-first-retry" },
  webServer: {
    command: `HOST=127.0.0.1 PORT=${PORT} node dist/server/entry.mjs`,
    reuseExistingServer: false,
    timeout: 120_000,
    url: baseURL,
  },
  workers: process.env["CI"] ? 2 : "50%",
});
