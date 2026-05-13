import React, { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [showLottie, setShowLottie] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  const startTimeRef = useRef(Date.now());
  const animationDataRef = useRef(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/assets/open%20envelope.json')
      .then(res => res.json())
      .then(data => {
        setAnimationData(data);
        animationDataRef.current = data;
      })
      .catch(err => console.error("Error loading Lottie:", err));
  }, []);

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = '';
      if (onDone) onDone();
    }, 600);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const duration = 2500;
    let raf;
    let localShowLottie = false;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);

      if (p >= 50 && !localShowLottie && animationDataRef.current) {
        localShowLottie = true;
        setShowLottie(true);
      }

      if (p < 100) {
        raf = requestAnimationFrame(updateProgress);
      } else {
        if (!animationDataRef.current) {
          handleFinish();
        }
      }
    };

    raf = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Lottie hanya tampil 2 detik lalu selesai ──
  useEffect(() => {
    if (!showLottie) return;
    const timer = setTimeout(() => {
      handleFinish();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLottie]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#faf6f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 20 }}>

        <div style={{ marginBottom: 40, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showLottie && animationData ? (
            <Lottie
              animationData={animationData}
              loop={false}
              style={{ width: 210, height: 210 }}
            />
          ) : (
            <img
              src={process.env.PUBLIC_URL + '/assets/monogram.webp'}
              alt="Monogram"
              onError={(e) => { e.target.src = e.target.src.replace('.webp', '.png') }}
              style={{
                width: 200,
                height: 'auto',
                display: 'block',
              }}
            />
          )}
        </div>

        <div
          style={{
            width: 40,
            height: 1,
            backgroundColor: '#c4a882',
            margin: '0 auto 40px',
            opacity: 0.6,
          }}
        />

        <div style={{ width: 120, margin: '0 auto 20px', opacity: showLottie ? 0 : 1, transition: 'opacity 0.4s ease' }}>
          <div
            style={{
              width: '100%',
              height: 1,
              backgroundColor: 'rgba(196, 168, 130, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                backgroundColor: '#c4a882',
                width: `${progress}%`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          <div
            className="font-ui"
            style={{
              fontSize: '11px',
              fontWeight: 400,
              color: '#c4a882',
              letterSpacing: '0.15em',
              marginTop: 16,
              textAlign: 'center',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            You're Invited
          </div>
        </div>
      </div>
    </div>
  );
}