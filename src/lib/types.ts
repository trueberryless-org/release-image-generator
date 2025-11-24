export enum SupportedFontFamily {
  bigshoulders = "bigshoulders",
  inter = "inter",
  jetbrainsmono = "jetbrainsmono",
  lato = "lato",
  opensans = "opensans",
  poppins = "poppins",
  quicksand = "quicksand",
  raleway = "raleway",
  readexpro = "readexpro",
  redhattext = "redhattext",
  roboto = "roboto",
  robotomono = "robotomono",
  rubik = "rubik",
  sourcecodepro = "sourcecodepro",
}

export enum SupportedFontWeight {
  bold = "bold",
  medium = "medium",
  light = "light",
}

export enum SupportedImageFormat {
  jpeg = "jpeg",
  jpg = "jpg",
  png = "png",
}

export enum SupportedPatternType {
  grid = "grid",
  dots = "dots",
  waves = "waves",
  triangles = "triangles",
  hexagons = "hexagons",
  concentric = "concentric",
  circuitry = "circuitry",
  maze = "maze",
  steps = "steps",
  geometry = "geometry",
}

export enum NoiseLevel {
  low = "low",
  medium = "medium",
  high = "high",
}

export interface ImageGeneratorOptions {
  text?: string;
  width: number;
  height: number;
  fontFamily: SupportedFontFamily;
  fontWeight: SupportedFontWeight;
  primaryColor?: string;
  imageFormat: SupportedImageFormat;
  patternType?: SupportedPatternType;
  noiseLevel: NoiseLevel;
  seed?: number;
}

export interface OklchColor {
  l: number; // lightness
  c: number; // chroma
  h: number; // hue
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  oklch: OklchColor;
  rgb: RgbColor;
  alpha: number;
}
