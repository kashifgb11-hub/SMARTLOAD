import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import api from '../api/client';
import { SLIDER_FEATURES, SELECT_FEATURES, DEFAULT_VALUES } from '../utils/constants';
import SliderInput from '../components/SliderInput';
import SelectInput from '../components/SelectInput';
import PredictionDisplay from '../components/PredictionDisplay';
import EnergyRating from '../components/EnergyRating';
import ShapChart from '../components/ShapChart';
import ExplanationList from '../components/ExplanationList';
import BuildingIllustration from '../components/BuildingIllustration';
import MissingDataNote from '../components/MissingDataNote';
import FloorPlanDecoration from '../components/FloorPlanDecoration';
import { HexagonShape, LineShape } from '../components/AmbientShapes';

function SkeletonBlock({ className }) {
  return <div className={`bg-border/70 rounded-md animate-pulse ${className}`} />;
}

const columnContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function EnergyPredictor() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [unknowns, setUnknowns] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const payload = {};
      for (const feature of [...SLIDER_FEATURES, ...SELECT_FEATURES]) {
        payload[feature.key] = unknowns[feature.key] ? null : values[feature.key];
      }

      try {
        const { data } = await api.post('/predict', payload);
        setPrediction(data);
        setError(null);
      } catch (err) {
        setError('Could not reach the prediction service. Is the backend running on localhost:8000?');
      } finally {
        setHasLoadedOnce(true);
      }
    }, 150);

    return () => clearTimeout(debounceRef.current);
  }, [values, unknowns]);

  const setValue = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));
  const setUnknown = (key, isUnknown) => setUnknowns((prev) => ({ ...prev, [key]: isUnknown }));

  const shapValues = prediction?.shap_values ?? {};

  return (
    <section id="energy-predictor" className="scroll-mt-16 relative bg-[#EFF4F8] py-10 overflow-hidden">
      <FloorPlanDecoration />
      <HexagonShape className="float-shape-1 top-28 left-10" />
      <LineShape className="float-shape-3 bottom-40 left-1/4" />

      {/* gradual blend into the Optimize section's slightly deeper background */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-b from-transparent to-[#E8EEF4] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-4">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-[3px] bg-accent-green rounded-full mb-3"
          />
          <h2 className="text-3xl font-bold text-primary">Energy Predictor</h2>
          <p className="mt-1 text-sm text-[#475569] max-w-2xl">
            Adjust building parameters in real-time and instantly see predicted energy demand
            with AI-powered explanations.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-accent-coral/10 border border-accent-coral/30 px-4 py-3 text-body text-accent-coral">
            {error}
          </div>
        )}

        <motion.div
          variants={columnContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Left column — inputs */}
          <motion.div variants={columnVariants} className="lg:w-5/12">
            <div className="bg-card rounded-xl shadow-md border border-blue-100/50 p-3 transition-shadow duration-300 hover:shadow-lg">
              <h3 className="text-sm font-semibold text-text-primary mb-1">Building Parameters</h3>

              <div className="divide-y divide-border">
                {SLIDER_FEATURES.map((feature) => (
                  <SliderInput
                    key={feature.key}
                    feature={feature}
                    value={values[feature.key]}
                    onChange={(v) => setValue(feature.key, v)}
                    isUnknown={!!unknowns[feature.key]}
                    onToggleUnknown={(v) => setUnknown(feature.key, v)}
                    shapValue={shapValues[feature.shapKey]}
                  />
                ))}
                {SELECT_FEATURES.map((feature) => (
                  <SelectInput
                    key={feature.key}
                    feature={feature}
                    value={values[feature.key]}
                    onChange={(v) => setValue(feature.key, v)}
                    isUnknown={!!unknowns[feature.key]}
                    onToggleUnknown={(v) => setUnknown(feature.key, v)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column — results */}
          <motion.div variants={columnVariants} className="lg:w-7/12">
            <div className="bg-card rounded-xl shadow-md border border-blue-100/50 p-3 transition-shadow duration-300 hover:shadow-lg">
              <BuildingIllustration />

              {!hasLoadedOnce ? (
                <div className="mt-2 space-y-4">
                  <div className="flex gap-10">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-4 w-24" />
                      <SkeletonBlock className="h-9 w-32" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonBlock className="h-4 w-24" />
                      <SkeletonBlock className="h-9 w-32" />
                    </div>
                  </div>
                  <SkeletonBlock className="h-2.5 w-full" />
                  <SkeletonBlock className="h-40 w-full" />
                </div>
              ) : prediction ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="flex flex-wrap gap-6 mt-2">
                    <PredictionDisplay label="Heating Load" value={prediction.heating_load} colorClassName="text-accent-coral" />
                    <PredictionDisplay label="Cooling Load" value={prediction.cooling_load} colorClassName="text-accent-blue" />
                  </div>

                  <EnergyRating heatingLoad={prediction.heating_load} coolingLoad={prediction.cooling_load} />

                  <MissingDataNote missingCount={prediction.missing_count} />

                  <ShapChart shapValues={prediction.shap_values} />

                  <ExplanationList explanation={prediction.explanation} />
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
