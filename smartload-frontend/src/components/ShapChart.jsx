import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { featureByShapKey } from '../utils/constants';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white border border-border rounded-lg shadow-md px-3 py-2 text-[13px]">
      <div className="font-semibold text-text-primary">{item.name}</div>
      <div className="text-text-secondary">
        {item.value > 0 ? '+' : ''}
        {item.value.toFixed(2)} kWh/m²
      </div>
    </div>
  );
}

export default function ShapChart({ shapValues }) {
  const data = Object.entries(shapValues)
    .map(([key, value]) => ({
      name: featureByShapKey[key]?.label ?? key,
      value,
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5);

  return (
    <div className="mt-3">
      <h3 className="text-sm font-semibold text-text-primary mb-2">What&apos;s Driving This Prediction?</h3>
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 20, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#64748B' }}
            label={{
              value: 'Impact on Heating Load (kWh/m²)',
              position: 'insideBottom',
              offset: -12,
              fontSize: 11,
              fill: '#64748B',
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 10, fill: '#1E293B' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
          <Bar dataKey="value" radius={[3, 3, 3, 3]} isAnimationActive animationDuration={500}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.value >= 0 ? '#EF4444' : '#3B82F6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
