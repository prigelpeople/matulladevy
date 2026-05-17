import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send } from 'lucide-react';
import { db } from '../lib/firebase';
import { ref as dbRef, push, onValue, off } from 'firebase/database';

gsap.registerPlugin(ScrollTrigger);

export default function RSVP() {
  const sectionRef = useRef(null);
  const [name, setName] = useState('');
  const [attend, setAttend] = useState('Ya');
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    const wishesRef = dbRef(db, 'wishes');
    onValue(wishesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data).sort((a, b) => b.ts - a.ts);
        setWishes(list);
      }
    });
    return () => off(wishesRef);
  }, []);

  // GSAP scroll animation removed per user request

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    
    const w = { 
      name: name.trim(), 
      attend, 
      count, 
      message: message.trim(), 
      ts: Date.now() 
    };

    try {
      const wishesRef = dbRef(db, 'wishes');
      await push(wishesRef, w);
      setName(''); setMessage(''); setCount(1); setAttend('Ya');
    } catch (err) {
      console.error("Firebase error:", err);
      alert("Gagal mengirim ucapan. Pastikan Firebase Database Rules sudah diubah menjadi public (.read: true, .write: true)");
    }
  };

  return (
    <section ref={sectionRef} id="rsvp" style={{ background: 'var(--cream)', padding: '140px 6vw' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 64 }}>
        <div>
          <div data-r className="font-ui tracked reveal" style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: 14 }}>RSVP</div>
          <h2 data-r className="font-display-sc reveal" style={{ fontWeight: 400, fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: 'var(--ink)', margin: 0, letterSpacing: '0.05em' }}>Konfirmasi &amp; Ucapan</h2>
          <div data-r style={{ width: 60, height: 1, background: 'var(--sage-green)', margin: '24px 0' }} />
          <div data-r className="font-ui reveal" style={{ color: 'var(--warm-dark)', opacity: 0.75, fontSize: '15px', lineHeight: 1.75, marginBottom: 36 }}>
            Mohon konfirmasi kehadiran Anda dan kirimkan doa terbaik untuk kami.
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div data-r>
              <label className="field-label">Nama Lengkap</label>
              <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tulis nama Anda" />
            </div>

            <div data-r>
              <label className="field-label">Konfirmasi Kehadiran</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                {['Ya', 'Tidak', 'Belum Pasti'].map(opt => (
                  <button type="button" key={opt} className={`chip ${attend === opt ? 'active' : ''}`} onClick={() => setAttend(opt)}>{opt}</button>
                ))}
              </div>
            </div>

            <div data-r>
              <label className="field-label">Jumlah Tamu</label>
              <input className="field-input" type="number" min="1" max="5" value={count} onChange={(e) => setCount(Math.max(1, Math.min(5, Number(e.target.value) || 1)))} />
            </div>

            <div data-r>
              <label className="field-label">Pesan / Doa</label>
              <textarea className="field-input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tuliskan doa & ucapan Anda" style={{ resize: 'none' }} />
            </div>

            <div data-r style={{ marginTop: 8 }}>
              <button type="submit" className="btn-pill rose" style={{ pointerEvents: 'auto' }}>
                <Send size={13} /> Kirim Ucapan
              </button>
            </div>
          </form>
        </div>

        <div data-r style={{ background: 'var(--sage-mist)', padding: '24px', borderRadius: '8px' }} className="reveal">
          <div className="font-ui tracked" style={{ color: 'var(--muted)', opacity: 0.8, fontSize: '11px', marginBottom: 22 }}>Ucapan Tamu · {wishes.length}</div>

          <div style={{ maxHeight: 540, overflowY: 'auto', paddingRight: 12 }}>
            {wishes.length === 0 ? (
              <div className="font-display" style={{ fontStyle: 'italic', color: 'var(--warm-dark)', opacity: 0.6 }}>Jadilah yang pertama memberikan ucapan ✦</div>
            ) : (
              wishes.map((w, i) => (
                <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid rgba(196,168,130,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <div className="font-display" style={{ fontStyle: 'italic', fontWeight: 300, fontSize: '1.2rem', color: 'var(--sage-green)', lineHeight: 0.9 }}>{w.name}</div>
                    <div className="font-ui tracked" style={{ color: 'var(--muted)', fontSize: '11px', opacity: 0.85 }}>{w.attend}{w.count > 1 ? ` · ${w.count} tamu` : ''}</div>
                  </div>
                  <div className="font-ui" style={{ color: 'var(--warm-dark)', opacity: 0.78, fontSize: '15px', lineHeight: 1.75 }}>{w.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
