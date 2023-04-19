import { ImageFile } from "@/classes/ImageFile";
import { NumberInput } from "@/components/inputs/NumberInput";
import { usePasteImages } from "@/hooks/usePasteImage";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import imageCropService from "@/services/ImageCropService";
import React from "react";

export default function ImageCrop() {
  const [imageFile, setImageFile] = React.useState<ImageFile>();

  // Settings
  const [alphaLimit, setAlphaLimit] = React.useState<number | undefined>(0);
  const [color, setColor] = React.useState("#ff0000");

  const [output, setOutput] = React.useState<ReturnType<typeof imageCropService["start"]>>();

  const originalRef = React.useRef<HTMLCanvasElement>(null);
  const croppedRef = React.useRef<HTMLCanvasElement>(null);

  usePasteImages((images) => setImageFile(images[0]));

  React.useEffect(() => {
    if (!imageFile) return;

    const output = imageCropService.start(
      {
        image: imageFile.image,
        canvas: { original: originalRef.current!, crop: croppedRef.current! },
      },
      { alphaLimit, color }
    );

    setOutput(output);
  }, [imageFile, alphaLimit, color]);

  return (
    <SidebarLayout>
      <div className="relative w-full h-full flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <NumberInput
            className="w-full text-black pl-2"
            label="Alpha"
            min={0}
            max={100}
            state={[alphaLimit, setAlphaLimit]}
          />

          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

          {output && (
            <div>
              <div>ORIGINAL: {output.original.width}x{output.original.height}</div>
              <div>CROP: {output.crop.width}x{output.crop.height}</div>
            </div>
          )}
        </div>

        <input type="file" accept="image/*" onChange={ImageFile.fromUpload((images) => setImageFile(images[0]))} />
      </div>

      <div className="relative w-full h-full grid grid-cols-[1fr,1fr] gap-4 justify-center place-items-center">
        <canvas ref={originalRef} className="border border-red-400 object-contain max-w-full max-h-full" />
        <canvas ref={croppedRef} className="border border-red-400 object-contain max-w-full max-h-full" />
      </div>
    </SidebarLayout>
  );
}
