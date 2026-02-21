import { useState, useEffect } from "react";
import type { HeadToHeadDetail } from "../api/types";
import { fetchHeadToHead } from "../api/graph";

export function useHeadToHead(
  team1: number | null,
  team2: number | null,
  competitions?: string,
  season?: number,
) {
  const [data, setData] = useState<HeadToHeadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!team1 || !team2) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchHeadToHead(team1, team2, { competitions, season })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [team1, team2, competitions, season]);

  return { data, loading, error };
}
