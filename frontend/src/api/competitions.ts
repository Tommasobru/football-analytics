import { apiFetch } from "./client";
import type { Competition, Team } from "./types";

export function fetchCompetitions(): Promise<Competition[]> {
  return apiFetch<Competition[]>("/competitions");
}

export function fetchCompetitionTeams(competitionId: number): Promise<Team[]> {
  return apiFetch<Team[]>(`/competitions/${competitionId}/teams`);
}
