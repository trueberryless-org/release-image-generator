using ReleaseImageGenerator.Domain.Implementations;

namespace ReleaseImageGenerator.Domain.Interfaces;

public interface IImageGenerator
{
    Tuple<MemoryStream, List<string>> GenerateImage();
}