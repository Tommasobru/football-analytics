interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

export default function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DateRangePickerProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-400">From</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-400">To</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
