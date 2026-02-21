import { useParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import TeamStatsComponent from "../components/team/TeamStats";
import MatchList from "../components/team/MatchList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";
import { useTeam } from "../hooks/useTeam";

export default function TeamProfile() {
  const { teamId } = useParams<{ teamId: string }>();
  const id = teamId ? Number(teamId) : null;
  const { stats, matches, loading, error, page, loadPage } = useTeam(id);

  if (!id) return null;

  return (
    <PageContainer title={stats?.team.name || "Team Profile"}>
      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} />}

      {stats && (
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            {stats.team.crestUrl && (
              <img
                src={stats.team.crestUrl}
                alt={stats.team.name}
                className="h-20 w-20 object-contain"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {stats.team.name}
              </h2>
              <p className="text-sm text-slate-400">
                {stats.team.tla} · {stats.team.areaName}
              </p>
            </div>
          </div>

          <TeamStatsComponent data={stats} />
        </div>
      )}

      {matches && matches.matches.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-200">
            Recent Matches
          </h3>
          <MatchList matches={matches.matches} highlightTeamId={id} />

          {/* Pagination */}
          {matches.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => loadPage(page - 1)}
                disabled={page <= 1}
                className="rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-400">
                Page {page} of {matches.pages}
              </span>
              <button
                onClick={() => loadPage(page + 1)}
                disabled={page >= matches.pages}
                className="rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
