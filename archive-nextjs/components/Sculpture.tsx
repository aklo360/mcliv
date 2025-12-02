"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Sculpture() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    // Transparent scene to let page background show through
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Ensure canvas is centered and fills the container
    const canvas = renderer.domElement as HTMLCanvasElement;
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    // Responsive sizing
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 1.2);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 2, 2);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0xffffff, 0.35);
    rim.position.set(-2, 1, 2);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    // Group to hold the composition (deliberate left crop)
    // Group centered in the column
    const group = new THREE.Group();
    // Offset slightly to the right within full-bleed background
    group.position.set(0.6, 0, 0);
    group.scale.setScalar(0.85); // a bit smaller overall
    // Sideways cloth, with a bit more upward tilt toward camera (~6–7° total) and subtle left roll
    group.rotation.set(-Math.PI / 2 + 0.12, -0.25, -0.05);
    scene.add(group);

    // Build an interactive point plane
    const cols = 100; // airier spacing
    const rows = 60;  // airier spacing
    const width = 7.5;  // larger plane for more spread
    const height = 4.6; // larger plane for more spread
    const dx = width / (cols - 1);
    const dy = height / (rows - 1);

    const positions = new Float32Array(cols * rows * 3);
    const base = new Float32Array(cols * rows * 3);
    // Per-point planar displacement and velocity (stardust scattering)
    const dispX = new Float32Array(cols * rows);
    const dispY = new Float32Array(cols * rows);
    const velX = new Float32Array(cols * rows);
    const velY = new Float32Array(cols * rows);
    let p = 0;
    for (let j = 0; j < rows; j++) {
      const y = -height / 2 + j * dy;
      for (let i = 0; i < cols; i++) {
        const x = -width / 2 + i * dx;
        positions[p] = x; base[p++] = x;
        positions[p] = y; base[p++] = y;
        positions[p] = 0; base[p++] = 0;
      }
    }

    const planeGeo = new THREE.BufferGeometry();
    planeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Create a circular sprite texture so points render as round "spheres"
    const makeCircleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 64;
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, 64, 64);
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      const tex = new THREE.Texture(c);
      tex.needsUpdate = true;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };
    const circleTexture = makeCircleTexture();

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

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0);
    const hitPoint = new THREE.Vector3(999, 999, 0);
    const hitPlane = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.05, height * 1.05), new THREE.MeshBasicMaterial({ visible: false }));
    group.add(hitPlane);

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerMove = (ev: PointerEvent) => {
      if (dragging) {
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;
        lastX = ev.clientX;
        lastY = ev.clientY;
        group.rotation.y += dx * 0.005;
        group.rotation.x += dy * 0.003;
      }
      const rect = container.getBoundingClientRect();
      mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(hitPlane, false)[0];
      if (hit) {
        // convert to group local space
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
      try { container.setPointerCapture(ev.pointerId); } catch {}
    };
    const onPointerUp = (ev: PointerEvent) => {
      dragging = false;
      try { container.releasePointerCapture(ev.pointerId); } catch {}
    };
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    const onLeave = () => hitPoint.set(999, 999, 0);
    container.addEventListener("pointerleave", onLeave);

    // Motion preference
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = () => {
      // Wave field + interactive disruption
      const t = performance.now() * 0.001;

      const pos = planeGeo.getAttribute("position") as any;
      const damping = 0.92; // elegant ease-out
      const spring = 0.07;  // slightly stronger return to base
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const bx = base[idx * 3 + 0];
          const by = base[idx * 3 + 1];

          // Layered turbulence for a calm wave
          const w1 = 0.12 * Math.sin(bx * 1.2 + t * 0.6);
          const w2 = 0.09 * Math.cos(by * 1.3 - t * 0.5);
          const w3 = 0.06 * Math.sin((bx + by) * 0.9 + t * 0.9);
          const angle = 0.4;
          const rx = bx * Math.cos(angle) - by * Math.sin(angle);
          const w4 = 0.05 * Math.sin(rx * 2.0 + t * 0.8);
          const wave = w1 + w2 + w3 + w4;

          // Stardust scattering: gentle radial push with swirl, then spring back
          if (hitPoint.x < 900) {
            const dxp = bx - hitPoint.x;
            const dyp = by - hitPoint.y;
            const dist2 = dxp * dxp + dyp * dyp;
            const r = 0.8; // reduce influence radius
            const sigma = r * 0.42;
            const influence = Math.exp(-dist2 / (2 * sigma * sigma));
            // Normalized direction away from cursor
            const len = Math.sqrt(dist2) + 1e-6;
            const ux = dxp / len;
            const uy = dyp / len;
            // Add slight swirl component (perpendicular)
            const swirl = 0.15;
            const sx = -uy * swirl;
            const sy = ux * swirl;
            const impulse = 0.02 * influence; // ~1/10th intensity
            velX[idx] += (ux + sx) * impulse;
            velY[idx] += (uy + sy) * impulse;
          }

          // Spring back to base, with damping
          velX[idx] += -spring * dispX[idx];
          velY[idx] += -spring * dispY[idx];
          velX[idx] *= damping;
          velY[idx] *= damping;
          dispX[idx] += velX[idx];
          dispY[idx] += velY[idx];

          pos.setXYZ(idx, bx + dispX[idx], by + dispY[idx], wave);
        }
      }
      pos.needsUpdate = true;
      renderer.render(scene, camera);
      reqRef.current = requestAnimationFrame(animate);
    };

    if (!prefersReduced) {
      reqRef.current = requestAnimationFrame(animate);
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      ro.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onLeave);
      planeGeo.dispose();
      pointsMat.dispose();
      hitPlane.geometry.dispose();
      (hitPlane.material as any).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" aria-label="Sculptural animation" />;
}
