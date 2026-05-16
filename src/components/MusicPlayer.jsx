import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const MUSIC_URL = "https://res.cloudinary.com/do24uyizc/video/upload/v1778931025/GHEA_INDRAWARI_-_MANUSIA_PALING_BAHAGIA_BERDAMAI_LYRIC_VIDEO_LIRIK_LAGU_TERBARU_1_vku7i8.mp4";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(10px)',
      borderRadius: '50%',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.4)',
      transition: 'all 0.3s ease',
      color: 'var(--sage-green, #6b705c)'
    }}
    className="music-player-btn"
    onClick={togglePlay}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.45)';
    }}
    >
      <audio
        ref={audioRef}
        src={MUSIC_URL}
        loop
      />
      
      {isPlaying ? <Pause size={20} strokeWidth={1.5} /> : <Play size={20} strokeWidth={1.5} style={{ marginLeft: '2px' }} />}
    </div>
  );
}
