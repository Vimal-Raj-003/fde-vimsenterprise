import { useEffect, useRef, type ReactNode } from "react";

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
  focal = 560,
  camZ = 700
) {
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

const NODES = [
  { x: -320, y: -140, z: -100, gold: true },
  { x: -165, y: -200, z: 90, gold: false },
  { x: -225, y: 95, z: 75, gold: false },
  { x: -40, y: -40, z: -135, gold: true },
  { x: 35, y: 140, z: 115, gold: false },
  { x: 155, y: -135, z: 55, gold: true },
  { x: 215, y: 50, z: -110, gold: false },
  { x: 325, y: -65, z: 85, gold: true },
  { x: 300, y: 150, z: -40, gold: false },
  { x: -95, y: 185, z: -90, gold: true }
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [3, 4],
  [4, 6],
  [5, 7],
  [6, 8],
  [7, 8],
  [9, 4]
];

/**
 * Seamless Light Warm-Ivory 3D Constellation & Champagne/Plum-Rose Wash Canvas.
 * Runs continuously behind every section so transitions feel smooth and unbroken.
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

    let baseYaw = 0.2;
    let ptrX = 0;
    let ptrY = 0;
    let smoothX = 0;
    let smoothY = 0;

    const pulses = EDGES.map((_, idx) => ({
      edgeIdx: idx,
      progress: (idx * 0.19) % 1,
      speed: 0.13 + (idx % 4) * 0.035,
      gold: idx % 2 === 0
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

      baseYaw += dt * 0.065;
      smoothX = damp(smoothX, ptrX, 2.8, dt || 0.016);
      smoothY = damp(smoothY, ptrY, 2.8, dt || 0.016);

      // Soft warm champagne top-right ambient wash
      const g1 = ctx.createRadialGradient(
        width * 0.78,
        height * 0.2,
        20,
        width * 0.78,
        height * 0.2,
        Math.max(width, height) * 0.58
      );
      g1.addColorStop(0, "rgba(181, 131, 56, 0.07)");
      g1.addColorStop(0.55, "rgba(106, 36, 76, 0.035)");
      g1.addColorStop(1, "rgba(250, 246, 240, 0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Satin plum-rose lower-left ambient wash
      const g2 = ctx.createRadialGradient(
        width * 0.18,
        height * 0.76,
        20,
        width * 0.18,
        height * 0.76,
        Math.max(width, height) * 0.54
      );
      g2.addColorStop(0, "rgba(106, 36, 76, 0.055)");
      g2.addColorStop(0.6, "rgba(181, 131, 56, 0.03)");
      g2.addColorStop(1, "rgba(250, 246, 240, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      const yaw = baseYaw + smoothX * 0.2;
      const pitch = -0.12 + smoothY * 0.12;
      const cx = width * 0.5;
      const cy = height * 0.46;
      const scaleFactor = width < 640 ? 0.68 : 1.08;

      const projected = NODES.map((n) =>
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

      for (const [aIdx, bIdx] of EDGES) {
        const a = projected[aIdx]!;
        const b = projected[bIdx]!;
        const midX = (a.x + b.x) * 0.5;
        const midY = (a.y + b.y) * 0.5 - 18;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(midX, midY, b.x, b.y);
        ctx.strokeStyle = "rgba(106, 36, 76, 0.075)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (const pkt of pulses) {
        pkt.progress = (pkt.progress + dt * pkt.speed) % 1;
        const [aIdx, bIdx] = EDGES[pkt.edgeIdx]!;
        const a = projected[aIdx]!;
        const b = projected[bIdx]!;
        const midX = (a.x + b.x) * 0.5;
        const midY = (a.y + b.y) * 0.5 - 18;
        const u = pkt.progress;
        const q = 1 - u;
        const px = q * q * a.x + 2 * q * u * midX + u * u * b.x;
        const py = q * q * a.y + 2 * q * u * midY + u * u * b.y;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pkt.gold
          ? "rgba(181, 131, 56, 0.45)"
          : "rgba(106, 36, 76, 0.38)";
        ctx.fill();
      }

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i]!;
        const node = NODES[i]!;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = node.gold
          ? "rgba(181, 131, 56, 0.34)"
          : "rgba(34, 25, 29, 0.16)";
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

export function Tilt3DCard({
  children,
  className = "",
  maxTiltDeg = 3.5
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
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const rotY = (nx - 0.5) * 2 * maxTiltDeg;
    const rotX = (0.5 - ny) * 2 * maxTiltDeg;

    el.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(3px)`;
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
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
      className={`relative ${className}`}
    >
      {children}
    </div>
  );
}
