using SkiaSharp;

namespace ReleaseImageGenerator.Domain;

public static class NoiseGenerator
{
    public static void GenerateNoise(SKCanvas canvas, int width, int height, Random random)
    {
        int noiseWidth = width / (random.Next(5) + 7);
        int noiseHeight = height / (random.Next(5) + 7);

        var noiseBitmap = new SKBitmap(noiseWidth, noiseHeight);

        for (int y = 0; y < noiseHeight; y++)
        {
            for (int x = 0; x < noiseWidth; x++)
            {
                byte noise = (byte)random.Next(0, Math.Min(256, (width / 100) * (height / 100) * random.Next(1, 4)));
                noiseBitmap.SetPixel(x, y, new SKColor(noise, noise, noise, 30)); // Semi-transparent noise
            }
        }

        using var noiseShader = SKShader.CreateBitmap(noiseBitmap, SKShaderTileMode.Repeat, SKShaderTileMode.Repeat);
        using var noisePaint = new SKPaint { Shader = noiseShader };

        canvas.DrawRect(new SKRect(0, 0, width, height), noisePaint);
    }
}