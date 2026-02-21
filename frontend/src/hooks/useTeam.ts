import { useState, useEffect } from "react";
import type { TeamStats, MatchResult, PaginatedResponse } from "../api/types";
import { fetchTeamStats, fetchTeamMatches } from "../api/teams";

export function useTeam(teamId: number | null) {
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [matches, setMatches] = useState<PaginatedResponse<MatchResult> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!teamId) return;

    setLoading(true);
    setError(null);

    Promise.all([fetchTeamStats(teamId), fetchTeamMatches(teamId, 1)])
      .then(([s, m]) => {
        setStats(s);
        setMatches(m);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  const loadPage = (p: number) => {
    if (!teamId) return;
    setPage(p);
    fetchTeamMatches(teamId, p).then(setMatches);
  };

  return { stats, matches, loading, error, page, loadPage };
}
