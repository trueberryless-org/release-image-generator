# release-image-generator

## 0.4.0

### Minor Changes

- [#34](https://github.com/trueberryless-org/release-image-generator/pull/34) [`e3143d4`](https://github.com/trueberryless-org/release-image-generator/commit/e3143d4d8c3427bec15ae3265abcc71b3f85c6e5) Thanks [@trueberryless](https://github.com/trueberryless)! - Add support for choosing the background pattern type. Support patterns: circuitry, concentric, dots, geometry, grid, hexagons, maze, steps, and waves. Read more in [the docs](https://github.com/trueberryless-org/release-image-generator#usage).

- [#32](https://github.com/trueberryless-org/release-image-generator/pull/32) [`8b2cc81`](https://github.com/trueberryless-org/release-image-generator/commit/8b2cc81b15967d43ef806ed9b6d4c00fc934323e) Thanks [@trueberryless](https://github.com/trueberryless)! - Add support for different image formats. Support formats: png, jpg and webp. Read more in [the docs](https://github.com/trueberryless-org/release-image-generator#usage).

## 0.3.0

### Minor Changes

- [#28](https://github.com/trueberryless-org/release-image-generator/pull/28) [`4931314`](https://github.com/trueberryless-org/release-image-generator/commit/493131472107230c647310948f7ad93caffa70b0) Thanks [@trueberryless](https://github.com/trueberryless)! - Add support for passing primary color

## 0.2.2

### Patch Changes

- [`3a26e9f`](https://github.com/trueberryless-org/release-image-generator/commit/3a26e9fe791627181247c1903127473da462b9e1) Thanks [@trueberryless](https://github.com/trueberryless)! - Fix fonts. Reason not working: Git + Windows did not track file rename to lowercase, so ttf files could not be found.

## 0.2.1

### Patch Changes

- [`3ed3343`](https://github.com/trueberryless-org/release-image-generator/commit/3ed33432a3d9a18fd75c5a29e16cf507ed5e5287) Thanks [@trueberryless](https://github.com/trueberryless)! - Try making font loader more secure (because fonts are not working)

## 0.2.0

### Minor Changes

- [`fac551a`](https://github.com/trueberryless-org/release-image-generator/commit/fac551af9225959161915f401b8fa14b1dea00af) Thanks [@trueberryless](https://github.com/trueberryless)! - ⚠️ **BREAKING CHANGE:** If no text is passed as a parameter, no text is displayed in the image. Default text is no text.

- [`3391713`](https://github.com/trueberryless-org/release-image-generator/commit/3391713e1fdb4dd0e1708590352106a2967fa524) Thanks [@trueberryless](https://github.com/trueberryless)! - ⚠️ **BREAKING CHANGE:** Font API changed. Family and Weight are now separated parameters: `fontFamily` & `fontWeight`. Please read [the docs](https://github.com/trueberryless-org/release-image-generator?tab=readme-ov-file#usage) for more details.

- [`fac551a`](https://github.com/trueberryless-org/release-image-generator/commit/fac551af9225959161915f401b8fa14b1dea00af) Thanks [@trueberryless](https://github.com/trueberryless)! - Change image format to PNG

### Patch Changes

- [`d1dbf05`](https://github.com/trueberryless-org/release-image-generator/commit/d1dbf05cde9773fb6e2c338114add34c464c48ca) Thanks [@trueberryless](https://github.com/trueberryless)! - Make all sizes, amounts and so on dynamic so it adjust with image size

- [`d1dbf05`](https://github.com/trueberryless-org/release-image-generator/commit/d1dbf05cde9773fb6e2c338114add34c464c48ca) Thanks [@trueberryless](https://github.com/trueberryless)! - Text shadow + gradient

## 0.1.0

### Minor Changes

- [`6070023`](https://github.com/trueberryless-org/release-image-generator/commit/60700238866018e4d983ec03d3abeb74591de2b9) Thanks [@trueberryless](https://github.com/trueberryless)! - Initial release
