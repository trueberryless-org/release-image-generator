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

  test("generates a new image with a new seed on every click", async ({
    page,
  }) => {
    const seed = page.getByLabel("Seed");
    const generate = page.getByRole("button", { name: "New image" });
    const status = page.getByRole("status");

    await generate.click();
    await expect(status).toContainText("image 1 of 1");
    const first = await seed.inputValue();

    await generate.click();
    await expect(status).toContainText("image 2 of 2");
    const second = await seed.inputValue();

    expect(first).not.toBe("");
    expect(second).not.toBe(first);
    await expect(page.getByLabel("API URL")).toHaveValue(
      new RegExp(`seed=${second}(&|$)`)
    );
  });

  test("loads a different image for a different seed", async ({ page }) => {
    const bodies: string[] = [];

    page.on("response", async (response) => {
      if (response.url().includes("/api/generateImage")) {
        bodies.push((await response.body()).toString("base64"));
      }
    });

    const generate = page.getByRole("button", { name: "New image" });
    const status = page.getByRole("status");

    await page.getByLabel("Width (px)").fill("200");
    await page.getByLabel("Height (px)").fill("120");
    await generate.click();
    await expect(status).toContainText("image 1 of 1");
    await generate.click();
    await expect(status).toContainText("image 2 of 2");

    expect(bodies).toHaveLength(2);
    expect(bodies[0]).not.toBe(bodies[1]);
  });

  test("goes back and forth between the generated images", async ({
    page,
  }) => {
    const seed = page.getByLabel("Seed");
    const generate = page.getByRole("button", { name: "New image" });
    const back = page.getByRole("button", { name: "Back" });
    const forward = page.getByRole("button", { name: "Forward" });
    const status = page.getByRole("status");

    await expect(back).toBeDisabled();
    await expect(forward).toBeDisabled();

    await generate.click();
    await expect(status).toContainText("image 1 of 1");
    const first = await seed.inputValue();
    await generate.click();
    await expect(status).toContainText("image 2 of 2");
    const second = await seed.inputValue();
    await generate.click();
    await expect(status).toContainText("image 3 of 3");

    await back.click();
    await expect(status).toContainText("image 2 of 3");
    await expect(seed).toHaveValue(second);
    await expect(forward).toBeEnabled();

    await back.click();
    await expect(status).toContainText("image 1 of 3");
    await expect(seed).toHaveValue(first);
    await expect(back).toBeDisabled();

    await forward.click();
    await expect(seed).toHaveValue(second);

    await generate.click();
    await expect(status).toContainText("image 3 of 3");
    await expect(forward).toBeDisabled();
  });

  test("supports the keyboard shortcuts", async ({ page }) => {
    const seed = page.getByLabel("Seed");
    const status = page.getByRole("status");

    await page.keyboard.press("r");
    await expect(status).toContainText("image 1 of 1");
    const first = await seed.inputValue();
    await page.keyboard.press("r");
    await expect(status).toContainText("image 2 of 2");

    await page.keyboard.press("b");
    await expect(seed).toHaveValue(first);
    await expect(status).toContainText("image 1 of 2");
    await page.keyboard.press("f");
    await expect(status).toContainText("image 2 of 2");
  });

  test("keeps the shortcuts out of the text field", async ({ page }) => {
    await page.getByLabel("Text").fill("rbf");

    await expect(page.getByLabel("Text")).toHaveValue("rbf");
    await expect(page.getByLabel("Seed")).toHaveValue("");
  });

  test("keeps the seed when an option changes", async ({ page }) => {
    const seed = page.getByLabel("Seed");
    const status = page.getByRole("status");

    await page.getByRole("button", { name: "New image" }).click();
    await expect(status).toContainText("image 1 of 1");
    const current = await seed.inputValue();

    await page.getByLabel("Text").fill("v2");
    await expect(status).toContainText("image 1 of 1");

    await expect(seed).toHaveValue(current);
    await expect(page.getByLabel("API URL")).toHaveValue(/text=v2/);
    await expect(
      page.getByRole("link", { name: "Open image in a new tab" })
    ).toHaveAttribute("href", /text=v2/);
  });

  test("uses a seed that was typed in", async ({ page }) => {
    const status = page.getByRole("status");

    await page.getByLabel("Width (px)").fill("320");
    await page.getByLabel("Height (px)").fill("180");
    await page.getByLabel("Seed").fill("5");
    await page.getByLabel("Seed").press("Tab");

    const preview = page.getByRole("img", { name: "Generated preview" });

    await expect(status).toContainText("Seed 5");
    await expect(preview).toBeVisible();
    expect(
      await preview.evaluate((image: HTMLImageElement) => image.naturalWidth)
    ).toBe(320);
  });

  test("reports an image that cannot be generated", async ({ page }) => {
    await page.route("**/api/generateImage*", (route) =>
      route.fulfill({ body: "Error generating image", status: 500 })
    );
    await page.getByRole("button", { name: "New image" }).click();

    await expect(page.getByRole("status")).toContainText(
      "could not be generated"
    );
    await expect(
      page.getByRole("button", { name: "New image" })
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
