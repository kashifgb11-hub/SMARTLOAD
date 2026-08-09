import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

function trackColorForShap(shapValue) {
  if (shapValue === null || shapValue === undefined) return '#94A3B8'; // grey — no prediction yet
  if (shapValue > 0) return '#EF4444'; // coral — increasing load
  if (shapValue < 0) return '#3B82F6'; // blue — decreasing load
  return '#94A3B8';
}

export default function SliderInput({ feature, value, onChange, isUnknown, onToggleUnknown, shapValue }) {
  const { label, min, max, step, format } = feature;
  const percent = ((value - min) / (max - min)) * 100;
  const trackColor = trackColorForShap(shapValue);

  return (
    <div className="py-1">
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-xs font-medium text-text-primary">{label}</label>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold tabular-nums transition-opacity duration-300 ${
              isUnknown ? 'opacity-40' : 'text-text-primary'
            }`}
          >
            {format(value)}
          </span>
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
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={isUnknown}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            '--track-color': trackColor,
            '--track-fill': `${percent}%`,
            filter: isUnknown ? 'blur(1px)' : 'none',
            opacity: isUnknown ? 0.5 : 1,
            transition: 'filter 0.3s ease, opacity 0.3s ease',
          }}
          className="w-full"
        />
        {isUnknown && (
          <QuestionMarkCircleIcon
            className="absolute right-0 -top-1 w-5 h-5 text-primary"
            style={{ animation: 'fadeIn 0.3s ease' }}
          />
        )}
      </div>
    </div>
  );
}
