using SkiaSharp;
using Wacton.Unicolour;

namespace ReleaseImageGenerator.Domain;

public static class BackgroundGenerator
{
    public static Unicolour GenerateBackground(SKCanvas canvas, int width, int height, Random random, Unicolour primaryColor)
    {
        // Generate a harmonious color palette around the primary color
        var colorPalette = ColorGenerator.GetRandomPalette(primaryColor, 8).Select(ColorGenerator.UnicolourToSKColor).ToArray();

        var backgroundRotationIsClockwise = random.Next(2) == 0;

        // Fill with a smooth gradient background based on the palette
        var paint = new SKPaint
        {
            Shader = SKShader.CreateLinearGradient(
                new SKPoint(0,
                    random.Next(backgroundRotationIsClockwise ? -1000 : height,
                        backgroundRotationIsClockwise ? 0 : height + 1000)),
                new SKPoint(width,
                    random.Next(backgroundRotationIsClockwise ? height : -1000,
                        backgroundRotationIsClockwise ? height + 1000 : 0)),
                colorPalette,
                SKShaderTileMode.Clamp
            )
        };

        var colorPalette2 = ColorGenerator.GetRandomPalette(primaryColor, 6, 60, 0.3D).Select(ColorGenerator.UnicolourToSKColor)
            .ToArray();
        var paint2 = new SKPaint
        {
            Shader = SKShader.CreateLinearGradient(
                new SKPoint(0,
                    random.Next(!backgroundRotationIsClockwise ? -1000 : height,
                        !backgroundRotationIsClockwise ? 0 : height + 1000)),
                new SKPoint(width,
                    random.Next(!backgroundRotationIsClockwise ? height : -1000,
                        !backgroundRotationIsClockwise ? height + 1000 : 0)),
                colorPalette2,
                SKShaderTileMode.Clamp
            )
        };

        var colorPalette3 = ColorGenerator.GetRandomPalette(primaryColor, 3, 50, 0.2D).Select(ColorGenerator.UnicolourToSKColor)
            .ToArray();
        var paint3 = new SKPaint
        {
            Shader = SKShader.CreateRadialGradient(
                new SKPoint(width / 2, height / 2),
                (float)Math.Sqrt(Math.Pow(width, 2) + Math.Pow(height, 2)) / 2,
                colorPalette3,
                SKShaderTileMode.Clamp
            )
        };
        canvas.DrawRect(0, 0, width, height, paint);
        canvas.DrawRect(0, 0, width, height, paint2);
        canvas.DrawRect(0, 0, width, height, paint3);

        return primaryColor;
    }
}