import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FloatingFlowers() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let rafId;
    let renderer;
    let st;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;

      const SIZE = Math.min(window.innerWidth * 0.45, 520);

      // ── Renderer ──
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
      } catch (e) {
        console.warn('FloatingButterfly: WebGL init failed', e);
        return;
      }

      renderer.setSize(SIZE, SIZE);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);

      // ── Scene & Camera ──
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 3.2);

      // Minimal manual lights — let HDR do the work (same as ring section)
      scene.add(new THREE.AmbientLight(0xffffff, 0.15));
      const key = new THREE.DirectionalLight(0xfff1d6, 0.6);
      key.position.set(2, 3, 2);
      scene.add(key);

      // ── Environment HDR ──
      new RGBELoader().load(
        process.env.PUBLIC_URL + '/assets/studio.hdr',
        (hdrTexture) => {
          hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = hdrTexture; // no environmentIntensity override
        }
      );

      // ── Load butterfly.glb ──
      let mixer = null;
      let group = null;
      let baseScale = 1;
      const clock = new THREE.Clock();

      new GLTFLoader().load(
        process.env.PUBLIC_URL + '/assets/butterfly.glb',
        (gltf) => {
          const model = gltf.scene;

          // Center
          const box = new THREE.Box3().setFromObject(model);
          model.position.sub(box.getCenter(new THREE.Vector3()));

          group = new THREE.Group();
          group.add(model);

          // Scale
          const size = box.getSize(new THREE.Vector3());
          baseScale = 2.4 / (Math.max(size.x, size.y, size.z) || 1);
          group.scale.setScalar(baseScale);

          // Material
          model.traverse((child) => {
            if (child.isMesh && child.material) {
              const enhance = (m) => {
                m.side = THREE.DoubleSide;
                m.envMapIntensity = 0.8; // subtler
                if (m.roughness !== undefined) m.roughness = Math.min(m.roughness, 0.55);
                if (m.map) m.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                m.needsUpdate = true;
                return m;
              };
              if (Array.isArray(child.material)) child.material = child.material.map(enhance);
              else child.material = enhance(child.material);
            }
          });

          scene.add(group);

          // ── Aktifkan animasi sayap ──
          if (gltf.animations?.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
            console.log(`Butterfly: ${gltf.animations.length} animations active`);
          }
        },
        undefined,
        (err) => console.error('Butterfly GLB error:', err)
      );

      // ── Render loop ──
      let scrollVelocity = 0;
      let smoothVelocity = 0;
      let time = 0;

      const tick = () => {
        rafId = requestAnimationFrame(tick);
        
        // SKIP RENDER if out of trigger range
        if (st && !st.isActive) return; 

        const delta = clock.getDelta();
        time += 0.01;

        // Update animasi (sayap flap)
        if (mixer) mixer.update(delta);

        if (group) {
          smoothVelocity += (scrollVelocity - smoothVelocity) * 0.08;

          // Rotasi idle + reaktif scroll
          group.rotation.y += 0.005 + Math.abs(smoothVelocity) * 0.04;
          group.rotation.x = Math.sin(time * 0.5) * 0.08 + smoothVelocity * 0.15;
          group.rotation.z = Math.cos(time * 0.35) * 0.05 + smoothVelocity * 0.08;

          // Scale pulse saat scroll cepat
          const s = baseScale * (1 + Math.abs(smoothVelocity) * 0.3);
          group.scale.lerp(new THREE.Vector3(s, s, s), 0.08);

          // Float
          group.position.y = Math.sin(time * 0.7) * 0.05;

          scrollVelocity *= 0.9;
        }

        renderer.render(scene, camera);
      };
      tick();

      // ── ScrollTrigger: jalur terbang ──
      st = ScrollTrigger.create({
        trigger: '#acara',
        endTrigger: '#rsvp',
        start: 'top 80%',
        end: 'bottom 20%',

        onUpdate: (self) => {
          const p = self.progress;
          scrollVelocity = self.getVelocity() / 2000;

          const isMobile = window.innerWidth < 768;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          let x, y;

          if (isMobile) {
            // Mobile: gerak vertikal tengah layar, sedikit ke kiri/kanan
            if (p < 0.33) {
              x = vw * 0.5 + Math.sin(p * Math.PI * 2) * vw * 0.15;
              y = vh * 0.15 + p * vh * 0.3;
            } else if (p < 0.66) {
              x = vw * 0.5 - Math.sin(p * Math.PI * 2) * vw * 0.15;
              y = vh * 0.45 + (p - 0.33) * vh * 0.3;
            } else {
              x = vw * 0.5;
              y = vh * 0.75 + (p - 0.66) * vh * 0.2;
            }
          } else {
            // Desktop: jalur melengkung seperti sebelumnya
            if (p < 0.25) {
              const t = p / 0.25;
              x = vw * 0.72 - t * vw * 0.42;
              y = vh * 0.12 + t * vh * 0.08;
            } else if (p < 0.5) {
              const t = (p - 0.25) / 0.25;
              x = vw * 0.30 - t * vw * 0.12;
              y = vh * 0.20 + t * vh * 0.55;
            } else if (p < 0.75) {
              const t = (p - 0.5) / 0.25;
              x = vw * 0.18 + t * vw * 0.52;
              y = vh * 0.75 - t * vh * 0.48;
            } else {
              const t = (p - 0.75) / 0.25;
              x = vw * 0.70 - t * vw * 0.18;
              y = vh * 0.27 + t * vh * 0.55;
            }
          }

          const half = SIZE / 2;
          const finalX = Math.max(half, Math.min(vw - half, x)) - half;
          const finalY = Math.max(half, Math.min(vh - half, y)) - half;
          wrapper.style.transform = `translate(${finalX}px, ${finalY}px)`;
        },

        onEnter: () => gsap.to(wrapper, { opacity: 1, duration: 0.9, ease: 'power3.out' }),
        onLeave: () => gsap.to(wrapper, { opacity: 0, duration: 0.5, ease: 'power3.in' }),
        onEnterBack: () => gsap.to(wrapper, { opacity: 1, duration: 0.7, ease: 'power3.out' }),
        onLeaveBack: () => gsap.to(wrapper, { opacity: 0, duration: 0.5, ease: 'power3.in' }),
      });

      const onResize = () => {
        const s = window.innerWidth < 768
          ? Math.min(window.innerWidth * 0.55, 280)
          : Math.min(window.innerWidth * 0.65, 780);
        if (renderer) renderer.setSize(s, s);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);

    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      if (st) st.kill();
      if (renderer) { renderer.dispose(); renderer.forceContextLoss(); }
    };
  }, []);

  const SIZE = typeof window !== 'undefined'
    ? (window.innerWidth < 768
      ? Math.min(window.innerWidth * 0.55, 280)
      : Math.min(window.innerWidth * 0.65, 780))
    : 450;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0,
        width: SIZE,
        height: SIZE,
        left: 0,
        top: 0,
        transform: 'translate(70vw, 15vh)',
        willChange: 'left, top, opacity',
        filter: 'drop-shadow(0 8px 40px rgba(122,158,126,0.15))',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}