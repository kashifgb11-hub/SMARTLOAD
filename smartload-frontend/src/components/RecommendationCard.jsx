import { motion } from 'motion/react';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function RecommendationCard({ recommendation, maxSavings }) {
  const { feature, savings, direction } = recommendation;
  const widthPercent = maxSavings > 0 ? (savings / maxSavings) * 100 : 0;

  return (
    <motion.div
      variants={cardVariants}
      className="bg-card rounded-xl shadow-md p-5 border border-blue-100/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-card-heading text-text-primary">{feature}</h4>
          <p className="text-body text-text-secondary mt-1">{direction}</p>
          <p className="text-body text-accent-green font-semibold mt-2">
            Estimated heating load reduction: {savings.toFixed(2)} kWh/m²
          </p>
        </div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent-green"
          initial={{ width: 0 }}
          animate={{ width: `${widthPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
}
