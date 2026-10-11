export const FONT_LABELS = {
  bigshoulders: "Big Shoulders",
  inter: "Inter",
  jetbrainsmono: "JetBrains Mono",
  lato: "Lato",
  opensans: "Open Sans",
  poppins: "Poppins",
  quicksand: "Quicksand",
  raleway: "Raleway",
  readexpro: "Readex Pro",
  redhattext: "Red Hat Text",
  roboto: "Roboto",
  robotomono: "Roboto Mono",
  rubik: "Rubik",
  sourcecodepro: "Source Code Pro",
} as const;

export const API_PATH = "/api/generateImage";

export function buildImagePath(formData: FormData) {
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" || value === "") continue;
    if (key === "randomColor" || key === "primaryColor") continue;

    params.append(key, value);
  }

  if (formData.get("randomColor") === null) {
    const color = formData.get("primaryColor");

    if (typeof color === "string" && color !== "") {
      params.append("primaryColor", color);
    }
  }

  return `${API_PATH}?${params.toString()}`;
}
