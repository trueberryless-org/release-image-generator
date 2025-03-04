using SkiaSharp;
using Wacton.Unicolour;

namespace ReleaseImageGenerator.Domain;

public static class PatternGenerator
{
    public static void GeneratePattern(SKCanvas canvas, int width, int height, Random random, Unicolour primaryColor)
    {
        var lightness = primaryColor.Oklch.L;
        
        // Choose a pattern type randomly
        int patternType = random.Next(10);

        switch (patternType)
        {
            case 0:
                // Subtle grid pattern
                DrawGridPattern(canvas, width, height, random, lightness);
                break;
            case 1:
                // Dotted pattern
                DrawDottedPattern(canvas, width, height, random, lightness);
                break;
            case 2:
                // Wavy lines pattern
                DrawWavyPattern(canvas, width, height, random, lightness);
                break;
            case 3:
                // Geometric shapes
                DrawGeometricPattern(canvas, width, height, random, lightness);
                break;
            case 4:
                // Hexagonal grid
                DrawHexagonalPattern(canvas, width, height, random, lightness);
                break;
            case 5:
                // Concentric circles
                DrawConcentricPattern(canvas, width, height, random, lightness);
                break;
            case 6:
                // Circuit board pattern
                DrawCircuitPattern(canvas, width, height, random, lightness);
                break;
            case 7:
                // Maze pattern
                DrawMazePattern(canvas, width, height, random, lightness);
                break;
            case 8:
                // Steps pattern
                DrawStepsPattern(canvas, width, height, random, lightness);
                break;
        }
    }

