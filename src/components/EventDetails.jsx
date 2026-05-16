import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WEDDING } from '../data/wedding';
import { MapPin, CalendarPlus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function EventDetails() {
  const ref = useRef(null);

  // GSAP scroll animation removed per user request

  const buildIcs = (ev) => {
    const dt = new Date(ev.isoDate);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(dt.getTime() + 4 * 60 * 60 * 1000);
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wedding//ID\nBEGIN:VEVENT\nUID:${ev.key}@rd-wedding\nSUMMARY:${ev.title} - Rachmatulla & Devy Puspita\nDTSTART:${fmt(dt)}\nDTEND:${fmt(end)}\nLOCATION:${ev.address}\nDESCRIPTION:Undangan Pernikahan\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${ev.key}-rd.ics`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section ref={ref} id="acara" style={{ background: 'var(--sage-mist)', padding: '140px 6vw' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="font-ui tracked reveal" style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: 14 }}>Save the Date</div>
          <h2 className="font-display-sc reveal" style={{ fontWeight: 400, fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', color: 'var(--ink)', margin: 0, letterSpacing: '0.05em' }}>Detail Acara</h2>
          <div style={{ width: 60, height: 1, background: 'var(--color-gold)', margin: '24px auto 0' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 32 }}>
          {WEDDING.events.map((ev) => (
            <div
              key={ev.key}
              data-card-event
              className="reveal"
              style={{
                background: 'var(--cream)',
                border: '1px solid rgba(196,168,130,0.32)',
                borderRadius: 2,
                padding: '48px 40px',
                position: 'relative',
              }}
            >
              <span data-line style={{ display: 'block', height: 1, background: 'var(--sage-green)', marginBottom: 28 }} />

              <div className="font-ui tracked" style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: 18 }}>{ev.tag}</div>
              <div className="font-display" style={{ fontStyle: 'italic', fontWeight: 300, fontSize: '2rem', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.01em', marginBottom: 18 }}>{ev.date}</div>
              <div style={{ width: 40, height: 1, background: 'var(--sage-green)', marginBottom: 22 }} />
              <div className="font-ui" style={{ fontSize: '15px', color: 'var(--warm-dark)', opacity: 0.85, marginBottom: 6 }}>{ev.time}</div>
              <div className="font-display" style={{ fontStyle: 'italic', fontWeight: 300, fontSize: '1.25rem', color: 'var(--sage-green)', marginBottom: 4 }}>{ev.venue}</div>
              <div className="font-ui" style={{ fontSize: '13px', color: 'var(--warm-dark)', opacity: 0.7, marginBottom: 32 }}>{ev.address}</div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <a href={ev.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noreferrer" className="btn-pill">
                  <MapPin size={13} /> Petunjuk Arah
                </a>
                <button className="font-ui tracked" onClick={() => buildIcs(ev)} style={{ background: 'transparent', border: 'none', color: 'var(--warm-dark)', opacity: 0.7, fontSize: '11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <CalendarPlus size={13} /> Tambahkan ke Kalender
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
