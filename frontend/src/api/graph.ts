import { apiFetch } from "./client";
import type { GraphData, HeadToHeadDetail } from "./types";

export function fetchGraphData(params?: {
  competitions?: string;
  season?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<GraphData> {
  return apiFetch<GraphData>("/graph/dominance", params);
}

export function fetchHeadToHead(
  team1: number,
  team2: number,
  params?: { competitions?: string; season?: number },
): Promise<HeadToHeadDetail> {
  return apiFetch<HeadToHeadDetail>("/graph/head-to-head", {
    team1,
    team2,
    ...params,
  });
}
