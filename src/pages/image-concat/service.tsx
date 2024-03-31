import { ImageFile } from "@/classes/ImageFile";
import { useObjectState } from "@/hooks/useObjectState";
import { alphaToHex } from "@/utils/number.util";
import React from "react";

const defaultSettings: ImageConcatService.Settings = {
  gap: 0,
  align: "start",
  background: "#ffffff",
  alpha: 0,
  fit: false,
  direction: "column",
};

class ImageConcatService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  static useSettings() {
    return useObjectState<ImageConcatService.Settings>({
      gap: 0,
      align: "start",
      background: "#ff0000",
      alpha: 0,
      fit: false,
      direction: "column",
    });
  }

  static use(imageFiles?: ImageFile[], settings?: ImageConcatService.Settings) {
    const [output, setOutput] = React.useState<ReturnType<ImageConcatService["render"]>>();

    const { current: service } = React.useRef<ImageConcatService>(new ImageConcatService());

    const ref = React.useRef<HTMLCanvasElement>(null);

    const render = React.useCallback(
      async (imageFiles: ImageFile[], settings?: ImageConcatService.Settings) => {
        const output = service.render(imageFiles, settings);
        setOutput(output);
      },
      [service]
    );

    React.useEffect(() => {
      service.bind(ref.current!);
    }, []);

    React.useEffect(() => {
      if (!imageFiles) return;

      render(imageFiles, settings);
    }, [render, imageFiles, settings]);

    return {
      ref: ref,
      service,
      output,
      render,
    };
  }

  public bind(canvas: NonNullable<typeof this.canvas>) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    return this;
  }

  public render(imageFiles: ImageFile[], settings: ImageConcatService.Settings = defaultSettings) {
    if (!this.canvas || !this.ctx) return;
    console.log("ImageConcatService.render", settings);

    this.updateCanvasSize(imageFiles, settings);
    this.clearCanvas(settings);

    if (settings.fit) {
      const imageSizes = this.updateImagesToFit(imageFiles, settings);
      this.clearCanvas(settings);

      imageFiles.reduce((current, { image }, i) => {
        if (settings.direction === "column") {
          this.ctx!.drawImage(image, 0, current, this.canvas!.width, imageSizes[i].height);
          return current + imageSizes[i].height + settings.gap;
        } else {
          this.ctx!.drawImage(image, current, 0, imageSizes[i].width, this.canvas!.height);
          return current + imageSizes[i].width + settings.gap;
        }
      }, 0);
    } else {
      imageFiles.reduce((current, { image }) => {
        if (settings.direction === "column") {
          let dx = 0;
          if (settings.align === "center") dx = this.canvas!.width / 2 - image.width / 2;
          else if (settings.align === "end") dx = this.canvas!.width - image.width;

          this.ctx!.drawImage(image, dx, current);
          return current + image.height + settings.gap;
        } else {
          let dy = 0;
          if (settings.align === "center") dy = this.canvas!.height / 2 - image.height / 2;
          else if (settings.align === "end") dy = this.canvas!.height - image.height;

          this.ctx!.drawImage(image, current, dy);
          return current + image.width + settings.gap;
        }
      }, 0);
    }
  }

  private clearCanvas(settings: ImageConcatService.Settings) {
    if (settings.alpha > 0) {
      this.ctx!.fillStyle = `${settings.background}${alphaToHex(settings.alpha)}`;
      return this.ctx!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    }
    this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
  }

  private updateCanvasSize(imageFiles: ImageFile[], settings: ImageConcatService.Settings) {
    let size = { width: 0, height: 0 };

    if (settings.direction === "column") {
      let maxWidth = 0;
      let height = Math.max(0, imageFiles.length - 1) * settings.gap;

      imageFiles.forEach(({ image }) => {
        if (image.width > maxWidth) maxWidth = image.width;
        height += image.height;
      });

      size = { width: maxWidth, height };
    } else {
      let width = Math.max(0, imageFiles.length - 1) * settings.gap;
      let maxHeight = 0;

      imageFiles.forEach(({ image }) => {
        if (image.height > maxHeight) maxHeight = image.height;
        width += image.width;
      });

      size = { width, height: maxHeight };
    }

    this.canvas!.width = size.width;
    this.canvas!.height = size.height;
  }

  private updateImagesToFit(imageFiles: ImageFile[], settings: ImageConcatService.Settings) {
    let imageSizes: Array<{ width: number; height: number }> = [];

    if (settings.direction === "column") {
      let height = Math.max(0, imageFiles.length - 1) * settings.gap;

      imageSizes = imageFiles.map(({ image }) => {
        const h = this.canvas!.width * (image.height / image.width);
        height += h;
        return { width: this.canvas!.width, height: h };
      });

      this.canvas!.height = height;
    } else {
      let width = Math.max(0, imageFiles.length - 1) * settings.gap;

      imageSizes = imageFiles.map(({ image }) => {
        const w = this.canvas!.height * (image.width / image.height);
        width += w;
        return { width: w, height: this.canvas!.height };
      });

      this.canvas!.width = width;
    }

    return imageSizes;
  }
}

namespace ImageConcatService {
  export interface Settings {
    gap: number;
    align: "start" | "center" | "end";
    background: string;
    alpha: number;
    fit: boolean;
    direction: "column" | "row";
  }
}

export default ImageConcatService;
