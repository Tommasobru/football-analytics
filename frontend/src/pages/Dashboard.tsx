import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import { useCompetitions } from "../hooks/useCompetitions";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { competitions, loading, error } = useCompetitions();

  return (
    <PageContainer title="Dashboard">
      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} />}

      <div className="mb-6">
        <button
          onClick={() => navigate("/graph")}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-500"
        >
          Open Dominance Graph
        </button>
      </div>

      {competitions.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-200">
            Available Competitions
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center gap-3 rounded-lg bg-slate-800 p-4"
              >
                {comp.emblemUrl && (
                  <img
                    src={comp.emblemUrl}
                    alt={comp.name}
                    className="h-10 w-10 object-contain"
                  />
                )}
                <div>
                  <p className="font-medium text-white">{comp.name}</p>
                  <p className="text-xs text-slate-400">
                    {comp.code} · {comp.areaName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && competitions.length === 0 && !error && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center">
          <p className="text-slate-400">
            No data yet. Run the ingestion script to import competition data.
          </p>
          <code className="mt-2 block text-sm text-slate-500">
            cd backend && python -m scripts.ingest --competitions PL
          </code>
        </div>
      )}
    </PageContainer>
  );
}
