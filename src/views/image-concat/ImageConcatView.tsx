import { ImageFile } from "@/classes/ImageFile";
import { NumberInput } from "@/components/inputs/NumberInput";
import { usePasteImages } from "@/hooks/usePasteImage";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ImageConcatService } from "@/services/ImageConcatService";
import React from "react";
import "./ImageConcatView.scss";

const service = new ImageConcatService();

export const ImageConcatView: React.FC = () => {
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
    <SidebarLayout id="image-concat">
      <div className="relative w-full h-full flex flex-col justify-between">
        <div className="flex flex-col gap-4 text-zinc-100">
          <NumberInput className="w-full text-zinc-900 pl-2" label="Gap" min={0} max={100} state={[gap, setGap]} />
          <NumberInput className="w-full text-zinc-900 pl-2" label="Alpha" min={0} max={100} state={[alpha, setAlpha]} />
          <div>
            <label>Align</label>
            <select className="text-black" value={align} onChange={(e) => setAlign(e.target.value as typeof align)}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </div>
          <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
          <div>
            <input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} />
            <label>Fit</label>
          </div>
          <div>
            <input type="checkbox" checked={direction} onChange={(e) => setDirection(e.target.checked)} />
            <label>Column?</label>
          </div>

          <NumberInput className="w-full text-zinc-900 pl-2" label="Zoom" min={0} max={100} state={[zoom, setZoom]} />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={ImageFile.fromUpload((images) => setImageFiles((current) => [...current, ...images]))}
        />
      </div>

      <div className="canvas-display" data-direction={settings.direction}>
        <div style={{ [settings.direction === "column" ? "maxWidth" : "maxHeight"]: `${zoom}%` }}>
          <canvas ref={canvasRef} className="bg-white shadow-md" />
        </div>
      </div>
    </SidebarLayout>
  );
};
