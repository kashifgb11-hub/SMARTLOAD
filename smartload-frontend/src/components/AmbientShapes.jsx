// Barely-visible geometric shapes that drift slowly via CSS @keyframes
// (not Motion, to avoid scroll-linked animation overhead). Purely ambient —
// only a couple of these should exist on the page at once.

export function HexagonShape({ className = '' }) {
  return (
    <svg
      className={`absolute pointer-events-none opacity-[0.04] ${className}`}
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      aria-hidden="true"
    >
      <polygon points="35,4 62,19 62,51 35,66 8,51 8,19" stroke="#1E3A5F" strokeWidth="1.5" />
    </svg>
  );
}

export function CircleShape({ className = '' }) {
  return (
    <svg
      className={`absolute pointer-events-none opacity-[0.035] ${className}`}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="25" cy="25" r="23" stroke="#1E3A5F" strokeWidth="1.5" />
    </svg>
  );
}

export function LineShape({ className = '' }) {
  return (
    <svg
      className={`absolute pointer-events-none opacity-[0.04] ${className}`}
      width="90"
      height="4"
      viewBox="0 0 90 4"
      fill="none"
      aria-hidden="true"
    >
      <line x1="0" y1="2" x2="90" y2="2" stroke="#1E3A5F" strokeWidth="1.5" />
    </svg>
  );
}
