using Wacton.Unicolour;

namespace ReleaseImageGenerator.Domain;

public static class ColorGenerator
{
    public enum ColorLimitation
    {
        ALL,
        LIGHTER,
        NEUTRAL_LIGHTNESS,
        DARKER,
        SATURATED,
        NEUTRAL_SATURATION,
        DESATURATED,
    }

    public static Unicolour GetRandomColor(params ColorLimitation[] limitations)
    {
        var random = new Random();
        var saturationRange = limitations?.Aggregate((0D, 1D), (current, limitation) => limitation switch
        {
            ColorLimitation.NEUTRAL_SATURATION => (0.25, 0.75),
            ColorLimitation.SATURATED => (0.5, 1D),
            ColorLimitation.DESATURATED => (0D, 0.5),
            _ => current
        }) ?? (0D, 1D);
        var lightnessRange = limitations?.Aggregate((0D, 1D), (current, limitation) => limitation switch
        {
            ColorLimitation.NEUTRAL_LIGHTNESS => (0.25, 0.75),
            ColorLimitation.LIGHTER => (0.5, 1D),
            ColorLimitation.DARKER => (0D, 0.5),
            _ => current
        }) ?? (0D, 1D);
        var color = new Unicolour(ColourSpace.Oklch,
            (lightnessRange.Item1 + random.NextDouble() * (lightnessRange.Item2 - lightnessRange.Item1 + double.Epsilon),
                saturationRange.Item1 +
                random.NextDouble() * (saturationRange.Item2 - saturationRange.Item1 + double.Epsilon),
                random.Next(0, 255)
            )).MapToRgbGamut();
        return color;
    }

    public static Unicolour[] GetRandomPalette(Unicolour primaryColor, int numberOfColors = 5, int spread = 20, double alpha = 1D)
    {
        // Ensure we get an odd number of colors for better balance
        var halfPaletteSize = numberOfColors / 2;
        var colors = new List<Unicolour>();

        // Get the HSL representation of the primary color
        var primaryHsl = primaryColor.Hsl;

        for (int i = -halfPaletteSize; i <= halfPaletteSize; i++)
        {
            // Create a new color with the shifted hue
            var shiftedColor = new Unicolour(ColourSpace.Hsl, primaryHsl.H + i * spread, primaryHsl.S, primaryHsl.L, alpha);
            colors.Add(shiftedColor);
        }

        return colors.ToArray();
    }

    public static Unicolour[] GetRandomPalette(int numberOfColors) =>
        GetRandomPalette(GetRandomColor(), numberOfColors);

    public static Unicolour[] GetRandomPalette() => GetRandomPalette(GetRandomColor());
}