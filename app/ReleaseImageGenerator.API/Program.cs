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
        (string? text, int? width, int? height, SupportedFontFamily? fontFamily, SupportedFontWeight? fontWeight) =>
        {
            var options = new ImageGeneratorOptions(text, width ?? 1920, height ?? 1080,
                fontFamily ?? SupportedFontFamily.readexpro, fontWeight ?? SupportedFontWeight.bold);
            var imageGenerator = new ImageGenerator(options);
            return Results.File(imageGenerator.GenerateImage().ToArray(), "image/png");
        })
    .WithName("ImageGenerator")
    .WithOpenApi();

app.Run();