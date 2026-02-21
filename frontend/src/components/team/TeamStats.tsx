import type { TeamStats as TeamStatsType } from "../../api/types";

interface TeamStatsProps {
  data: TeamStatsType;
}

export default function TeamStats({ data }: TeamStatsProps) {
  const { stats } = data;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Played", value: stats.played },
        { label: "Wins", value: stats.wins },
        { label: "Draws", value: stats.draws },
        { label: "Losses", value: stats.losses },
        { label: "Goals For", value: stats.goalsFor },
        { label: "Goals Against", value: stats.goalsAgainst },
        { label: "Goal Diff", value: stats.goalDifference },
        {
          label: "Win Rate",
          value: stats.played
            ? `${Math.round((stats.wins / stats.played) * 100)}%`
            : "0%",
        },
      ].map((item) => (
        <div key={item.label} className="rounded-lg bg-slate-800 p-3 text-center">
          <p className="text-xl font-bold text-white">{item.value}</p>
          <p className="text-xs text-slate-400">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
