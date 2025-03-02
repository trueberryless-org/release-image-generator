using ReleaseImageGenerator.Domain.Implementations;

namespace ReleaseImageGenerator.Domain.Interfaces;

public interface IImageGenerator
{
    MemoryStream GenerateImage();
}