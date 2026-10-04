// A fountain pen, nib tip at (0,0), body extending along +x. Rotated so it rests like a writing hand.
export default function Pen() {
  return (
    <svg width="260" height="60" viewBox="-4 -30 264 60" overflow="visible" style={{ position: "absolute", left: -4, top: -30, transform: "rotate(-38deg)", transformOrigin: "4px 30px", filter: "drop-shadow(6px 14px 10px rgba(17,19,24,.22))" }}>
      <defs>
        <linearGradient id="nib" x1="0" y1="-12" x2="0" y2="12" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f2f3f6" /><stop offset=".55" stopColor="#c3c7cf" /><stop offset="1" stopColor="#7d838e" /></linearGradient>
        <linearGradient id="body" x1="0" y1="-14" x2="0" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#3a3e49" /><stop offset=".35" stopColor="#15171d" /><stop offset="1" stopColor="#0b0c10" /></linearGradient>
      </defs>
      <path d="M0 0 L42 -10 Q48 0 42 10 Z" fill="url(#nib)" />
      <path d="M2 0 L30 0" stroke="#4b505a" strokeWidth="1.1" />
      <circle cx="30" cy="0" r="2" fill="#4b505a" />
      <rect x="42" y="-10" width="40" height="20" rx="4" fill="url(#body)" />
      <rect x="80" y="-13" width="170" height="26" rx="12" fill="url(#body)" />
      <rect x="136" y="-13.2" width="7" height="26.4" fill="#cfd2d9" />
      <rect x="144" y="-13.2" width="5" height="26.4" fill="#2a3ad1" />
      <path d="M92 -7 H236" stroke="rgba(255,255,255,.28)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M170 -14 H226 Q232 -14 232 -8 V-4" stroke="#cfd2d9" strokeWidth="3" fill="none" />
    </svg>
  );
}

