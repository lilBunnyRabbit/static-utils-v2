export function formatDimensions({ width, height }: Record<"width" | "height", number>, unit = "px") {
  return `${width}${unit} x ${height}${unit}`;
}
