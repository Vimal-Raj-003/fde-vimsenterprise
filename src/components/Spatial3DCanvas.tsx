import { useEffect, useRef, useState, type ReactNode } from "react";

export function damp(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-dt * rate));
}

export function project3D(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  yaw: number,
  pitch: number,
  focal = 620,
  camZ = 760
) {
  const cry = Math.cos(yaw);
  const sry = Math.sin(yaw);
  const crx = Math.cos(pitch);
  const srx = Math.sin(pitch);

  const x1 = x * cry + z * sry;
  const z1 = -x * sry + z * cry;
  const y2 = y * crx - z1 * srx;
  const z2 = y * srx + z1 * crx;
  const denom = Math.max(150, z2 + camZ);
  const k = focal / denom;

  return {
    x: cx + x1 * k,
    y: cy + y2 * k,
    scale: k / (focal / camZ),
    z: z2
  };
}

// 3D Octahedron vertices + nested orbital ring geometry
const CORE_VERTS = [
  { x: 0, y: -195, z: 0 },
  { x: 185, y: 0, z: 0 },
  { x: 0, y: 0, z: 185 },
  { x: -185, y: 0, z: 0 },
  { x: 0, y: 0, z: -185 },
  { x: 0, y: 195, z: 0 }
];

const CORE_EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 1]
];

const CORE_FACES: Array<[number, number, number]> = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 1],
  [5, 2, 1],
  [5, 3, 2],
  [5, 4, 3],
  [5, 1, 4]
];

const AMBIENT_NODES = [
  { x: -390, y: -150, z: -90, gold: true },
  { x: -245, y: 175, z: 110, gold: false },
  { x: -125, y: -235, z: 140, gold: true },
  { x: 155, y: -205, z: -130, gold: false },
  { x: 355, y: -120, z: 85, gold: true },
  { x: 385, y: 155, z: -65, gold: false },
  { x: 195, y: 225, z: 120, gold: true },
  { x: -330, y: 35, z: -140, gold: true }
];

function buildRingPoints(radius: number, count: number, tiltX: number, tiltZ: number) {
  const pts: Array<{ x: number; y: number; z: number }> = [];
  const cx = Math.cos(tiltX);
  const sx = Math.sin(tiltX);
  const cz = Math.cos(tiltZ);
  const sz = Math.sin(tiltZ);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const rx = Math.cos(t) * radius;
    const ry = 0;
    const rz = Math.sin(t) * radius;

    const y1 = ry * cx - rz * sx;
    const z1 = ry * sx + rz * cx;

    const x2 = rx * cz - y1 * sz;
    const y2 = rx * sz + y1 * cz;

    pts.push({ x: x2, y: y2, z: z1 });
  }
  return pts;
}

const OUTER_RING = buildRingPoints(295, 42, 0.58, -0.28);
const INNER_RING = buildRingPoints(235, 36, -0.72, 0.42);

/**
 * Interactive 3D Metallic Gold & Alabaster/Obsidian Geometry Canvas.
 * Smoothly rotates in 3D space with cursor parallax, vertical scroll inertia, and high-DPI crispness.
 */
