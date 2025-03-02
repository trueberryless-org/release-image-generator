using SkiaSharp;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/image-generator", (string text) =>
    {
        text = string.IsNullOrEmpty(text) ? "Release 1.0" : text;
        
        int width = 1200;
        int height = 600;
        
        using var surface = SKSurface.Create(new SKImageInfo(width, height));
        var canvas = surface.Canvas;
        
        // Fill with a random gradient background
        var random = new Random();
        var paint = new SKPaint
        {
            Shader = SKShader.CreateLinearGradient(
                new SKPoint(0, 0),
                new SKPoint(width, height),
                new SKColor[] {
                    RandomColor(random),
                    RandomColor(random),
                    RandomColor(random)
                },
                SKShaderTileMode.Clamp
            )
        };
        canvas.DrawRect(0, 0, width, height, paint);
        
        // Add some noise
        AddNoise(canvas, width, height);
        
        // Draw a simple pattern
        // DrawPattern(canvas, width, height);
        
        // Load JetBrains Mono font
        var typeface = SKTypeface.FromFile("./fonts/JetBrainsMono-Bold.ttf");

        // Calculate text size and position
        paint = new SKPaint
        {
            Color = SKColors.White,
            TextSize = 100,
            IsAntialias = true,
            Typeface = typeface ?? SKTypeface.Default
        };

        var textWidth = paint.MeasureText(text);
        var textBounds = new SKRect();
        paint.MeasureText(text, ref textBounds);

        float textX = (width - textWidth) / 2;
        float textY = height / 2 + textBounds.Height / 2;

        // Draw glassmorphism background
        var bgPaint = new SKPaint
        {
            Color = SKColors.White.WithAlpha(40),
            IsAntialias = true
        };
        var borderPaint = new SKPaint
        {
            Color = SKColors.White.WithAlpha(100),
            IsStroke = true,
            StrokeWidth = 4,
            IsAntialias = true
        };

        var padding = 40;
        var rect = new SKRect(textX - padding, textY + textBounds.Top - padding, textX + textWidth + padding, textY + padding);
        canvas.DrawRoundRect(rect, 20, 20, bgPaint);
        canvas.DrawRoundRect(rect, 20, 20, borderPaint);

        // Draw the text
        canvas.DrawText(text, textX, textY, paint);
        
        // Return as JPEG
        var stream = new MemoryStream();
        using var image = surface.Snapshot();
        using var data = image.Encode(SKEncodedImageFormat.Jpeg, 90);
        data.SaveTo(stream);
        return Results.File(stream.ToArray(), "image/jpeg");
    })
    .WithName("ImageGenerator")
    .WithOpenApi();

app.Run();

static SKColor RandomColor(Random random)
{
    return new SKColor(
        (byte)random.Next(256),
        (byte)random.Next(256),
        (byte)random.Next(256)
    );
}

static void AddNoise(SKCanvas canvas, int width, int height)
{
    var random = new Random();
    var noisePaint = new SKPaint { Color = SKColors.White.WithAlpha(10) };
    for (int i = 0; i < 1000; i++)
    {
        canvas.DrawPoint(random.Next(width), random.Next(height), noisePaint);
    }
}

static void DrawPattern(SKCanvas canvas, int width, int height)
{
    var paint = new SKPaint
    {
        Color = SKColors.White.WithAlpha(20),
        StrokeWidth = 2
    };

    for (int i = 0; i < width; i += 40)
    {
        canvas.DrawLine(i, 0, i, height, paint);
    }
}
