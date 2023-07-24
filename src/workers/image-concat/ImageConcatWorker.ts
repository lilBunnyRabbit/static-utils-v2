import { CanvasRenderer } from "@/classes/CanvasRenderer";
import { ImageFile } from "@/classes/ImageFile";
import { alphaToHex } from "@/utils/number.util";

export namespace ImageConcat {
  export interface Settings {
    gap: number;
    align: "start" | "center" | "end";
    background: string;
    alpha: number;
    fill: boolean;
    direction: "column" | "row";
  }
}

export class ImageConcatWorker extends CanvasRenderer {
  readonly settings: ImageConcat.Settings = {
    gap: 0,
    align: "start",
    background: "#ffffff",
    alpha: 0,
    fill: false,
    direction: "column",
  };

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, { willReadFrequently: true });
  }

  override render(images: ImageFile[]) {
    console.log(`${ImageConcatWorker.name}.render`);

    this.updateCanvasSize(images);

    if (this.settings.fill) return this.renderFill(images);
    return this.renderFit(images);
  }

  private renderFit(images: ImageFile[]) {
    this.clearCanvas(this.getBackground());

    let currentSize = 0;
    for (let i = 0; i < images.length; i++) {
      const { image } = images[i];

      if (this.settings.direction === "column") {
        let dx = 0;
        if (this.settings.align === "center") {
          dx = this.canvas.width / 2 - image.width / 2;
        } else if (this.settings.align === "end") {
          dx = this.canvas.width - image.width;
        }

        this.ctx.drawImage(image, dx, currentSize);
        currentSize += image.height + this.settings.gap;
      } else {
        let dy = 0;
        if (this.settings.align === "center") {
          dy = this.canvas.height / 2 - image.height / 2;
        } else if (this.settings.align === "end") {
          dy = this.canvas.height - image.height;
        }

        this.ctx.drawImage(image, currentSize, dy);
        currentSize += image.width + this.settings.gap;
      }
    }
  }

  private renderFill(images: ImageFile[]) {
    const imageSizes = this.updateImagesToFill(images);
    this.clearCanvas(this.getBackground());

    let currentSize = 0;
    for (let i = 0; i < images.length; i++) {
      const { image } = images[i];

      if (this.settings.direction === "column") {
        this.ctx.drawImage(image, 0, currentSize, this.canvas.width, imageSizes[i].height);
        currentSize += imageSizes[i].height + this.settings.gap;
      } else {
        this.ctx.drawImage(image, currentSize, 0, imageSizes[i].width, this.canvas.height);
        currentSize += imageSizes[i].width + this.settings.gap;
      }
    }
  }

  private getBackground() {
    if (this.settings.alpha > 0) {
      return `${this.settings.background}${alphaToHex(this.settings.alpha)}`;
    }
  }

  private updateCanvasSize(images: ImageFile[]) {
    let size = { width: 0, height: 0 };

    if (this.settings.direction === "column") {
      let maxWidth = 0;
      let height = Math.max(0, images.length - 1) * this.settings.gap;

      for (const { image } of images) {
        if (image.width > maxWidth) {
          maxWidth = image.width;
        }

        height += image.height;
      }

      size = { width: maxWidth, height };
    } else {
      let width = Math.max(0, images.length - 1) * this.settings.gap;
      let maxHeight = 0;

      for (const { image } of images) {
        if (image.height > maxHeight) {
          maxHeight = image.height;
        }

        width += image.width;
      }

      size = { width, height: maxHeight };
    }

    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  private updateImagesToFill(images: ImageFile[]) {
    let imageSizes: Array<{ width: number; height: number }> = [];

    if (this.settings.direction === "column") {
      let height = Math.max(0, images.length - 1) * this.settings.gap;

      imageSizes = images.map(({ image }) => {
        const h = this.canvas.width * (image.height / image.width);
        height += h;
        return { width: this.canvas.width, height: h };
      });

      this.canvas.height = height;
    } else {
      let width = Math.max(0, images.length - 1) * this.settings.gap;

      imageSizes = images.map(({ image }) => {
        const w = this.canvas.height * (image.width / image.height);
        width += w;
        return { width: w, height: this.canvas.height };
      });

      this.canvas.width = width;
    }

    return imageSizes;
  }
}
