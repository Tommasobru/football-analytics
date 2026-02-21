import type { MatchResult } from "../../api/types";
import { formatDate, formatScore } from "../../lib/formatters";

interface MatchListProps {
  matches: MatchResult[];
  highlightTeamId?: number;
}

export default function MatchList({ matches, highlightTeamId }: MatchListProps) {
  return (
    <div className="flex flex-col gap-2">
      {matches.map((match) => {
        let resultClass = "text-slate-400";
        if (highlightTeamId) {
          const isHome = match.homeTeam.id === highlightTeamId;
          const won =
            (isHome && match.winner === "HOME_TEAM") ||
            (!isHome && match.winner === "AWAY_TEAM");
          const lost =
            (isHome && match.winner === "AWAY_TEAM") ||
            (!isHome && match.winner === "HOME_TEAM");
          if (won) resultClass = "border-l-green-500";
          else if (lost) resultClass = "border-l-red-500";
          else resultClass = "border-l-slate-500";
        }

        return (
          <div
            key={match.id}
            className={`rounded-md border-l-4 bg-slate-800 px-4 py-2 ${resultClass}`}
          >
            <p className="text-xs text-slate-500">{formatDate(match.utcDate)}</p>
            <p className="text-sm text-slate-200">
              {match.homeTeam.shortName || match.homeTeam.name}{" "}
              <span className="font-bold text-white">
                {formatScore(match.homeScore, match.awayScore)}
              </span>{" "}
              {match.awayTeam.shortName || match.awayTeam.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
