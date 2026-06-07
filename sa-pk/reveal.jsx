/* eslint-disable */
/* sa-pk/reveal.jsx — Scroll-reveal helpers for the long-scroll narrative.
   - useReveal: fires once when an element enters view (drives fade-up).
   - useScrollProgress: 0→1 as a tall section scrolls through the viewport,
     used by the sticky product-reveal section to stage callouts one by one.
   - Reveal: wrapper that applies a staggered fade-up to its children. */

/* In-view detector — bidirectional, scroll-driven (deterministic across
   browsers/harnesses): true while the element's top band is in the viewport,
   false once it leaves. Reveals on scroll-down, un-reveals on scroll-up. */
const useReveal = (opts = {}) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!ref.current) return;
    if (reduced) { setSeen(true); return; }
    let raf = 0;
    const check = () => {
      const el = ref.current; if (!el) return;
      const vh = window.innerHeight || 800;
      const r = el.getBoundingClientRect();
      setSeen(r.top < vh * 0.9 && r.bottom > vh * 0.04);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [reduced]);
  return [ref, seen];
};

/* 0→1 progress as a tall element scrolls from entering to leaving the viewport.
   progress 0 = element top hits viewport bottom; 1 = element bottom hits viewport top.
   We clamp to the "pinned" window so the sticky child gets a clean 0..1. */
const useScrollProgress = (ref) => {
  const [p, setP] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        // total scrollable distance for this section = its height - one viewport
        const total = r.height - vh;
        const scrolled = -r.top;
        const k = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : (r.top < vh * 0.5 ? 1 : 0);
        setP(k);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  // reduced motion → treat as fully revealed once mounted near view
  return reduced ? 1 : p;
};

/* Staggered fade-up wrapper. Children get sequential delays once revealed. */
const Reveal = ({ children, as: As = 'div', className = '', stagger = 90, threshold, ...rest }) => {
  const [ref, seen] = useReveal({ threshold });
  return (
    <As ref={ref} className={`reveal ${seen ? 'is-in' : ''} ${className}`} {...rest}>
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              style: { ...(child.props.style || {}), '--reveal-delay': `${i * stagger}ms` },
              className: `reveal__item ${child.props.className || ''}`,
            })
          : child
      )}
    </As>
  );
};

Object.assign(window, { useReveal, useScrollProgress, Reveal });

/* ScrubVideo — a <video> whose currentTime is driven by a 0..1 `progress`.
   Gives true scroll-scrubbed motion: scroll down → video plays forward, up →
   reverse. Muted/inline so it can be seeked freely.
   When `chroma` is set, each frame is drawn to a <canvas> with near-white pixels
   knocked out to transparent — so a white-background clip floats on the dark page
   with no white box (option-1 transparent look, done at runtime). */
