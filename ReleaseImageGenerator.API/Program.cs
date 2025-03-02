using SkiaSharp;
using System;
using Microsoft.AspNetCore.Mvc;
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

app.MapGet("/image-generator", (string? text, int? width, int? height, SupportedFonts? font) =>
    {
        var options = new ImageGeneratorOptions(text ?? "1.0", width ?? 1920, height ?? 1080, font ?? SupportedFonts.JETBRAINS_BOLD);
        var imageGenerator = new ImageGenerator(options);
        return Results.File(imageGenerator.GenerateImage().ToArray(), "image/jpeg");
    })
.WithName("ImageGenerator")
.WithOpenApi();

app.Run();
