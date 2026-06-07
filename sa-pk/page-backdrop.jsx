/* eslint-disable */
/* sa-pk/page-backdrop.jsx — One continuous night sky behind the WHOLE page.
   Fixed, full-viewport, z-index -2 (below the aurora at -1). It carries the same
   stars + soft nebula the hero scenes use, so scrolling from the hero into the
   narrative never hits a "flat dark" wall — the sky is the through-line.

   Pure SVG, deterministic, no per-frame work (one slow CSS twinkle only). */

const BackdropStars = ({ count, seed, rMax = 1.7, opacityMin = 0.25 }) => {
  const stars = useMemo(() => {
    const out = [];
    let s = seed * 9301 + 49297;
    const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < count; i++) {
      out.push({
        x: +(r() * 100).toFixed(2),
        y: +(r() * 100).toFixed(2),
        rad: +(0.4 + r() * rMax).toFixed(2),
        op: +(opacityMin + r() * (1 - opacityMin)).toFixed(2),
        tw: +(2.5 + r() * 4).toFixed(2),
        delay: +(r() * 4).toFixed(2),
      });
    }
    return out;
  }, [count, seed, rMax, opacityMin]);
  return (
    <>
      {stars.map((st, i) => (
        <circle
          key={i}
          cx={`${st.x}%`} cy={`${st.y}%`} r={st.rad}
          fill="#F5F7FA" opacity={st.op}
          style={{ animation: `bd-twinkle ${st.tw}s var(--ease-smooth) ${st.delay}s infinite` }}
        />
      ))}
    </>
  );
};

const PageBackdrop = () => {
  const reduced = usePrefersReducedMotion();
  return (
    <React.Fragment>
      <div className="page-backdrop" aria-hidden="true">
        {/* Nebula blooms behind everything */}
        <div className="page-backdrop__nebula" />
        <div className="page-backdrop__vignette" />
      </div>
      {/* Stars + shooting stars, always rendered. The opaque hero scene covers
          them on screen 1; transparent sections reveal them from screen 2 on. */}
      <div className="starfield" aria-hidden="true">
        <svg className="page-backdrop__stars page-backdrop__stars--a" preserveAspectRatio="none">
          <BackdropStars count={reduced ? 90 : 170} seed={7} rMax={2.2} opacityMin={0.5} />
        </svg>
        <svg className="page-backdrop__stars page-backdrop__stars--b" preserveAspectRatio="none">
          <BackdropStars count={reduced ? 30 : 70} seed={13} rMax={1.3} opacityMin={0.32} />
        </svg>
        {!reduced && (
          <div className="page-backdrop__shooting">
            <span className="shoot shoot--1" />
            <span className="shoot shoot--2" />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

Object.assign(window, { PageBackdrop, BackdropStars });
