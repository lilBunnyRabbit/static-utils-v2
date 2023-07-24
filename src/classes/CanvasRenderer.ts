export class CanvasRenderer {
  protected ctx!: CanvasRenderingContext2D;

  constructor(readonly canvas: HTMLCanvasElement, options?: CanvasRenderingContext2DSettings) {
    const ctx = canvas.getContext("2d", options);
    if (!ctx) throw new Error("Failed to get canvas rendering context 2D.");

    this.ctx = ctx;
  }

  public render(..._: any[]) {
    throw new Error("Not implemented!");
  }

  protected clearCanvas(background?: string) {
    if (background) {
      this.ctx.fillStyle = background;
      return this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
  }
}
