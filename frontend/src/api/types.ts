export interface Competition {
  id: number;
  name: string;
  code: string;
  areaName: string;
  type: string;
  emblemUrl: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crestUrl: string;
  areaName: string;
}

export interface MatchResult {
  id: number;
  competitionId: number;
  seasonYear: number;
  utcDate: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW";
}

export interface GraphNode {
  id: number;
  name: string;
  tla: string;
  crestUrl: string;
  totalWins: number;
  totalDraws: number;
  totalLosses: number;
  totalGoals: number;
  // D3 simulation properties
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  source: number | GraphNode;
  target: number | GraphNode;
  weight: number;
  dominance: number;
  sourceWins: number;
  targetWins: number;
  draws: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface HeadToHeadStats {
  matchesPlayed: number;
  teamAWins: number;
  teamBWins: number;
  draws: number;
  teamAGoals: number;
  teamBGoals: number;
}

export interface HeadToHeadDetail {
  teamA: Team;
  teamB: Team;
  stats: HeadToHeadStats;
  matches: MatchResult[];
}

export interface TeamStats {
  team: Team;
  stats: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
  };
}

export interface PaginatedResponse<T> {
  matches: T[];
  total: number;
  page: number;
  pages: number;
}

export interface FilterState {
  competitions: string[];
  season: number | null;
  dateFrom: string;
  dateTo: string;
}
