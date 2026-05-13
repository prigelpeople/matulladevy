/**
 * WeddingRingSection.jsx
 * Photorealistic 3D wedding ring section using Three.js + HDR lighting +
 * post-processing (UnrealBloom + BokehPass for DoF). Scroll-driven rotation
 * via GSAP ScrollTrigger. 500vh scroll spacer, sticky 100vh viewport,
 * 6 copy panels timed to the same scroll progress.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    label: 'AWAL SEGALANYA',
    title: 'Sebuah Janji\nAbadi',
    body: 'Dimulai dari satu cincin, satu janji, dan satu nama yang terukir di hati.',
  },
  {
    label: 'TERUKIR SELAMANYA',
    title: 'R & D',
    arabic: 'رَحْمَتُلَّه وَ دِيفِي',
    body: 'Dua inisial, satu takdir — terpahat di emas seperti doa yang tak pernah putus.',
  },
  {
    label: 'MENUJU HARI BAHAGIA',
    title: 'Minggu,\n24 Mei 2026',
    body: 'Resepsi Pernikahan · Ngunduh Mantu 30 Mei 2026',
    cta: 'Buka Undangan',
  },
];

export default function WeddingRingSection() {
  const wrapRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRefs = useRef([]);
  const ringRef = useRef(null);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) return;

    let renderer, scene, camera, composer, bloom, bokeh, raf;
    const isMobile = window.innerWidth < 768;

    const init = () => {
      try {
        /* ── Renderer ── */
        const W = canvasRef.current.clientWidth;
        const H = canvasRef.current.clientHeight;

        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: false,
        });
        renderer.setSize(W, H, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        /* ── Scene & Camera ── */
        scene = new THREE.Scene();
        scene.background = new THREE.Color('#FAF8F4'); // var(--cream)

        camera = new THREE.PerspectiveCamera(22, W / H, 0.01, 100);
        camera.position.set(0, 0, 2.5);

        /* ── HDR Environment ── */
        new RGBELoader().load(process.env.PUBLIC_URL + '/assets/studio.hdr', (hdrTexture) => {
          hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = hdrTexture;
        });

        /* ── Load GLB ring ── */
        new GLTFLoader().load(process.env.PUBLIC_URL + '/assets/ring.glb', (gltf) => {
          const model = gltf.scene;
          model.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const targetSize = 0.7;
          const scale = targetSize / maxDim;
          model.scale.setScalar(scale);
          model.updateMatrixWorld(true);
          const scaledBox = new THREE.Box3().setFromObject(model);
          const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
          model.position.sub(scaledCenter);
          scene.add(model);
          ringRef.current = model;
        });

        scene.add(new THREE.AmbientLight(0xffffff, 0.15));
        const key = new THREE.DirectionalLight(0xfff1d6, 0.6);
        key.position.set(2, 3, 2);
        scene.add(key);

        /* ── Post-processing ── */
        composer = new EffectComposer(renderer);
        composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        composer.setSize(W, H);
        composer.addPass(new RenderPass(scene, camera));

        bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.18, 0.4, 0.92);
        composer.addPass(bloom);

        bokeh = new BokehPass(scene, camera, { focus: 2.5, aperture: 0.003, maxblur: 0.008 });
        composer.addPass(bokeh);
        composer.addPass(new OutputPass());

        /* ── Render loop ── */
        let t = 0;
        const render = () => {
          raf = requestAnimationFrame(render);
          t += 0.012;
          if (ringRef.current) ringRef.current.position.y = Math.sin(t * 0.8) * 0.02;
          composer.render();
        };
        render();

        /* ── Pin sticky viewport ── */
        const pinST = ScrollTrigger.create({
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stickyRef.current,
          pinSpacing: false,
        });

        const orbitST = ScrollTrigger.create({
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const p = self.progress;
            if (ringRef.current) {
              ringRef.current.rotation.y = p * Math.PI * 6;
              ringRef.current.rotation.x = p * Math.PI * 0.3 - 0.2;
            }
            camera.position.z = 2.5 - p * 0.4;
            if (bokeh.uniforms && bokeh.uniforms['focus']) {
              bokeh.uniforms['focus'].value = camera.position.z;
            }
          },
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });

        const totalPanels = 3; // Corrected to match PANELS array length
        const segmentSize = 1 / totalPanels;
        copyRefs.current.forEach((el, i) => {
          if (!el) return;
          const start = i * segmentSize;
          const fadeIn = start + 0.01;
          const hold = start + segmentSize * 0.35;
          const fadeOut = start + segmentSize * 0.75;
          const end = start + segmentSize;
          tl.set(el, { opacity: 0, y: 24 }, start)
            .to(el, { opacity: 1, y: 0, duration: 0.08, ease: 'expo.out' }, fadeIn)
            .to(el, { opacity: 1, y: 0, duration: fadeOut - hold }, hold)
            .to(el, { opacity: 0, y: -20, duration: end - fadeOut, ease: 'expo.in' }, fadeOut);
        });

        return () => {
          pinST.kill();
          orbitST.kill();
          tl.kill();
          cancelAnimationFrame(raf);
          if (composer && composer.dispose) composer.dispose();
          if (renderer) renderer.dispose();
        };
      } catch (err) {
        console.error('[WeddingRingSection] Error:', err);
        setHasError(true);
      }
    };

    const cleanup = init();

    const onResize = () => {
      if (!canvasRef.current || !renderer || !camera || !composer) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '500vh',
        background: 'var(--cream)',
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--cream)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            background: 'var(--cream)',
          }}
        />

        {/* Top decorative rule */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 1,
            background: 'rgba(196,168,130,0.5)',
            zIndex: 8,
          }}
        />

        {/* Section label */}
        <div
          className="font-ui tracked"
          style={{
            position: 'absolute',
            top: 56,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '11px',
            color: '#3a3535',
            opacity: 0.55,
            zIndex: 8,
            whiteSpace: 'nowrap',
          }}
        >
          Rachmatulla &amp; Devy Puspita
        </div>

        {/* Copy panels */}
        {PANELS.map((p, i) => (
          <div
            key={i}
            ref={(el) => (copyRefs.current[i] = el)}
            style={{
              position: 'absolute',
              bottom: '12vh',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              maxWidth: 520,
              width: '88vw',
              opacity: 0,
              zIndex: 10,
              pointerEvents: p.cta ? 'auto' : 'none',
            }}
          >
            <div
              className="font-ui tracked reveal"
              style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: 14 }}
            >
              {p.label}
            </div>

            <div
              className="reveal"
              style={{
                width: 40,
                height: 1,
                background: 'var(--sage-green)',
                margin: '0 auto 18px',
              }}
            />

            <h3
              className="font-display reveal"
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                color: 'var(--ink)',
                lineHeight: 0.9,
                letterSpacing: '-0.01em',
                margin: '0 0 18px',
                whiteSpace: 'pre-line',
              }}
            >
              {p.title}
            </h3>

            {p.arabic && (
              <div
                className="font-arabic"
                style={{
                  fontSize: '1.6rem',
                  color: '#c4a882',
                  marginBottom: 14,
                  lineHeight: 1.6,
                }}
              >
                {p.arabic}
              </div>
            )}

            {p.verse && (
              <div
                className="font-arabic"
                style={{
                  fontSize: '1.4rem',
                  color: '#c4a882',
                  marginBottom: 14,
                  lineHeight: 1.6,
                }}
              >
                {p.verse}
              </div>
            )}

            {p.body && (
              <p
                className="font-ui reveal"
                style={{
                  fontSize: '15px',
                  color: 'var(--warm-dark)',
                  opacity: 0.78,
                  lineHeight: 1.75,
                  margin: '0 auto',
                  maxWidth: 460,
                  fontWeight: 400,
                }}
              >
                {p.body}
              </p>
            )}

            {p.quote && (
              <blockquote
                className="font-ui"
                style={{
                  fontSize: '15px',
                  color: '#3a3535',
                  opacity: 0.85,
                  lineHeight: 1.75,
                  margin: '0 auto 14px',
                  maxWidth: 460,
                }}
              >
                {p.quote}
              </blockquote>
            )}
            {p.source && (
              <div
                className="font-ui tracked"
                style={{ fontSize: '11px', color: '#c4a882', marginTop: 6 }}
              >
                {p.source}
              </div>
            )}

            {p.cta && (
              <button
                type="button"
                onClick={() => {
                  const t = document.getElementById('rsvp');
                  if (t) t.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  marginTop: 24,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 32px',
                  borderRadius: 999,
                  border: '1px solid #c4a882',
                  background: 'transparent',
                  color: '#3a3535',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c4a882';
                  e.currentTarget.style.color = '#faf6f1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#3a3535';
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#c4a882',
                  }}
                />
                {p.cta}
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#c4a882',
                  }}
                />
              </button>
            )}
          </div>
        ))}

        {/* Bottom decorative rule */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 1,
            background: 'rgba(196,168,130,0.5)',
            zIndex: 8,
          }}
        />
      </div>
    </section>
  );
}
