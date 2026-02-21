import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import ForceGraph from "../components/graph/ForceGraph";
import GraphControls from "../components/graph/GraphControls";
import GraphFilters from "../components/graph/GraphFilters";
import EdgeDetail from "../components/graph/EdgeDetail";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";
import { useGraphData } from "../hooks/useGraphData";
import type { GraphNode, GraphEdge } from "../api/types";

export default function GraphView() {
  const navigate = useNavigate();
  const { data, loading, error } = useGraphData();
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      navigate(`/team/${node.id}`);
    },
    [navigate],
  );

  const handleEdgeClick = useCallback((edge: GraphEdge) => {
    setSelectedEdge(edge);
  }, []);

  return (
    <PageContainer title="Dominance Graph">
      <div className="mb-4">
        <GraphFilters />
      </div>

      {loading && <LoadingSpinner message="Building graph..." />}
      {error && <ErrorBanner message={error} />}

      {data && (
        <div className="relative" style={{ height: "calc(100vh - 240px)" }}>
          <div className="absolute left-3 top-3 z-10">
            <GraphControls svgRef={svgRef} />
          </div>
          <ForceGraph
            data={data}
            svgRef={svgRef}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
          />
          {selectedEdge && (
            <EdgeDetail
              edge={selectedEdge}
              onClose={() => setSelectedEdge(null)}
            />
          )}
        </div>
      )}

      {data && !data.nodes.length && !loading && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center">
          <p className="text-slate-400">
            No graph data for the selected filters. Try different filters or
            import more data.
          </p>
        </div>
      )}
    </PageContainer>
  );
}
