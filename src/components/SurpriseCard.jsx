import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SurpriseCard() {
  const ref = useRef(null);
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    // Read ?to=NamaTamu from URL
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to') || 'Bapak/Ibu/Saudara/i';
    // Decode URI and replace + with space
    setGuestName(decodeURIComponent(name.replace(/\+/g, ' ')));
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 60, rotation: -3, scale: 0.92 },
      {
        opacity: 1, y: 0, rotation: -5, scale: 1,
        duration: 0.9,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          once: true,
        }
      }
    );
  }, [guestName]);

  // Render always, using fallback name if URL param is missing

  return (
    <section style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: 'var(--sage-mist)',
      overflow: 'hidden',
    }}>
      <div
        ref={ref}
        style={{
          position: 'relative',
          opacity: 0,
          width: 'clamp(320px, 85vw, 760px)',
          userSelect: 'none',

        }}
      >
        {/* Papan bunga PNG — base image */}
        <img
          src={process.env.PUBLIC_URL + '/assets/papan-bunga.webp'}
          alt="Papan bunga"
          style={{ width: '100%', display: 'block' }}
        />

        {/* Custom text overlay — positioned over the blue banner area */}
        <div style={{
          position: 'absolute',
          bottom: '22%',
          left: '8%',
          right: '8%',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <p style={{
            fontFamily: "'Arial Black', 'Impact', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1rem, 4.5vw, 2.2rem)',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            margin: 0,
            wordBreak: 'break-word',
          }}>
            <span style={{ fontSize: '1em' }}>from {guestName}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
