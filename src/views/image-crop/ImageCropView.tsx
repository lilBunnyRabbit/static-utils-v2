import { ImageFile } from "@/classes/ImageFile";
import { Input } from "@/components/inputs";
import { useDropImages } from "@/hooks/useDropImages";
import { usePasteImages } from "@/hooks/usePasteImages";
import { SidebarLayout } from "@/layouts/sidebar/SidebarLayout";
import { ImageCropService } from "@/services/imageCrop.service";
import { cx } from "@/utils/class.util";
import { formatDimensions } from "@/utils/format.util";
import React from "react";

export const ImageCropView: React.FC = () => {
  const [imageFile, setImageFile] = React.useState<ImageFile>();
  const [settings, setSetting] = ImageCropService.useSettings();

  const { refs, output } = ImageCropService.use(imageFile, settings);

  const dropRef = React.useRef<HTMLDivElement>(null);

  const { activeDrag } = useDropImages(dropRef, (images) => setImageFile(images[0]));

  usePasteImages((images) => setImageFile(images[0]));

  return (
    <SidebarLayout title="Image Crop">
      <div className="relative w-full h-full flex flex-col justify-between">
        <div className="flex flex-col gap-4 text-zinc-100">
          <Input
            type="number"
            label="Alpha"
            color="tertiary"
            value={settings.alphaLimit}
            onChange={(e) => setSetting("alphaLimit", e.target.valueAsNumber)}
          />
        </div>

        <input type="file" accept="image/*" onChange={ImageFile.fromUpload((images) => setImageFile(images[0]))} />
      </div>

      <div
        ref={dropRef}
        className={cx(
          "relative w-full h-full grid grid-cols-[repeat(2,1fr)] grid-rows-[min-content,1fr] gap-x-8 gap-y-8 justify-center place-items-center",
          activeDrag && "!bg-red-400"
        )}
      >
        {output && (
          <>
            <h3 children={formatDimensions(output.original)} />
            <h3 children={formatDimensions(output.crop)} />
          </>
        )}

        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <canvas
            ref={refs.original}
            className={cx("object-contain max-w-full max-h-full bg-white shadow-md", !imageFile && "hidden")}
          />
        </div>

        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <canvas
            ref={refs.cropped}
            className={cx("object-contain max-w-full max-h-full bg-white shadow-md", !imageFile && "hidden")}
          />
        </div>
      </div>
    </SidebarLayout>
  );
};
