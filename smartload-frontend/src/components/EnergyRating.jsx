import { getEnergyRating } from '../utils/constants';

export default function EnergyRating({ heatingLoad, coolingLoad }) {
  const avg = (heatingLoad + coolingLoad) / 2;
  const rating = getEnergyRating(avg);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-secondary">Energy Efficiency Rating</span>
        <span
          className="text-xs font-semibold transition-colors duration-500"
          style={{ color: rating.color }}
        >
          {rating.label}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min((avg / 55) * 100, 100)}%`,
            backgroundColor: rating.color,
          }}
        />
      </div>
    </div>
  );
}
