import { ImageFile } from "@/classes/ImageFile";
import { usePasteImages } from "@/hooks/usePasteImage";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { drawHollowRect } from "@/utils/canvas.util";
import React from "react";

class ImageCropService {
  public start(imageFile: ImageFile, ogCanvas: HTMLCanvasElement, cropCanvas: HTMLCanvasElement) {
    const ogCtx = ogCanvas.getContext("2d");
    const cropCtx = cropCanvas.getContext("2d");
    if (!ogCtx || !cropCtx) return;

    const { image } = imageFile;

    ogCanvas.width = image.width;
    ogCanvas.height = image.height;
    ogCtx.clearRect(0, 0, ogCanvas.width, ogCanvas.height);
    ogCtx.drawImage(image, 0, 0);

    const cropLimits = this.getCropLimits(ogCtx, 0);
    console.log("cropLimits", cropLimits);

    ogCtx.fillStyle = "#ff0000";
    drawHollowRect(ogCtx, cropLimits);

    cropCanvas.width = cropLimits.right - cropLimits.left;
    cropCanvas.height = cropLimits.bottom - cropLimits.top;

    cropCtx.drawImage(
      image,
      cropLimits.left,
      cropLimits.top,
      cropCanvas.width,
      cropCanvas.height,
      0,
      0,
      cropCanvas.width,
      cropCanvas.height
    );
  }

  private getCropLimits(ctx: CanvasRenderingContext2D, alphaLimit = 0) {
    const canvas = ctx.canvas;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const getAlpha = (x: number, y: number) => data[(y * canvas.width + x) * 4 + 3];

    const getTopLimit = () => {
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (getAlpha(x, y) > alphaLimit) return y;
        }
      }
      return 0;
    };

    const getRightLimit = (top: number) => {
      for (let x = canvas.width - 1; x >= 0; x--) {
        for (let y = top; y < canvas.height; y++) {
          if (getAlpha(x, y) > alphaLimit) {
            return x === canvas.width ? canvas.width : x + 1;
          }
        }
      }
      return canvas.width;
    };

    const getBottomLimit = (right: number) => {
      for (let y = canvas.height - 1; y >= 0; y--) {
        for (let x = 0; x < right; x++) {
          if (getAlpha(x, y) > alphaLimit) {
            return y === canvas.height ? canvas.height : y + 1;
          }
        }
      }
      return canvas.height;
    };

    const getLeftLimit = (top: number, bottom: number) => {
      for (let x = 0; x < canvas.width; x++) {
        for (let y = top; y < bottom; y++) {
          if (getAlpha(x, y) > alphaLimit) return x;
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

const imageCropService = new ImageCropService();

export default function ImageCrop() {
  const [imageFile, setImageFile] = React.useState<ImageFile>();

  const originalRef = React.useRef<HTMLCanvasElement>(null);
  const croppedRef = React.useRef<HTMLCanvasElement>(null);

  usePasteImages((images) => setImageFile(images[0]));

  React.useEffect(() => {
    console.log({ imageFile, name: imageFile?.file.name });
    if (!imageFile || !originalRef.current || !croppedRef.current) return;
    imageCropService.start(imageFile, originalRef.current, croppedRef.current);
  }, [imageFile]);

  return (
    <SidebarLayout>
      <div className="relative w-full h-full flex flex-col justify-between">
        <div></div>

        <input type="file" accept="image/*" onChange={ImageFile.fromUpload((images) => setImageFile(images[0]))} />
      </div>

      <div className="relative w-full h-full bg-zinc-500 grid grid-cols-[1fr,1fr] gap-2 justify-center place-items-center">
        <canvas ref={originalRef} className="border border-red-400 object-contain max-w-full max-h-full"></canvas>
        <canvas ref={croppedRef} className="border border-red-400 object-contain max-w-full max-h-full"></canvas>
      </div>
    </SidebarLayout>
  );
}
