import type { Team } from "../../api/types";
import { Link } from "react-router-dom";

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      to={`/team/${team.id}`}
      className="flex items-center gap-3 rounded-lg bg-slate-800 p-4 transition-colors hover:bg-slate-700"
    >
      {team.crestUrl && (
        <img
          src={team.crestUrl}
          alt={team.name}
          className="h-10 w-10 object-contain"
        />
      )}
      <div>
        <p className="font-medium text-white">{team.name}</p>
        <p className="text-xs text-slate-400">{team.areaName}</p>
      </div>
    </Link>
  );
}
