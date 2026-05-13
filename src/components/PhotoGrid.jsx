import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { type: 'photo', src: process.env.PUBLIC_URL + '/assets/prep1.jpg', rotate: -5 },
  { type: 'photo', src: process.env.PUBLIC_URL + '/assets/prep2.webp', rotate: 3 },
  { type: 'text' },
  { type: 'photo', src: process.env.PUBLIC_URL + '/assets/prep3.webp', rotate: -3 },
  { type: 'photo', src: process.env.PUBLIC_URL + '/assets/prep4.jpeg', rotate: 4 },
];

export default function PhotoGrid() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);

    gsap.set(items, { opacity: 0, y: 60 });

    const ctx = gsap.context(() => {
      // Semua item masuk saat scroll
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      });

      // Parallax ringan — foto genap naik, ganjil turun
      items.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -25 : 25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--transparant)',
        padding: '48px 0',
        overflow: 'hidden',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          padding: '40px 4vw',
        }}
      >
        {ITEMS.map((item, i) => {
          if (item.type === 'text') {
            return (
              <div
                key={i}
                ref={(el) => (itemRefs.current[i] = el)}
                style={{
                  flexShrink: 0,
                  width: 'clamp(200px, 20vw, 280px)',
                  aspectRatio: '3/4',
                  borderRadius: '20px',
                  background: 'var(--sage)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '32px 28px',
                  transform: `rotate(2deg)`,
                  marginLeft: '-24px',
                  marginRight: '-24px',
                  zIndex: 3,
                  position: 'relative',
                }}
              >
                <div
                  className="font-ui tracked"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: 'var(--muted)',
                    marginBottom: 16,
                    textTransform: 'uppercase',
                  }}
                >
                  Our Story
                </div>
                <div
                  className="font-display"
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    color: 'var(--ink)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    marginBottom: 20,
                  }}
                >
                  Nyuwun Dungo<br />Pangestunipun
                </div>
                <div
                  style={{
                    width: 32,
                    height: 1,
                    background: 'var(--sage-green)',
                    marginBottom: 16,
                  }}
                />
                <div
                  className="font-ui"
                  style={{
                    fontSize: '13px',
                    color: 'var(--warm-dark)',
                    opacity: 0.7,
                    lineHeight: 1.7,
                  }}
                >
                  Rachmatulla &amp; Devy<br />
                  <span style={{ opacity: 0.6 }}>#MaDeWithLove</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              style={{
                flexShrink: 0,
                width: 'clamp(180px, 20vw, 260px)',
                transform: `rotate(${item.rotate}deg)`,
                marginLeft: i === 0 ? '0' : '-20px',
                position: 'relative',
                zIndex: i === 1 || i === 3 ? 2 : 1,
                willChange: 'transform',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
              }}
            >
              <img
                src={item.src}
                alt={`Foto ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
