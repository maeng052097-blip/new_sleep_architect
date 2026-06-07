/* eslint-disable */
/* sa-pk/navbar.jsx — Oval orbital navigation
   5 glass orbs orbit around an ellipse; the active stage sits at the apex (top).
   Hover lifts a non-active orb; click jumps to that stage. */

const Navbar = ({ step, onSelect, onHoverStart, onHoverEnd }) => {
  const [hoverIdx, setHoverIdx] = useState(null);

  return (
    <nav className="navbar" aria-label="Sleep stage navigation">
      {/* Diffuse white glow base */}
      <div className="navbar__glow" />
      {/* White semicircle plate */}
      <div className="navbar__plate" />
      {/* Visible orbit guide */}
      <div className="navbar__orbit" />

      {/* Orbs — each stage owns a fixed slot; position is derived from current step */}
      {STAGES.map((stage, slotIdx) => {
        const pos = positionForOrbit(slotIdx, step);
        const isActive = slotIdx === step - 1;
        const isHover  = hoverIdx === slotIdx && !isActive;
        return (
          <button
            type="button"
            key={stage.id}
            data-stage={stage.id}
            className={`nav-item ${isActive ? 'is-active' : ''}`}
            aria-label={`${stage.num} ${stage.short} — ${stage.title}`}
            aria-current={isActive ? 'step' : undefined}
            onClick={() => onSelect(slotIdx + 1)}
            onMouseEnter={() => { setHoverIdx(slotIdx); onHoverStart?.(); }}
            onMouseLeave={() => { setHoverIdx(null); onHoverEnd?.(); }}
            onFocus={() => onHoverStart?.()}
            onBlur={() => onHoverEnd?.()}
            style={{
              left:  `calc(50% + ${pos.x}px)`,
              top:   `${pos.y}px`,
              // Hover lift handled via CSS on :hover, but we also slightly amplify here
            }}
          >
            <span className="nav-item__num">{stage.num}</span>
            <span className="nav-item__label">{stage.short}</span>
            <span className="nav-item__dot" aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
};

Object.assign(window, { Navbar });
