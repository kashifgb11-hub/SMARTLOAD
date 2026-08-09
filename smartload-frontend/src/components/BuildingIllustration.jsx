export default function BuildingIllustration() {
  return (
    <div className="flex justify-center opacity-60" style={{ height: 70 }}>
      <svg width="128" height="70" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ground line */}
        <line x1="6" y1="112" x2="214" y2="112" stroke="#94A3B8" strokeWidth="1" />

        {/* main building block */}
        <rect x="40" y="42" width="90" height="70" stroke="#94A3B8" strokeWidth="1" />
        {/* roof */}
        <path d="M32 42L85 12L138 42" stroke="#94A3B8" strokeWidth="1" strokeLinejoin="round" />

        {/* windows grid */}
        <rect x="52" y="56" width="14" height="14" stroke="#94A3B8" strokeWidth="0.75" />
        <rect x="78" y="56" width="14" height="14" stroke="#94A3B8" strokeWidth="0.75" />
        <rect x="104" y="56" width="14" height="14" stroke="#94A3B8" strokeWidth="0.75" />
        <rect x="52" y="82" width="14" height="14" stroke="#94A3B8" strokeWidth="0.75" />
        <rect x="104" y="82" width="14" height="14" stroke="#94A3B8" strokeWidth="0.75" />

        {/* door */}
        <rect x="78" y="88" width="14" height="24" stroke="#94A3B8" strokeWidth="0.75" />

        {/* side annex */}
        <rect x="138" y="70" width="42" height="42" stroke="#94A3B8" strokeWidth="1" />
        <path d="M132 70L159 52L186 70" stroke="#94A3B8" strokeWidth="1" strokeLinejoin="round" />
        <rect x="148" y="84" width="12" height="12" stroke="#94A3B8" strokeWidth="0.75" />
        <rect x="166" y="84" width="12" height="12" stroke="#94A3B8" strokeWidth="0.75" />

        {/* dimension marks, blueprint feel */}
        <line x1="40" y1="20" x2="130" y2="20" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="40" y1="16" x2="40" y2="24" stroke="#94A3B8" strokeWidth="0.5" />
        <line x1="130" y1="16" x2="130" y2="24" stroke="#94A3B8" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
