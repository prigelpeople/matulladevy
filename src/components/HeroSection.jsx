import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ASSETS, WEDDING } from '../data/wedding';

function SplitChars({ text, className, style }) {
  return (
    <span className={`split-heading ${className || ''}`} style={style}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="word">
          {word.split('').map((c, ci) => (
            <span key={ci} className="ch">{c}</span>
          ))}
        </span>
      ))}
    </span>
  );
}

function useGuestName() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    if (!name) return 'Tamu Undangan';
    return decodeURIComponent(name.replace(/\+/g, ' '));
  }, []);
}

export default function HeroSection() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const totalFramesRef = useRef(0);
  const [activeState, setActiveState] = useState(0);
  const activeStateRef = useRef(0);
  const gradientRef = useRef(null);
  const progressDisplayRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const monogramWrapRef = useRef(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnProgressRef = useRef(0);
  const isSeekingRef = useRef(false);
  const useRVFCRef = useRef(false);

  const guestName = useGuestName();

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    useRVFCRef.current = 'requestVideoFrameCallback' in video;

    const handleLoaded = () => {
      framesRef.current = video;
      totalFramesRef.current = video.duration;
      console.log('Video duration loaded:', video.duration);
      
      // "Warm up" the video for mobile scrubbing
      video.play().then(() => {
        video.pause();
      }).catch(err => {
        console.warn('Video warm-up failed, scrubbing might be jittery:', err);
      });
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.load(); // Force load on iOS
    if (video.readyState >= 1) handleLoaded();

    return () => { 
      video.removeEventListener('loadedmetadata', handleLoaded);
    };
  }, []);

  useEffect(() => {
    let trigger;
    let isCancelled = false;
    let rafId;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (isCancelled) return;

      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',
        pin: pinRef.current,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          targetProgressRef.current = p;

          if (progressDisplayRef.current) {
            progressDisplayRef.current.textContent =
              Math.round(p * 100).toString().padStart(2, '0') + ' — 100';
          }
          if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.opacity = p < 0.05 ? '1' : '0';
          }

          const next = p < 0.10 ? 0 : p < 0.20 ? 1 : p < 0.40 ? 2 : p < 0.50 ? 3 : 4;
          if (next !== activeStateRef.current) {
            activeStateRef.current = next;
            setActiveState(next);
          }
        },
      });
    };

    initGSAP();

    const loop = () => {
      if (isCancelled) return;
      rafId = requestAnimationFrame(loop);

      const lerpFactor = window.innerWidth < 768 ? 0.15 : 0.1;
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * lerpFactor;
      const p = currentProgressRef.current;

      if (gradientRef.current) {
        if (p > 0.85) {
          gradientRef.current.style.background = 'linear-gradient(to top, rgba(12,8,6,0.85) 0%, rgba(12,8,6,0.4) 50%, transparent 100%)';
        } else if (p > 0.12) {
          gradientRef.current.style.background = 'linear-gradient(to top, rgba(12,8,6,0.35) 0%, transparent 100%)';
        } else {
          gradientRef.current.style.background = 'transparent';
        }
      }
      if (monogramWrapRef.current) {
        monogramWrapRef.current.style.transform = `scale(${1 + p * 0.4})`;
      }

      if (Math.abs(p - lastDrawnProgressRef.current) < 0.002) return;
      if (isSeekingRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || !video.duration || video.readyState < 2) return;

      const targetTime = p * video.duration;
      if (isNaN(targetTime)) return;

      isSeekingRef.current = true;
      lastDrawnProgressRef.current = p;
      video.currentTime = targetTime;

      const drawAndRelease = () => {
        if (isCancelled) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        isSeekingRef.current = false;
      };

      if (useRVFCRef.current) {
        video.requestVideoFrameCallback(drawAndRelease);
      } else {
        const onSeeked = () => {
          drawAndRelease();
          video.removeEventListener('seeked', onSeeked);
        };
        video.addEventListener('seeked', onSeeked);
      }
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(rafId);
      if (trigger) trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section grain" style={{ position: 'relative' }}>
      {/* Hidden video element for iOS support */}
      <video
        ref={videoRef}
        src={process.env.PUBLIC_URL + (window.innerWidth < 768 ? '/assets/hero-mobile-scrub.mp4' : '/assets/hero-full-scrub.mp4')}
        muted
        playsInline
        preload="auto"
        style={{ display: 'none' }}
      />
      <div ref={pinRef} style={{
        position: 'relative', width: '100vw', height: '100vh',
        overflow: 'hidden',
        background: `url(${process.env.PUBLIC_URL}/assets/bggarden.webp) center/cover no-repeat`
      }}>
        <canvas ref={canvasRef}
          width={window.innerWidth < 768 ? 720 : 1280}
          height={window.innerWidth < 768 ? 1280 : 720}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
        />
        <div ref={gradientRef} style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%',
          background: 'transparent', transition: 'background 0.6s ease', zIndex: 2
        }} />

        <div className={`hero-state center ${activeState === 0 ? 'active' : ''}`} style={{ zIndex: 3 }}>
          <div style={{ textAlign: 'center' }}>
            <div ref={monogramWrapRef} style={{ transform: 'scale(1)', transition: 'transform 0.4s ease', willChange: 'transform' }}>
              <img src={process.env.PUBLIC_URL + "/assets/monogram1.webp"} alt="R & D Monogram"
                onError={(e) => { e.target.src = e.target.src.replace('.webp', '.png') }}
                style={{ width: 'clamp(10rem, 25vw, 18rem)', height: 'auto', filter: 'drop-shadow(0 0 20px rgba(196,168,130,0.3))' }}
              />
            </div>
            <div className="font-ui tracked" style={{ color: '#ffffff', fontSize: '11px', marginTop: 18, opacity: 0.8 }}>
              #MaDeWithLove
            </div>
          </div>
        </div>

        <div className={`hero-state ${activeState === 1 ? 'active' : ''}`} style={{ zIndex: 3 }}>
          <div style={{ maxWidth: 760 }}>
            <SplitChars text="" className="font-display"
              style={{ color: '#ffffff', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.9, letterSpacing: '-0.01em' }}
            />
          </div>
        </div>

        <div className={`hero-state ${activeState === 2 ? 'active' : ''}`} style={{ zIndex: 3 }}>
          <div>
            <div className="font-ui tracked" style={{ color: '#ffffff', fontSize: '11px', marginBottom: 14 }}>The Wedding Of</div>
            <div className="font-display" style={{ color: '#ffffff', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.01em' }}>
              {WEDDING.heroTitle}
            </div>
            <div className="font-ui tracked" style={{ color: '#ffffff', fontSize: '11px', marginTop: 18, opacity: 0.85 }}>
              {WEDDING.heroDates}
            </div>
          </div>
        </div>

        <div className={`hero-state ${activeState === 3 ? 'active' : ''}`} style={{ zIndex: 3 }}>
          <div style={{ maxWidth: 760 }}>
            <SplitChars text="Dengan bahagia, kami mengundang rekan sekalian" className="font-display"
              style={{ color: '#ffffff', fontStyle: 'italic', fontSize: '40px', lineHeight: 0.9, fontWeight: 300, letterSpacing: '-0.01em' }}
            />
            <div className="font-ui" style={{ color: '#ffffff', opacity: 0.75, marginTop: 18, maxWidth: 460, fontSize: '15px', lineHeight: 1.75 }}>
              untuk turut hadir dan memberikan doa restu di hari bahagia kami.
            </div>
          </div>
        </div>

        <div className={`hero-state ${activeState === 4 ? 'active' : ''}`}
          style={{ zIndex: 4, alignItems: 'flex-end', justifyContent: 'space-between', paddingLeft: '6vw', paddingRight: '6vw' }}>
          <div style={{ flex: 1 }}>
            <div className="font-ui tracked" style={{ color: 'rgba(255,255,255,1)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Kepada Yth.
            </div>
            <div className="font-display" style={{ color: '#ffffff', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '20px', paddingBottom: '20px', borderBottom: '0.5px solid rgba(255,255,255,1)' }}>
              {guestName}
            </div>
            <div className="font-display" style={{ color: '#ffffff', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.01em' }}>
            </div>
            <div style={{ marginTop: 24 }}></div>
          </div>
        </div>

        <div ref={scrollIndicatorRef} className="scroll-indicator" style={{ opacity: 1, transition: 'opacity 0.4s ease' }}>
          <span>Scroll Down</span>
          <span className="arrow" />
        </div>

        <div style={{ position: 'absolute', top: 28, left: 80, zIndex: 6, color: '#ffffff' }}>
          <div className="font-ui tracked" style={{ fontSize: '11px', opacity: 0.7 }}>Undangan Pernikahan</div>
          <div className="font-display" style={{ fontStyle: 'italic', fontWeight: 300, fontSize: '1.2rem', color: '#ffffff', marginTop: 4, lineHeight: 0.9 }}>
            Rachmatulla &amp; Devy
          </div>
        </div>

        <div style={{ position: 'absolute', top: 28, right: 36, zIndex: 6, color: '#ffffff' }}>
          <div ref={progressDisplayRef} className="font-ui tracked" style={{ fontSize: '11px', opacity: 0.6 }}>
            00 — 100
          </div>
        </div>
      </div>
    </section>
  );
}
