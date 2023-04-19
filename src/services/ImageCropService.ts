import { ImageFile } from "@/classes/ImageFile";
import { drawHollowRect } from "@/utils/canvas.util";

export class ImageCropService {
  private canvas: Record<"original" | "crop", HTMLCanvasElement> | null = null;

  public bind(canvas: typeof this.canvas) {
    this.canvas = canvas;
  }

  public render(
    imageFile: ImageFile,
    settings: {
      alphaLimit?: number;
      color?: string | CanvasGradient | CanvasPattern;
    } = {}
  ) {
    if (!this.canvas) return;

    const ctx = {
      original: this.canvas.original.getContext("2d"),
      crop: this.canvas.crop.getContext("2d"),
    };
    if (!ctx.original || !ctx.crop) return;

    const { image } = imageFile;

    this.canvas.original.width = image.width;
    this.canvas.original.height = image.height;

    ctx.original.clearRect(0, 0, this.canvas.original.width, this.canvas.original.height);
    ctx.original.drawImage(image, 0, 0);

    const cropLimits = this.getCropLimits(ctx.original, ((settings.alphaLimit || 0) * 255) / 100);

    ctx.original.fillStyle = settings.color || "#ff0000";
    drawHollowRect(ctx.original, cropLimits);

    this.canvas.crop.width = cropLimits.right - cropLimits.left;
    this.canvas.crop.height = cropLimits.bottom - cropLimits.top;

    ctx.crop.clearRect(0, 0, this.canvas.crop.width, this.canvas.crop.height);
    ctx.crop.drawImage(
      image,
      cropLimits.left,
      cropLimits.top,
      this.canvas.crop.width,
      this.canvas.crop.height,
      0,
      0,
      this.canvas.crop.width,
      this.canvas.crop.height
    );

    return {
      original: {
        width: this.canvas.original.width,
        height: this.canvas.original.height,
      },
      crop: {
        width: this.canvas.crop.width,
        height: this.canvas.crop.height,
      },
    };
  }

  private getCropLimits(ctx: CanvasRenderingContext2D, alphaLimit = 0) {
    const canvas = ctx.canvas;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const isValidAlpha = (x: number, y: number) => data[(y * canvas.width + x) * 4 + 3] <= alphaLimit;

    const getTopLimit = () => {
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (!isValidAlpha(x, y)) return y;
        }
      }
      return 0;
    };

    const getRightLimit = (top: number) => {
      for (let x = canvas.width - 1; x >= 0; x--) {
        for (let y = top; y < canvas.height; y++) {
          if (!isValidAlpha(x, y)) {
            return x === canvas.width ? canvas.width : x + 1;
          }
        }
      }
      return canvas.width;
    };

    const getBottomLimit = (right: number) => {
      for (let y = canvas.height - 1; y >= 0; y--) {
        for (let x = 0; x < right; x++) {
          if (!isValidAlpha(x, y)) {
            return y === canvas.height ? canvas.height : y + 1;
          }
        }
      }
      return canvas.height;
    };

    const getLeftLimit = (top: number, bottom: number) => {
      for (let x = 0; x < canvas.width; x++) {
        for (let y = top; y < bottom; y++) {
          if (!isValidAlpha(x, y)) return x;
        }
      }
      return 0;
    };

    const top = getTopLimit();
    const right = getRightLimit(top);
    const bottom = getBottomLimit(right);
    const left = getLeftLimit(top, bottom);

    return { top, bottom, left, right };
  }
}
