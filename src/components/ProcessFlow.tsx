import { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * Self-playing flowchart of how BackSoon works. Shows step names only — the
 * presenter does the narrating. Sections follow the pitch script:
 *   0  BackSoon
 *   1  Need a shift covered: post → matched → choose → manager approves → covered
 *   2  Looking for work: set profile → find shifts → (into matching)
 * A longer pause at the end of each section leaves room to talk.
 */

const SECTIONS: string[][] = [
  ['brand'],
  ['l1', 'post', 'a1', 'match', 'a2', 'choose', 'a3', 'approve', 'a4', 'covered'],
  ['l2', 'profile', 'c1', 'c2', 'c3', 'c4', 'a5', 'find', 'a6', 'hot:match'],
];

const SECTION_PAUSE = 2600;

function beat(id: string): number {
  if (id.startsWith('a')) return 300;
  if (id.startsWith('l')) return 500;
  if (id.startsWith('c') && id.length === 2) return 260;
  return 900;
}

interface Step {
  id: string;
  section: number;
  wait: number;
}

const STEPS: Step[] = SECTIONS.flatMap((ids, section) =>
  ids.map((id, i) => ({ id, section, wait: i === ids.length - 1 ? SECTION_PAUSE : beat(id) })),
);

const NODE_IDS = new Set(['post', 'match', 'choose', 'approve', 'covered', 'profile', 'find']);

interface ProcessFlowProps {
  /** 'inView' starts when scrolled to; 'immediate' starts on mount */
  start?: 'inView' | 'immediate';
  /** 'minimal' shows a replay link; 'full' adds pause, next section and pace */
  controls?: 'minimal' | 'full';
  /** Space pause/play · R replay · → next section */
  keyboard?: boolean;
}

export default function ProcessFlow({ start = 'inView', controls = 'minimal', keyboard = false }: ProcessFlowProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const markerId = `bsflow${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const [shown, setShown] = useState(reduced ? STEPS.length : 0);
  const [playing, setPlaying] = useState(!reduced && start === 'immediate');
  const [pace, setPace] = useState(1);
  const done = shown >= STEPS.length;

  useEffect(() => {
    if (start !== 'inView' || reduced) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [start, reduced]);

  useEffect(() => {
    if (!playing) return;
    if (done) {
      setPlaying(false);
      return;
    }
    const delay = shown === 0 ? 300 : STEPS[shown - 1].wait / pace;
    const t = window.setTimeout(() => setShown(s => s + 1), delay);
    return () => window.clearTimeout(t);
  }, [playing, shown, pace, done]);

  const replay = () => {
    setShown(0);
    setPlaying(true);
  };
  const toggle = () => {
    if (done) replay();
    else setPlaying(p => !p);
  };
  const nextSection = () => {
    const current = shown === 0 ? -1 : STEPS[shown - 1].section;
    const endOf = (section: number) => {
      const last = STEPS.map(s => s.section).lastIndexOf(section);
      return last === -1 ? STEPS.length : last + 1;
    };
    const endCurrent = current === -1 ? 0 : endOf(current);
    setShown(shown < endCurrent ? endCurrent : Math.min(STEPS.length, endOf(current + 1)));
  };

  useEffect(() => {
    if (!keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggle();
      } else if (e.key.toLowerCase() === 'r') {
        replay();
      } else if (e.key === 'ArrowRight') {
        nextSection();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const revealed = STEPS.slice(0, shown);
  const on = new Set(revealed.map(s => s.id));
  const lastNode = [...revealed].reverse().find(s => NODE_IDS.has(s.id) || s.id.startsWith('hot:'));
  const hot = done ? null : lastNode?.id.replace('hot:', '') ?? null;

  const item = (id: string) => `bs-flow-item${on.has(id) ? ' is-on' : ''}`;
  const arrow = (id: string) => `bs-flow-arrow${on.has(id) ? ' is-on' : ''}`;

  const Node = ({
    id, x, y, w = 112, lines, tone = 'plain',
  }: { id: string; x: number; y: number; w?: number; lines: string[]; tone?: 'plain' | 'approve' | 'covered' }) => {
    const isHot = hot === id;
    const fill = tone === 'covered' ? 'var(--color-accent)' : tone === 'approve' ? 'var(--color-warm-light)' : 'var(--color-card)';
    const stroke = isHot ? 'var(--color-accent)' : tone === 'covered' ? 'var(--color-accent)' : 'var(--color-border)';
    const text = tone === 'covered' ? 'var(--color-accent-foreground)' : 'var(--color-foreground)';
    const cy = y + 22;
    return (
      <g className={item(id)}>
        <rect x={x} y={y} width={w} height={44} rx={8} fill={fill} stroke={stroke} strokeWidth={isHot ? 2 : 1} />
        {lines.map((line, i) => (
          <text
            key={line}
            x={x + w / 2}
            y={cy + 4.5 + (i - (lines.length - 1) / 2) * 15}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill={text}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  const Arrow = ({ id, d }: { id: string; d: string }) => (
    <g className={item(id)}>
      <path
        className={arrow(id)}
        d={d}
        stroke="var(--color-accent)"
        strokeWidth="2"
        fill="none"
        markerEnd={`url(#${markerId})`}
      />
    </g>
  );

  const Chip = ({ id, x, y, label }: { id: string; x: number; y: number; label: string }) => (
    <g className={item(id)}>
      <rect x={x} y={y} width={84} height={24} rx={12} fill="var(--color-accent-light)" />
      <text x={x + 42} y={y + 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-deep)">
        {label}
      </text>
    </g>
  );

  const Label = ({ id, y, text }: { id: string; y: number; text: string }) => (
    <text className={item(id)} x={20} y={y} fontSize="12" fontWeight="700" fill="var(--color-deep)">
      {text}
    </text>
  );

  return (
    <div ref={rootRef}>
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <svg
          viewBox="0 0 680 352"
          className="w-full min-w-[620px] font-display"
          role="img"
          aria-label="How BackSoon works: a student who needs a shift covered posts it, gets matched with suitable students, chooses one, their manager approves, and the shift is covered. Students looking for work set their availability, experience, work type and wage, then find shifts."
        >
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          {/* 0 — BackSoon */}
          <g className={item('brand')}>
            <text x="340" y="40" textAnchor="middle" fontSize="30" fontWeight="700" letterSpacing="-0.5">
              <tspan fill="var(--color-accent)">B</tspan>
              <tspan fill="var(--color-warm)">ack</tspan>
              <tspan fill="var(--color-accent)">S</tspan>
              <tspan fill="var(--color-warm)">oon</tspan>
            </text>
            <path d="M285 52 Q338 72 393 50" fill="none" stroke="var(--color-accent)" strokeWidth="2.6" strokeLinecap="round" markerEnd={`url(#${markerId})`} />
          </g>

          {/* 1 — need a shift covered */}
          {Label({ id: 'l1', y: 100, text: 'Need a shift covered' })}
          {Node({ id: 'post', x: 20, y: 112, lines: ['Post shift'] })}
          {Arrow({ id: 'a1', d: 'M134 134H148' })}
          {Node({ id: 'match', x: 152, y: 112, lines: ['Get matched'] })}
          {Arrow({ id: 'a2', d: 'M266 134H280' })}
          {Node({ id: 'choose', x: 284, y: 112, lines: ['Choose one'] })}
          {Arrow({ id: 'a3', d: 'M398 134H412' })}
          {Node({ id: 'approve', x: 416, y: 112, lines: ['Manager', 'approves'], tone: 'approve' })}
          {Arrow({ id: 'a4', d: 'M530 134H544' })}
          {Node({ id: 'covered', x: 548, y: 112, lines: ['Covered ✓'], tone: 'covered' })}

          {/* 2 — looking for work */}
          {Label({ id: 'l2', y: 218, text: 'Looking for work' })}
          {Node({ id: 'profile', x: 20, y: 230, lines: ['Set profile'] })}
          {Chip({ id: 'c1', x: 0, y: 284, label: 'Availability' })}
          {Chip({ id: 'c2', x: 88, y: 284, label: 'Experience' })}
          {Chip({ id: 'c3', x: 0, y: 314, label: 'Work type' })}
          {Chip({ id: 'c4', x: 88, y: 314, label: 'Wage' })}
          {Arrow({ id: 'a5', d: 'M134 252H148' })}
          {Node({ id: 'find', x: 152, y: 230, lines: ['Find shifts'] })}
          {Arrow({ id: 'a6', d: 'M208 228V160' })}
        </svg>
      </div>

      {controls === 'minimal' ? (
        done && (
          <div className="mt-4 flex justify-end">
            <button onClick={replay} className="text-xs font-medium text-accent hover:underline">
              Replay ↺
            </button>
          </div>
        )
      ) : (
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <button
            onClick={toggle}
            className="px-3 py-1.5 rounded-lg border border-border bg-card font-medium hover:bg-secondary transition-colors"
          >
            {done ? 'Replay' : playing ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={nextSection}
            className="px-3 py-1.5 rounded-lg border border-border bg-card font-medium hover:bg-secondary transition-colors"
          >
            Next section →
          </button>
          <button
            onClick={replay}
            className="px-3 py-1.5 rounded-lg border border-border bg-card font-medium hover:bg-secondary transition-colors"
          >
            Replay ↺
          </button>
          <label className="flex items-center gap-2 ml-auto text-muted-foreground">
            Pace
            <input
              type="range"
              min="0.5"
              max="1.6"
              step="0.1"
              value={pace}
              onChange={e => setPace(parseFloat(e.target.value))}
              className="accent-[var(--color-accent)]"
            />
            <span className="w-9 text-foreground">{pace.toFixed(1)}×</span>
          </label>
          {keyboard && (
            <p className="w-full text-xs text-muted-foreground">Space pause · → next section · R replay</p>
          )}
        </div>
      )}
    </div>
  );
}
