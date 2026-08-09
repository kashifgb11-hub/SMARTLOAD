export default function SelectInput({ feature, value, onChange, isUnknown, onToggleUnknown }) {
  const { label, options } = feature;

  return (
    <div className="py-1">
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-xs font-medium text-text-primary">{label}</label>
        <button
          type="button"
          onClick={() => onToggleUnknown(!isUnknown)}
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border transition-colors duration-300 ${
            isUnknown
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-text-secondary border-border hover:border-primary hover:text-primary'
          }`}
        >
          Unknown
        </button>
      </div>

      <div className="relative">
        <select
          value={value}
          disabled={isUnknown}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            filter: isUnknown ? 'blur(1px)' : 'none',
            opacity: isUnknown ? 0.5 : 1,
          }}
          className="w-full appearance-none bg-white border border-border rounded-lg px-3 py-1 text-xs text-text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
