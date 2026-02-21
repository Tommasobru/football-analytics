import { useState, useEffect } from "react";
import type { GraphData } from "../api/types";
import { fetchGraphData } from "../api/graph";
import { useFilterStore } from "../store/filters";

export function useGraphData() {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { competitions, season, dateFrom, dateTo } = useFilterStore();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchGraphData({
      competitions: competitions.length ? competitions.join(",") : undefined,
      season: season ?? undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [competitions, season, dateFrom, dateTo]);

  return { data, loading, error };
}
