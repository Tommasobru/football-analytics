import { useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";
import type { GraphData, GraphNode, GraphEdge } from "../../api/types";
import { createSimulation, nodeRadius, edgeWidth, edgeOpacity } from "../../lib/graph";

interface ForceGraphProps {
  data: GraphData;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  onNodeClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
}

export default function ForceGraph({ data, svgRef: externalSvgRef, onNodeClick, onEdgeClick }: ForceGraphProps) {
  const internalSvgRef = useRef<SVGSVGElement>(null);
  const svgRef = externalSvgRef || internalSvgRef;
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const render = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    svg.selectAll("*").remove();

    if (!data.nodes.length) return;

    // Deep copy to avoid D3 mutation issues
    const nodes: GraphNode[] = data.nodes.map((d) => ({ ...d }));
    const edges: GraphEdge[] = data.edges.map((d) => ({ ...d }));

    // Arrow marker
    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#64748b");

    const g = svg.append("g");

    // Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Edges
    const link = g
      .append("g")
      .selectAll<SVGLineElement, GraphEdge>("line")
      .data(edges)
      .join("line")
      .attr("stroke", "#64748b")
      .attr("stroke-width", (d) => edgeWidth(d.weight))
      .attr("stroke-opacity", (d) => edgeOpacity(d.dominance))
      .attr("marker-end", "url(#arrow)")
      .attr("cursor", "pointer")
      .on("click", (_event, d) => onEdgeClick?.(d));

    // Nodes
    const node = g
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (_event, d) => onNodeClick?.(d))
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulationRef.current?.alphaTarget(0);
            // Keep pinned on single drag, double-click to unpin
          }),
      );

    // Node circles
    node
      .append("circle")
      .attr("r", (d) => nodeRadius(d))
      .attr("fill", "#1e40af")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2);

    // Crest images in nodes
    node
      .append("clipPath")
      .attr("id", (d) => `clip-${d.id}`)
      .append("circle")
      .attr("r", (d) => nodeRadius(d) - 3);

    node
      .filter((d) => !!d.crestUrl)
      .append("image")
      .attr("xlink:href", (d) => d.crestUrl)
      .attr("x", (d) => -(nodeRadius(d) - 3))
      .attr("y", (d) => -(nodeRadius(d) - 3))
      .attr("width", (d) => (nodeRadius(d) - 3) * 2)
      .attr("height", (d) => (nodeRadius(d) - 3) * 2)
      .attr("clip-path", (d) => `url(#clip-${d.id})`)
      .on("error", function () {
        d3.select(this).remove();
      });

    // Labels
    node
      .append("text")
      .text((d) => d.tla || d.name.slice(0, 3).toUpperCase())
      .attr("text-anchor", "middle")
      .attr("dy", (d) => nodeRadius(d) + 14)
      .attr("fill", "#cbd5e1")
      .attr("font-size", "10px")
      .attr("font-weight", "600");

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    node
      .on("mouseenter", (event, d) => {
        tooltip
          .style("display", "block")
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY - 12}px`)
          .html(
            `<strong>${d.name}</strong><br/>` +
              `W: ${d.totalWins} D: ${d.totalDraws} L: ${d.totalLosses}<br/>` +
              `Goals: ${d.totalGoals}`,
          );
      })
      .on("mouseleave", () => {
        tooltip.style("display", "none");
      });

    // Double-click to unpin
    node.on("dblclick", (_event, d) => {
      d.fx = null;
      d.fy = null;
      simulationRef.current?.alphaTarget(0.1).restart();
      setTimeout(() => simulationRef.current?.alphaTarget(0), 500);
    });

    // Simulation
    if (simulationRef.current) simulationRef.current.stop();

    const simulation = createSimulation(nodes, edges, width, height);
    simulationRef.current = simulation;

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Store zoom for external controls
    (svgRef.current as any).__zoom_behavior = zoom;
    (svgRef.current as any).__zoom_g = g;
  }, [data, onNodeClick, onEdgeClick]);

  useEffect(() => {
    render();
    return () => {
      simulationRef.current?.stop();
    };
  }, [render]);

  return (
    <div className="relative h-full w-full">
      <svg ref={svgRef} className="h-full w-full bg-slate-950 rounded-lg" />
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-50 hidden rounded-md bg-slate-800 px-3 py-2 text-xs text-slate-200 shadow-lg border border-slate-600"
      />
    </div>
  );
}
