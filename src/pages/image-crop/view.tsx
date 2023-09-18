import { ImageFile } from "@/classes/ImageFile";
import { Input } from "@/components/inputs";
import { useDropImages } from "@/hooks/useDropImages";
import { usePasteImages } from "@/hooks/usePasteImages";
import { SidebarLayout } from "@/layouts/sidebar/SidebarLayout";
import { cx } from "@/utils/class.util";
import { formatDimensions } from "@/utils/format.util";
import React from "react";
import ImageCropService from "./service";
import { Button } from "@/components/buttons";
import "./view.scss";

const ImageCropView: React.FC = () => {
  const [imageFile, setImageFile] = React.useState<ImageFile>();

  const [settings, setSetting] = ImageCropService.useSettings();
  const { refs, output } = ImageCropService.use(imageFile, settings);

  const dropRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { activeDrag } = useDropImages(dropRef, (images) => setImageFile(images[0]));

  usePasteImages((images) => setImageFile(images[0]));

  return (
    <SidebarLayout
      ref={dropRef}
      id="image-crop"
      title="Image Crop"
      underlay="Drop your image here"
      classNames={{
        root: activeDrag && "!bg-success",
      }}
    >
      <>
        <Input
          type="number"
          label="Alpha"
          value={settings.alphaLimit}
          min={0}
          max={100}
          onChange={(e) => setSetting("alphaLimit", e.target.valueAsNumber)}
        />

        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={ImageFile.fromUpload((images) => setImageFile(images[0]))}
        />

        <Button className="!w-full mt-2" onClick={() => fileInputRef.current?.click()} children="Upload" />
      </>

      <div className="relative w-full h-full grid grid-cols-[repeat(2,1fr)] grid-rows-[min-content,1fr] gap-x-8 gap-y-8 justify-center place-items-center">
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

export default ImageCropView;
