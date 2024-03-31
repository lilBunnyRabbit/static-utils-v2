import { ImageFile } from "@/classes/ImageFile";
import { Button } from "@/components/buttons";
import { Checkbox, Input } from "@/components/inputs";
import { SidebarLayout } from "@/layouts/sidebar/SidebarLayout";
import React from "react";
import ImageConcatService from "./service";
import "./view.scss";

const ImageConcatView: React.FC = () => {
  const [imageFiles, setImageFiles] = React.useState<ImageFile[]>([]);

  const [settings, setSetting] = ImageConcatService.useSettings();
  const { ref, output } = ImageConcatService.use(imageFiles, settings);

  const [zoom, setZoom] = React.useState<number | undefined>(50);

  const dropRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { activeDrag } = ImageFile.useDrop(dropRef, (images) => setImageFiles((current) => [...current, ...images]));

  ImageFile.useClipboard((images) => setImageFiles((current) => [...current, ...images]));

  return (
    <SidebarLayout
      ref={dropRef}
      id="image-concat"
      title="Image Concat"
      underlay={
        <>
          Drop or paste your
          <br />
          images here
        </>
      }
      actions={<Button className="!w-full" onClick={() => fileInputRef.current?.click()} children="Upload" />}
      classNames={{
        root: activeDrag && "!bg-success",
      }}
    >
      <>
        <div className="flex flex-col gap-4 text-zinc-100">
          <Input
            type="number"
            label="Gap"
            value={settings.gap}
            min={0}
            max={100}
            onChange={(e) => setSetting("gap", e.target.valueAsNumber)}
          />

          <Input
            type="number"
            label="Alpha"
            value={settings.alpha}
            min={0}
            max={100}
            onChange={(e) => setSetting("alpha", e.target.valueAsNumber)}
          />

          <div>
            <label className="mr-2 text-base">Align</label>
            <select
              className="text-black"
              value={settings.align}
              onChange={(e) => setSetting("align", e.target.value as ImageConcatService.Settings["align"])}
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </div>

          <input type="color" value={settings.background} onChange={(e) => setSetting("background", e.target.value)} />

          <Checkbox
            checked={settings.fit}
            onChange={(e) => setSetting("fit", e.target.checked)}
            label={settings.fit ? "Fit size" : "Original size"}
          />

          <Checkbox
            checked={settings.direction === "column"}
            onChange={(e) => setSetting("direction", e.target.checked ? "column" : "row")}
            label={settings.direction === "column" ? "Y-Axis" : "X-Axis"}
          />

          <Input
            type="number"
            label="Zoom"
            value={zoom}
            min={0}
            max={100}
            onChange={(e) => setZoom(e.target.valueAsNumber)}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={ImageFile.fromUpload((images) => setImageFiles((current) => [...current, ...images]))}
        />
      </>

      <div className="canvas-display" data-direction={settings.direction}>
        <div style={{ [settings.direction === "column" ? "maxWidth" : "maxHeight"]: `${zoom}%` }}>
          <canvas ref={ref} className="bg-white shadow-md" width={0} height={0} />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ImageConcatView;
