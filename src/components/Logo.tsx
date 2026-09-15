interface LogoProps {
  /** pixel size of the square mark */
  size?: number;
  /** render the wordmark next to the mark */
  wordmark?: boolean;
  className?: string;
  /** animate the return path drawing in */
  animate?: boolean;
}

/**
 * BackSoon brand mark — a "return arc": a path departs from a solid origin dot,
 * arcs away, and loops back with an arrowhead pointing home. The visual metaphor
 * for departure → coverage → return.
 */
export function LogoMark({ size = 28, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* return arc */}
      <path
        d="M9 23 C 2 16, 6 5, 16 5 C 26 5, 30 16, 23 23"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        style={
          animate
            ? {
                strokeDasharray: 70,
                strokeDashoffset: 70,
                animation: 'bs-draw 1.1s cubic-bezier(0.22,1,0.36,1) forwards',
              }
            : undefined
        }
      />
      {/* arrowhead returning home */}
      <path
        d="M23 23 L 23 17 M23 23 L 29 23"
        stroke="var(--color-warm)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* origin dot (home) */}
      <circle cx="9" cy="23" r="3.4" fill="var(--color-ink)" />
    </svg>
  );
}

export default function Logo({ size = 26, wordmark = true, className = '', animate = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} animate={animate} />
      {wordmark && (
        <span className="font-display font-700 tracking-tight text-foreground leading-none">
          Back<span className="text-accent">Soon</span>
        </span>
      )}
    </span>
  );
}
