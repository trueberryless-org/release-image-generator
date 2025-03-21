﻿namespace ReleaseImageGenerator.Domain.Implementations;

public record ImageGeneratorOptions(string? text, int width, int height, SupportedFontFamily fontFamily, SupportedFontWeight fontWeight);

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