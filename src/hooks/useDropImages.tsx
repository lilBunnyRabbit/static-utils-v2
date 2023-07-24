import { ImageFile } from "@/classes/ImageFile";
import React from "react";

export function useDropImages(ref: React.RefObject<HTMLElement>, callback: (imageFiles: ImageFile[]) => void) {
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
      callback(imageFiles);
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
