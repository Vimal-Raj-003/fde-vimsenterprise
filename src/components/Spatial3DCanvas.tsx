import { useEffect, useRef, type ReactNode } from "react";

export function damp(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-dt * rate));
}

export interface Projected3D {
  x: number;
  y: number;
  scale: number;
  z: number;
}

export function project3D(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  yaw: number,
  pitch: number,
  focal = 560,
  camZ = 700
): Projected3D {
  const cry = Math.cos(yaw);
  const sry = Math.sin(yaw);
  const crx = Math.cos(pitch);
  const srx = Math.sin(pitch);

  const x1 = x * cry + z * sry;
  const z1 = -x * sry + z * cry;
  const y2 = y * crx - z1 * srx;
  const z2 = y * srx + z1 * crx;
  const denom = Math.max(140, z2 + camZ);
  const k = focal / denom;

  return {
    x: cx + x1 * k,
    y: cy + y2 * k,
    scale: k / (focal / camZ),
    z: z2
  };
}

interface LuxuryNode {
  x: number;
  y: number;
  z: number;
  gold: boolean;
}

interface DustMote {
  x: number;
  y: number;
  z: number;
  radius: number;
  driftSpeed: number;
  phase: number;
  gold: boolean;
}

const CONSTELLATION_NODES: LuxuryNode[] = [
  { x: -320, y: -150, z: -110, gold: true },
  { x: -170, y: -210, z: 95, gold: false },
  { x: -230, y: 95, z: 75, gold: false },
  { x: -45, y: -45, z: -145, gold: true },
  { x: 35, y: 145, z: 120, gold: false },
  { x: 155, y: -140, z: 55, gold: true },
  { x: 215, y: 50, z: -115, gold: false },
  { x: 330, y: -70, z: 85, gold: true },
  { x: 310, y: 155, z: -40, gold: false },
  { x: -95, y: 195, z: -95, gold: true },
  { x: 90, y: -225, z: -70, gold: false },
  { x: -345, y: 20, z: -155, gold: false }
];

const CONSTELLATION_EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 11],
  [11, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [3, 4],
  [4, 6],
  [5, 10],
  [10, 7],
  [5, 7],
  [6, 8],
  [7, 8],
  [9, 4],
  [9, 6]
];

/**
 * Full-Viewport Seamless 3D Luxury Atmospheric Canvas.
 * Fixed across the entire experience so sections flow continuously without a single seam or cut.
 */
