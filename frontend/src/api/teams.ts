import { apiFetch } from "./client";
import type { Team, TeamStats, PaginatedResponse, MatchResult } from "./types";

export function fetchTeam(teamId: number): Promise<Team> {
  return apiFetch<Team>(`/teams/${teamId}`);
}

export function fetchTeamStats(teamId: number): Promise<TeamStats> {
  return apiFetch<TeamStats>(`/teams/${teamId}/stats`);
}

export function fetchTeamMatches(
  teamId: number,
  page = 1,
  perPage = 20,
): Promise<PaginatedResponse<MatchResult>> {
  return apiFetch<PaginatedResponse<MatchResult>>(`/teams/${teamId}/matches`, {
    page,
    per_page: perPage,
  });
}
