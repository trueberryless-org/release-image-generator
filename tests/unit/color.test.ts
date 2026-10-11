import { describe, expect, test } from "vitest";

import {
  ColorLimitation,
  colorToRgbString,
  colorToRgbaString,
  createColor,
  getRandomColor,
  getRandomPalette,
  oklchToRgb,
  parseColor,
} from "../../src/lib/color";
import { createRandom } from "../../src/lib/random";

describe("parseColor", () => {
  test("parses hex colors", () => {
    const { rgb } = parseColor(createRandom(1), "#ff0000");

    expect(rgb.r).toBeCloseTo(1);
    expect(rgb.g).toBeCloseTo(0);
    expect(rgb.b).toBeCloseTo(0);
  });

  test("parses named colors like their hex value", () => {
    expect(parseColor(createRandom(1), "red")).toEqual(
      parseColor(createRandom(1), "#ff0000")
    );
  });

  test("falls back to a random neutral color for invalid input", () => {
    const color = parseColor(createRandom(1), "not-a-color");

    expect(color.oklch.c).toBeLessThanOrEqual(0.4);
    expect(color.alpha).toBe(1);
  });
});

describe("getRandomColor", () => {
  test("is deterministic for a seed", () => {
    expect(getRandomColor(createRandom(7))).toEqual(
      getRandomColor(createRandom(7))
    );
  });

  test("respects lightness limitations", () => {
    const lighter = getRandomColor(createRandom(3), ColorLimitation.LIGHTER);
    const darker = getRandomColor(createRandom(3), ColorLimitation.DARKER);

    expect(lighter.oklch.l).toBeGreaterThan(darker.oklch.l);
  });

  test("respects saturation limitations", () => {
    const saturated = getRandomColor(
      createRandom(3),
      ColorLimitation.SATURATED
    );
    const desaturated = getRandomColor(
      createRandom(3),
      ColorLimitation.DESATURATED
    );

    expect(saturated.oklch.c).toBeGreaterThan(desaturated.oklch.c);
  });
});

describe("palette and formatting", () => {
  test("creates an odd-sized palette around the primary color", () => {
    const primary = createColor(0.7, 0.1, 200);
    const palette = getRandomPalette(primary, 5, 20);

    expect(palette).toHaveLength(5);
    expect(palette[2]?.oklch.h).toBe(200);
    expect(palette[0]?.oklch.h).toBe(160);
  });

  test("wraps the hue around 360 degrees", () => {
    const palette = getRandomPalette(createColor(0.7, 0.1, 350), 3, 20);

    expect(palette[2]?.oklch.h).toBe(10);
  });

  test("formats rgb and rgba strings", () => {
    const color = { ...createColor(0.5, 0.1, 100), alpha: 0.5 };
    const [r, g, b] = [color.rgb.r, color.rgb.g, color.rgb.b].map((channel) =>
      Math.round(channel * 255)
    );

    expect(colorToRgbString(color)).toBe(`rgb(${r}, ${g}, ${b})`);
    expect(colorToRgbaString(color)).toBe(`rgba(${r}, ${g}, ${b}, 0.5)`);
  });

  test("converts oklch to rgb channels in range", () => {
    const { b, g, r } = oklchToRgb({ c: 0.4, h: 30, l: 0.6 });

    for (const channel of [r, g, b]) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(1);
    }
  });
});
