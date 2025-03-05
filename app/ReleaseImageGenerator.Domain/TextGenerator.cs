using System.Net.Mime;
using System.Reflection;
using ReleaseImageGenerator.Domain.Implementations;
using SkiaSharp;
using Wacton.Unicolour;

namespace ReleaseImageGenerator.Domain;

public static class TextGenerator
{
    public static void GenerateText(SKCanvas canvas, string text, int width, int height, SupportedFontFamily fontFamily,
        SupportedFontWeight fontWeight, Unicolour primaryColor)
    {
        var typeface = LoadFont(fontFamily.ToString(), fontWeight.ToString());
        var fontsize = GetMaxFontSize(width - width / 3, typeface, text, 1f, width > height ? height / 3 : width / 3);

        // Calculate text size and position
        var textPaint = new SKPaint
        {
            TextSize = fontsize,
            IsAntialias = true,
            Typeface = typeface,
            TextScaleX = 0.95f
        };

        var textwidth = textPaint.MeasureText(text);
        var textBounds = new SKRect();
        textPaint.MeasureText(text, ref textBounds);

        float textX = (width - textwidth) / 2;
        float textY = height / 2 + textBounds.Height / 2;

        // Add light text shadow
        var textShadowPaint = new SKPaint
        {
            TextSize = fontsize,
            IsAntialias = true,
            Typeface = typeface,
            TextScaleX = 0.95f,
            Color = SKColors.Black.WithAlpha(80),
            MaskFilter = SKMaskFilter.CreateBlur(SKBlurStyle.Normal, 5)
        };
        canvas.DrawText(text, textX + fontsize / 100, textY + fontsize / 100, textShadowPaint);

        // Now set up the gradient with proper positioning
        textPaint.Shader = SKShader.CreateLinearGradient(
            new SKPoint(textX, textY + textBounds.Top),
            new SKPoint(textX + textwidth, textY + textBounds.Bottom),
            new[]
            {
                SKColors.White,
                ColorGenerator.UnicolourToSKColor(new Unicolour(ColourSpace.Oklch,
                    (0.8 + Math.Max(0, (primaryColor.Oklch.L - 0.8) * 0.5), 0, 0), 1D))
            },
            SKShaderTileMode.Clamp
        );

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

        var padding = fontsize / 3;
        var rect = new SKRect(textX - padding, textY + textBounds.Top - padding, textX + textwidth + padding,
            textY + padding);

        // Draw shadow in the direction of the light
        canvas.Translate(fontsize / 50, fontsize / 50);
        canvas.DrawRoundRect(rect, fontsize / 4, fontsize / 4, shadowPaint);
        canvas.Translate(-fontsize / 50, -fontsize / 50);

        canvas.DrawRoundRect(rect, fontsize / 4, fontsize / 4, bgPaint);
        canvas.DrawRoundRect(rect, fontsize / 4, fontsize / 4, borderPaint);

        // Draw the text
        canvas.DrawText(text, textX, textY, textPaint);
    }

    private static SKTypeface LoadFont(string fontFamily, string fontWeight)
    {
        var fontName = $"{fontFamily}-{fontWeight}.ttf";

        return SKTypeface.FromFile($"./fonts/{fontFamily}-{fontWeight}.ttf") ??
               SKTypeface.FromFile($"./fonts/readexpro-bold.ttf") ?? SKTypeface.Default;
    }

    private static float GetMaxFontSize(double sectorSize, SKTypeface typeface, string text,
        float degreeOfCertainty = 1f,
        float maxFont = 100f)
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