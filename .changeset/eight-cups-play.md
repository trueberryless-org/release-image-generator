---
"release-image-generator": minor
---

**⚠️ Breaking change**: Move the image generation API endpoint from `/` to `/api/generateImage`. This means that you now need to add this path to your request:

```diff
-https://release-image-generator.trueberryless.org?text=1.0
+https://release-image-generator.trueberryless.org/api/generateImage?text=1.0
```