const ScrubVideo = ({ src, poster, progress, className = '', alt = '', chroma = false }) => {
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const durRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  // Fetch the file as a blob URL — blob: sources are fully seekable, fixing
  // MP4s whose currentTime won't move (seekable range empty) when loaded via
  // a plain relative URL without range support.
  useEffect(() => {
    let revoked = null;
    let alive = true;
    fetch(src)
      .then((r) => r.blob())
      .then((b) => {
        if (!alive) return;
        const url = URL.createObjectURL(b);
        revoked = url;
        setBlobUrl(url);
      })
      .catch(() => { if (alive) setBlobUrl(src); }); // fall back to direct src
    return () => { alive = false; if (revoked) URL.revokeObjectURL(revoked); };
  }, [src]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !blobUrl) return;
    const onMeta = () => {
      durRef.current = v.duration || 0;
      // size the keying canvas to the video (capped for perf)
      if (canvasRef.current && v.videoWidth) {
        const cap = 760;
        const scale = Math.min(1, cap / v.videoWidth);
        canvasRef.current.width = Math.round(v.videoWidth * scale);
        canvasRef.current.height = Math.round(v.videoHeight * scale);
      }
      setReady(true);
    };
    const onErr = () => setFailed(true);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('error', onErr);
    v.load();
    // Fallback: if the browser can't decode this codec within 6s, show poster.
    const t = setTimeout(() => { if (!v.videoWidth) setFailed(true); }, 6000);
    return () => {
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('error', onErr);
      clearTimeout(t);
    };
  }, [blobUrl]);

  // Continuously ease the video's currentTime toward the scroll target via rAF,
  // and (when chroma) draw the current frame to the canvas with white knocked out.
  const targetRef = useRef(0);
  useEffect(() => { targetRef.current = Math.max(0, Math.min(1, progress)); }, [progress]);

  useEffect(() => {
    if (!ready || !durRef.current) return;
    const v = ref.current;
    const cv = canvasRef.current;
    if (!v) return;
    const ctx = chroma && cv ? cv.getContext('2d', { willReadFrequently: true }) : null;
    let raf = 0;
    const dur = durRef.current - 0.05;
    const FPS = 30;
    let displayed = v.currentTime;
    let lastDrawn = -1;

    const keyFrame = () => {
      if (!ctx) return;
      // Lazily size the canvas to the video the first time we have dimensions.
      if (cv.width < 100 && v.videoWidth) {
        const cap = 760;
        const scale = Math.min(1, cap / v.videoWidth);
        cv.width = Math.round(v.videoWidth * scale);
        cv.height = Math.round(v.videoHeight * scale);
      }
      const w = cv.width, h = cv.height;
      if (w < 100) return;
      try { ctx.drawImage(v, 0, 0, w, h); } catch (e) { return; }
      let img;
      try { img = ctx.getImageData(0, 0, w, h); } catch (e) { return; }
      const d = img.data;
      // Knock out near-white, low-saturation pixels (the studio backdrop).
      // Robot keeps its shape: colored accents are saturated, the face is dark,
      // and the cream body stays because we only fully cut pixels above ~248.
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const mx = r > g ? (r > b ? r : b) : (g > b ? g : b);
        const mn = r < g ? (r < b ? r : b) : (g < b ? g : b);
        const sat = mx - mn;
        const warm = r - b;           // beige backdrop is warm: R > B
        // Background = warm, mid-bright, low-saturation beige. The robot's dark
        // face (low mx), teal accents (b≥r → warm≤0) and neutral highlights
        // (warm≈0) all survive; only the beige studio sweep is cut.
        if (mx > 95 && warm >= 16 && sat < 64) {
          // ramp alpha by how strongly "beige" the pixel is
          const a = Math.max(0, Math.min(255, (40 - warm) * 12));
          d[i + 3] = a;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const tick = () => {
      if (!reduced) {
        const targetT = targetRef.current * dur;
        const gap = targetT - displayed;
        const absGap = Math.abs(gap);
        // Large jump (fast scroll): snap straight to target so we never lag.
        // Small gap: ease for smoothness.
        if (absGap > 0.4) {
          displayed = targetT;
        } else {
          const k = 0.12 + Math.min(0.18, absGap * 0.08);
          displayed += gap * k;
        }
        const quantized = Math.round(displayed * FPS) / FPS;
        // Only request a new seek when the decoder is idle — issuing a seek
        // while v.seeking is true gets dropped by the browser and freezes the
        // frame on fast scrubs.
        if (!v.seeking && Math.abs(v.currentTime - quantized) >= 1 / FPS) {
          try { v.currentTime = quantized; } catch (e) {}
        }
      }
      // redraw the keyed frame whenever the shown time changed
      if (ctx && Math.abs(v.currentTime - lastDrawn) >= 0.5 / FPS) {
        keyFrame();
        lastDrawn = v.currentTime;
      }
      raf = requestAnimationFrame(tick);
    };
    // draw once the first frame is decodable
    const onSeeked = () => keyFrame();
    v.addEventListener('seeked', onSeeked);
    v.addEventListener('loadeddata', onSeeked);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener('seeked', onSeeked);
      v.removeEventListener('loadeddata', onSeeked);
    };
  }, [ready, reduced, chroma]);

  if (chroma) {
    return (
      <span className="scrubv">
        {!failed && (
          <video
            ref={ref}
            src={blobUrl || undefined}
            muted playsInline preload="auto" tabIndex={-1}
            className="scrubv__video"
            aria-hidden="true"
          />
        )}
        {failed
          ? <img src={poster} className={`scrubv__canvas ${className}`} alt={alt} />
          : <canvas ref={canvasRef} className={`scrubv__canvas ${className}`} role="img" aria-label={alt} />
        }
      </span>
    );
  }

  return (
    <video
      ref={ref}
      className={className}
      src={blobUrl || undefined}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-label={alt}
      tabIndex={-1}
    />
  );
};

Object.assign(window, { ScrubVideo });
