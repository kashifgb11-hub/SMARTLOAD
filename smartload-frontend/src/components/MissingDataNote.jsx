import { motion, AnimatePresence } from 'motion/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function MissingDataNote({ missingCount }) {
  return (
    <AnimatePresence>
      {missingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent-amber/10 border border-accent-amber/30 px-3 py-2">
            <InformationCircleIcon className="w-4 h-4 text-accent-amber shrink-0" />
            <span className="text-[13px] text-text-secondary">
              {missingCount} of 8 parameters were unavailable. Median values were used for estimation.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
