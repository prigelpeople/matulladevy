import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram } from 'lucide-react';
import { ASSETS, WEDDING } from '../data/wedding';

gsap.registerPlugin(ScrollTrigger);

export default function CouplePhotoSection() {
  const wrapRef = useRef(null);
  const stickyRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
    const slides = slideRefs.current;
    if (!slides || slides.length < 3) return;

    // Show first slide immediately
    gsap.set(slides[0], { opacity: 1 });
    gsap.set(slides[1], { opacity: 0 });
    gsap.set(slides[2], { opacity: 0 });

    const pinTrigger = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
    });

    const scrubTrigger = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        // Slide 0: visible 0–40%, fade out 33–40%
        // Slide 1: fade in 33–40%, visible 40–73%, fade out 66–73%
        // Slide 2: fade in 66–73%, visible 73–100%
        gsap.to(slides[0], { opacity: p < 0.33 ? 1 : p < 0.4 ? 1 - ((p - 0.33) / 0.07) : 0, duration: 0 });
        gsap.to(slides[1], { opacity: p < 0.33 ? 0 : p < 0.4 ? (p - 0.33) / 0.07 : p < 0.66 ? 1 : p < 0.73 ? 1 - ((p - 0.66) / 0.07) : 0, duration: 0 });
        gsap.to(slides[2], { opacity: p < 0.66 ? 0 : p < 0.73 ? (p - 0.66) / 0.07 : 1, duration: 0 });

        // Update indicator dots
        const activeSlide = p < 0.4 ? 0 : p < 0.73 ? 1 : 2;
        [0, 1, 2].forEach(i => {
          const dot = document.getElementById(`dot-${i}`);
          if (dot) {
            dot.style.background = i === activeSlide ? 'rgba(196,168,130,1)' : 'rgba(255,255,255,0.35)';
            dot.style.width = i === activeSlide ? '32px' : '20px';
          }
        });
      }
    });

    return () => {
      pinTrigger.kill();
      scrubTrigger.kill();
    };
  }, []);

  const slidesData = [
    {
      photo: ASSETS.slide1,
      label: 'Our Journey',
      title: 'Together Forever',
      desc: 'Dua hati yang dipersatukan dalam ikatan suci pernikahan dan cinta yang tulus.',
    },
    {
      photo: ASSETS.slide2,
      label: 'The Bride',
      title: 'Devy Puspitasari',
      desc: `Putri dari Bpk. ${WEDDING.bride.father} & Ibu ${WEDDING.bride.mother}`,
      ig: 'https://instagram.com/devypuspitas',
    },
    {
      photo: ASSETS.slide3,
      label: 'The Groom',
      title: 'Rachmatulla',
      desc: `Putra dari Bpk. ${WEDDING.groom.father} & Ibu ${WEDDING.groom.mother}`,
      ig: 'https://instagram.com/matullaa',
    },
  ];

  return (
    <div ref={wrapRef} style={{ height: '300vh', position: 'relative', background: 'var(--sage)' }}>
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
        {slidesData.map((slide, index) => (
          <div
            key={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className="slide"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
            }}
          >
            {/* Full bleed photo */}
            <img
              src={slide.photo}
              alt={slide.title}
              loading={index === 0 ? undefined : "lazy"}
              decoding={index === 0 ? undefined : "async"}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />

            {/* Dark gradient overlay — stronger at bottom for text legibility */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.5) 100%)',
              }}
            />

            {/* Text overlay — bottom left, unique on all slides */}
            <div
              style={{
                position: 'absolute',
                bottom: 'clamp(40px, 8vh, 80px)',
                left: 'clamp(24px, 6vw, 80px)',
                right: 'clamp(24px, 6vw, 80px)',
                color: '#fff',
              }}
            >
              <p
                className="reveal"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  opacity: 0.7,
                  marginBottom: '12px',
                }}
              >
                {slide.label}
              </p>

              <h2
                className="reveal"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(2.2rem, 6vw, 5rem)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.01em',
                  margin: '0 0 clamp(12px, 2vh, 24px)',
                  color: '#fff',
                }}
              >
                {slide.title}
              </h2>

              <div
                className="reveal"
                style={{
                  width: '40px',
                  height: '1px',
                  background: 'rgba(196,168,130,0.8)',
                  marginBottom: '14px',
                }}
              />

              <p
                className="reveal"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: 1.75,
                  opacity: 0.75,
                  maxWidth: '360px',
                  marginBottom: '24px',
                }}
              >
                {slide.desc}
              </p>

              {/* Instagram Button */}
              {slide.ig && (
                <a
                  href={slide.ig}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-pill dark"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    pointerEvents: 'auto',
                  }}
                >
                  <Instagram size={14} />
                  <span>Instagram</span>
                </a>
              )}

              {/* Slide indicator dots */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    id={`dot-${i}`}
                    style={{
                      width: i === 0 ? '32px' : '20px',
                      height: '1px',
                      background: i === 0 ? 'rgba(196,168,130,1)' : 'rgba(255,255,255,0.4)',
                      transition: 'background 0.3s, width 0.3s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
