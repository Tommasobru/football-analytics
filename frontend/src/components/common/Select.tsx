interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function Select({ label, value, onChange, options, placeholder }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
