import React, { useEffect, useState } from 'react';
import './App.css';
import Preloader from './components/Preloader';
import SideNav from './components/SideNav';
import HeroSection from './components/HeroSection';

const Marquee = React.lazy(() => import('./components/Marquee'));
const BismillahSection = React.lazy(() => import('./components/BismillahSection'));
const CouplePhotoSection = React.lazy(() => import('./components/CouplePhotoSection'));
const EventDetails = React.lazy(() => import('./components/EventDetails'));
const Countdown = React.lazy(() => import('./components/Countdown'));
const QuoteSection = React.lazy(() => import('./components/QuoteSection'));
const RSVP = React.lazy(() => import('./components/RSVP'));
const WeddingRingSection = React.lazy(() => import('./components/WeddingRingSection'));
const FooterSeamless = React.lazy(() => import('./components/FooterSeamless'));
const FloatingFlowers = React.lazy(() => import('./components/FloatingFlowers'));
const PhotoGrid = React.lazy(() => import('./components/PhotoGrid'));
const SurpriseCard = React.lazy(() => import('./components/SurpriseCard'));

function App() {
  const [loaded, setLoaded] = useState(false);
  const [showPreloadVideo, setShowPreloadVideo] = useState(false);
  const [navDark, setNavDark] = useState(false);

  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [loaded]);

  useEffect(() => {
    const onScroll = () => {
      setNavDark(window.scrollY > window.innerHeight * 4.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loaded]);

  const handlePreloaderDone = () => {
    setLoaded(true);
  };

  return (
    <div className="App">
        {!loaded && <Preloader onDone={handlePreloaderDone} />}
        
        <SideNav dark={navDark} />

        <main style={{ visibility: loaded ? 'visible' : 'hidden' }}>
          <HeroSection />
          <React.Suspense fallback={<div style={{ height: '100vh', background: 'var(--cream)' }} />}>
            {/* FloatingFlowers: fixed overlay, aktif dari #acara sampai #rsvp */}
            {loaded && <FloatingFlowers />}
            <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--cream))' }} />
          <WeddingRingSection />
          <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--cream))' }} />
          <BismillahSection />
          <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--sage))' }} />
          <CouplePhotoSection />


          <Marquee
            text="30 Mei 2026 · Ngunduh Mantu · Rachmatulla & Devy Puspita · "
            direction="right"
            alt
          />
          <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--sage-mist))' }} />

          <div className="bg-pattern">
            {/* EventDetails sudah punya id="acara" — trigger start FloatingFlowers */}
            <EventDetails />

            <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--sage-mist))' }} />
            
            <div className="countdown-surprise-wrapper">
              <Countdown />
              <SurpriseCard />
            </div>

            <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--cream))' }} />
            <PhotoGrid />
            <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--sage-mist))' }} />
            <QuoteSection />
            <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--cream))' }} />

            {/* RSVP sudah punya id="rsvp" — trigger end FloatingFlowers */}
            <RSVP />
          </div>

          <div style={{ height: 80, marginTop: -80, position: 'relative', zIndex: 10, background: 'linear-gradient(to bottom, transparent, var(--cream))' }} />
          <FooterSeamless />
        </React.Suspense>
      </main>
    </div>
  );
}

export default App;

