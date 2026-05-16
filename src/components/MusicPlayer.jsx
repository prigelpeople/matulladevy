import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const MUSIC_URL = "https://res.cloudinary.com/do24uyizc/video/upload/v1778931025/GHEA_INDRAWARI_-_MANUSIA_PALING_BAHAGIA_BERDAMAI_LYRIC_VIDEO_LIRIK_LAGU_TERBARU_1_vku7i8.mp4";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (e) => {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log("Playback failed:", e));
      }
    }
  };

  useEffect(() => {
    let hasAttemptedUnlock = false;

    const playAudio = () => {
      // Only auto-play if we haven't successfully started it yet
      if (audioRef.current && !isPlaying && !hasAttemptedUnlock) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            hasAttemptedUnlock = true;
            // Once playing, remove these listeners
            window.removeEventListener('click', playAudio);
            window.removeEventListener('touchstart', playAudio);
            window.removeEventListener('scroll', playAudio);
          })
          .catch(() => {});
      }
    };

    // Attempt immediately
    playAudio();

    // Listen for any interaction to unlock
    window.addEventListener('click', playAudio);
    window.addEventListener('touchstart', playAudio);
    window.addEventListener('scroll', playAudio);

    return () => {
      window.removeEventListener('click', playAudio);
      window.removeEventListener('touchstart', playAudio);
      window.removeEventListener('scroll', playAudio);
    };
  }, []);

  return (
    <div 
    onClick={togglePlay}
    style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 99999,
      cursor: 'pointer',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(10px)',
      borderRadius: '50%',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.5)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#4a4e40',
      pointerEvents: 'auto',
    }}
    className="music-player-btn"
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
    }}
    >
      <audio
        ref={audioRef}
        src={MUSIC_URL}
        loop
        autoPlay
        preload="auto"
      />
      
      {isPlaying ? <Pause size={20} strokeWidth={1.5} /> : <Play size={20} strokeWidth={1.5} style={{ marginLeft: '2px' }} />}
    </div>
  );
}
