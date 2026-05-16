import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WEDDING } from '../data/wedding';

gsap.registerPlugin(ScrollTrigger);

const BankCard = ({ bank, logoColor, logoUrl, accNumber, name }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(accNumber);
    setCopied(true);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c4a882', '#a8b5a2', '#C9897A', '#FAF6F1']
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="reveal"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.5)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Subtle decorative circles for card effect */}
      <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', zIndex: 0 }} />
      <div style={{ position: 'absolute', left: '-10%', bottom: '-20%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          {/* Chip icon */}
          <div style={{ width: '42px', height: '30px', background: 'linear-gradient(135deg, #e0c38c 0%, #c4a882 100%)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.2)' }} />
            <div style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.2)' }} />
            <div style={{ position: 'absolute', right: '30%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.2)' }} />
          </div>

          {logoUrl ? (
            <img src={logoUrl} alt={bank} style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          ) : (
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: logoColor, fontStyle: 'italic', letterSpacing: '-0.02em' }}>
              {bank}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.1em' }}>
            {accNumber}
          </div>
          <div className="font-ui" style={{ fontSize: '15px', color: 'var(--warm-dark)', marginTop: '4px' }}>
            a.n. {name}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: copied ? 'var(--sage-green)' : '#a3a3a3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              transition: 'all 0.3s ease',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Tersalin' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function QuoteSection() {
  const ref = useRef(null);

  // GSAP scroll animation removed per user request

  return (
    <section ref={ref} style={{ background: 'var(--sage-mist)', padding: '140px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <h2 data-q className="font-display reveal" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: 'var(--ink)', marginBottom: '24px', fontStyle: 'italic', fontWeight: 300 }}>
          Tanda Kasih
        </h2>

        <p data-q className="font-ui reveal" style={{ fontSize: '15px', color: 'var(--warm-dark)', lineHeight: 1.8, marginBottom: '48px' }}>
          Doa restu Bapak/Ibu sekalian merupakan karunia yang sangat berarti bagi kami. Dan jika memberi merupakan ungkapan tanda kasih, rekan sekalian dapat memberi kado secara online melalui berikut. Terima Kasih.
        </p>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <BankCard
            bank="BCA"
            logoUrl="https://res.cloudinary.com/do24uyizc/image/upload/v1778288198/master_mbv8wz.jpg"
            logoColor="#005bac"
            accNumber="0526703316"
            name={WEDDING.bride.name}
          />
          <BankCard
            bank="SeaBank"
            logoUrl="https://res.cloudinary.com/do24uyizc/image/upload/v1778288198/SeaBank.svg_akauvg.png"
            logoColor="#e31c23"
            accNumber="901527178506"
            name={WEDDING.bride.name}
          />
        </div>
      </div>
    </section>
  );
}
