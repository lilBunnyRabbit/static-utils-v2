import { ImageFile } from "@/classes/ImageFile";
import { useObjectState } from "@/hooks/useObjectState";
import { drawHollowRect } from "@/utils/canvas.util";
import React from "react";
import { flushSync } from "react-dom";

class ImageCropService {
  private canvas: Record<"original" | "crop", HTMLCanvasElement> | null = null;
  private ctx: Record<"original" | "crop", CanvasRenderingContext2D> | null = null;

  constructor(readonly debug = true) {}

  private log() {
    if (!this.debug) return;
    console.log(`${ImageCropService.name}`, this.log.prototype);
  }

  static useSettings() {
    return useObjectState<ImageCropService.Settings>({
      alphaLimit: 0,
      color: "#F27C7C",
    });
  }

  static use(imageFile?: ImageFile, settings?: ImageCropService.Settings) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [output, setOutput] = React.useState<Awaited<ReturnType<ImageCropService["render"]>>>();

    const { current: service } = React.useRef<ImageCropService>(new ImageCropService());

    const originalRef = React.useRef<HTMLCanvasElement>(null);
    const croppedRef = React.useRef<HTMLCanvasElement>(null);

    const render = React.useCallback(
      async (imageFile: ImageFile, settings?: ImageCropService.Settings) => {
        const output = await service.render(imageFile, settings);
        setIsLoading(false);
        setOutput(output);
      },
      [service]
    );

    React.useEffect(() => {
      service.bind({ original: originalRef.current!, crop: croppedRef.current! });
    }, []);

    React.useEffect(() => {
      if (!imageFile) return;
      setIsLoading(true);
      render(imageFile, settings);
    }, [render, imageFile, settings]);

    return {
      refs: {
        original: originalRef,
        cropped: croppedRef,
      },
      service,
      output,
      render,
      isLoading,
    };
  }

  public bind(canvas: NonNullable<typeof this.canvas>) {
    this.canvas = canvas;
    this.ctx = {
      original: canvas.original.getContext("2d", { willReadFrequently: true })!,
      crop: canvas.crop.getContext("2d", { willReadFrequently: true })!,
    };

    return this;
  }

  public async render(imageFile: ImageFile, settings: ImageCropService.Settings = {}) {
    this.log();
    if (!this.canvas || !this.ctx) return;

    const { image } = imageFile;

    this.canvas.original.width = image.width;
    this.canvas.original.height = image.height;

    this.ctx.original.clearRect(0, 0, this.canvas.original.width, this.canvas.original.height);
    this.ctx.original.drawImage(image, 0, 0);

    const cropLimits = this.getCropLimits(this.ctx.original, ((settings.alphaLimit || 0) * 255) / 100);

    this.ctx.original.fillStyle = settings.color || "#ff0000";
    drawHollowRect(this.ctx.original, cropLimits);

    this.canvas.crop.width = cropLimits.right - cropLimits.left;
    this.canvas.crop.height = cropLimits.bottom - cropLimits.top;

    this.ctx.crop.clearRect(0, 0, this.canvas.crop.width, this.canvas.crop.height);
    this.ctx.crop.drawImage(
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

namespace ImageCropService {
  export interface Settings {
    alphaLimit?: number;
    color?: string | CanvasGradient | CanvasPattern;
  }
}

export default ImageCropService;
