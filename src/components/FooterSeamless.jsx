import React from "react";
import TextPressure from "./TextPressure";

export default function FooterSeamless() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;1,300&family=Courier+Prime&display=swap');
        .fs-footer{position:relative;width:100%;overflow:hidden;background:var(--cream);}
        .fs-upper{background:var(--cream);padding:3.5rem 3rem 0;position:relative;z-index:2;}
        .fs-nav-row{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:2rem;padding-bottom:3rem;border-bottom:0.5px solid rgba(0,0,0,0.1);}
        .fs-tagline{font-family:'Courier Prime',monospace;font-size:12px;color:var(--warm-dark);line-height:2;max-width:260px;letter-spacing:0.01em;margin:0;}
        .fs-tagline a{display:inline-block;margin-top:1.25rem;font-family:'Courier Prime',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.7);text-decoration:none;border-bottom:0.5px solid rgba(255,255,255,0.3);padding-bottom:2px;}
        .fs-nav-cols{display:flex;gap:3.5rem;}
        .fs-nav-col{display:flex;flex-direction:column;gap:0.8rem;}
        .fs-nav-col a{font-family:'Courier Prime',monospace;font-size:12px;color:rgba(255,255,255,0.5);text-decoration:none;letter-spacing:0.02em;}
        .fs-nav-col a:hover{color:#fff;}
        .fs-socials{display:flex;flex-direction:column;gap:0.8rem;}
        .fs-socials a{font-family:'Courier Prime',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);text-decoration:none;}
        .fs-socials a:hover{color:#fff;}
        .fs-hero-zone{position:relative;height:420px;overflow:hidden;}
        .fs-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 40%;filter:blur(2px) saturate(0.75) brightness(0.85);transform:scale(1.05);}
        .fs-gradient-top{position:absolute;top:0;left:0;right:0;height:70%;background:linear-gradient(to bottom,var(--cream) 0%,var(--cream) 15%,rgba(250,248,244,0.85) 40%,transparent 100%);z-index:2;}
        .fs-gradient-bottom{position:absolute;bottom:0;left:0;right:0;height:35%;background:linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%);z-index:2;}
        .fs-wordmark{position:absolute;bottom:-0.08em;left:0;right:0;text-align:center;z-index:3;pointer-events:auto;user-select:none;}
        .fs-wordmark span{font-family:'Cormorant',serif;font-style:italic;font-weight:300;font-size:clamp(48px,10vw,120px);color:#fff;letter-spacing:-0.01em;line-height:1;display:block;}
        .fs-bottom-bar{background:#000;padding:1.1rem 3rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;position:relative;z-index:4;border-top:0.5px solid rgba(255,255,255,0.06);}
        .fs-copy,.fs-legal span,.fs-legal a{font-family:'Courier Prime',monospace;font-size:10px;color:rgba(255,255,255,0.25);text-decoration:none;letter-spacing:0.08em;}
        .fs-legal a:hover{color:rgba(255,255,255,0.6);}
        .fs-legal{display:flex;gap:1.5rem;flex-wrap:wrap;align-items:center;}
      `}</style>

      <footer className="fs-footer">
        <div className="fs-upper">
          <div className="fs-nav-row">
            <p className="fs-tagline">
              Crafted with<br />
              Claude & bytedance,<br />
              by PrigelPeople.
              <br />
            </p>
          </div>
        </div>

        <div className="fs-hero-zone">
          <img
            className="fs-photo"
            src="https://images.unsplash.com/photo-1558172474-d41b68c8ad45?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzc4MTg5NDQ5fA&ixlib=rb-4.1.0"
            alt=""
            aria-hidden="true"
            crossOrigin="anonymous"
          />
          <div className="fs-gradient-top" aria-hidden="true" />
          <div className="fs-gradient-bottom" aria-hidden="true" />
          <div className="fs-wordmark" aria-hidden="true" style={{ height: 'clamp(6rem, 20vw, 15rem)', display: 'flex', alignItems: 'center' }}>
            <TextPressure
              text="MATULLA & DEVY"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              minFontSize={36}
              scale={true}
            />
          </div>
        </div>


      </footer>
    </>
  );
}
