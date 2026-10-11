import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47];

test.describe("landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has the title, the canonical url and the standard Open Graph image", async ({
    page,
  }) => {
    await expect(page).toHaveTitle("Release Image Generator");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Release Image Generator"
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://release-image-generator.netlify.app/"
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://release-image-generator.netlify.app/og-image.png"
    );
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      "href",
      "/favicon.svg"
    );
  });

  test("shows the API URL for the current options", async ({ page }) => {
    const url = page.getByLabel("API URL");

    await expect(url).toHaveValue(/\/api\/generateImage\?/);
    await expect(url).toHaveValue(/width=1920&height=1080/);

    await page.getByLabel("Text").fill("Release v2");
    await page.getByLabel("Pattern").selectOption("hexagons");

    await expect(url).toHaveValue(/text=Release\+v2/);
    await expect(url).toHaveValue(/patternType=hexagons/);
  });

  test("only sends a color when the random color is turned off", async ({
    page,
  }) => {
    const url = page.getByLabel("API URL");
    const color = page.getByLabel("Primary color");

    await expect(color).toBeDisabled();
    await expect(url).not.toHaveValue(/primaryColor/);

    await page.getByLabel("Random color").uncheck();

    await expect(color).toBeEnabled();
    await expect(url).toHaveValue(/primaryColor=%23/);
  });

  test("generates and shows the image", async ({ page }) => {
    await page.getByLabel("Width (px)").fill("320");
    await page.getByLabel("Height (px)").fill("180");
    await page.getByLabel("Seed").fill("5");
    await page.getByRole("button", { name: "Generate image" }).click();

    const preview = page.getByRole("img", { name: "Generated preview" });

    await expect(preview).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("Image generated.");
    expect(
      await preview.evaluate((image: HTMLImageElement) => image.naturalWidth)
    ).toBe(320);
    await expect(
      page.getByRole("link", { name: "Open image in a new tab" })
    ).toHaveAttribute("href", /seed=5/);
  });

  test("reports an image that cannot be generated", async ({ page }) => {
    await page.route("**/api/generateImage*", (route) =>
      route.fulfill({ body: "Error generating image", status: 500 })
    );
    await page.getByRole("button", { name: "Generate image" }).click();

    await expect(page.getByRole("status")).toContainText(
      "could not be generated"
    );
    await expect(
      page.getByRole("button", { name: "Generate image" })
    ).toBeEnabled();
  });
});

test.describe("API", () => {
  test("returns a png by default", async ({ request }) => {
    const response = await request.get("/api/generateImage?text=Hello&width=200&height=120");
    const body = await response.body();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    expect([...body.subarray(0, 4)]).toEqual(PNG_SIGNATURE);
    expect(body.readUInt32BE(16)).toBe(200);
    expect(body.readUInt32BE(20)).toBe(120);
  });

  test("returns a jpeg when requested", async ({ request }) => {
    const response = await request.get("/api/generateImage?imageFormat=jpg&width=200&height=120");

    expect(response.headers()["content-type"]).toBe("image/jpeg");
  });

  test("returns the same image for the same seed and caches it", async ({
    request,
  }) => {
    const first = await request.get("/api/generateImage?seed=12&text=Seed&width=200&height=120");
    const second = await request.get("/api/generateImage?seed=12&text=Seed&width=200&height=120");

    expect(first.headers()["cache-control"]).toBe(
      "public, max-age=86400, immutable"
    );
    expect((await first.body()).equals(await second.body())).toBe(true);
  });

  test("does not cache images without a seed", async ({ request }) => {
    const response = await request.get("/api/generateImage?width=200&height=120");

    expect(response.headers()["cache-control"]).toBe("public, max-age=0");
  });

  test("limits the size", async ({ request }) => {
    const response = await request.get("/api/generateImage?width=1&height=1");
    const body = await response.body();

    expect(body.readUInt32BE(16)).toBe(100);
    expect(body.readUInt32BE(20)).toBe(100);
  });

  for (const [query, message] of [
    ["fontFamily=comic-sans", "Invalid fontFamily"],
    ["fontWeight=black", "Invalid fontWeight"],
    ["imageFormat=gif", "Invalid imageFormat"],
    ["noiseLevel=loud", "Invalid noiseLevel"],
    ["patternType=zigzag", "Invalid patternType"],
  ] as const) {
    test(`rejects ${query}`, async ({ request }) => {
      const response = await request.get(`/api/generateImage?${query}`);

      expect(response.status()).toBe(400);
      expect(await response.text()).toBe(message);
    });
  }
});

test("shows a 404 for unknown pages", async ({ request }) => {
  const response = await request.get("/nothing-here");

  expect(response.status()).toBe(404);
});

test.describe("accessibility", () => {
  for (const colorScheme of ["dark", "light"] as const) {
    test(`has no violations in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      expect(
        violations.map(
          ({ id, nodes }) =>
            `${id}: ${nodes.map(({ target }) => target.join(" ")).join(", ")}`
        )
      ).toEqual([]);
    });
  }

  test("does not scroll horizontally", async ({ page }) => {
    await page.goto("/");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );

    expect(overflow).toBeLessThanOrEqual(0);
  });
});
