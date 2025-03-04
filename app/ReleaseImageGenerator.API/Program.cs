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

app.MapGet("/", (string? text, int? width, int? height, SupportedFonts? font) =>
    {
        var options = new ImageGeneratorOptions(text, width ?? 1920, height ?? 1080, font ?? SupportedFonts.READEX_BOLD);
        var imageGenerator = new ImageGenerator(options);
        return Results.File(imageGenerator.GenerateImage().ToArray(), "image/png");
    })
.WithName("ImageGenerator")
.WithOpenApi();

app.Run();
