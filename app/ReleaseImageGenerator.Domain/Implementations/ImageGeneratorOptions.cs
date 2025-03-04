namespace ReleaseImageGenerator.Domain.Implementations;

public record ImageGeneratorOptions(string? text, int width, int height, SupportedFonts font);

public enum SupportedFonts
{
    JETBRAINS_LIGHT,
    JETBRAINS_MEDIUM,
    JETBRAINS_BOLD,
    READEX_LIGHT,
    READEX_MEDIUM,
    READEX_BOLD,
    SOURCE_CODE_LIGHT,
    SOURCE_CODE_MEDIUM,
    SOURCE_CODE_BOLD,
}