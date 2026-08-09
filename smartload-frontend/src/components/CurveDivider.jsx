// Seamless curved transition anchored to the bottom of a section. `toColor`
// should match the background color of whatever comes next so the seam is
// invisible. Must sit inside a `relative overflow-hidden` section.
export default function CurveDivider({ toColor, className = '' }) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 leading-none pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 100" className="block w-full h-[60px] md:h-[90px]" preserveAspectRatio="none">
        <path d="M0,40 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" fill={toColor} />
      </svg>
    </div>
  );
}
