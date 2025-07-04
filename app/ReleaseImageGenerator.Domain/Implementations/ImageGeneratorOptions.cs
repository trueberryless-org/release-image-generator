﻿namespace ReleaseImageGenerator.Domain.Implementations;

public record ImageGeneratorOptions(
    string? text,
    int width,
    int height,
    SupportedFontFamily fontFamily,
    SupportedFontWeight fontWeight,
    string? primaryColor,
    SupportedImageFormat imageFormat,
    SupportedPatternType? patternType);

public enum SupportedFontFamily
{
    bigshoulders,
    inter,
    jetbrainsmono,
    lato,
    opensans,
    poppins,
    quicksand,
    raleway,
    readexpro,
    roboto,
    robotomono,
    rubik,
    sourcecodepro
}

public enum SupportedFontWeight
{
    bold,
    medium,
    light
}

public enum SupportedImageFormat
{
    jpeg,
    jpg,
    png,
    webp
}

public enum SupportedPatternType
{
    grid,
    dots,
    waves,
    hexagons,
    concentric,
    circuitry,
    maze,
    steps,
    geometry
}