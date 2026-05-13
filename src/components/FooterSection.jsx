import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer style={{ background: 'var(--color-charcoal)', padding: '64px 24px 40px', color: 'var(--color-cream)' }}>
      <div style={{ width: '100%', height: 1, background: 'rgba(196,168,130,0.3)', marginBottom: 56 }} />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div className="font-display" style={{ color: 'var(--color-gold)', fontStyle: 'italic', fontWeight: 300, fontSize: '2.6rem', lineHeight: 0.9 }}>R &amp; D</div>
        <div className="font-ui tracked" style={{ fontSize: '12px', marginTop: 16 }}>Rachmatulla &amp; Devy Puspita</div>
        <div className="font-ui tracked" style={{ fontSize: '11px', opacity: 0.5, marginTop: 8 }}>24 Mei 2026 · Resepsi Pernikahan</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 32 }}>
          <a href="#" aria-label="Instagram" style={{ color: 'var(--color-gold)', opacity: 0.7 }}><Instagram size={16} /></a>
          <a href="#" aria-label="LinkedIn" style={{ color: 'var(--color-gold)', opacity: 0.7 }}><Linkedin size={16} /></a>
        </div>

        <div className="font-ui tracked" style={{ fontSize: '11px', color: 'var(--color-gold)', opacity: 0.55, marginTop: 36 }}>
          Dibuat dengan cinta ✦ 2026
        </div>
      </div>
    </footer>
  );
}
