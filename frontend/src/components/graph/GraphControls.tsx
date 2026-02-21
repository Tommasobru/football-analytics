import * as d3 from "d3";

interface GraphControlsProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export default function GraphControls({ svgRef }: GraphControlsProps) {
  const zoomBy = (factor: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svgRef.current as any).__zoom_behavior;
    if (zoom) {
      svg.transition().duration(300).call(zoom.scaleBy, factor);
    }
  };

  const resetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svgRef.current as any).__zoom_behavior;
    if (zoom) {
      svg
        .transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={() => zoomBy(1.3)}
        className="rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600"
        title="Zoom in"
      >
        +
      </button>
      <button
        onClick={() => zoomBy(0.7)}
        className="rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600"
        title="Zoom out"
      >
        -
      </button>
      <button
        onClick={resetZoom}
        className="rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600"
        title="Reset view"
      >
        Reset
      </button>
    </div>
  );
}
