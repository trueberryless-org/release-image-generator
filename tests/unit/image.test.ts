import { describe, expect, test } from "vitest";

import { generateImage, getContentType } from "../../src/lib/image";
import type { ImageGeneratorOptions } from "../../src/lib/types";
import {
  NoiseLevel,
  SupportedFontFamily,
  SupportedFontWeight,
  SupportedImageFormat,
  SupportedPatternType,
} from "../../src/lib/types";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function createOptions(
  overrides: Partial<ImageGeneratorOptions> = {}
): ImageGeneratorOptions {
  return {
    fontFamily: SupportedFontFamily.readexpro,
    fontWeight: SupportedFontWeight.bold,
    height: 90,
    imageFormat: SupportedImageFormat.png,
    noiseLevel: NoiseLevel.medium,
    seed: 1,
    width: 160,
    ...overrides,
  };
}

describe("getContentType", () => {
  test.each([
    [SupportedImageFormat.png, "image/png"],
    [SupportedImageFormat.jpg, "image/jpeg"],
    [SupportedImageFormat.jpeg, "image/jpeg"],
  ])("maps %s to %s", (format, contentType) => {
    expect(getContentType(format)).toBe(contentType);
  });
});

describe("generateImage", () => {
  test("creates a png with the requested size", () => {
    const image = generateImage(createOptions());

    expect(image.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
    expect(image.readUInt32BE(16)).toBe(160);
    expect(image.readUInt32BE(20)).toBe(90);
  });

  test.each([SupportedImageFormat.jpg, SupportedImageFormat.jpeg])(
    "creates a jpeg for %s",
    (imageFormat) => {
      const image = generateImage(createOptions({ imageFormat }));

      expect([...image.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    }
  );

  test("is deterministic for a seed", () => {
    const options = createOptions({ text: "v1.0.0" });

    expect(generateImage(options).equals(generateImage(options))).toBe(true);
  });

  test("differs between seeds", () => {
    expect(
      generateImage(createOptions({ seed: 1 })).equals(
        generateImage(createOptions({ seed: 2 }))
      )
    ).toBe(false);
  });

  test("draws the text", () => {
    expect(
      generateImage(createOptions({ text: "Hello" })).equals(
        generateImage(createOptions())
      )
    ).toBe(false);
  });

  test("uses the primary color", () => {
    expect(
      generateImage(createOptions({ primaryColor: "#ff0000" })).equals(
        generateImage(createOptions({ primaryColor: "#0000ff" }))
      )
    ).toBe(false);
  });

  test.each(Object.values(SupportedPatternType))(
    "renders the %s pattern",
    (patternType) => {
      const image = generateImage(createOptions({ patternType }));

      expect(image.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
    }
  );

  test.each(Object.values(NoiseLevel))("renders %s noise", (noiseLevel) => {
    expect(generateImage(createOptions({ noiseLevel })).length).toBeGreaterThan(0);
  });

  test.each(Object.values(SupportedFontFamily))(
    "renders text with the %s font",
    (fontFamily) => {
      expect(
        generateImage(createOptions({ fontFamily, text: "Fonts" })).length
      ).toBeGreaterThan(0);
    }
  );

  test("renders without a seed", () => {
    const { seed: _seed, ...options } = createOptions();

    expect(generateImage(options).length).toBeGreaterThan(0);
  });
});
