using ReleaseImageGenerator.Domain.Interfaces;
using SkiaSharp;

namespace ReleaseImageGenerator.Domain.Implementations;

public class ImageGenerator : IImageGenerator
{
    public string? Text { get; set; }
    public string? Label { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public SupportedFontFamily FontFamily { get; set; }
    public SupportedFontWeight FontWeight { get; set; }
    public SupportedFontFamily LabelFontFamily { get; set; }
    public SupportedFontWeight LabelFontWeight { get; set; }

    public ImageGenerator(ImageGeneratorOptions options)
    {
        Text = options.text;
        Label = options.label;
        Width = options.width;
        Height = options.height;
        FontFamily = options.fontFamily;
        FontWeight = options.fontWeight;
        LabelFontFamily = options.labelFontFamily;
        LabelFontWeight = options.labelFontWeight;
    }

    public MemoryStream GenerateImage()
    {
        using var surface = SKSurface.Create(new SKImageInfo(Width, Height));
        var canvas = surface.Canvas;
        var random = new Random();

        var primaryColor = ColorGenerator.GetRandomColor(ColorGenerator.ColorLimitation.NEUTRAL_LIGHTNESS,
            ColorGenerator.ColorLimitation.NEUTRAL_SATURATION);
        BackgroundGenerator.GenerateBackground(canvas, Width, Height, random, primaryColor);
        PatternGenerator.GeneratePattern(canvas, Width, Height, random, primaryColor);
        NoiseGenerator.GenerateNoise(canvas, Width, Height, random);
        if (Text != null && Label != null)
            TextGenerator.GenerateText(canvas, Text, Width, Height, FontFamily, FontWeight, Label, LabelFontFamily,
                LabelFontWeight, primaryColor);

        // Return as PNG
        var stream = new MemoryStream();
        using var image = surface.Snapshot();
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);
        data.SaveTo(stream);
        return stream;
    }
}