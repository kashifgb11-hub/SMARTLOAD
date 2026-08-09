import { motion } from 'motion/react';

// Faint floor-plan sketch anchored to the bottom-right of the Energy
// Predictor section. Purely aesthetic — fills empty page space.
export default function FloorPlanDecoration() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.04 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="hidden md:block absolute bottom-0 right-0 pointer-events-none"
      width="420"
      height="360"
      viewBox="0 0 420 360"
      fill="none"
      aria-hidden="true"
    >
      <rect x="60" y="40" width="320" height="280" stroke="#1E3A5F" strokeWidth="2" />
      <line x1="60" y1="180" x2="380" y2="180" stroke="#1E3A5F" strokeWidth="1.5" />
      <line x1="220" y1="40" x2="220" y2="180" stroke="#1E3A5F" strokeWidth="1.5" />
      <line x1="300" y1="180" x2="300" y2="320" stroke="#1E3A5F" strokeWidth="1.5" />
      <path d="M220 180a70 70 0 0 1 70 70" stroke="#1E3A5F" strokeWidth="1" />
      <rect x="90" y="220" width="40" height="40" stroke="#1E3A5F" strokeWidth="1" />
      <rect x="320" y="70" width="40" height="40" stroke="#1E3A5F" strokeWidth="1" />
      <line x1="60" y1="20" x2="380" y2="20" stroke="#1E3A5F" strokeWidth="0.75" strokeDasharray="4 4" />
      <line x1="60" y1="10" x2="60" y2="30" stroke="#1E3A5F" strokeWidth="0.75" />
      <line x1="380" y1="10" x2="380" y2="30" stroke="#1E3A5F" strokeWidth="0.75" />
    </motion.svg>
  );
}
