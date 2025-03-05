using ReleaseImageGenerator.Domain.Interfaces;
using SkiaSharp;
using Wacton.Unicolour;

namespace ReleaseImageGenerator.Domain.Implementations;

public class ImageGenerator : IImageGenerator
{
    public string? Text { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public SupportedFontFamily FontFamily { get; set; }
    public SupportedFontWeight FontWeight { get; set; }

    public ImageGenerator(ImageGeneratorOptions options)
    {
        Text = options.text;
        Width = options.width;
        Height = options.height;
        FontFamily = options.fontFamily;
        FontWeight = options.fontWeight;
    }

    public Tuple<MemoryStream, List<string>> GenerateImage()
    {
        List<string> logger = new List<string>();
        using var surface = SKSurface.Create(new SKImageInfo(Width, Height));
        var canvas = surface.Canvas;
        var random = new Random();

        var primaryColor = ColorGenerator.GetRandomColor(ColorGenerator.ColorLimitation.NEUTRAL_LIGHTNESS,
            ColorGenerator.ColorLimitation.NEUTRAL_SATURATION);
        BackgroundGenerator.GenerateBackground(canvas, Width, Height, random, primaryColor);
        PatternGenerator.GeneratePattern(canvas, Width, Height, random, primaryColor);
        NoiseGenerator.GenerateNoise(canvas, Width, Height, random);
        if (Text != null) TextGenerator.GenerateText(canvas, Text, Width, Height, FontFamily, FontWeight, primaryColor, logger);

        // Return as PNG
        var stream = new MemoryStream();
        using var image = surface.Snapshot();
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);
        data.SaveTo(stream);
        return new Tuple<MemoryStream, List<string>>(stream, logger);
    }
}