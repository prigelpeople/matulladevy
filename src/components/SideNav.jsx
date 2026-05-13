import React from 'react';

export default function SideNav({ dark }) {
  return (
    <nav className={`side-nav ${dark ? 'dark' : ''}`} aria-label="Side navigation">
      <div className="nav-mark">
      </div>
      <div className="links">
        <a href="#acara">Acara</a>
        <a href="#hitung">Hitung Hari</a>
        <a href="#rsvp">RSVP</a>
      </div>
      <div className="nav-date font-ui" style={{
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: dark ? 'rgba(58,53,53,0.5)' : 'rgba(250,246,241,0.6)',
        marginBottom: '24px'
      }}>
        24 Mei 2026
      </div>
    </nav>
  );
}
