import { useState } from 'react';
import { motion } from 'motion/react';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import api from '../api/client';
import { SLIDER_FEATURES, SELECT_FEATURES, DEFAULT_VALUES } from '../utils/constants';
import PredictionDisplay from '../components/PredictionDisplay';
import RecommendationCard from '../components/RecommendationCard';
import CurveDivider from '../components/CurveDivider';
import { CircleShape } from '../components/AmbientShapes';

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

function NumberField({ feature, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-primary mb-1">
        {feature.label} {feature.unit && <span className="text-text-secondary">({feature.unit})</span>}
      </label>
      <input
        type="number"
        min={feature.min}
        max={feature.max}
        step={feature.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full bg-white border border-border rounded-lg px-2.5 py-1.5 text-sm text-text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    </div>
  );
}

function CategoryField({ feature, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-primary mb-1">{feature.label}</label>
      <select
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full appearance-none bg-white border border-border rounded-lg px-2.5 py-1.5 text-sm text-text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      >
        {feature.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function OptimizeSection() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const setValue = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/optimize', values);
      setResult(data);
    } catch (err) {
      setError('Could not reach the optimization service. Is the backend running on localhost:8000?');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const maxSavings = result?.recommendations?.length
    ? Math.max(...result.recommendations.map((r) => r.savings))
    : 0;

  return (
    <section id="optimize" className="scroll-mt-16 relative bg-[#E8EEF4] py-10 overflow-hidden">
      <CircleShape className="float-shape-2 top-16 right-16" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-6">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-[3px] bg-accent-green rounded-full mb-6"
          />
          <h2 className="text-3xl font-bold text-primary">Optimize Your Building</h2>
          <p className="mt-1 text-sm text-[#475569] max-w-2xl">
            Enter your current building design and receive AI-powered recommendations to reduce
            energy consumption.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {error && (
            <div className="mb-4 rounded-lg bg-accent-coral/10 border border-accent-coral/30 px-4 py-3 text-body text-accent-coral">
              {error}
            </div>
          )}

          <div className="bg-card rounded-xl shadow-md border border-blue-100/50 p-5 relative">
            <h3 className="text-sm font-semibold text-text-primary mb-0.5">Enter Your Current Design</h3>
            <p className="text-xs text-text-secondary mb-3">
              Provide all 8 design parameters to find changes that reduce your building's heating load.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
              {SLIDER_FEATURES.map((feature) => (
                <NumberField
                  key={feature.key}
                  feature={feature}
                  value={values[feature.key]}
                  onChange={(v) => setValue(feature.key, v)}
                />
              ))}
              {SELECT_FEATURES.map((feature) => (
                <CategoryField
                  key={feature.key}
                  feature={feature}
                  value={values[feature.key]}
                  onChange={(v) => setValue(feature.key, v)}
                />
              ))}
            </div>

            <div
              onClick={isLoading ? undefined : handleAnalyze}
              className={`mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-lg py-2.5 cursor-pointer select-none transition-all duration-200 hover:brightness-110 hover:-translate-y-px ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  <span className="animate-pulse">Analyzing your design...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Analyze</span>
                </>
              )}
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mt-4"
            >
              <div className="bg-card rounded-xl shadow-md border border-blue-100/50 p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Your Current Design</h3>
                <div className="flex gap-10">
                  <PredictionDisplay
                    label="Heating Load"
                    value={result.current_heating_load}
                    colorClassName="text-accent-coral"
                  />
                  <PredictionDisplay
                    label="Cooling Load"
                    value={result.current_cooling_load}
                    colorClassName="text-accent-blue"
                  />
                </div>
              </div>

              <h3 className="text-card-heading text-text-primary mt-8 mb-4">Optimization Opportunities</h3>

              {result.recommendations.length === 0 ? (
                <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-6 text-center">
                  <p className="text-body font-medium text-accent-green">
                    Your design is already well-optimized for energy efficiency.
                  </p>
                </div>
              ) : (
                <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-4">
                  {result.recommendations.map((rec) => (
                    <RecommendationCard key={rec.feature} recommendation={rec} maxSavings={maxSavings} />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      <CurveDivider toColor="#1E3A5F" />
    </section>
  );
}
