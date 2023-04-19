import { fileToImage } from "@/utils/file.util";
import { ChangeEvent } from "react";

export class ImageFile {
  private constructor(readonly file: File, readonly image: HTMLImageElement) {}

  static async fromFile(file: File): Promise<ImageFile> {
    const image = await fileToImage(file);
    return new ImageFile(file, image);
  }

  static async fromList(list?: null | FileList | DataTransferItemList) {
    if (!list) return [];

    const data = list instanceof FileList ? Array.from(list) : Array.from(list);

    return (await Promise.all(
      data
        .map(async (item) => {
          let file: File | null = null;
          if (item instanceof File) {
            file = item;
          } else {
            if (!item || item.kind !== "file") return;
            file = item.getAsFile();
          }

          if (!file) return null;

          return await ImageFile.fromFile(file).catch((error) => console.error(error));
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

  static fromUpload(callback: (images: ImageFile[]) => void) {
    return async (event: ChangeEvent<HTMLInputElement>) => {
      return ImageFile.fromChangeEvent(event)
        .then(callback)
        .catch((error) => console.error(error));
    };
  }
}
