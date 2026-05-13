import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Marquee({ text, direction = 'left', alt = false }) {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2; // we duplicated content

    const dir = direction === 'left' ? -1 : 1;
    const tween = gsap.fromTo(
      track,
      { x: dir === -1 ? 0 : -totalWidth },
      {
        x: dir === -1 ? -totalWidth : 0,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      }
    );
    return () => { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); };
  }, [direction]);

  // We render the text 6 times for safety
  const items = Array.from({ length: 6 }, (_, i) => i);

  return (
    <section
      ref={wrapperRef}
      style={{
        position: 'relative',
        background: 'var(--sage-mist)',
        padding: '0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(122,158,126,0.3)', // var(--sage-green) alpha
        borderBottom: '1px solid rgba(122,158,126,0.3)',
      }}
    >
      <div style={{ padding: '40px 0' }}>
        <div ref={trackRef} className="marquee-track">
          {items.concat(items).map((_, i) => (
            <span
              key={i}
              className="marquee-item font-display"
              style={{
                fontStyle: 'italic',
                color: alt
                  ? (i % 3 === 1 ? 'var(--ink)' : 'var(--muted)')
                  : (i % 3 === 1 ? 'var(--sage-green)' : 'var(--warm-dark)'),
                fontWeight: 300,
                letterSpacing: '-0.01em',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
