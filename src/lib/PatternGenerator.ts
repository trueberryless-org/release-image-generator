import type { Canvas, CanvasRenderingContext2D } from "canvas";

import type { Color } from "./types";
import { SupportedPatternType } from "./types";

export class PatternGenerator {
  static generatePattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    primaryColor: Color,
    patternType?: SupportedPatternType
  ): void {
    const lightness = primaryColor.oklch.l + random() * 2.5;

    // Choose random pattern if not specified
    const patterns = Object.values(SupportedPatternType);
    const patternsExcludingGeometry = patterns.filter(
      (p) => p !== SupportedPatternType.geometry
    );
    const selectedPattern =
      patternType ??
      patternsExcludingGeometry[
        Math.floor(random() * patternsExcludingGeometry.length)
      ];

    switch (selectedPattern) {
      case SupportedPatternType.grid:
        this.drawGridPattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.dots:
        this.drawDottedPattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.waves:
        this.drawWavyPattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.geometry:
        this.drawGeometricPattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.triangles:
        this.drawTrianglesPattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.hexagons:
        this.drawHexagonalPattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.concentric:
        this.drawConcentricPattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.circuitry:
        this.drawCircuitPattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.maze:
        this.drawMazePattern(ctx, width, height, random, lightness);
        break;
      case SupportedPatternType.steps:
        this.drawStepsPattern(ctx, width, height, random, lightness);
        break;
    }
  }

  private static drawGridPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 3) + lightness * 10 + 7) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;

    const spacing = Math.max(
      10,
      Math.floor(
        random() *
          (((width / 100) * (height / 100)) / 3 -
            ((width / 100) * (height / 100)) / 7)
      ) +
        ((width / 100) * (height / 100)) / 7
    );

    ctx.beginPath();
    for (let x = 0; x < width; x += spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }

  private static drawDottedPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 3) + lightness * 11 + 12) / 255;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

    const spacing = Math.max(
      10,
      Math.floor(
        random() *
          (((width / 100) * (height / 100)) / 5 -
            ((width / 100) * (height / 100)) / 8)
      ) +
        ((width / 100) * (height / 100)) / 8
    );
    const dotSize = Math.max(
      1,
      Math.floor(
        random() *
          (((width / 140) * (height / 140)) / 40 -
            ((width / 140) * (height / 140)) / 100)
      ) +
        ((width / 140) * (height / 140)) / 100
    );

    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        const randomOffset = Math.max(
          0,
          Math.floor(
            random() *
              (((width / 150) * (height / 150)) / 25 -
                ((width / 150) * (height / 150)) / 50)
          ) +
            ((width / 150) * (height / 150)) / 50
        );
        const offsetX = random() * randomOffset * 2 - randomOffset;
        const offsetY = random() * randomOffset * 2 - randomOffset;

        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private static drawWavyPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 3) + lightness * 9 + 8) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;

    const spacing = Math.max(
      10,
      Math.floor(
        random() *
          (((width / 100) * (height / 100)) / 3 -
            ((width / 100) * (height / 100)) / 7)
      ) +
        ((width / 100) * (height / 100)) / 7
    );
    const amplitude = Math.max(
      5,
      Math.floor(
        random() *
          (((width / 100) * (height / 100)) / 8 -
            ((width / 100) * (height / 100)) / 14)
      ) +
        ((width / 100) * (height / 100)) / 14
    );
    let frequency = Math.max(
      2,
      Math.floor(
        random() *
          (((width / 100) * (height / 100)) / 15 -
            ((width / 100) * (height / 100)) / 30)
      ) +
        ((width / 100) * (height / 100)) / 30
    );

    // Horizontal wavy lines
    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < width; x += 2) {
        const yOffset =
          Math.sin(((x * frequency) / width) * Math.PI * 2) * amplitude;
        ctx.lineTo(x, y + yOffset);
      }
      ctx.stroke();
    }

    // Vertical wavy lines
    frequency = Math.floor(random() * 3) + 2;
    for (let x = 0; x < width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 0; y < height; y += 2) {
        const xOffset =
          Math.sin(((y * frequency) / height) * Math.PI * 2) * amplitude;
        ctx.lineTo(x + xOffset, y);
      }
      ctx.stroke();
    }
  }

  private static drawGeometricPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 4) + lightness * 17 + 18) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;

    const shapeCount = Math.max(
      10,
      Math.floor(
        random() *
          (((width / 140) * (height / 140)) / 50 -
            ((width / 140) * (height / 140)) / 100)
      ) +
        ((width / 140) * (height / 140)) / 100
    );
    const spacing = width / shapeCount;

    for (let x = spacing / 4; x < width; x += spacing) {
      for (let y = spacing / 4; y < height; y += spacing) {
        const shapeType = Math.floor(random() * 3);
        const size = Math.max(
          10,
          Math.floor(
            random() *
              (Math.max(width, height) / 40 - Math.max(width, height) / 100)
          ) +
            Math.max(width, height) / 100
        );

        const randomOffset = Math.max(
          0,
          Math.floor(
            random() *
              (Math.max(width, height) / 50 - Math.max(width, height) / 100)
          ) +
            Math.max(width, height) / 100
        );
        const offsetX = random() * randomOffset * 2 - randomOffset;
        const offsetY = random() * randomOffset * 2 - randomOffset;

        ctx.beginPath();
        switch (shapeType) {
          case 0: // Squares
            ctx.rect(
              x - size / 2 + offsetX,
              y - size / 2 + offsetY,
              size,
              size
            );
            break;
          case 1: // Circles
            ctx.arc(x + offsetX, y + offsetY, size / 2, 0, Math.PI * 2);
            break;
          case 2: // Triangles
            ctx.moveTo(x + offsetX, y - size / 2 + offsetY);
            ctx.lineTo(x - size / 2 + offsetX, y + size / 2 + offsetY);
            ctx.lineTo(x + size / 2 + offsetX, y + size / 2 + offsetY);
            ctx.closePath();
            break;
        }
        ctx.stroke();
      }
    }
  }

  private static drawTrianglesPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 3) + lightness * 11 + 8) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;

    const size = Math.max(
      10,
      Math.floor(
        random() *
          (((width / 100) * (height / 100)) / 2 -
            ((width / 100) * (height / 100)) / 3)
      ) +
        ((width / 100) * (height / 100)) / 3
    );
    const h = (size * Math.sqrt(3)) / 2;

    for (let row = -1; row < height / h + 1; row++) {
      for (let col = -1; col < width / size + 1; col++) {
        const centerX = col * size + (row % 2 === 0 ? 0 : size / 2);
        const centerY = row * h;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = centerX + (size / 2) * Math.cos(angle);
          const y = centerY + (size / 2) * Math.sin(angle);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  private static drawHexagonalPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 3) + lightness * 11 + 8) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;

    // Honeycomb hexagon pattern (no gaps)
    const size = Math.max(
      15,
      Math.floor(
        random() *
          (((width / 80) * (height / 80)) / 2 -
            ((width / 80) * (height / 80)) / 4)
      ) +
        ((width / 80) * (height / 80)) / 4
    );
    const h = size * Math.sqrt(3);
    const randomSpacingFactor = random() / 5 + 0.9;
    const vertSpacing = h * randomSpacingFactor;
    const horizSpacing = size * 2 * randomSpacingFactor;

    for (let row = -1; row <= Math.ceil(height / vertSpacing) + 1; row++) {
      for (let col = -1; col <= Math.ceil(width / horizSpacing) + 1; col++) {
        const offsetX = row % 2 === 0 ? 0 : horizSpacing / 2;
        const centerX = col * horizSpacing + offsetX;
        const centerY = row * vertSpacing;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6; // Rotate by 30 degrees for flat-top
          const x = centerX + size * Math.cos(angle);
          const y = centerY + size * Math.sin(angle);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  private static drawConcentricPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 3) + lightness * 8 + 10) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;

    const numCenters = Math.floor(random() * 2) + 1;
    const maxRadius = Math.max(width, height);

    for (let i = 0; i < numCenters; i++) {
      const centerX = random() * width;
      const centerY = random() * height;

      const numCircles = Math.max(
        2,
        Math.floor(
          random() *
            (((width / 100) * (height / 100)) / 8 -
              ((width / 100) * (height / 100)) / 30)
        ) +
          ((width / 100) * (height / 100)) / 30
      );
      const radiusStep = maxRadius / numCircles;

      for (let j = 1; j <= numCircles; j++) {
        const radius = j * radiusStep;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  private static drawCircuitPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 5) + lightness * 14 + 12) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;

    const gridSize = Math.max(
      10,
      Math.floor(
        random() *
          ((width / 100) * (height / 100) -
            ((width / 100) * (height / 100)) / 5)
      ) +
        ((width / 100) * (height / 100)) / 5
    );
    const lineChance = Math.floor(random() * 40) + 50;

    const margin = gridSize * 3.5;
    for (let x = -margin; x < width + margin; x += gridSize) {
      for (let y = -margin; y < height + margin; y += gridSize) {
        if (random() * 100 < 60) {
          const nodeSize = Math.max(
            1,
            Math.floor(
              random() *
                (((width / 140) * (height / 140)) / 20 -
                  ((width / 140) * (height / 140)) / 50)
            ) +
              ((width / 140) * (height / 140)) / 50
          );

          ctx.beginPath();
          ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
          ctx.fill();

          // Horizontal line
          if (x + gridSize < width && random() * 100 < lineChance) {
            if (random() * 100 < 80) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + gridSize, y);
              ctx.stroke();
            } else {
              const midX = x + gridSize / 2;
              const midY =
                y +
                (Math.floor(random() * 2) === 0 ? gridSize / 2 : -gridSize / 2);

              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(midX, y);
              ctx.lineTo(midX, midY);
              ctx.lineTo(x + gridSize, midY);
              ctx.lineTo(x + gridSize, y);
              ctx.stroke();
            }
          }

          // Vertical line
          if (y + gridSize < height && random() * 100 < lineChance) {
            if (random() * 100 < 80) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y + gridSize);
              ctx.stroke();
            } else {
              const midY = y + gridSize / 2;
              const midX =
                x +
                (Math.floor(random() * 2) === 0 ? gridSize / 2 : -gridSize / 2);

              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, midY);
              ctx.lineTo(midX, midY);
              ctx.lineTo(midX, y + gridSize);
              ctx.lineTo(x, y + gridSize);
              ctx.stroke();
            }
          }
        }
      }
    }
  }

  private static drawMazePattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 3) + lightness * 11 + 11) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 2;

    const gridSize = Math.max(
      10,
      Math.floor(
        random() *
          (((width / 100) * (height / 100)) / 3 -
            ((width / 100) * (height / 100)) / 6)
      ) +
        ((width / 100) * (height / 100)) / 6
    );
    const horizontalCells = Math.floor(width / Math.max(gridSize, 1)) + 1;
    const verticalCells = Math.floor(height / Math.max(gridSize, 1)) + 1;

    for (let i = 0; i < horizontalCells + verticalCells - 1; i++) {
      for (let x = 0; x <= i; x++) {
        const y = i - x;

        if (x < horizontalCells && y < verticalCells) {
          const x1 = x * gridSize;
          const y1 = y * gridSize;
          const x2 = (x + 1) * gridSize;
          const y2 = (y + 1) * gridSize;

          if ((x + y) % 2 === 0) {
            const goUp = Math.floor(random() * 2) === 0;

            ctx.beginPath();
            if (goUp) {
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y1);
              ctx.lineTo(x2, y2);
            } else {
              ctx.moveTo(x1, y2);
              ctx.lineTo(x2, y2);
              ctx.lineTo(x2, y1);
            }
            ctx.stroke();
          }
        }
      }
    }
  }

  private static drawStepsPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    lightness: number
  ): void {
    const alpha = (Math.floor(random() * 3) + lightness * 7 + 9) / 255;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 2;

    const gridSize = Math.max(
      10,
      Math.floor(
        random() *
          (((width / 100) * (height / 100)) / 3 -
            ((width / 100) * (height / 100)) / 8)
      ) +
        ((width / 100) * (height / 100)) / 8
    );
    const horizontalCells = Math.floor(width / Math.max(gridSize, 1)) + 1;
    const verticalCells = Math.floor(height / Math.max(gridSize, 1)) + 1;
    const goUp = Math.floor(random() * 2) === 0;

    for (let i = 0; i < horizontalCells + verticalCells - 1; i++) {
      for (let x = 0; x <= i; x++) {
        const y = i - x;

        if (x < horizontalCells && y < verticalCells) {
          const x1 = x * gridSize;
          const y1 = y * gridSize;
          const x2 = (x + 1) * gridSize;
          const y2 = (y + 1) * gridSize;

          if ((x + y) % 2 === 0) {
            ctx.beginPath();
            if (goUp) {
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y1);
              ctx.lineTo(x2, y2);
            } else {
              ctx.moveTo(x1, y2);
              ctx.lineTo(x2, y2);
              ctx.lineTo(x2, y1);
            }
            ctx.stroke();
          }
        }
      }
    }
  }
}
