import type { GraphEdge, GraphNode, HeadToHeadDetail } from "../../api/types";
import { useHeadToHead } from "../../hooks/useHeadToHead";
import { useFilterStore } from "../../store/filters";
import { formatDate, formatScore } from "../../lib/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

interface EdgeDetailProps {
  edge: GraphEdge;
  onClose: () => void;
}

export default function EdgeDetail({ edge, onClose }: EdgeDetailProps) {
  const source = edge.source as GraphNode;
  const target = edge.target as GraphNode;

  const { competitions, season } = useFilterStore();
  const { data, loading } = useHeadToHead(
    source.id,
    target.id,
    competitions.length ? competitions.join(",") : undefined,
    season ?? undefined,
  );

  return (
    <div className="absolute right-0 top-0 z-40 flex h-full w-96 flex-col border-l border-slate-700 bg-slate-800 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <h3 className="text-sm font-bold text-white">Head to Head</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {data && (
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4 text-center">
            <p className="text-lg font-bold text-white">
              {data.teamA.shortName || data.teamA.name} vs{" "}
              {data.teamB.shortName || data.teamB.name}
            </p>
          </div>

          {/* W/D/L Bar */}
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-slate-400">
              <span>{data.stats.teamAWins}W</span>
              <span>{data.stats.draws}D</span>
              <span>{data.stats.teamBWins}W</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full">
              {data.stats.matchesPlayed > 0 && (
                <>
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${(data.stats.teamAWins / data.stats.matchesPlayed) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-slate-500"
                    style={{
                      width: `${(data.stats.draws / data.stats.matchesPlayed) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${(data.stats.teamBWins / data.stats.matchesPlayed) * 100}%`,
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md bg-slate-900 p-2">
              <p className="text-lg font-bold text-white">
                {data.stats.matchesPlayed}
              </p>
              <p className="text-xs text-slate-400">Played</p>
            </div>
            <div className="rounded-md bg-slate-900 p-2">
              <p className="text-lg font-bold text-white">
                {data.stats.teamAGoals}
              </p>
              <p className="text-xs text-slate-400">
                {data.teamA.tla} Goals
              </p>
            </div>
            <div className="rounded-md bg-slate-900 p-2">
              <p className="text-lg font-bold text-white">
                {data.stats.teamBGoals}
              </p>
              <p className="text-xs text-slate-400">
                {data.teamB.tla} Goals
              </p>
            </div>
          </div>

          {/* Match List */}
          <h4 className="mb-2 text-sm font-semibold text-slate-300">
            Recent Matches
          </h4>
          <div className="flex flex-col gap-2">
            {data.matches.map((match) => (
              <div
                key={match.id}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm"
              >
                <p className="text-xs text-slate-500">
                  {formatDate(match.utcDate)}
                </p>
                <p className="text-slate-200">
                  {match.homeTeam.shortName || match.homeTeam.name}{" "}
                  <span className="font-bold">
                    {formatScore(match.homeScore, match.awayScore)}
                  </span>{" "}
                  {match.awayTeam.shortName || match.awayTeam.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
