import { drawHollowRect } from "@/utils/canvas.util";

interface StartData {
  image: HTMLImageElement;
  canvas: Record<"original" | "crop", HTMLCanvasElement>;
}

interface StartSettings {
  alphaLimit?: number;
  color?: string | CanvasGradient | CanvasPattern;
}

export class ImageCropService {
  public start({ image, canvas }: StartData, settings: StartSettings = {}) {
    const ctx = {
      original: canvas.original.getContext("2d"),
      crop: canvas.crop.getContext("2d"),
    };
    if (!ctx.original || !ctx.crop) return;

    canvas.original.width = image.width;
    canvas.original.height = image.height;

    ctx.original.clearRect(0, 0, canvas.original.width, canvas.original.height);
    ctx.original.drawImage(image, 0, 0);

    const cropLimits = this.getCropLimits(ctx.original, ((settings.alphaLimit || 0) * 255) / 100);

    ctx.original.fillStyle = settings.color || "#ff0000";
    drawHollowRect(ctx.original, cropLimits);

    canvas.crop.width = cropLimits.right - cropLimits.left;
    canvas.crop.height = cropLimits.bottom - cropLimits.top;

    ctx.crop.clearRect(0, 0, canvas.crop.width, canvas.crop.height);
    ctx.crop.drawImage(
      image,
      cropLimits.left,
      cropLimits.top,
      canvas.crop.width,
      canvas.crop.height,
      0,
      0,
      canvas.crop.width,
      canvas.crop.height
    );

    return {
      original: {
        width: canvas.original.width,
        height: canvas.original.height,
      },
      crop: {
        width: canvas.crop.width,
        height: canvas.crop.height,
      },
    };
  }

  private getCropLimits(ctx: CanvasRenderingContext2D, alphaLimit = 0) {
    const canvas = ctx.canvas;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const alphas: Record<number, boolean> = {};

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

    console.log({ alphas });

    return { top, bottom, left, right };
  }
}

export default new ImageCropService();
