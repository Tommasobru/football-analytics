import { create } from "zustand";
import type { FilterState } from "../api/types";

interface FilterStore extends FilterState {
  setCompetitions: (codes: string[]) => void;
  setSeason: (season: number | null) => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  reset: () => void;
}

const initialState: FilterState = {
  competitions: [],
  season: null,
  dateFrom: "",
  dateTo: "",
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setCompetitions: (codes) => set({ competitions: codes }),
  setSeason: (season) => set({ season }),
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  reset: () => set(initialState),
}));
