import * as d3 from "d3";
import type { GraphNode, GraphEdge } from "../api/types";

export function createSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number,
) {
  return d3
    .forceSimulation<GraphNode>(nodes)
    .force(
      "link",
      d3
        .forceLink<GraphNode, GraphEdge>(edges)
        .id((d) => d.id)
        .distance(120),
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(30));
}

export function nodeRadius(node: GraphNode): number {
  const total = node.totalWins + node.totalDraws + node.totalLosses;
  return Math.max(12, Math.min(30, 8 + total * 0.5));
}

export function edgeWidth(weight: number): number {
  return Math.max(1, Math.min(6, weight));
}

export function edgeOpacity(dominance: number): number {
  return Math.max(0.2, Math.min(0.9, dominance));
}
