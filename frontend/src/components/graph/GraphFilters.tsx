import { useFilterStore } from "../../store/filters";
import { useCompetitions } from "../../hooks/useCompetitions";
import DateRangePicker from "../common/DateRangePicker";

export default function GraphFilters() {
  const { competitions: selectedCodes, season, dateFrom, dateTo, setCompetitions, setSeason, setDateFrom, setDateTo, reset } = useFilterStore();
  const { competitions } = useCompetitions();

  const toggleCompetition = (code: string) => {
    if (selectedCodes.includes(code)) {
      setCompetitions(selectedCodes.filter((c) => c !== code));
    } else {
      setCompetitions([...selectedCodes, code]);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-400">Competitions</label>
        <div className="flex flex-wrap gap-1">
          {competitions.map((comp) => (
            <button
              key={comp.code}
              onClick={() => toggleCompetition(comp.code)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCodes.includes(comp.code)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {comp.code}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-400">Season</label>
        <select
          value={season ?? ""}
          onChange={(e) => setSeason(e.target.value ? Number(e.target.value) : null)}
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All seasons</option>
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
            (y) => (
              <option key={y} value={y}>
                {y}/{y + 1}
              </option>
            ),
          )}
        </select>
      </div>

      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      <button
        onClick={reset}
        className="rounded-md bg-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-600"
      >
        Clear filters
      </button>
    </div>
  );
}
