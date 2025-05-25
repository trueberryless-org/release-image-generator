using ReleaseImageGenerator.Domain.Implementations;
using SkiaSharp;
using Wacton.Unicolour;

namespace ReleaseImageGenerator.Domain;

public static class TextGenerator
{
    public static void GenerateText(SKCanvas canvas, string text, int width, int height, SupportedFontFamily fontFamily,
        SupportedFontWeight fontWeight, string? label, SupportedFontFamily labelFontFamily,
        SupportedFontWeight labelFontWeight, Unicolour primaryColor)
    {
        var typeface = LoadFont(fontFamily.ToString(), fontWeight.ToString());
        var labelTypeface = LoadFont(labelFontFamily.ToString(), labelFontWeight.ToString());

        bool hasLabel = !string.IsNullOrWhiteSpace(label);

        var availableWidth = width - width / 3;
        var maxMainTextHeight =
            hasLabel ? (width > height ? height / 4 : width / 4) : (width > height ? height / 3 : width / 3);
        var fontsize = GetMaxFontSize(availableWidth, typeface, text, 1f, maxMainTextHeight);

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
        float labelFontSize = 0;
        float labelWidth = 0;
        SKRect labelBounds = new SKRect();
        SKPaint labelPaint = null;

        if (hasLabel)
        {

            float canvasMinDimension = Math.Min(width, height);

            float baseLabelSize = canvasMinDimension * 0.08f; 

            float aspectRatio = (float)width / height;
            float aspectAdjustment = Math.Min(1.3f, Math.Max(0.8f, aspectRatio * 0.8f));

            float labelLengthAdjustment = Math.Max(0.7f, Math.Min(1.2f, 12f / Math.Max(1, label.Length)));

            float minLabelSize = canvasMinDimension * 0.06f; 

            float maxLabelSize = canvasMinDimension * 0.12f; 

            labelFontSize = baseLabelSize * aspectAdjustment * labelLengthAdjustment;

            labelFontSize = Math.Max(minLabelSize, Math.Min(maxLabelSize, labelFontSize));

            float minRelativeToMainText = fontsize * 0.25f; 
            labelFontSize = Math.Max(labelFontSize, minRelativeToMainText);

            labelPaint = new SKPaint
            {
                TextSize = labelFontSize,
                IsAntialias = true,
                Typeface = labelTypeface,
                TextScaleX = 0.95f
            };

            labelWidth = labelPaint.MeasureText(label);
            labelPaint.MeasureText(label, ref labelBounds);
        }

        float totalHeight = Math.Abs(textBounds.Bottom - textBounds.Top) +
                            (hasLabel ? Math.Abs(labelBounds.Bottom - labelBounds.Top) + labelFontSize * (Math.Max(0.1f, Math.Min(0.5f, 8f / Math.Max(1, text.Length)))) : 0);

        float centerY = height / 2f;

        float labelX = hasLabel ? (width - labelWidth) / 2f : 0;
        float labelY = hasLabel ? centerY - totalHeight / 2f + Math.Abs(labelBounds.Bottom - labelBounds.Top) : 0;

        float textX = (width - textwidth) / 2f;
        float textY = hasLabel
            ? labelY + labelFontSize * (Math.Max(0.1f, Math.Min(0.5f, 8f / Math.Max(1, text.Length)))) + Math.Abs(textBounds.Bottom - textBounds.Top)
            : centerY + Math.Abs(textBounds.Bottom - textBounds.Top) / 2f;

        var textShadowPaint = new SKPaint
        {
            TextSize = fontsize,
            IsAntialias = true,
            Typeface = typeface,
            TextScaleX = 0.95f,
            Color = SKColors.Black.WithAlpha(100),
            MaskFilter = SKMaskFilter.CreateBlur(SKBlurStyle.Normal, Math.Max(3, fontsize / 25))
        };
        canvas.DrawText(text, textX + fontsize / 80, textY + fontsize / 80, textShadowPaint);

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

        canvas.Translate(fontsize / 50, fontsize / 50);
        canvas.DrawRoundRect(rect, fontsize / 4, fontsize / 4, shadowPaint);
        canvas.Translate(-fontsize / 50, -fontsize / 50);

        canvas.DrawRoundRect(rect, fontsize / 4, fontsize / 4, bgPaint);
        canvas.DrawRoundRect(rect, fontsize / 4, fontsize / 4, borderPaint);

        canvas.DrawText(text, textX, textY, textPaint);

        if (hasLabel)
        {

            var labelShadowPaint = new SKPaint
            {
                TextSize = labelFontSize,
                IsAntialias = true,
                Typeface = labelTypeface,
                TextScaleX = 0.95f,
                Color = SKColors.Black.WithAlpha(80),
                MaskFilter = SKMaskFilter.CreateBlur(SKBlurStyle.Normal, Math.Max(2, labelFontSize / 30))
            };
            canvas.DrawText(label, labelX + labelFontSize / 100, labelY + labelFontSize / 100, labelShadowPaint);

            labelPaint.Shader = SKShader.CreateLinearGradient(
                new SKPoint(labelX, labelY + labelBounds.Top),
                new SKPoint(labelX + labelWidth, labelY + labelBounds.Bottom),
                new[]
                {
                    SKColors.White,
                    SKColors.White.WithAlpha(250)
                },
                SKShaderTileMode.Clamp
            );

            var labelBgPaint = new SKPaint
            {
                Color = ColorGenerator.UnicolourToSKColor(primaryColor).WithAlpha(230),
                IsAntialias = true
            };
            var labelBorderPaint = new SKPaint
            {
                Color = ColorGenerator.UnicolourToSKColor(primaryColor),
                IsStroke = true,
                StrokeWidth = Math.Max(2, labelFontSize / 20), 
                IsAntialias = true
            };

            var labelShadowBgPaint = new SKPaint
            {
                Color = SKColors.Black.WithAlpha(70),
                MaskFilter = SKMaskFilter.CreateBlur(SKBlurStyle.Normal, Math.Max(4, labelFontSize / 15))
            };

            var labelPadding = labelFontSize / 3.5f; 
            var labelRect = new SKRect(labelX - labelPadding, labelY + labelBounds.Top - labelPadding,
                labelX + labelWidth + labelPadding, labelY + labelPadding);

            canvas.Translate(labelFontSize / 60, labelFontSize / 60);
            canvas.DrawRoundRect(labelRect, labelFontSize / 5, labelFontSize / 5, labelShadowBgPaint);
            canvas.Translate(-labelFontSize / 60, -labelFontSize / 60);

            canvas.DrawRoundRect(labelRect, labelFontSize / 5, labelFontSize / 5, labelBgPaint);
            canvas.DrawRoundRect(labelRect, labelFontSize / 5, labelFontSize / 5, labelBorderPaint);

            canvas.DrawText(label, labelX, labelY, labelPaint);
        }

        labelPaint?.Dispose();
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
        var max = maxFont; 
        var min = 0f; 
        var last = -1f; 
        float value;
        while (true)
        {
            value = min + ((max - min) / 2); 
            using (SKFont ft = new SKFont(typeface, value))
            using (SKPaint paint = new SKPaint(ft))
            {
                if (paint.MeasureText(text) > sectorSize) 
                {

                    last = value;
                    max = value;
                }
                else
                {

                    min = value;

                    if (Math.Abs(last - value) <= degreeOfCertainty)
                        return last; 

                    last = value;
                }
            }
        }
    }
}