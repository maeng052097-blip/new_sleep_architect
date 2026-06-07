/* eslint-disable */
/* sa-pk/gallery.jsx — Full-bleed auto-advancing image gallery (final section).
   Crossfade + slow ken-burns drift like the reference hero. Auto-advances on a
   timer, pauses on hover, supports dots + arrows, respects reduced-motion. */

const GALLERY = [
  { src: 'sa-pk/img/gallery-3.webp', alt: '침대 프레임에 장착된 Sleep Architect 센서 바' },
  { src: 'sa-pk/img/gallery-4.webp', alt: '밝은 침실의 침대 프레임 장착형 센서 바' },
  { src: 'sa-pk/img/gallery-5.webp', alt: '협탁 위 컴패니언 로봇 — 미스트와 무드 라이트' },
  { src: 'sa-pk/img/gallery-6.webp', alt: '어두운 침실에서 작동 중인 컴패니언 로봇' },
  { src: 'sa-pk/img/gallery-2.webp', alt: '부클레 헤드보드의 무드 라이트 침실' },
  { src: 'sa-pk/img/gallery-1.webp', alt: '협탁 위 컴패니언 로봇이 놓인 미니멀 침실' },
  { src: 'sa-pk/img/gallery-7.webp', alt: '협탁 위 모듈형 센서 퍽' },
  { src: 'sa-pk/img/gallery-8.webp', alt: '따뜻한 조명의 침실에 놓인 모듈형 센서' },
];

const Gallery = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const n = GALLERY.length;

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % n), 4000);
    return () => clearInterval(id);
  }, [reduced, paused, n]);

  const go = (i) => setIdx(((i % n) + n) % n);

  return (
    <section
      id="gallery"
      className="gal"
      data-screen-label="13 Gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="제품 갤러리"
    >
      <div className="gal__head">
        <p className="eyebrow">IN YOUR ROOM</p>
        <h2 className="hp-h2">당신의 침실에서.</h2>
      </div>

      <div className="gal__stage">
        {GALLERY.map((g, i) => (
          <figure
            key={g.src}
            className={`gal__slide ${i === idx ? 'is-active' : ''}`}
            aria-hidden={i !== idx}
          >
            <img className="gal__img" src={g.src} alt={i === idx ? g.alt : ''} loading={i <= 1 ? 'eager' : 'lazy'} />
          </figure>
        ))}

        {/* Caption of active slide */}
        <figcaption className="gal__caption" aria-live="polite">{GALLERY[idx].alt}</figcaption>

        {/* Arrows */}
        <button type="button" className="gal__arrow gal__arrow--prev" onClick={() => go(idx - 1)} aria-label="이전 이미지">‹</button>
        <button type="button" className="gal__arrow gal__arrow--next" onClick={() => go(idx + 1)} aria-label="다음 이미지">›</button>

        {/* Dots */}
        <div className="gal__dots" role="tablist" aria-label="이미지 선택">
          {GALLERY.map((g, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={`${i + 1}번 이미지`}
              className={`gal__dot ${i === idx ? 'is-active' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { Gallery });
