import { ImageFile } from "@/classes/ImageFile";
import { NumberInput } from "@/components/inputs/NumberInput";
import { Paper } from "@/components/inputs/Paper";
import { usePasteImages } from "@/hooks/usePasteImage";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ImageCropService } from "@/services/ImageCropService";
import { cx } from "@/utils/class.util";
import { formatDimensions } from "@/utils/format.util";
import React from "react";

const service = new ImageCropService();

export const ImageCropView: React.FC = () => {
  const [imageFile, setImageFile] = React.useState<ImageFile>();

  // Settings
  const [alphaLimit, setAlphaLimit] = React.useState<number | undefined>(0);

  const [output, setOutput] = React.useState<ReturnType<(typeof service)["render"]>>();

  const originalRef = React.useRef<HTMLCanvasElement>(null);
  const croppedRef = React.useRef<HTMLCanvasElement>(null);

  usePasteImages((images) => setImageFile(images[0]));

  React.useEffect(() => {
    service.bind({ original: originalRef.current!, crop: croppedRef.current! });
  }, []);

  React.useEffect(() => {
    if (!imageFile) return;

    const output = service.render(imageFile, { alphaLimit, color: "#18181b" });

    setOutput(output);
  }, [imageFile, alphaLimit]);

  return (
    <SidebarLayout>
      <div className="relative w-full h-full flex flex-col justify-between">
        <div className="flex flex-col gap-4 text-zinc-100">
          <NumberInput
            className="w-full text-zinc-900 pl-2"
            label="Alpha"
            min={0}
            max={100}
            state={[alphaLimit, setAlphaLimit]}
          />
        </div>

        <input type="file" accept="image/*" onChange={ImageFile.fromUpload((images) => setImageFile(images[0]))} />
      </div>

      <div className="relative w-full h-full grid grid-cols-[repeat(2,1fr)] grid-rows-[min-content,1fr] gap-x-8 gap-y-8 justify-center place-items-center">
        {output && (
          <>
            <h3 children={formatDimensions(output.original)} />
            <h3 children={formatDimensions(output.crop)} />
          </>
        )}

        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <canvas ref={originalRef} className={cx("object-contain max-w-full max-h-full bg-white shadow-md", !imageFile && "hidden")} />
        </div>

        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <canvas ref={croppedRef} className={cx("object-contain max-w-full max-h-full bg-white shadow-md", !imageFile && "hidden")} />
        </div>
      </div>
    </SidebarLayout>
  );
};
