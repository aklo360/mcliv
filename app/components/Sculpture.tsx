"use client";

import { useEffect, useRef } from 'react';
import type * as THREEType from 'three';

/**
 * Interactive point-field sculpture inspired by the legacy Next.js layout.
 * Runs only on the client; safe to render inside server components.
 */
export default function Sculpture() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let reqRef: number | null = null;
    let ro: ResizeObserver | null = null;
    let cleanup: (() => void) | null = null;

    let cancelled = false;

    (async () => {
      const THREE: typeof THREEType = await import('three');
      if (cancelled) return;
      const liveContainer = mountRef.current;
      if (!liveContainer) return;

      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(0, 0, 6);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const canvas = renderer.domElement;
      canvas.style.position = 'absolute';
      canvas.style.top = '50%';
      canvas.style.left = '50%';
      canvas.style.transform = 'translate(-50%, -50%)';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      liveContainer.appendChild(canvas);

      const resize = () => {
        const rect = liveContainer.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(liveContainer);

      // Lights
      scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.2));
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(2, 2, 2);
      scene.add(dir);
      const rim = new THREE.DirectionalLight(0xffffff, 0.35);
      rim.position.set(-2, 1, 2);
      scene.add(rim);
      scene.add(new THREE.AmbientLight(0xffffff, 0.18));

      const group = new THREE.Group();
      // keep centered; previously offset on x which nudged the scene right
      group.position.set(0, 0, 0);
      const scale =
        typeof window !== 'undefined' && window.innerWidth <= 640 ? 0.9 : 1.02;
      group.scale.setScalar(scale);
      group.rotation.set(-Math.PI / 2 + 0.3, -0.3, -0);
      scene.add(group);

      const cols = 100;
      const rows = 60;
      const width = 7.5;
      const height = 4.6;
      const dx = width / (cols - 1);
      const dy = height / (rows - 1);

      const positions = new Float32Array(cols * rows * 3);
      const base = new Float32Array(cols * rows * 3);
      const dispX = new Float32Array(cols * rows);
      const dispY = new Float32Array(cols * rows);
      const velX = new Float32Array(cols * rows);
      const velY = new Float32Array(cols * rows);

      let p = 0;
      for (let j = 0; j < rows; j++) {
        const y = -height / 2 + j * dy;
        for (let i = 0; i < cols; i++) {
          const x = -width / 2 + i * dx;
          positions[p] = x;
          base[p++] = x;
          positions[p] = y;
          base[p++] = y;
          positions[p] = 0;
          base[p++] = 0;
        }
      }

      const planeGeo = new THREE.BufferGeometry();
      planeGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );

      const circleTexture = (() => {
        const c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext('2d')!;
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        const tex = new THREE.Texture(c);
        tex.needsUpdate = true;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
      })();

      const pointsMat = new THREE.PointsMaterial({
        color: 0x2a2a2a,
        size: 0.06,
        sizeAttenuation: true,
        map: circleTexture,
        alphaTest: 0.5,
        transparent: true,
        depthWrite: false,
      });
      const points = new THREE.Points(planeGeo, pointsMat);
      group.add(points);

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(0, 0);
      const hitPoint = new THREE.Vector3(999, 999, 0);
      const hitPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 1.05, height * 1.05),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      group.add(hitPlane);

      let dragging = false;
      let lastX = 0;
      let lastY = 0;

      const onPointerMove = (ev: PointerEvent) => {
        if (dragging) {
          const dxMove = ev.clientX - lastX;
          const dyMove = ev.clientY - lastY;
          lastX = ev.clientX;
          lastY = ev.clientY;
          group.rotation.y += dxMove * 0.005;
          group.rotation.x += dyMove * 0.003;
        }
        const rect = liveContainer.getBoundingClientRect();
        mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hit = raycaster.intersectObject(hitPlane, false)[0];
        if (hit) {
          hitPoint.copy(hit.point);
          group.worldToLocal(hitPoint);
        } else {
          hitPoint.set(999, 999, 0);
        }
      };
      const onPointerDown = (ev: PointerEvent) => {
        dragging = true;
        lastX = ev.clientX;
        lastY = ev.clientY;
        try {
          liveContainer.setPointerCapture(ev.pointerId);
        } catch (_err) {
          // ignore capture failures
        }
      };
      const onPointerUp = (ev: PointerEvent) => {
        dragging = false;
        try {
          liveContainer.releasePointerCapture(ev.pointerId);
        } catch (_err) {
          // ignore release failures
        }
      };
      const onLeave = () => hitPoint.set(999, 999, 0);
      liveContainer.addEventListener('pointermove', onPointerMove);
      liveContainer.addEventListener('pointerdown', onPointerDown);
      liveContainer.addEventListener('pointerup', onPointerUp);
      liveContainer.addEventListener('pointerleave', onLeave);

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const animate = () => {
        const t = performance.now() * 0.001;
        const pos = planeGeo.getAttribute('position') as THREEType.BufferAttribute;
        const damping = 0.92;
        const spring = 0.07;

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const idx = j * cols + i;
            const bx = base[idx * 3 + 0];
            const by = base[idx * 3 + 1];

            const w1 = 0.12 * Math.sin(bx * 1.2 + t * 0.6);
            const w2 = 0.09 * Math.cos(by * 1.3 - t * 0.5);
            const w3 = 0.06 * Math.sin((bx + by) * 0.9 + t * 0.9);
            const rx = bx * Math.cos(0.4) - by * Math.sin(0.4);
            const w4 = 0.05 * Math.sin(rx * 2.0 + t * 0.8);
            const wave = prefersReduced ? 0 : w1 + w2 + w3 + w4;

            if (hitPoint.x < 900) {
              const dxHit = bx - hitPoint.x;
              const dyHit = by - hitPoint.y;
              const dist2 = dxHit * dxHit + dyHit * dyHit;
              // Much stronger, tighter falloff for a localized hover push/pull
              const influence = dist2 < 1.4 ? Math.exp(-dist2 * 3.2) : 0;
              velX[idx] += dxHit * 0.012 * influence;
              velY[idx] += dyHit * 0.012 * influence;
            }

            velX[idx] = velX[idx] * damping - (dispX[idx] - wave) * spring;
            velY[idx] = velY[idx] * damping - dispY[idx] * spring;
            dispX[idx] += velX[idx];
            dispY[idx] += velY[idx];

            pos.array[idx * 3 + 2] = dispX[idx] + dispY[idx];
          }
        }

        pos.needsUpdate = true;
        renderer.render(scene, camera);
        reqRef = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        if (reqRef) cancelAnimationFrame(reqRef);
        ro?.disconnect();
        liveContainer.removeEventListener('pointermove', onPointerMove);
        liveContainer.removeEventListener('pointerdown', onPointerDown);
        liveContainer.removeEventListener('pointerup', onPointerUp);
        liveContainer.removeEventListener('pointerleave', onLeave);
        renderer.dispose();
        planeGeo.dispose();
        if (canvas.parentElement) {
          canvas.parentElement.removeChild(canvas);
        }
      };
    })();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return <div className="sculpture-mount" ref={mountRef} aria-hidden="true" />;
}
