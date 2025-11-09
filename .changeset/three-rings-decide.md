---
"release-image-generator": patch
---

Add new `seed` option to deterministically generate colors, patterns, noise and background. Different options regarding `text`, `width`, `height`, `fontFamily`, `fontWeight` and `imageFormat` will still result in different image outcomes. Seeded images with same parameters will be cached.
