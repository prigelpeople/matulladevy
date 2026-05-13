import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WEDDING } from '../data/wedding';

gsap.registerPlugin(ScrollTrigger);

function calc(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const ref = useRef(null);
  const [t, setT] = useState(calc(WEDDING.countdownTarget));

  useEffect(() => {
    const id = setInterval(() => setT(calc(WEDDING.countdownTarget)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-cd-item]', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
    }, ref);
    return () => ctx.revert();
  }, []);

  const units = [
    { label: 'Hari', val: t.days },
    { label: 'Jam', val: t.hours },
    { label: 'Menit', val: t.minutes },
    { label: 'Detik', val: t.seconds },
  ];

  return (
    <section ref={ref} id="hitung" style={{ background: 'var(--sage-mist)', minHeight: '60vh', padding: '120px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1100, textAlign: 'center' }}>
        <div data-cd-item className="font-ui tracked reveal" style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: 16, opacity: 0.85 }}>The Big Day</div>
        <h2 data-cd-item className="font-display reveal" style={{ fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4.6vw, 3.4rem)', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.01em', margin: 0 }}>
          Menghitung Hari Menuju Hari Bahagia
        </h2>
        <div data-cd-item style={{ width: 60, height: 1, background: 'var(--sage-green)', margin: '28px auto 56px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
          {units.map((u, i) => (
            <div key={u.label} data-cd-item className="reveal" style={{ borderLeft: i === 0 ? 'none' : '1px solid rgba(196,168,130,0.3)', padding: '0 12px' }}>
              <div className="font-display" style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--sage-green)', fontSize: 'clamp(3rem, 8vw, 6.5rem)', lineHeight: 0.9, letterSpacing: '-0.01em' }}>{String(u.val).padStart(2, '0')}</div>
              <div className="font-ui tracked" style={{ color: 'var(--muted)', opacity: 0.6, fontSize: '11px', marginTop: 12 }}>{u.label}</div>
            </div>
          ))}
        </div>

        <div data-cd-item className="font-ui reveal" style={{ marginTop: 56, color: 'var(--warm-dark)', opacity: 0.7, fontSize: '15px' }}>
          24 Mei 2026 · 10.00 WIB
        </div>
      </div>
    </section>
  );
}
