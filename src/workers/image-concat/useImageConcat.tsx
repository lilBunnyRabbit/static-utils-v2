import { ImageFile } from "@/classes/ImageFile";
import React from "react";
import { ImageConcat, ImageConcatWorker } from "./ImageConcatWorker";

export function useImageConcat(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [worker, setWorker] = React.useState<ImageConcatWorker>();
  const [settings, setSettings] = React.useState<ImageConcat.Settings>();

  const [imageFiles, setImageFiles] = React.useState<ImageFile[]>([]);

  const render = React.useCallback(() => {
    if (!worker) return;
    worker.render(imageFiles);
  }, [worker, imageFiles]);

  React.useEffect(() => {
    if (!canvasRef.current) {
      return console.error("Missing canvas ref.");
    }

    const worker = new ImageConcatWorker(canvasRef.current);
    setWorker(worker);
    setSettings(worker.settings);

    return () => {
      setWorker(undefined);
      setSettings(undefined);
    };
  }, [canvasRef]);

  return {
    worker,
    settings,

    updateSettings: (settings: Partial<ImageConcat.Settings>) => {
      if (!worker) return;

      for (const key in settings) {
        if (key in worker.settings) {
          (worker.settings[key as keyof ImageConcat.Settings] as any) = settings[key as keyof ImageConcat.Settings];
        }
      }

      setSettings(worker.settings);
    },

    addImageFiles: (imageFiles: ImageFile | ImageFile[]) => {
      setImageFiles((current) => {
        if (Array.isArray(imageFiles)) return [...current, ...imageFiles];
        return [...current, imageFiles];
      });

      render();
    },
  };
}
