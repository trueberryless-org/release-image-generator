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
  fontFamily: SupportedFontFamily;
  fontWeight: SupportedFontWeight;
  height: number;
  imageFormat: SupportedImageFormat;
  noiseLevel: NoiseLevel;
  patternType?: SupportedPatternType | undefined;
  primaryColor?: string | undefined;
  seed?: number | undefined;
  text?: string | undefined;
  width: number;
}

export interface OklchColor {
  l: number;
  c: number;
  h: number;
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