export function FullPageLuxuryCanvas({ theme }: { theme: "light" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastTime = performance.now();

    let baseYaw = 0.35;
    let ptrX = 0;
    let ptrY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let smoothScroll = window.scrollY * 0.0012;

    const pulses = CORE_EDGES.map((_, idx) => ({
      edgeIdx: idx,
      progress: (idx * 0.14) % 1,
      speed: 0.16 + (idx % 3) * 0.04
    }));

    const onPointerMove = (e: PointerEvent) => {
      if (!width || !height) return;
      ptrX = (e.clientX / width - 0.5) * 2;
      ptrY = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const paint = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 40 || height < 40) return;

      const isDark = themeRef.current === "dark";
      baseYaw += dt * 0.12;
      smoothX = damp(smoothX, ptrX, 3.2, dt || 0.016);
      smoothY = damp(smoothY, ptrY, 3.2, dt || 0.016);
      smoothScroll = damp(smoothScroll, window.scrollY * 0.0012, 4.0, dt || 0.016);

      // Ambient warm champagne-gold volumetric spotlights tailored to Light vs Dark surface
      const g1 = ctx.createRadialGradient(
        width * 0.78,
        height * 0.18,
        24,
        width * 0.78,
        height * 0.18,
        Math.max(width, height) * 0.58
      );
      if (isDark) {
        g1.addColorStop(0, "rgba(227, 180, 82, 0.12)");
        g1.addColorStop(0.5, "rgba(192, 139, 39, 0.045)");
        g1.addColorStop(1, "rgba(12, 11, 10, 0)");
      } else {
        g1.addColorStop(0, "rgba(184, 134, 43, 0.085)");
        g1.addColorStop(0.55, "rgba(218, 186, 120, 0.045)");
        g1.addColorStop(1, "rgba(246, 244, 239, 0)");
      }
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(
        width * 0.18,
        height * 0.8,
        20,
        width * 0.18,
        height * 0.8,
        Math.max(width, height) * 0.52
      );
      if (isDark) {
        g2.addColorStop(0, "rgba(227, 180, 82, 0.075)");
        g2.addColorStop(1, "rgba(12, 11, 10, 0)");
      } else {
        g2.addColorStop(0, "rgba(158, 110, 26, 0.055)");
        g2.addColorStop(1, "rgba(246, 244, 239, 0)");
      }
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      const yaw = baseYaw + smoothX * 0.35 + smoothScroll * 0.85;
      const pitch = -0.22 + smoothY * 0.22 + Math.sin(smoothScroll) * 0.12;
      const cx = width < 640 ? width * 0.5 : width * 0.52;
      const cy = height * 0.48;
      const scaleFactor = width < 640 ? 0.62 : 1.06;

      // Project rotating 3D octahedral core
      const projCore = CORE_VERTS.map((v) =>
        project3D(
          v.x * scaleFactor,
          v.y * scaleFactor,
          v.z * scaleFactor,
          cx,
          cy,
          yaw,
          pitch
        )
      );

      // Depth-sorted translucent triangular facets
      const sortedFaces = CORE_FACES.map(([i, j, k]) => {
        const a = projCore[i]!;
        const b = projCore[j]!;
        const c = projCore[k]!;
        return {
          a,
          b,
          c,
          avgZ: (a.z + b.z + c.z) / 3
        };
      }).sort((f1, f2) => f2.avgZ - f1.avgZ);

      for (const face of sortedFaces) {
        const depthAlpha = Math.max(0.015, Math.min(0.075, (250 - face.avgZ) / 6000));
        ctx.beginPath();
        ctx.moveTo(face.a.x, face.a.y);
        ctx.lineTo(face.b.x, face.b.y);
        ctx.lineTo(face.c.x, face.c.y);
        ctx.closePath();
        ctx.fillStyle = isDark
          ? `rgba(227, 180, 82, ${(depthAlpha * 1.15).toFixed(3)})`
          : `rgba(168, 120, 32, ${depthAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // Draw octahedral 3D structural edges
      for (const [aIdx, bIdx] of CORE_EDGES) {
        const a = projCore[aIdx]!;
        const b = projCore[bIdx]!;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = isDark
          ? "rgba(227, 180, 82, 0.22)"
          : "rgba(158, 110, 26, 0.16)";
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }

      // Draw nested tilted 3D orbital rings
      const drawRing = (
        ring: Array<{ x: number; y: number; z: number }>,
        yawMul: number,
        strokeColor: string
      ) => {
        ctx.beginPath();
        ring.forEach((pt, idx) => {
          const p = project3D(
            pt.x * scaleFactor,
            pt.y * scaleFactor,
            pt.z * scaleFactor,
            cx,
            cy,
            yaw * yawMul,
            pitch * 0.9
          );
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      drawRing(
        OUTER_RING,
        0.65,
        isDark ? "rgba(248, 245, 238, 0.12)" : "rgba(22, 20, 18, 0.085)"
      );
      drawRing(
        INNER_RING,
        -0.85,
        isDark ? "rgba(227, 180, 82, 0.18)" : "rgba(158, 110, 26, 0.13)"
      );

      // Travelling energy pulses along core edges
      for (const pkt of pulses) {
        pkt.progress = (pkt.progress + dt * pkt.speed) % 1;
        const [aIdx, bIdx] = CORE_EDGES[pkt.edgeIdx]!;
        const a = projCore[aIdx]!;
        const b = projCore[bIdx]!;
        const u = pkt.progress;
        const px = a.x + (b.x - a.x) * u;
        const py = a.y + (b.y - a.y) * u;

        ctx.beginPath();
        ctx.arc(px, py, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? "rgba(244, 206, 116, 0.55)"
          : "rgba(158, 110, 26, 0.42)";
        ctx.fill();
      }

      // Floating depth satellite nodes
      for (const node of AMBIENT_NODES) {
        const p = project3D(
          node.x * scaleFactor,
          node.y * scaleFactor,
          node.z * scaleFactor,
          cx,
          cy,
          yaw * 0.5,
          pitch
        );
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = node.gold
          ? isDark
            ? "rgba(227, 180, 82, 0.42)"
            : "rgba(158, 110, 26, 0.34)"
          : isDark
            ? "rgba(248, 245, 238, 0.24)"
            : "rgba(22, 20, 18, 0.16)";
        ctx.fill();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(0);
    };

    window.addEventListener("resize", resize);
    resize();

    if (!reducedMotion) {
      const loop = (now: number) => {
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        paint(dt);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}

/**
 * Interactive 3D Perspective Card with cursor-tracked specular sheen.
 */
export function Tilt3DCard({
  children,
  className = "",
  maxTiltDeg = 5.5
}: {
  children: ReactNode;
  className?: string;
  maxTiltDeg?: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const nx = px / rect.width;
    const ny = py / rect.height;
    const rotY = (nx - 0.5) * 2 * maxTiltDeg;
    const rotX = (0.5 - ny) * 2 * maxTiltDeg;

    el.style.setProperty("--mx", `${px.toFixed(1)}px`);
    el.style.setProperty("--my", `${py.toFixed(1)}px`);
    el.style.transform = `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`;
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)"
      }}
      className={`tilt-card-host relative ${className}`}
    >
      <span aria-hidden="true" className="tilt-sheen" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/**
 * Clean 3D entrance animation triggered once when entering viewport.
 */
export function Reveal3D({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-3d ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
