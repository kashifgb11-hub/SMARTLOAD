// Single source of truth for feature metadata used across the app.
// `key` matches the FastAPI request field name; `shapKey` matches the key
// used in the /predict response's shap_values object.

export const FEATURES = [
  {
    key: 'relative_compactness',
    shapKey: 'Relative_Compactness',
    label: 'Relative Compactness',
    type: 'slider',
    min: 0.62,
    max: 0.98,
    step: 0.01,
    default: 0.82,
    unit: '',
    format: (v) => v.toFixed(2),
  },
  {
    key: 'surface_area',
    shapKey: 'Surface_Area',
    label: 'Surface Area',
    type: 'slider',
    min: 514.5,
    max: 808.5,
    step: 0.5,
    default: 673.75,
    unit: 'm²',
    format: (v) => v.toFixed(1),
  },
  {
    key: 'wall_area',
    shapKey: 'Wall_Area',
    label: 'Wall Area',
    type: 'slider',
    min: 245,
    max: 416.5,
    step: 0.5,
    default: 318.5,
    unit: 'm²',
    format: (v) => v.toFixed(1),
  },
  {
    key: 'roof_area',
    shapKey: 'Roof_Area',
    label: 'Roof Area',
    type: 'slider',
    min: 110.25,
    max: 220.5,
    step: 0.25,
    default: 183.75,
    unit: 'm²',
    format: (v) => v.toFixed(2),
  },
  {
    key: 'overall_height',
    shapKey: 'Overall_Height',
    label: 'Overall Height',
    type: 'select',
    default: 7.0,
    unit: 'm',
    options: [
      { label: '3.5m (Single Storey)', value: 3.5 },
      { label: '7.0m (Double Storey)', value: 7.0 },
    ],
  },
  {
    key: 'orientation',
    shapKey: 'Orientation',
    label: 'Orientation',
    type: 'select',
    default: 2,
    unit: '',
    options: [
      { label: 'North', value: 2 },
      { label: 'East', value: 3 },
      { label: 'South', value: 4 },
      { label: 'West', value: 5 },
    ],
  },
  {
    key: 'glazing_area',
    shapKey: 'Glazing_Area',
    label: 'Glazing Area',
    type: 'slider',
    min: 0,
    max: 0.4,
    step: 0.01,
    default: 0.25,
    unit: '%',
    format: (v) => `${Math.round(v * 100)}%`,
    displayScale: 100,
  },
  {
    key: 'glazing_dist',
    shapKey: 'Glazing_Dist',
    label: 'Glazing Distribution',
    type: 'select',
    default: 3,
    unit: '',
    options: [
      { label: 'None', value: 0 },
      { label: 'Uniform', value: 1 },
      { label: 'North', value: 2 },
      { label: 'East', value: 3 },
      { label: 'South', value: 4 },
      { label: 'West', value: 5 },
    ],
  },
];

export const SLIDER_FEATURES = FEATURES.filter((f) => f.type === 'slider');
export const SELECT_FEATURES = FEATURES.filter((f) => f.type === 'select');

export const DEFAULT_VALUES = FEATURES.reduce((acc, f) => {
  acc[f.key] = f.default;
  return acc;
}, {});

export const featureByKey = FEATURES.reduce((acc, f) => {
  acc[f.key] = f;
  return acc;
}, {});

export const featureByShapKey = FEATURES.reduce((acc, f) => {
  acc[f.shapKey] = f;
  return acc;
}, {});

export const ENERGY_RATINGS = [
  { max: 15, color: '#10B981', label: 'Very Efficient' },
  { max: 25, color: '#14B8A6', label: 'Efficient' },
  { max: 35, color: '#F59E0B', label: 'Moderate' },
  { max: 45, color: '#F97316', label: 'Inefficient' },
  { max: Infinity, color: '#EF4444', label: 'Very Inefficient' },
];

export function getEnergyRating(avgLoad) {
  return ENERGY_RATINGS.find((r) => avgLoad < r.max) ?? ENERGY_RATINGS[ENERGY_RATINGS.length - 1];
}
