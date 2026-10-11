import { describe, expect, test } from "vitest";

import {
  API_PATH,
  FONT_LABELS,
  buildImagePath,
  describeImage,
} from "../../src/lib/form";
import { SupportedFontFamily } from "../../src/lib/types";

function createFormData(entries: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    formData.append(key, value);
  }

  return formData;
}

describe("buildImagePath", () => {
  test("skips empty values", () => {
    expect(buildImagePath(createFormData({ patternType: "", text: "" }))).toBe(
      `${API_PATH}?`
    );
  });

  test("encodes the filled values", () => {
    expect(
      buildImagePath(createFormData({ text: "Release v1", width: "800" }))
    ).toBe(`${API_PATH}?text=Release+v1&width=800`);
  });

  test("leaves the color out while a random color is chosen", () => {
    expect(
      buildImagePath(
        createFormData({ primaryColor: "#ff0000", randomColor: "on" })
      )
    ).toBe(`${API_PATH}?`);
  });

  test("adds the chosen color when no random color is requested", () => {
    expect(buildImagePath(createFormData({ primaryColor: "#ff0000" }))).toBe(
      `${API_PATH}?primaryColor=%23ff0000`
    );
  });
});

describe("FONT_LABELS", () => {
  test("has a label for every supported font", () => {
    expect(Object.keys(FONT_LABELS).sort()).toEqual(
      Object.values(SupportedFontFamily).sort()
    );
  });
});

describe("describeImage", () => {
  test("mentions the text and the seed", () => {
    expect(describeImage(" v1.0 ", 42)).toBe(
      "Generated image with the text “v1.0”, seed 42"
    );
  });

  test("handles images without text or seed", () => {
    expect(describeImage("", undefined)).toBe("Generated image without text");
  });
});
