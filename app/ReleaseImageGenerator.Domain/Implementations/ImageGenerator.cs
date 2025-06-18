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
    public string? PrimaryColor { get; set; }
    public SupportedImageFormat ImageFormat { get; set; }

    public ImageGenerator(ImageGeneratorOptions options)
    {
        Text = options.text;
        Width = options.width;
        Height = options.height;
        FontFamily = options.fontFamily;
        FontWeight = options.fontWeight;
        PrimaryColor = options.primaryColor;
        ImageFormat = options.imageFormat;
    }

    public MemoryStream GenerateImage()
    {
        using var surface = SKSurface.Create(new SKImageInfo(Width, Height));
        var canvas = surface.Canvas;
        var random = new Random();

        var primaryColor = PrimaryColor != null
            ? new Unicolour(PrimaryColor)
            : ColorGenerator.GetRandomColor(ColorGenerator.ColorLimitation.NEUTRAL_LIGHTNESS,
                ColorGenerator.ColorLimitation.NEUTRAL_SATURATION);
        BackgroundGenerator.GenerateBackground(canvas, Width, Height, random, primaryColor);
        PatternGenerator.GeneratePattern(canvas, Width, Height, random, primaryColor);
        NoiseGenerator.GenerateNoise(canvas, Width, Height, random);
        if (Text != null) TextGenerator.GenerateText(canvas, Text, Width, Height, FontFamily, FontWeight, primaryColor);

        // Encode and return image in the requested format
        var stream = new MemoryStream();
        using var image = surface.Snapshot();
        using var data = image.Encode(ImageFormat switch
        {
            SupportedImageFormat.jpeg => SKEncodedImageFormat.Jpeg,
            SupportedImageFormat.jpg => SKEncodedImageFormat.Jpeg,
            SupportedImageFormat.png => SKEncodedImageFormat.Png,
            SupportedImageFormat.webp => SKEncodedImageFormat.Webp,
            _ => SKEncodedImageFormat.Png
        }, 100);
        data.SaveTo(stream);
        return stream;
    }
}