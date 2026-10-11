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

    await expect.poll(() => bodies.length).toBe(2);
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

    await expect(back).toHaveAttribute("aria-disabled", "true");
    await expect(forward).toHaveAttribute("aria-disabled", "true");

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
    await expect(forward).toHaveAttribute("aria-disabled", "false");

    await back.click();
    await expect(status).toContainText("image 1 of 3");
    await expect(seed).toHaveValue(first);
    await expect(back).toHaveAttribute("aria-disabled", "true");

    await forward.click();
    await expect(seed).toHaveValue(second);

    await generate.click();
    await expect(status).toContainText("image 3 of 3");
    await expect(forward).toHaveAttribute("aria-disabled", "true");
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

    const preview = page.getByRole("img", {
      name: "Generated image without text, seed 5",
    });

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
    ).toHaveAttribute("aria-disabled", "false");
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
  function contrast(first: string, second: string) {
    const luminance = (color: string) => {
      const [red = 0, green = 0, blue = 0] = (color.match(/\d+/g) ?? [])
        .slice(0, 3)
        .map((channel) => Number(channel) / 255)
        .map((channel) =>
          channel <= 0.039_28
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4
        );

      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const [lighter = 0, darker = 0] = [
      luminance(first),
      luminance(second),
    ].toSorted((a, b) => b - a);

    return (lighter + 0.05) / (darker + 0.05);
  }

  for (const colorScheme of ["dark", "light"] as const) {
    test(`has no violations in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(
        violations.map(
          ({ id, nodes }) =>
            `${id}: ${nodes.map(({ target }) => target.join(" ")).join(", ")}`
        )
      ).toEqual([]);
    });

    test(`has no violations with an image in ${colorScheme} mode`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");
      await page.getByRole("button", { name: "New image" }).click();
      await expect(page.getByRole("status")).toContainText("image 1 of 1");

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(violations.map(({ id }) => id)).toEqual([]);
    });

    test(`gives form controls a 3:1 border contrast in ${colorScheme} mode`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");

      const colors = await page.evaluate(() => {
        const surface = getComputedStyle(
          document.querySelector("form")!
        ).backgroundColor;

        return ["#text", "#fontFamily", "#copy"].map((selector) => ({
          border: getComputedStyle(document.querySelector(selector)!)
            .borderTopColor,
          surface,
        }));
      });

      for (const { border, surface } of colors) {
        expect(contrast(border, surface)).toBeGreaterThanOrEqual(3);
      }
    });
  }

  test("has banner, main and contentinfo landmarks", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.getByRole("form", { name: "Options" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Result" })).toBeVisible();
  });

  test("keeps the focus on the button while an image loads", async ({
    page,
  }) => {
    await page.goto("/");

    const generate = page.getByRole("button", { name: "New image" });

    await generate.focus();
    await page.keyboard.press("Enter");
    await expect(generate).toHaveAttribute("aria-disabled", "true");
    await expect(generate).toBeFocused();
    await expect(page.getByRole("status")).toContainText("image 1 of 1");
    await expect(generate).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toContainText("image 2 of 2");

    const back = page.getByRole("button", { name: "Back" });

    await back.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toContainText("image 1 of 2");
    await expect(back).toHaveAttribute("aria-disabled", "true");
    await expect(back).toBeFocused();
  });

  test("keeps the focus indicator fully visible on unavailable buttons", async ({
    page,
  }) => {
    await page.goto("/");

    const back = page.getByRole("button", { name: "Back" });

    await back.focus();

    const style = await back.evaluate((element) => {
      const computed = getComputedStyle(element);

      return { opacity: computed.opacity, outline: computed.outlineStyle };
    });

    expect(style).toEqual({ opacity: "1", outline: "solid" });
  });

  test("ignores clicks on unavailable buttons", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Back" }).click({ force: true });

    await expect(page.getByRole("status")).toHaveText(
      "Choose your options and generate an image."
    );
  });

  test("lets the keyboard shortcuts be turned off", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Keyboard shortcuts").uncheck();
    await page.keyboard.press("r");
    await expect(page.getByLabel("Seed")).toHaveValue("");

    await page.reload();
    await expect(page.getByLabel("Keyboard shortcuts")).not.toBeChecked();
    await page.keyboard.press("r");
    await expect(page.getByLabel("Seed")).toHaveValue("");

    await page.getByLabel("Keyboard shortcuts").check();
    await page.keyboard.press("r");
    await expect(page.getByRole("status")).toContainText("image 1 of 1");
  });

  test("describes the size and seed fields", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByLabel("Width (px)")).toHaveAccessibleDescription(
      "Between 100 and 4000 pixels."
    );
    await expect(page.getByLabel("Seed")).toHaveAccessibleDescription(
      /same seed always gives the same image/
    );
  });

  test("describes the generated image", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Text").fill("v3.0");
    await page.getByLabel("Seed").fill("12");
    await page.getByLabel("Seed").press("Tab");

    await expect(
      page.getByRole("img", { name: "Generated image with the text “v3.0”, seed 12" })
    ).toBeVisible();
  });

  test("does not announce re-renders while typing", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "New image" }).click();

    const status = page.getByRole("status");

    await expect(status).toContainText("image 1 of 1");
    const message = await status.textContent();

    await page.getByLabel("Text").pressSequentially("abc");
    await page.waitForResponse((response) =>
      response.url().includes("text=abc")
    );
    await expect(status).toHaveText(message ?? "");
  });

  test("reflows at 320 CSS pixels", async ({ page }) => {
    await page.setViewportSize({ height: 640, width: 320 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );

    expect(overflow).toBeLessThanOrEqual(0);
  });

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
