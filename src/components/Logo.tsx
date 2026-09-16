import { useLayoutEffect, useRef, useState } from 'react';

interface LogoProps {
  /** approximate cap size in px; scales the wordmark */
  size?: number;
  /** kept for call-site compatibility — the logo is the wordmark */
  wordmark?: boolean;
  className?: string;
  /** draw the swoosh in */
  animate?: boolean;
}

/** Chevron arrowhead at `end`, pointing away from control point `ctrl`. */
function arrowhead(ex: number, ey: number, cx: number, cy: number, len: number) {
  const dx = ex - cx;
  const dy = ey - cy;
  const m = Math.hypot(dx, dy) || 1;
  const bx = -dx / m;
  const by = -dy / m;
  const c = Math.cos(0.62);
  const s = Math.sin(0.62);
  const ax = ex + (bx * c - by * s) * len;
  const ay = ey + (bx * s + by * c) * len;
  const zx = ex + (bx * c + by * s) * len;
  const zy = ey + (-bx * s + by * c) * len;
  return `M${ax} ${ay} L${ex} ${ey} L${zx} ${zy}`;
}

/**
 * BackSoon compact mark — a red B with the swoosh running under it.
 * Used where the full wordmark doesn't fit: inline icons, badges, favicon.
 */
export function LogoMark({ size = 28, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontFamily="Montserrat, ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="var(--color-accent)"
      >
        B
      </text>
      <path
        d="M6 25 Q16 31 26 25"
        stroke="var(--color-accent)"
        strokeWidth="2.6"
        strokeLinecap="round"
        style={
          animate
            ? { strokeDasharray: 26, strokeDashoffset: 26, animation: 'bs-draw 1.1s cubic-bezier(0.22,1,0.36,1) forwards' }
            : undefined
        }
      />
      <path
        d="M22 24.7 L26 25 L24.4 28.7"
        stroke="var(--color-accent)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'bs-fade-late' : undefined}
      />
    </svg>
  );
}

interface Swoosh {
  w: number;
  h: number;
  d: string;
  head: string;
  stroke: number;
  len: number;
}

/**
 * "BackSoon" as set in the pitch — B and S in red, the rest in salmon — with
 * the swoosh arrow running from the B to the second O.
 *
 * The swoosh is measured from the rendered letters rather than hard-coded, so
 * it stays attached to the B and the O at any size and after the web font loads.
 */
export function Wordmark({
  className = '',
  swoosh = true,
  animate = false,
  style,
}: {
  className?: string;
  swoosh?: boolean;
  animate?: boolean;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const bRef = useRef<HTMLSpanElement | null>(null);
  const oRef = useRef<HTMLSpanElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [geo, setGeo] = useState<Swoosh | null>(null);

  useLayoutEffect(() => {
    if (!swoosh) return;
    const wrap = wrapRef.current;
    const b = bRef.current;
    const o = oRef.current;
    if (!wrap || !b || !o) return;

    const measure = () => {
      const W = wrap.getBoundingClientRect();
      const B = b.getBoundingClientRect();
      const O = o.getBoundingClientRect();
      if (!W.width || !O.height) return;
      const h = O.height;
      const bottom = O.top - W.top + h * 0.86;
      const xs = B.left - W.left + B.width * 0.3;
      const xe = O.left - W.left + O.width * 0.9;
      const ys = bottom + h * 0.1;
      const cx = (xs + xe) / 2;
      const cy = bottom + h * 0.55;
      const ye = bottom + h * 0.05;
      const stroke = Math.max(1.8, h * 0.075);
      const d = `M${xs} ${ys} Q${cx} ${cy} ${xe} ${ye}`;
      setGeo({
        w: W.width,
        h: W.height,
        d,
        head: arrowhead(xe, ye, cx, cy, h * 0.17),
        stroke,
        len: 0,
      });
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [swoosh]);

  // length is only known once the path is in the DOM
  useLayoutEffect(() => {
    if (!geo || geo.len || !pathRef.current) return;
    const len = Math.ceil(pathRef.current.getTotalLength()) + 2;
    setGeo(g => (g ? { ...g, len } : g));
  }, [geo]);

  return (
    <span
      ref={wrapRef}
      className={`relative inline-block font-display font-700 tracking-tight leading-none ${className}`}
      style={{ paddingBottom: swoosh ? '0.34em' : undefined, ...style }}
    >
      <span ref={bRef} className="text-accent">B</span>
      <span className="text-warm">ack</span>
      <span className="text-accent">S</span>
      <span className="text-warm">o</span>
      <span ref={oRef} className="text-warm">o</span>
      <span className="text-warm">n</span>

      {swoosh && geo && (
        <svg
          width={geo.w}
          height={geo.h}
          className="absolute left-0 top-0 overflow-visible pointer-events-none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d={geo.d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={geo.stroke}
            strokeLinecap="round"
            style={
              !animate
                ? undefined
                : geo.len
                  ? {
                      strokeDasharray: geo.len,
                      strokeDashoffset: geo.len,
                      animation: 'bs-draw 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s forwards',
                    }
                  : { opacity: 0 }
            }
          />
          <path
            d={geo.head}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={geo.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animate ? 'bs-fade-late' : undefined}
          />
        </svg>
      )}
    </span>
  );
}

export default function Logo({ size = 26, className = '', animate = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Wordmark animate={animate} style={{ fontSize: `${Math.round(size * 0.8)}px` }} />
    </span>
  );
}
