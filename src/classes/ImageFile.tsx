import { fileToImage } from "@/utils/file.util";
import React, { ChangeEvent } from "react";

export class ImageFile {
  private constructor(readonly file: File, readonly image: HTMLImageElement) {}

  static async fromFile(file: File): Promise<ImageFile | null> {
    if (!file.type.match("^image/")) return null;

    const image = await fileToImage(file);
    if (!image) return null;

    return new ImageFile(file, image);
  }

  static async fromList(list?: null | FileList | DataTransferItemList) {
    if (!list) return [];

    const files: File[] = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!item) continue;

      if (item instanceof File) {
        files.push(item);
      } else if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    return (await Promise.all(
      files
        .map(async (file) => {
          return await ImageFile.fromFile(file).catch((error) => {
            console.error(error);
            return null;
          });
        })
        .filter(Boolean)
    )) as ImageFile[];
  }

  static async fromClipboardEvent(event: ClipboardEvent): Promise<ImageFile[]> {
    return await ImageFile.fromList(event.clipboardData?.items);
  }

  static async fromChangeEvent(event: ChangeEvent<HTMLInputElement>): Promise<ImageFile[]> {
    return await ImageFile.fromList((event.target as HTMLInputElement).files);
  }

  static fromUpload(callback: (imageFiles: ImageFile[]) => void) {
    return async (event: ChangeEvent<HTMLInputElement>) => {
      return ImageFile.fromChangeEvent(event)
        .then(callback)
        .catch((error) => console.error(error));
    };
  }

  static useClipboard(callback: (imageFiles: ImageFile[]) => void) {
    React.useEffect(() => {
      let pasteEnabled = true;

      const handlePaste = async (event: ClipboardEvent) => {
        if (!pasteEnabled) return;
        pasteEnabled = false;

        await ImageFile.fromClipboardEvent(event)
          .then((imageFiles) => imageFiles.length && callback(imageFiles))
          .catch((e: string) => {
            // createNotification({ title: "Paste Error", description: e, type: "error" });
            console.error(e);
          });

        pasteEnabled = true;
      };

      document.addEventListener("paste", handlePaste);
      return () => {
        document.removeEventListener("paste", handlePaste);
      };
    }, [callback]);
  }

  static useDrop(ref: React.RefObject<HTMLElement>, callback: (imageFiles: ImageFile[]) => void) {
    const [activeDrag, setActiveDrag] = React.useState(false);

    const handleDrag = React.useCallback((event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      console.log(event.type);

      if (event.type === "dragenter" || event.type === "dragover") {
        setActiveDrag(true);
      } else if (event.type === "dragleave") {
        setActiveDrag(false);
      }
    }, []);

    const handleDrop = React.useCallback(async (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      setActiveDrag(false);

      if (event?.dataTransfer?.files) {
        const imageFiles = await ImageFile.fromList(event.dataTransfer.files);
        imageFiles.length && callback(imageFiles);
      }
    }, []);

    React.useEffect(() => {
      const element = ref.current;
      if (!element) return console.error("Missing ref.");
      console.log("React.useEffect");

      element.addEventListener("dragenter", handleDrag);
      element.addEventListener("dragleave", handleDrag);
      element.addEventListener("dragover", handleDrag);
      element.addEventListener("drop", handleDrop);

      return () => {
        element.removeEventListener("dragenter", handleDrag);
        element.removeEventListener("dragleave", handleDrag);
        element.removeEventListener("dragover", handleDrag);
        element.removeEventListener("drop", handleDrop);

        setActiveDrag(false);
      };
    }, [ref, handleDrag, handleDrop]);

    return {
      activeDrag,
    };
  }
}
