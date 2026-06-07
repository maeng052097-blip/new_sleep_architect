/* eslint-disable */
/* sa-pk/device.jsx — The Sleep Architect bedside robot, inline SVG papercraft style.
   A soft rounded capsule body with a glowing horizontal sensor band ("the eye"),
   a fabric base, and faint sensor waves. Hue is the teal brand accent.
   `glowColor` lets callers tint the sensor band to the active sensor. */

const Device = ({ glowColor = 'var(--color-accent)', breathing = true, size = 360 }) => {
  return (
    <svg
      className={`device-svg ${breathing ? 'is-breathing' : ''}`}
      viewBox="0 0 360 460"
      width={size}
      height={size * (460 / 360)}
      role="img"
      aria-label="Sleep Architect Robot — 침실 협탁 위 로봇"
      style={{ '--device-glow': glowColor }}
    >
      <defs>
        <linearGradient id="dev-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#222A42" />
          <stop offset="55%" stopColor="#1A2138" />
          <stop offset="100%" stopColor="#10162A" />
        </linearGradient>
        <linearGradient id="dev-body-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="rgba(255,255,255,0.14)" />
          <stop offset="12%" stopColor="rgba(255,255,255,0)" />
          <stop offset="88%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.10)" />
        </linearGradient>
        <linearGradient id="dev-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#2A3350" />
          <stop offset="100%" stopColor="#171D31" />
        </linearGradient>
        <radialGradient id="dev-eye" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="var(--device-glow)" stopOpacity="1" />
          <stop offset="55%" stopColor="var(--device-glow)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--device-glow)" stopOpacity="0" />
        </radialGradient>
        <filter id="dev-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Ground glow */}
      <ellipse cx="180" cy="430" rx="150" ry="26" fill="var(--device-glow)" opacity="0.18" filter="url(#dev-soft)" />

      {/* Sensor waves emanating upward (subtle) */}
      <g className="device-waves" stroke="var(--device-glow)" fill="none" strokeLinecap="round" opacity="0.5">
        <path d="M 96 150 Q 180 120 264 150" strokeWidth="2" opacity="0.5" />
        <path d="M 78 132 Q 180 92 282 132"  strokeWidth="2" opacity="0.32" />
        <path d="M 60 116 Q 180 66 300 116"  strokeWidth="2" opacity="0.18" />
      </g>

      {/* Base / fabric pedestal */}
      <g className="paper">
        <path d="M 96 360 Q 180 348 264 360 L 286 420 Q 180 440 74 420 Z" fill="url(#dev-base)" />
        {/* fabric stitch lines */}
        <path d="M 104 388 Q 180 378 256 388" stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none" />
        <path d="M 96 406 Q 180 396 264 406" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
      </g>

      {/* Body capsule */}
      <g className="paper--deep">
        <rect x="96" y="150" width="168" height="226" rx="84" fill="url(#dev-body)" />
        <rect x="96" y="150" width="168" height="226" rx="84" fill="url(#dev-body-edge)" />
        {/* top hairline highlight */}
        <path d="M 120 162 Q 180 150 240 162" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
      </g>

      {/* Sensor band ("the eye") */}
      <g>
        <ellipse cx="180" cy="232" rx="120" ry="60" fill="url(#dev-eye)" className="device-eye-glow" />
        <rect x="116" y="210" width="128" height="44" rx="22" fill="#0A0E1A" />
        <rect x="116" y="210" width="128" height="44" rx="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* The pupil — animated dot scanning */}
        <circle className="device-pupil" cx="180" cy="232" r="11" fill="var(--device-glow)" />
        <circle cx="180" cy="232" r="11" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        {/* tiny mic dots */}
        <circle cx="138" cy="232" r="3" fill="rgba(255,255,255,0.35)" />
        <circle cx="222" cy="232" r="3" fill="rgba(255,255,255,0.35)" />
      </g>

      {/* Status LED ring at base of body */}
      <g>
        <rect x="150" y="344" width="60" height="6" rx="3" fill="var(--device-glow)" opacity="0.8" />
        <rect x="150" y="344" width="60" height="6" rx="3" fill="var(--device-glow)" opacity="0.4" filter="url(#dev-soft)" />
      </g>
    </svg>
  );
};

Object.assign(window, { Device });
