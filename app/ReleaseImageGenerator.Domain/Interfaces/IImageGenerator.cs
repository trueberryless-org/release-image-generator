namespace ReleaseImageGenerator.Domain.Interfaces;

public interface IImageGenerator
{
    MemoryStream GenerateImage();
}