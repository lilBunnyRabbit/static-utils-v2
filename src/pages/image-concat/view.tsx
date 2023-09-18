import { ImageFile } from "@/classes/ImageFile";
import { Button } from "@/components/buttons";
import { Input } from "@/components/inputs";
import { usePasteImages } from "@/hooks/usePasteImages";
import { SidebarLayout } from "@/layouts/sidebar/SidebarLayout";
import React from "react";
import ImageConcatService from "./service";
import "./view.scss";

const service = new ImageConcatService();

const ImageConcatView: React.FC = () => {
  const [imageFiles, setImageFiles] = React.useState<ImageFile[]>([]);

  // Settings
  const [gap, setGap] = React.useState<number | undefined>(0);
  const [alpha, setAlpha] = React.useState<number | undefined>(0);
  const [align, setAlign] = React.useState<ImageConcatService.Settings["align"]>("start");
  const [background, setBackground] = React.useState("#ff0000");
  const [fit, setFit] = React.useState(false);
  const [direction, setDirection] = React.useState(true);

  const [zoom, setZoom] = React.useState<number | undefined>(50);

  const [output, setOutput] = React.useState<ReturnType<(typeof service)["render"]>>();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const settings: ImageConcatService.Settings = React.useMemo(
    () => ({
      gap: gap || 0,
      align,
      background,
      alpha: alpha || 0,
      fit,
      direction: direction ? "column" : "row",
    }),
    [gap, alpha, align, background, fit, direction]
  );

  usePasteImages((images) => setImageFiles((current) => [...current, ...images]));

  React.useEffect(() => {
    service.bind(canvasRef.current!);
  }, []);

  React.useEffect(() => {
    if (!imageFiles) return;

    const output = service.render(imageFiles, settings);

    setOutput(output);
  }, [imageFiles, settings]);

  return (
    <SidebarLayout id="image-concat" title="Image Concat" underlay="Drop your images here">
      <>
        <div className="flex flex-col gap-4 text-zinc-100">
          <Input
            type="number"
            label="Gap"
            value={gap}
            min={0}
            max={100}
            onChange={(e) => setGap(e.target.valueAsNumber)}
          />

          <Input
            type="number"
            label="Alpha"
            value={alpha}
            min={0}
            max={100}
            onChange={(e) => setAlpha(e.target.valueAsNumber)}
          />

          <div>
            <label className="mr-2 text-base">Align</label>
            <select className="text-black" value={align} onChange={(e) => setAlign(e.target.value as typeof align)}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </div>

          <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} />

          <div>
            <input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} />
            <label className="ml-2 text-base">Fit</label>
          </div>

          <div>
            <input type="checkbox" checked={direction} onChange={(e) => setDirection(e.target.checked)} />
            <label className="ml-2 text-base">Column?</label>
          </div>

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

        <Button className="!w-full mt-2" onClick={() => fileInputRef.current?.click()} children="Upload" />
      </>

      <div className="canvas-display" data-direction={settings.direction}>
        <div style={{ [settings.direction === "column" ? "maxWidth" : "maxHeight"]: `${zoom}%` }}>
          <canvas ref={canvasRef} className="bg-white shadow-md" />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ImageConcatView;
