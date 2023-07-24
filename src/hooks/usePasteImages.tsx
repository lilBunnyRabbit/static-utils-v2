import { ImageFile } from "@/classes/ImageFile";
import React from "react";

export function usePasteImages(callback: (imageFiles: ImageFile[]) => void) {
  React.useEffect(() => {
    let pasteEnabled = true;

    const handlePaste = async (event: ClipboardEvent) => {
      if (!pasteEnabled) return;
      pasteEnabled = false;

      await ImageFile.fromClipboardEvent(event)
        .then(callback)
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
