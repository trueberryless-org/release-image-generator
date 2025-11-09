# Release Image Generator

This project generates random images with customizable patterns, colors, and text overlays.

## API Usage

### Endpoint: `GET /api/generateImage`

### Query Parameters

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| `text` | string | none | Any text to display |
| `width` | number | 1200 | Any positive integer |
| `height` | number | 630 | Any positive integer |
| `fontFamily` | string | readexpro | See supported fonts below |
| `fontWeight` | string | bold | bold, medium, light |
| `primaryColor` | string | random | Any valid CSS color or hex |
| `imageFormat` | string | png | png, jpg, jpeg, webp |
| `patternType` | string | random | grid, dots, waves, triangles, hexagons, concentric, circuitry, maze, steps, geometry |
| `noiseLevel` | string | medium | low, medium, high |
| `seed` | number | `Date.now()` | Any positive integer |

### Supported Fonts

- bigshoulders
- inter
- jetbrainsmono
- lato
- opensans
- poppins
- quicksand
- raleway
- readexpro
- roboto
- robotomono
- rubik
- sourcecodepro

### Supported Weights

- bold
- medium
- light

### Example Requests

**Simple image with text:**

https://release-image-generator.trueberryless.org/api/generateImage?text=Hello+World

**Custom dimensions and color:**

https://release-image-generator.trueberryless.org/api/generateImage?text=Release+v1.0&width=1920&height=1080&primaryColor=%23ff6b6b

**Specific pattern and font:**

https://release-image-generator.trueberryless.org/api/generateImage?text=Welcome&patternType=hexagons&fontFamily=poppins&fontWeight=bold

**JPEG format with low noise:**

https://release-image-generator.trueberryless.org/api/generateImage?text=Banner&imageFormat=jpeg&noiseLevel=low

## License

Licensed under the MIT license, Copyright © trueberryless.
See [LICENSE](/LICENSE) for more information.
