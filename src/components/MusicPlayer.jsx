import React, { useState, useRef, useEffect } from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';

const MUSIC_URL = "https://res.cloudinary.com/do24uyizc/video/upload/v1778931025/GHEA_INDRAWARI_-_MANUSIA_PALING_BAHAGIA_BERDAMAI_LYRIC_VIDEO_LIRIK_LAGU_TERBARU_1_vku7i8.mp4";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const lottieRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Try to autoplay when component mounts, but browser might block it
    // until the first user interaction.
    const attemptAutoplay = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.log("Waiting for user gesture to play music...");
          });
      }
    };

    window.addEventListener('click', attemptAutoplay, { once: true });
    window.addEventListener('touchstart', attemptAutoplay, { once: true });

    return () => {
      window.removeEventListener('click', attemptAutoplay);
      window.removeEventListener('touchstart', attemptAutoplay);
    };
  }, [isPlaying]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      cursor: 'pointer',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      borderRadius: '50%',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.3)',
      transition: 'transform 0.3s ease',
    }}
    className="music-player-btn"
    onClick={togglePlay}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <audio
        ref={audioRef}
        src={MUSIC_URL}
        loop
      />
      
      <div style={{ width: '40px', height: '40px' }}>
        <DotLottiePlayer
          ref={lottieRef}
          src={process.env.PUBLIC_URL + '/assets/play.lottie'}
          autoplay
          loop
          // Using the isPlaying state to control the animation playback
          // If the .lottie file has a state machine, we'd typically use 
          // seeker or specific methods, but for a simple toggle, 
          // playing/pausing the animation works well.
          playMode={isPlaying ? "normal" : "bounce"} 
          speed={isPlaying ? 1 : 0}
        />
      </div>
    </div>
  );
}