    private static void DrawGridPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        // Subtle grid lines with very low opacity
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(3) + lightness * 10 + 7)),
            IsStroke = true,
            StrokeWidth = 1
        };

        int spacing = Math.Max(10, random.Next((width / 100) * (height / 100) / 7, (width / 100) * (height / 100) / 3));

        // Draw vertical lines
        for (int x = 0; x < width; x += spacing)
        {
            canvas.DrawLine(x, 0, x, height, paint);
        }

        // Draw horizontal lines
        for (int y = 0; y < height; y += spacing)
        {
            canvas.DrawLine(0, y, width, y, paint);
        }
    }

    private static void DrawDottedPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        // Create tiny dots with low opacity
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(3) + lightness * 11 + 12)),
            IsAntialias = true
        };

        int spacing = Math.Max(10, random.Next((width / 100) * (height / 100) / 8, (width / 100) * (height / 100) / 5));
        float dotSize = Math.Max(1, random.Next((width / 140) * (height / 140) / 100, (width / 140) * (height / 140) / 40));

        for (int x = 0; x < width; x += spacing)
        {
            for (int y = 0; y < height; y += spacing)
            {
                // Add slight randomness to position
                float randomOffset = Math.Max(0, random.Next((width / 150) * (height / 150) / 50, (width / 150) * (height / 150) / 25));
                float offsetX = (float)(randomOffset * 2 - randomOffset);
                float offsetY = (float)(randomOffset * 2 - randomOffset);

                canvas.DrawCircle(x + offsetX, y + offsetY, dotSize, paint);
            }
        }
    }

    private static void DrawWavyPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(3) + lightness * 9 + 8)),
            IsAntialias = true,
            IsStroke = true,
            StrokeWidth = 1
        };

        int spacing = Math.Max(10, random.Next((width / 100) * (height / 100) / 7, (width / 100) * (height / 100) / 3));
        int amplitude = Math.Max(5, random.Next((width / 100) * (height / 100) / 14, (width / 100) * (height / 100) / 8));
        int frequency = Math.Max(2, random.Next((width / 100) * (height / 100) / 30, (width / 100) * (height / 100) / 15));

        // Draw horizontal wavy lines
        for (int y = 0; y < height; y += spacing)
        {
            var path = new SKPath();
            path.MoveTo(0, y);

            for (int x = 0; x < width; x += 2)
            {
                float yOffset = (float)(Math.Sin(x * frequency / (double)width * Math.PI * 2) * amplitude);
                path.LineTo(x, y + yOffset);
            }

            canvas.DrawPath(path, paint);
        }

        // Draw vertical wavy lines with different frequency
        frequency = random.Next(2, 5);
        for (int x = 0; x < width; x += spacing)
        {
            var path = new SKPath();
            path.MoveTo(x, 0);

            for (int y = 0; y < height; y += 2)
            {
                float xOffset = (float)(Math.Sin(y * frequency / (double)height * Math.PI * 2) * amplitude);
                path.LineTo(x + xOffset, y);
            }

            canvas.DrawPath(path, paint);
        }
    }

    private static void DrawGeometricPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(4) + lightness * 17 + 18)),
            IsAntialias = true,
            IsStroke = true,
            StrokeWidth = 1
        };

        int shapeCount = Math.Max(10, random.Next((width / 140) * (height / 140) / 100, (width / 140) * (height / 140) / 50));

        // Calculate the optimal spacing based on the shape count and canvas size
        int spacing = width / shapeCount;

        for (int x = spacing / 4; x < width; x += spacing)
        {
            for (int y = spacing / 4; y < height; y += spacing)
            {
                int shapeType = random.Next(3);
                int size = Math.Max(10, random.Next(Math.Max(width, height) / 100, Math.Max(width, height) / 40));

                // Add slight randomness to position
                float randomOffset = Math.Max(0, random.Next(Math.Max(width, height) / 100, Math.Max(width, height) / 50));
                float offsetX = (float)(randomOffset * 2 - randomOffset);
                float offsetY = (float)(randomOffset * 2 - randomOffset);

                switch (shapeType)
                {
                    case 0: // Squares
                        canvas.DrawRect(x - size / 2 + offsetX, y - size / 2 + offsetY, size, size, paint);
                        break;
                    case 1: // Circles
                        canvas.DrawCircle(x + offsetX, y + offsetY, size / 2, paint);
                        break;
                    case 2: // Triangles
                        var path = new SKPath();
                        path.MoveTo(x + offsetX, y - size / 2 + offsetY);
                        path.LineTo(x - size / 2 + offsetX, y + size / 2 + offsetY);
                        path.LineTo(x + size / 2 + offsetX, y + size / 2 + offsetY);
                        path.Close();
                        canvas.DrawPath(path, paint);
                        break;
                }
            }
        }
    }

    private static void DrawHexagonalPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(3) + lightness * 11 + 8)),
            IsAntialias = true,
            IsStroke = true,
            StrokeWidth = 1
        };

        // Size of hexagons
        int size = Math.Max(10, random.Next((width / 100) * (height / 100) / 3, (width / 100) * (height / 100) / 2));
        float h = (float)(size * Math.Sqrt(3) / 2); // Height of equilateral triangle

        // Offset rows to create hexagonal tiling
        for (int row = -1; row < height / h + 1; row++)
        {
            for (int col = -1; col < width / size + 1; col++)
            {
                float centerX = col * size + (row % 2 == 0 ? 0 : size / 2);
                float centerY = row * h;

                // Draw a hexagon
                var path = new SKPath();
                for (int i = 0; i < 6; i++)
                {
                    float angle = (float)(Math.PI / 3 * i);
                    float x = centerX + (float)(size / 2 * Math.Cos(angle));
                    float y = centerY + (float)(size / 2 * Math.Sin(angle));

                    if (i == 0)
                        path.MoveTo(x, y);
                    else
                        path.LineTo(x, y);
                }

                path.Close();
                canvas.DrawPath(path, paint);
            }
        }
    }

    private static void DrawConcentricPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(3) + lightness * 8 + 10)),
            IsAntialias = true,
            IsStroke = true,
            StrokeWidth = 1
        };

        // Number of center points for concentric circles
        int numCenters = random.Next(1, 3);
        int maxRadius = Math.Max(width, height);

        for (int i = 0; i < numCenters; i++)
        {
            // Random center point
            float centerX = random.Next(width);
            float centerY = random.Next(height);

            // Draw several concentric circles from each center
            int numCircles = Math.Max(2, random.Next((width / 100) * (height / 100) / 30, (width / 100) * (height / 100) / 8));
            float radiusStep = maxRadius / numCircles;

            for (int j = 1; j <= numCircles; j++)
            {
                float radius = j * radiusStep;
                canvas.DrawCircle(centerX, centerY, radius, paint);
            }
        }
    }

    private static void DrawCrosshatchPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(3) + lightness * 6 + 8)),
            IsAntialias = true,
            IsStroke = true,
            StrokeWidth = 1,
            PathEffect = SKPathEffect.CreateDash(new float[] { 2, 4 }, 0)
        };

        int spacing = Math.Max(10, random.Next((width / 100) * (height / 100) / 7, (width / 100) * (height / 100) / 3));
        float angle1 = (float)(random.Next(30, 60) * Math.PI / 180); // Convert to radians
        float angle2 = angle1 + (float)(Math.PI / 2); // Perpendicular

        // Additional randomness to have varied line density
        int lineDensity = random.Next(1, 3);

        // Draw lines at angle1
        for (int i = -height; i < width + height; i += spacing / lineDensity)
        {
            float x1 = i;
            float y1 = 0;
            float x2 = i + height * (float)Math.Cos(angle1);
            float y2 = height * (float)Math.Sin(angle1);

            canvas.DrawLine(x1, y1, x2, y2, paint);
        }

        // Draw lines at angle2
        for (int i = -height; i < width + height; i += spacing / lineDensity)
        {
            float x1 = i;
            float y1 = 0;
            float x2 = i + height * (float)Math.Cos(angle2);
            float y2 = height * (float)Math.Sin(angle2);

            canvas.DrawLine(x1, y1, x2, y2, paint);
        }
    }

    private static void DrawCircuitPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(5) + lightness * 14 + 12)),
            IsAntialias = true,
            IsStroke = true,
            StrokeWidth = 1
        };

        int gridSize = Math.Max(10, random.Next((width / 100) * (height / 100) / 5, (width / 100) * (height / 100)));
        int lineChance = random.Next(50, 90); // Percentage chance of drawing a line

        // Create a grid of nodes
        for (int x = gridSize; x < width; x += gridSize)
        {
            for (int y = gridSize; y < height; y += gridSize)
            {
                // Sometimes draw a small node
                if (random.Next(100) < 60)
                {
                    float nodeSize = Math.Max(1,
                        random.Next((width / 140) * (height / 140) / 50, (width / 140) * (height / 140) / 20));
                    canvas.DrawCircle(x, y, nodeSize, paint);

                    // Draw horizontal line to the right
                    if (x + gridSize < width && random.Next(100) < lineChance)
                    {
                        // Occasionally draw straight line
                        if (random.Next(100) < 80)
                        {
                            canvas.DrawLine(x, y, x + gridSize, y, paint);
                        }
                        else
                        {
                            // Draw L-shaped line
                            int midX = x + gridSize / 2;
                            int midY = y + (random.Next(2) == 0 ? gridSize / 2 : -gridSize / 2);

                            var path = new SKPath();
                            path.MoveTo(x, y);
                            path.LineTo(midX, y);
                            path.LineTo(midX, midY);
                            path.LineTo(x + gridSize, midY);
                            path.LineTo(x + gridSize, y);
                            canvas.DrawPath(path, paint);
                        }
                    }

                    // Draw vertical line down
                    if (y + gridSize < height && random.Next(100) < lineChance)
                    {
                        // Occasionally draw straight line
                        if (random.Next(100) < 80)
                        {
                            canvas.DrawLine(x, y, x, y + gridSize, paint);
                        }
                        else
                        {
                            // Draw L-shaped line
                            int midY = y + gridSize / 2;
                            int midX = x + (random.Next(2) == 0 ? gridSize / 2 : -gridSize / 2);

                            var path = new SKPath();
                            path.MoveTo(x, y);
                            path.LineTo(x, midY);
                            path.LineTo(midX, midY);
                            path.LineTo(midX, y + gridSize);
                            path.LineTo(x, y + gridSize);
                            canvas.DrawPath(path, paint);
                        }
                    }
                }
            }
        }
    }

    private static void DrawMazePattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(3) + lightness * 11 + 11)),
            IsAntialias = true,
            IsStroke = true,
            StrokeWidth = 2 // Thicker lines
        };

        // Create a chess/steps pattern - decide on grid size
        int gridSize = Math.Max(10, random.Next((width / 100) * (height / 100) / 6, (width / 100) * (height / 100) / 3));

        // Determine how many grid cells we need in each dimension
        int horizontalCells = width / Math.Max(gridSize, 1) + 1;
        int verticalCells = height / Math.Max(gridSize, 1) + 1;

        // Create the step pattern
        for (int i = 0; i < horizontalCells + verticalCells - 1; i++)
        {
            // For each diagonal, we draw the step pattern
            for (int x = 0; x <= i; x++)
            {
                int y = i - x;

                // Only draw if within the grid bounds
                if (x < horizontalCells && y < verticalCells)
                {
                    // Calculate the actual coordinates
                    int x1 = x * gridSize;
                    int y1 = y * gridSize;
                    int x2 = (x + 1) * gridSize;
                    int y2 = (y + 1) * gridSize;

                    // Only draw if this is a "white" square in our chessboard pattern
                    if ((x + y) % 2 == 0)
                    {
                        bool goUp = random.Next(2) == 0;
                    
                        if (goUp)
                        {
                            canvas.DrawLine(x1, y1, x2, y1, paint); // Horizontal line
                            canvas.DrawLine(x2, y1, x2, y2, paint); // Vertical down
                        }
                        else
                        {
                            canvas.DrawLine(x1, y2, x2, y2, paint); // Horizontal line
                            canvas.DrawLine(x2, y2, x2, y1, paint); // Vertical up
                        }
                    }
                }
            }
        }
    }
    
    private static void DrawStepsPattern(SKCanvas canvas, int width, int height, Random random, double lightness)
    {
        var paint = new SKPaint
        {
            Color = SKColors.White.WithAlpha((byte)(random.Next(3) + lightness * 7 + 9)), // Slightly more visible
            IsAntialias = true,
            IsStroke = true,
            StrokeWidth = 2 // Thicker lines
        };

        // Create a chess/steps pattern - decide on grid size
        int gridSize = Math.Max(10, random.Next((width / 100) * (height / 100) / 8, (width / 100) * (height / 100) / 3));

        // Determine how many grid cells we need in each dimension
        int horizontalCells = width / Math.Max(gridSize, 1) + 1;
        int verticalCells = height / Math.Max(gridSize, 1) + 1;
        
        // Determine whether to go up or down
        bool goUp = random.Next(2) == 0;

        // Create the step pattern
        for (int i = 0; i < horizontalCells + verticalCells - 1; i++)
        {
            // For each diagonal, we draw the step pattern
            for (int x = 0; x <= i; x++)
            {
                int y = i - x;

                // Only draw if within the grid bounds
                if (x < horizontalCells && y < verticalCells)
                {
                    // Calculate the actual coordinates
                    int x1 = x * gridSize;
                    int y1 = y * gridSize;
                    int x2 = (x + 1) * gridSize;
                    int y2 = (y + 1) * gridSize;

                    // Only draw if this is a "white" square in our chessboard pattern
                    if ((x + y) % 2 == 0)
                    {
                        if (goUp)
                        {
                            canvas.DrawLine(x1, y1, x2, y1, paint); // Horizontal line
                            canvas.DrawLine(x2, y1, x2, y2, paint); // Vertical down
                        }
                        else
                        {
                            canvas.DrawLine(x1, y2, x2, y2, paint); // Horizontal line
                            canvas.DrawLine(x2, y2, x2, y1, paint); // Vertical up
                        }
                    }
                }
            }
        }
    }
}