import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";
import MatchList from "../components/team/MatchList";
import { useHeadToHead } from "../hooks/useHeadToHead";

export default function HeadToHead() {
  const [searchParams, setSearchParams] = useSearchParams();

  const team1 = searchParams.get("team1")
    ? Number(searchParams.get("team1"))
    : null;
  const team2 = searchParams.get("team2")
    ? Number(searchParams.get("team2"))
    : null;

  const [inputTeam1, setInputTeam1] = useState(
    searchParams.get("team1") || "",
  );
  const [inputTeam2, setInputTeam2] = useState(
    searchParams.get("team2") || "",
  );

  const { data, loading, error } = useHeadToHead(team1, team2);

  const handleSearch = () => {
    if (inputTeam1 && inputTeam2) {
      setSearchParams({ team1: inputTeam1, team2: inputTeam2 });
    }
  };

  return (
    <PageContainer title="Head to Head">
      <div className="mb-6 flex items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">
            Team 1 ID
          </label>
          <input
            type="number"
            value={inputTeam1}
            onChange={(e) => setInputTeam1(e.target.value)}
            placeholder="e.g. 57"
            className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">
            Team 2 ID
          </label>
          <input
            type="number"
            value={inputTeam2}
            onChange={(e) => setInputTeam2(e.target.value)}
            placeholder="e.g. 65"
            className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
        >
          Compare
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} />}

      {data && (
        <div>
          {/* Team Headers */}
          <div className="mb-6 flex items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              {data.teamA.crestUrl && (
                <img
                  src={data.teamA.crestUrl}
                  alt={data.teamA.name}
                  className="h-16 w-16 object-contain"
                />
              )}
              <p className="text-xl font-bold text-white">{data.teamA.name}</p>
            </div>
            <span className="text-2xl font-bold text-slate-500">vs</span>
            <div className="flex items-center gap-3">
              <p className="text-xl font-bold text-white">{data.teamB.name}</p>
              {data.teamB.crestUrl && (
                <img
                  src={data.teamB.crestUrl}
                  alt={data.teamB.name}
                  className="h-16 w-16 object-contain"
                />
              )}
            </div>
          </div>

          {/* W/D/L Bar */}
          <div className="mx-auto mb-6 max-w-lg">
            <div className="mb-1 flex justify-between text-sm text-slate-400">
              <span>
                {data.teamA.tla}: {data.stats.teamAWins}W
              </span>
              <span>{data.stats.draws}D</span>
              <span>
                {data.teamB.tla}: {data.stats.teamBWins}W
              </span>
            </div>
            <div className="flex h-4 overflow-hidden rounded-full">
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

          {/* Stats Grid */}
          <div className="mx-auto mb-6 grid max-w-lg grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-slate-800 p-3">
              <p className="text-2xl font-bold text-white">
                {data.stats.matchesPlayed}
              </p>
              <p className="text-xs text-slate-400">Matches</p>
            </div>
            <div className="rounded-lg bg-slate-800 p-3">
              <p className="text-2xl font-bold text-white">
                {data.stats.teamAGoals}
              </p>
              <p className="text-xs text-slate-400">{data.teamA.tla} Goals</p>
            </div>
            <div className="rounded-lg bg-slate-800 p-3">
              <p className="text-2xl font-bold text-white">
                {data.stats.teamBGoals}
              </p>
              <p className="text-xs text-slate-400">{data.teamB.tla} Goals</p>
            </div>
          </div>

          {/* Match List */}
          <h3 className="mb-3 text-lg font-semibold text-slate-200">
            All Matches
          </h3>
          <MatchList matches={data.matches} />
        </div>
      )}

      {!team1 && !team2 && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center">
          <p className="text-slate-400">
            Enter two team IDs to see their head-to-head record. You can also
            click an edge in the Dominance Graph to see H2H details.
          </p>
        </div>
      )}
    </PageContainer>
  );
}
