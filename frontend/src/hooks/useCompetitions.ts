import { useState, useEffect } from "react";
import type { Competition } from "../api/types";
import { fetchCompetitions } from "../api/competitions";

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompetitions()
      .then(setCompetitions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { competitions, loading, error };
}
