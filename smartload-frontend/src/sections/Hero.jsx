import { motion } from 'motion/react';
import { scrollToSection } from '../utils/scroll';
import AnimatedBuilding from '../components/AnimatedBuilding';
import CurveDivider from '../components/CurveDivider';

const HEADING = 'Smarter Buildings Start with Smarter Predictions';

export default function Hero() {
  return (
    <section
      id="home"
      className="scroll-mt-16 relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1E3A5F] to-[#0F2744]"
    >
      <div className="relative z-10 min-h-screen flex items-center justify-between max-w-7xl mx-auto px-8 lg:px-12 pt-20">
        {/* Left column — text */}
        <div className="relative w-full lg:w-7/12 text-left py-16">
          {/* subtle glow behind the heading */}
          <div
            className="absolute -left-16 -top-10 pointer-events-none"
            style={{
              width: 600,
              height: 400,
              background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <h1 className="relative text-4xl font-bold text-white leading-tight">
            {HEADING.split(' ').map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative mt-4 text-lg text-blue-200/80 max-w-lg"
          >
            Predict heating and cooling energy demand using machine learning at the earliest
            design stage.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="relative mt-8 flex items-center gap-4"
          >
            <button
              type="button"
              onClick={() => scrollToSection('energy-predictor')}
              className="bg-white text-primary font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            >
              Start Predicting
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('optimize')}
              className="bg-transparent border border-white text-white font-semibold rounded-lg px-6 py-3 transition-colors duration-200 hover:bg-white/10"
            >
              Optimize Design
            </button>
          </motion.div>
        </div>

        {/* Right column — animated building illustration */}
        <div className="hidden lg:flex w-5/12 items-center justify-center">
          <AnimatedBuilding />
        </div>
      </div>

      <CurveDivider toColor="#EFF4F8" />
    </section>
  );
}
