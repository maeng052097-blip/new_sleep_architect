/* eslint-disable */
/* sa-pk/intro.jsx — First-load intro motion. A full-screen night-sky splash where
   the SLEEP ARCHITECT wordmark fades up, an aurora sweep crosses it, then the
   whole overlay lifts to reveal the hero. Plays once per page load.
   prefers-reduced-motion: shows briefly then removes, no movement. */

const Intro = () => {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState('in'); // in → hold → out → gone

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => setPhase('gone'), 400);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setPhase('hold'), 900);
    const t2 = setTimeout(() => setPhase('out'), 2100);
    const t3 = setTimeout(() => setPhase('gone'), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [reduced]);

  // Lock scroll while the intro is on screen.
  useEffect(() => {
    if (phase === 'gone') { document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  }, [phase]);

  if (phase === 'gone') return null;

  const WORD = 'SLEEP ARCHITECT';
  return (
    <div className={`intro intro--${phase}`} aria-hidden="true">
      <div className="intro__sky" />
      <div className="intro__center">
        <p className="intro__word">
          {WORD.split('').map((ch, i) => (
            <span
              key={i}
              className="intro__char"
              style={{ animationDelay: `${i * 38}ms` }}
            >{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </p>
        <span className="intro__line" />
        <p className="intro__tag">잠드는 순간부터, 깨는 순간까지</p>
      </div>
      <span className="intro__sweep" />
    </div>
  );
};

Object.assign(window, { Intro });
