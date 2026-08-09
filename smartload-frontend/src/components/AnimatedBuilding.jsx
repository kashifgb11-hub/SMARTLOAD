import { motion } from 'motion/react';

// Groups drawn in sequence: foundation -> walls -> roof -> windows -> energy arrows.
// Each path animates pathLength 0 -> 1; the arrows keep pulsing gently once drawn.
const DELAYS = { foundation: 0, walls: 0.5, roof: 1.0, windows: 1.5, arrows: 2.0 };
const DRAW_DURATION = 0.5;

const drawn = (group, index = 0) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: DRAW_DURATION, delay: DELAYS[group] + index * 0.06, ease: 'easeInOut' },
});

const pulsingArrow = (index) => ({
  initial: { pathLength: 0, opacity: 0.6 },
  animate: { pathLength: 1, opacity: [0.6, 0.8, 0.4, 0.8] },
  transition: {
    pathLength: { duration: DRAW_DURATION, delay: DELAYS.arrows + index * 0.1, ease: 'easeInOut' },
    opacity: {
      delay: DELAYS.arrows + index * 0.1 + DRAW_DURATION,
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
});

export default function AnimatedBuilding() {
  const stroke = '#FFFFFF';

  return (
    <div className="relative w-full flex items-center justify-center pointer-events-none" aria-hidden="true">
      <svg
        className="h-auto w-[230px] lg:w-[270px] xl:w-[320px]"
        viewBox="0 0 400 420"
        fill="none"
      >
        {/* foundation */}
        <motion.path d="M50 380L350 380" stroke={stroke} strokeWidth="1.75" {...drawn('foundation', 0)} />
        <motion.path d="M75 380L65 393" stroke={stroke} strokeWidth="1.5" {...drawn('foundation', 1)} />
        <motion.path d="M300 380L310 393" stroke={stroke} strokeWidth="1.5" {...drawn('foundation', 2)} />

        {/* walls */}
        <motion.rect x="90" y="180" width="220" height="200" stroke={stroke} strokeWidth="1.75" {...drawn('walls', 0)} />
        <motion.path d="M200 180L200 380" stroke={stroke} strokeWidth="1.5" {...drawn('walls', 1)} />

        {/* roof */}
        <motion.path d="M85 183L200 105" stroke={stroke} strokeWidth="1.75" {...drawn('roof', 0)} />
        <motion.path d="M200 105L315 183" stroke={stroke} strokeWidth="1.75" {...drawn('roof', 1)} />
        <motion.path
          d="M78 186L322 186"
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray="4 4"
          {...drawn('roof', 2)}
        />

        {/* windows + door */}
        <motion.rect x="115" y="205" width="38" height="38" stroke={stroke} strokeWidth="1.5" {...drawn('windows', 0)} />
        <motion.path d="M134 205L134 243" stroke={stroke} strokeWidth="1" {...drawn('windows', 1)} />
        <motion.rect x="247" y="205" width="38" height="38" stroke={stroke} strokeWidth="1.5" {...drawn('windows', 2)} />
        <motion.path d="M266 205L266 243" stroke={stroke} strokeWidth="1" {...drawn('windows', 3)} />
        <motion.rect x="182" y="300" width="36" height="80" stroke={stroke} strokeWidth="1.5" {...drawn('windows', 4)} />
        <motion.circle cx="210" cy="340" r="2.5" stroke={stroke} strokeWidth="1.5" {...drawn('windows', 5)} />

        {/* energy flow arrows, rising from the roof, then pulsing forever */}
        <motion.path
          d="M170 100C165 70 175 50 170 20"
          stroke={stroke}
          strokeWidth="1.5"
          markerEnd="url(#hero-flow-arrow)"
          {...pulsingArrow(0)}
        />
        <motion.path
          d="M200 95C195 65 205 45 200 15"
          stroke={stroke}
          strokeWidth="1.5"
          markerEnd="url(#hero-flow-arrow)"
          {...pulsingArrow(1)}
        />
        <motion.path
          d="M230 100C235 70 225 50 230 20"
          stroke={stroke}
          strokeWidth="1.5"
          markerEnd="url(#hero-flow-arrow)"
          {...pulsingArrow(2)}
        />

        <defs>
          <marker id="hero-flow-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0 0L8 4L0 8Z" fill={stroke} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