export function FullPageLuxuryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    let baseYaw = 0.18;
    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let scrollOffset = 0;
    let smoothScroll = 0;

    const motes: DustMote[] = Array.from({ length: 34 }).map((_, i) => ({
      x: ((i * 97) % 100) / 100,
      y: ((i * 53) % 100) / 100,
      z: 0.4 + ((i * 31) % 60) / 60,
      radius: 0.8 + (i % 3) * 0.65,
      driftSpeed: 0.008 + (i % 5) * 0.003,
      phase: i * 0.7,
      gold: i % 2 === 0
    }));

    const pulses = CONSTELLATION_EDGES.map((_, idx) => ({
      edgeIdx: idx,
      progress: (idx * 0.17) % 1,
      speed: 0.11 + (idx % 4) * 0.035,
      gold: idx % 2 === 0
    }));

    const onPointerMove = (e: PointerEvent) => {
      if (!width || !height) return;
      pointerX = (e.clientX / width - 0.5) * 2;
      pointerY = (e.clientY / height - 0.5) * 2;
    };

    const onScroll = () => {
      scrollOffset = window.scrollY * 0.00045;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const paint = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 40 || height < 40) return;

      baseYaw += dt * 0.055;
      smoothX = damp(smoothX, pointerX, 2.8, dt || 0.016);
      smoothY = damp(smoothY, pointerY, 2.8, dt || 0.016);
      smoothScroll = damp(smoothScroll, scrollOffset, 3.2, dt || 0.016);

      // 1. Soft atmospheric emerald & champagne gold ambient light pools
      const pool1X = width * (0.72 + smoothX * 0.04);
      const pool1Y = height * (0.28 + smoothY * 0.04);
      const grad1 = ctx.createRadialGradient(
        pool1X,
        pool1Y,
        20,
        pool1X,
        pool1Y,
        Math.max(width, height) * 0.62
      );
      grad1.addColorStop(0, "rgba(38, 88, 68, 0.24)");
      grad1.addColorStop(0.5, "rgba(21, 48, 38, 0.11)");
      grad1.addColorStop(1, "rgba(11, 19, 16, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const pool2X = width * (0.22 - smoothX * 0.03);
      const pool2Y = height * (0.74 - smoothY * 0.03);
      const grad2 = ctx.createRadialGradient(
        pool2X,
        pool2Y,
        10,
        pool2X,
        pool2Y,
        Math.max(width, height) * 0.52
      );
      grad2.addColorStop(0, "rgba(212, 175, 122, 0.085)");
      grad2.addColorStop(0.55, "rgba(32, 68, 54, 0.06)");
      grad2.addColorStop(1, "rgba(11, 19, 16, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Depth-of-field floating luminous gold & jade dust motes
      for (const m of motes) {
        m.y -= dt * m.driftSpeed * m.z;
        if (m.y < -0.05) m.y = 1.05;
        const mx = (m.x + Math.sin(baseYaw * 2 + m.phase) * 0.015 + smoothX * 0.012 * m.z) * width;
        const my = ((m.y - (smoothScroll * 0.35 * m.z) % 1 + 1) % 1) * height;
        const alpha = 0.12 + m.z * 0.22;

        ctx.beginPath();
        ctx.arc(mx, my, m.radius * m.z * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = m.gold
          ? `rgba(212, 175, 122, ${alpha.toFixed(3)})`
          : `rgba(82, 183, 136, ${(alpha * 0.75).toFixed(3)})`;
        ctx.fill();
      }

      // 3. 3D Rotating Architectural Silk Constellation
      const yaw = baseYaw + smoothX * 0.22 + smoothScroll * 0.65;
      const pitch = -0.12 + smoothY * 0.14;
      const cx = width >= 1024 ? width * 0.56 : width * 0.5;
      const cy = height * 0.48;
      const scaleFactor = width < 640 ? 0.65 : width < 1024 ? 0.88 : 1.12;

      const projected = CONSTELLATION_NODES.map((n) =>
        project3D(
          n.x * scaleFactor,
          n.y * scaleFactor,
          n.z * scaleFactor,
          cx,
          cy,
          yaw,
          pitch
        )
      );

      for (const [aIdx, bIdx] of CONSTELLATION_EDGES) {
        const a = projected[aIdx]!;
        const b = projected[bIdx]!;
        const midX = (a.x + b.x) * 0.5;
        const midY = (a.y + b.y) * 0.5 - 22 * ((a.scale + b.scale) * 0.5);
        const alpha = Math.max(0.03, Math.min(0.14, ((a.scale + b.scale) * 0.5) * 0.095));

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(midX, midY, b.x, b.y);
        ctx.strokeStyle = `rgba(212, 175, 122, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      for (const pkt of pulses) {
        pkt.progress = (pkt.progress + dt * pkt.speed) % 1;
        const [aIdx, bIdx] = CONSTELLATION_EDGES[pkt.edgeIdx]!;
        const a = projected[aIdx]!;
        const b = projected[bIdx]!;
        const midX = (a.x + b.x) * 0.5;
        const midY = (a.y + b.y) * 0.5 - 22 * ((a.scale + b.scale) * 0.5);

        const u = pkt.progress;
        const q = 1 - u;
        const px = q * q * a.x + 2 * q * u * midX + u * u * b.x;
        const py = q * q * a.y + 2 * q * u * midY + u * u * b.y;
        const r = Math.max(1.4, 2.5 * ((a.scale + b.scale) * 0.5));

        ctx.beginPath();
        ctx.arc(px, py, r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = pkt.gold
          ? "rgba(212, 175, 122, 0.12)"
          : "rgba(82, 183, 136, 0.11)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = pkt.gold
          ? "rgba(229, 197, 148, 0.65)"
          : "rgba(82, 183, 136, 0.62)";
        ctx.fill();
      }

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i]!;
        const node = CONSTELLATION_NODES[i]!;
        const r = Math.max(1.8, 3.2 * p.scale);
        const alpha = Math.max(0.12, Math.min(0.46, p.scale * 0.36));

        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 3, 0, Math.PI * 2);
        ctx.strokeStyle = node.gold
          ? `rgba(212, 175, 122, ${(alpha * 0.55).toFixed(3)})`
          : `rgba(245, 241, 232, ${(alpha * 0.3).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.gold
          ? `rgba(212, 175, 122, ${alpha.toFixed(3)})`
          : `rgba(245, 241, 232, ${(alpha * 0.7).toFixed(3)})`;
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
      if (reducedMotion) paint(0);
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
      window.removeEventListener("scroll", onScroll);
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
 * Tactile 3D Perspective Specular Tilt Wrapper with Warm Champagne Sheen.
 */
export function Tilt3DCard({
  children,
  className = "",
  maxTiltDeg = 4.2
}: {
  children: ReactNode;
  className?: string;
  maxTiltDeg?: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const rotY = (nx - 0.5) * 2 * maxTiltDeg;
    const rotX = (0.5 - ny) * 2 * maxTiltDeg;

    el.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(4px)`;
    if (sheenRef.current) {
      sheenRef.current.style.opacity = "1";
      sheenRef.current.style.background = `radial-gradient(460px circle at ${(nx * 100).toFixed(1)}% ${(ny * 100).toFixed(1)}%, rgba(212,175,122,0.10), transparent 62%)`;
    }
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    if (sheenRef.current) {
      sheenRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)"
      }}
      className={`relative ${className}`}
    >
      <div
        ref={sheenRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
      />
      {children}
    </div>
  );
}
