export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatScore(home: number, away: number): string {
  return `${home} - ${away}`;
}

export function winRate(wins: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((wins / total) * 100)}%`;
}
