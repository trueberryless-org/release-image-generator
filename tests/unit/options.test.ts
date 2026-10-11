import { describe, expect, test } from "vitest";

import { MAX_SEED, parseImageOptions } from "../../src/lib/options";
import type { ImageGeneratorOptions } from "../../src/lib/types";

function parse(query = "") {
  return parseImageOptions(new URLSearchParams(query));
}

function parseOptions(query = ""): ImageGeneratorOptions {
  const result = parse(query);

  if ("error" in result) throw new Error(result.error);

  return result.options;
}

describe("parseImageOptions", () => {
  test("applies the defaults", () => {
    expect(parseOptions()).toEqual({
      fontFamily: "readexpro",
      fontWeight: "bold",
      height: 1080,
      imageFormat: "png",
      noiseLevel: "medium",
      patternType: undefined,
      primaryColor: undefined,
      seed: undefined,
      text: undefined,
      width: 1920,
    });
  });

  test("reads every parameter", () => {
    expect(
      parseOptions(
        "text=v1.0&width=800&height=400&fontFamily=inter&fontWeight=light&primaryColor=%23ff0000&imageFormat=jpg&patternType=dots&noiseLevel=high&seed=42"
      )
    ).toEqual({
      fontFamily: "inter",
      fontWeight: "light",
      height: 400,
      imageFormat: "jpg",
      noiseLevel: "high",
      patternType: "dots",
      primaryColor: "#ff0000",
      seed: 42,
      text: "v1.0",
      width: 800,
    });
  });

  test.each([
    ["fontFamily=comic-sans", "Invalid fontFamily"],
    ["fontWeight=black", "Invalid fontWeight"],
    ["imageFormat=gif", "Invalid imageFormat"],
    ["noiseLevel=loud", "Invalid noiseLevel"],
    ["patternType=zigzag", "Invalid patternType"],
  ])("rejects %s", (query, error) => {
    expect(parse(query)).toEqual({ error });
  });

  test("treats an empty pattern as random", () => {
    expect(parseOptions("patternType=").patternType).toBeUndefined();
  });

  test.each([
    ["width=1", 100],
    ["width=99999", 4000],
    ["width=abc", 1920],
    ["width=-5", 100],
  ])("clamps %s to %i", (query, width) => {
    expect(parseOptions(query).width).toBe(width);
  });

  test("clamps the height like the width", () => {
    expect(parseOptions("height=1").height).toBe(100);
    expect(parseOptions("height=").height).toBe(1080);
  });

  test.each([
    ["seed=0", 0],
    ["seed=-3", 0],
    ["seed=99999999999999999999", MAX_SEED],
    ["seed=abc", undefined],
    ["", undefined],
  ])("parses %j as seed %s", (query, seed) => {
    expect(parseOptions(query).seed).toBe(seed);
  });
});
