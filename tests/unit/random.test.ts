import { afterEach, describe, expect, test, vi } from "vitest";

import { SEED_SPACE, createRandom, randomSeed } from "../../src/lib/random";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createRandom", () => {
  test("returns the same sequence for the same seed", () => {
    const first = createRandom(42);
    const second = createRandom(42);

    expect([first(), first(), first()]).toEqual([
      second(),
      second(),
      second(),
    ]);
  });

  test("returns values in the range [0, 1)", () => {
    const random = createRandom(7);

    for (let index = 0; index < 100; index++) {
      const value = random();

      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  test("differs between seeds", () => {
    expect(createRandom(1)()).not.toBe(createRandom(2)());
  });
});

describe("randomSeed", () => {
  test("returns integers inside the seed space", () => {
    for (let index = 0; index < 200; index++) {
      const seed = randomSeed();

      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(SEED_SPACE);
    }
  });

  test("wraps random values into the seed space", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (array: Uint32Array) => {
        array[0] = SEED_SPACE * 3 + 17;

        return array;
      },
    });

    expect(randomSeed()).toBe(17);
  });

  test("is not constant", () => {
    const seeds = new Set(Array.from({ length: 50 }, () => randomSeed()));

    expect(seeds.size).toBeGreaterThan(40);
  });
});
