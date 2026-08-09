import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export default function ExplanationList({ explanation }) {
  return (
    <div className="mt-3">
      <h3 className="text-sm font-semibold text-text-primary mb-2">In Plain Language</h3>
      <div className="space-y-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={explanation.join('|')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            {explanation.map((line) => {
              const isIncreasing = line.includes('increasing');
              const Icon = isIncreasing ? ArrowUpIcon : ArrowDownIcon;
              return (
                <div key={line} className="flex items-start gap-1.5">
                  <Icon
                    className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                      isIncreasing ? 'text-accent-coral' : 'text-accent-blue'
                    }`}
                  />
                  <span className="text-xs text-text-primary">{line}</span>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
