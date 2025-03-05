using Microsoft.JSInterop;
using ReleaseImageGenerator.Domain.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
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

app.MapGet("/",
        (HttpContext context, string? text, int? width, int? height, SupportedFontFamily? fontFamily, SupportedFontWeight? fontWeight) =>
        {
            var options = new ImageGeneratorOptions(text, width ?? 1920, height ?? 1080,
                fontFamily ?? SupportedFontFamily.readexpro, fontWeight ?? SupportedFontWeight.bold);
            var imageGenerator = new ImageGenerator(options);
            var result = imageGenerator.GenerateImage();
            result.Item2.ForEach(s => context.Response.Headers.Append("X-Debug-Log", s));
            return Results.File(result.Item1.ToArray(), "image/png");
        })
    .WithName("ImageGenerator")
    .WithOpenApi();

app.Run();