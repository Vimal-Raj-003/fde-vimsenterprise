export type Icon3DName =
  | "brain"
  | "database"
  | "cloud"
  | "agent"
  | "code"
  | "rocket"
  | "award"
  | "calendar"
  | "language"
  | "shield"
  | "portfolio"
  | "check";

interface Icon3DProps {
  name: Icon3DName;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<Icon3DProps["size"]>, string> = {
  sm: "h-9 w-9 rounded-xl",
  md: "h-12 w-12 rounded-2xl",
  lg: "h-14 w-14 rounded-2xl"
};

const SVG_SIZES: Record<NonNullable<Icon3DProps["size"]>, number> = {
  sm: 18,
  md: 24,
  lg: 28
};

function renderIconGlyph(name: Icon3DName, px: number) {
  const common = {
    width: px,
    height: px,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const
  };

  switch (name) {
    case "brain":
      return (
        <svg {...common}>
          <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
          <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1 1.32 4.24 3 3 0 0 1-.34 5.58 2.5 2.5 0 0 1-2.96 3.08 2.5 2.5 0 0 1-4.91.05L12 20" />
        </svg>
      );
    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14a9 3 0 0 0 18 0V5" />
          <path d="M3 12a9 3 0 0 0 18 0" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
    case "agent":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none" />
          <path d="M9 15c1.5 1 4.5 1 6 0" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="13.5" y1="4.5" x2="10.5" y2="19.5" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "award":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "language":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8" />
          <path d="M3.6 15h16.8" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "portfolio":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2.5" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 13h18" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
  }
}

/**
 * Sculpted metallic-bevel 3D icon badge with specular top highlight and gold depth shadow.
 */
export function Icon3D({ name, size = "md", className = "" }: Icon3DProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center border border-[var(--border-gold)] transition-transform duration-300 group-hover:scale-105 ${SIZE_CLASSES[size]} ${className}`}
      style={{
        background:
          "linear-gradient(145deg, var(--accent-gold-bright) 0%, var(--accent-gold-deep) 100%)",
        color: "#FFFFFF",
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.28), 0 8px 18px rgba(158, 110, 26, 0.28)"
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-t-xl opacity-35"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)"
        }}
      />
      <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
        {renderIconGlyph(name, SVG_SIZES[size])}
      </span>
    </span>
  );
}
