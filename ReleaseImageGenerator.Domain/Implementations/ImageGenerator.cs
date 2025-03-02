using ReleaseImageGenerator.Domain.Interfaces;
using SkiaSharp;
using Wacton.Unicolour;

namespace ReleaseImageGenerator.Domain.Implementations;

public class ImageGenerator : IImageGenerator
{
    public string Text { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public SupportedFonts Font { get; set; }

    public ImageGenerator(ImageGeneratorOptions options)
    {
        Text = options.text;
        Width = options.width;
        Height = options.height;
        Font = options.font;
    }

    public MemoryStream GenerateImage()
    {
        using var surface = SKSurface.Create(new SKImageInfo(Width, Height));
        var canvas = surface.Canvas;
        
        var random = new Random();

        // Generate a harmonious color palette around the primary color
        var primaryColor = ColorGenerator.GetRandomColor(ColorGenerator.ColorLimitation.NEUTRAL_LIGHTNESS,
            ColorGenerator.ColorLimitation.NEUTRAL_SATURATION);

        var colorPalette = ColorGenerator.GetRandomPalette(primaryColor, 8).Select(UnicolourToSKColor).ToArray();

        var backgroundRotationIsClockwise = random.Next(2) == 0;
        
        // Fill with a smooth gradient background based on the palette
        var paint = new SKPaint
        {
            Shader = SKShader.CreateLinearGradient(
                new SKPoint(0, random.Next(backgroundRotationIsClockwise ? -1000 : Height, backgroundRotationIsClockwise ? 0 : Height + 1000)),
                new SKPoint(Width, random.Next(backgroundRotationIsClockwise ? Height : -1000, backgroundRotationIsClockwise ? Height + 1000: 0)),
                colorPalette,
                SKShaderTileMode.Clamp
            )
        };
        
        var colorPalette2 = ColorGenerator.GetRandomPalette(primaryColor, 6, 60, 0.3D).Select(UnicolourToSKColor).ToArray();
        var paint2 = new SKPaint
        {
            Shader = SKShader.CreateLinearGradient(
                new SKPoint(0, random.Next(!backgroundRotationIsClockwise ? -1000 : Height, !backgroundRotationIsClockwise ? 0 : Height + 1000)),
                new SKPoint(Width, random.Next(!backgroundRotationIsClockwise ? Height : -1000, !backgroundRotationIsClockwise ? Height + 1000: 0)),
                colorPalette2,
                SKShaderTileMode.Clamp
            )
        };
        
        var colorPalette3 = ColorGenerator.GetRandomPalette(primaryColor, 3, 50, 0.2D).Select(UnicolourToSKColor).ToArray();
        var paint3 = new SKPaint
        {
            Shader = SKShader.CreateRadialGradient(
                new SKPoint(Width / 2, Height / 2),
                (float)Math.Sqrt(Math.Pow(Width, 2) + Math.Pow(Height, 2)) / 2,
                colorPalette3,
                SKShaderTileMode.Clamp
            )
        };
        canvas.DrawRect(0, 0, Width, Height, paint);
        canvas.DrawRect(0, 0, Width, Height, paint2);
        canvas.DrawRect(0, 0, Width, Height, paint3);

        // Add some noise
        AddNoise(canvas, Width, Height);

        // Load JetBrains Mono font
        var typeface = Font switch
        {
            SupportedFonts.READEX_BOLD => SKTypeface.FromFile("./fonts/ReadexPro-Bold.ttf"),
            SupportedFonts.READEX_MEDIUM => SKTypeface.FromFile("./fonts/ReadexPro-Medium.ttf"),
            SupportedFonts.READEX_LIGHT => SKTypeface.FromFile("./fonts/ReadexPro-Light.ttf"),
            SupportedFonts.JETBRAINS_BOLD => SKTypeface.FromFile("./fonts/JetbrainsMono-Bold.ttf"),
            SupportedFonts.JETBRAINS_MEDIUM => SKTypeface.FromFile("./fonts/JetbrainsMono-Medium.ttf"),
            SupportedFonts.JETBRAINS_LIGHT => SKTypeface.FromFile("./fonts/JetbrainsMono-Light.ttf"),
            SupportedFonts.SOURCE_CODE_BOLD => SKTypeface.FromFile("./fonts/SourceCodePro-Bold.ttf"),
            SupportedFonts.SOURCE_CODE_MEDIUM => SKTypeface.FromFile("./fonts/SourceCodePro-Medium.ttf"),
            SupportedFonts.SOURCE_CODE_LIGHT  => SKTypeface.FromFile("./fonts/SourceCodePro-Light.ttf"),
            _ => SKTypeface.Default
        };
        var fontsize = GetMaxFontSize(Width - Width / 3, typeface, Text, 1f, Width > Height ? Height / 3 : Width / 3);

        // Calculate text size and position
        paint = new SKPaint
        {
            Color = SKColors.White,
            TextSize = fontsize,
            IsAntialias = true,
            Typeface = typeface
        };

        var textWidth = paint.MeasureText(Text);
        var textBounds = new SKRect();
        paint.MeasureText(Text, ref textBounds);

        float textX = (Width - textWidth) / 2;
        float textY = Height / 2 + textBounds.Height / 2;

        // Draw glassmorphism background with smaller border and shadow
        var bgPaint = new SKPaint
        {
            Color = SKColors.White.WithAlpha(40),
            IsAntialias = true
        };
        var borderPaint = new SKPaint
        {
            Color = SKColors.White.WithAlpha(80),
            IsStroke = true,
            StrokeWidth = 4,
            IsAntialias = true
        };

        var shadowPaint = new SKPaint
        {
            Color = SKColors.Black.WithAlpha(50),
            MaskFilter = SKMaskFilter.CreateBlur(SKBlurStyle.Normal, 10)
        };

        var padding = 80;
        var rect = new SKRect(textX - padding, textY + textBounds.Top - padding, textX + textWidth + padding,
            textY + padding);

        // Draw shadow in the direction of the light
        canvas.Translate(10, 10);
        canvas.DrawRoundRect(rect, 50, 50, shadowPaint);
        canvas.Translate(-10, -10);

        canvas.DrawRoundRect(rect, 50, 50, bgPaint);
        canvas.DrawRoundRect(rect, 50, 50, borderPaint);

        // Draw the text
        canvas.DrawText(Text, textX, textY, paint);

        // Return as JPEG
        var stream = new MemoryStream();
        using var image = surface.Snapshot();
        using var data = image.Encode(SKEncodedImageFormat.Jpeg, 90);
        data.SaveTo(stream);
        return stream;
    }

    SKColor UnicolourToSKColor(Unicolour unicolour)
    {
        return new SKColor(
            (byte)(unicolour.Rgb.R * 255),
            (byte)(unicolour.Rgb.G * 255),
            (byte)(unicolour.Rgb.B * 255),
            (byte)unicolour.Alpha.A255);
    }

    void AddNoise(SKCanvas canvas, int width, int height)
    {
        var random = new Random();
        var noisePaint = new SKPaint { Color = SKColors.White.WithAlpha(20) };
        for (int i = 0; i < 10000; i++)
        {
            canvas.DrawPoint(random.Next(width), random.Next(height), noisePaint);
        }
    }
    
    public float GetMaxFontSize(double sectorSize, SKTypeface typeface, string text, float degreeOfCertainty = 1f, float maxFont = 100f)
    {
        var max = maxFont; // The upper bound. We know the font size is below this value
        var min = 0f; // The lower bound, We know the font size is equal to or above this value
        var last = -1f; // The last calculated value.
        float value;
        while (true)
        {
            value = min + ((max - min) / 2); // Find the half way point between Max and Min
            using (SKFont ft = new SKFont(typeface, value))
            using (SKPaint paint = new SKPaint(ft))
            {
                if (paint.MeasureText(text) > sectorSize) // Measure the string size at this font size
                {
                    // The text size is too large
                    // therefore the max possible size is below value
                    last = value;
                    max = value;
                }
                else
                {
                    // The text fits within the area
                    // therefore the min size is above or equal to value
                    min = value;

                    // Check if this value is within our degree of certainty
                    if (Math.Abs(last - value) <= degreeOfCertainty)
                        return last; // Value is within certainty range, we found the best font size!

                    //This font difference is not within our degree of certainty
                    last = value;
                }
            }
        }
    }
}