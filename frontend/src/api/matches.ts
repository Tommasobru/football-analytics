import { apiFetch } from "./client";
import type { PaginatedResponse, MatchResult } from "./types";

export function fetchMatches(params?: {
  competition?: string;
  season?: number;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<MatchResult>> {
  return apiFetch<PaginatedResponse<MatchResult>>("/matches", params);
}
