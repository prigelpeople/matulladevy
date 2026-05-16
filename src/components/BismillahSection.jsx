import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

  // GSAP scroll animation removed per user request

export default function BismillahSection() {
  const ref = useRef(null);

  return (
    <section ref={ref} id="bismillah" style={{ position: 'relative', background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', overflow: 'hidden' }}>
      {/* Decorative Bottom Background */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40vh',
          backgroundImage: 'url(https://res.cloudinary.com/do24uyizc/image/upload/v1778293164/premium_photo-1709492256417-816ffcb88cc5_1_zt85d8.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.6,
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: 720, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div data-reveal style={{ marginBottom: 40 }} className="reveal">
          <img
            src={process.env.PUBLIC_URL + '/assets/monogram1.webp'}
            alt="Monogram"
            style={{ width: 140, height: 'auto', display: 'inline-block' }}
          />
        </div>

        <div data-reveal style={{ marginBottom: 28 }} className="reveal">
          <svg width="80" height="40" viewBox="0 0 80 40" style={{ display: 'inline-block' }}>
            <path d="M5 20 Q 20 5, 40 20 T 75 20" stroke="var(--sage-green)" strokeWidth="1" fill="none" />
            <circle cx="40" cy="20" r="3" fill="var(--sage-green)" />
            <path d="M30 20 Q 35 12, 40 20 Q 45 28, 50 20" stroke="var(--sage-green)" strokeWidth="0.7" fill="none" />
          </svg>
        </div>

        <div data-reveal className="font-arabic reveal" style={{ color: 'var(--sage-green)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.6, marginBottom: 28 }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>

        <div data-reveal className="reveal" style={{ width: 60, height: 1, background: 'var(--sage-green)', margin: '0 auto 28px' }} />

        <div data-reveal className="font-ui reveal" style={{ fontSize: '15px', color: 'var(--warm-dark)', opacity: 0.85, lineHeight: 1.75, marginBottom: 56 }}>
          Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang
        </div>

        <div data-reveal className="font-display reveal" style={{ fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.01em', marginBottom: 24 }}>
          Dengan rahmat &amp; ridho-Nya
        </div>

        <div data-reveal className="font-ui reveal" style={{ fontSize: '15px', color: 'var(--warm-dark)', opacity: 0.75, lineHeight: 1.75, maxWidth: 540, margin: '0 auto' }}>
          Kami bermaksud menyelenggarakan pernikahan putra dan putri kami sebagai bukti syukur atas anugerah cinta yang Tuhan titipkan.
        </div>
      </div>
    </section>
  );
}
