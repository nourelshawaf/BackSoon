import { useEffect, useRef, useState } from 'react';
import type { View } from '../types';
import Logo, { LogoMark, Wordmark } from '../components/Logo';
import { nadeenHero, storyBeats } from '../imports/nadeen';

interface LandingProps {
  onNavigate: (view: View) => void;
}

/* Reveal-on-scroll wrapper */
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bs-reveal ${seen ? 'bs-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Small hook: run a callback once the element is in view */
function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="bg-background text-foreground overflow-x-clip">
      <SectionScenario onNavigate={onNavigate} />
      <SectionStory />
      <SectionProblem />
      <SectionEvidence />
      <SectionTransition />
      <SectionHowItWorks />
      <SectionProduct />
      <SectionTrust />
      <SectionReturn />
      <SectionTwoSides />
      <SectionFinalCTA onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

/* ───────────────────────── SECTION 1 — THE SCENARIO ───────────────────────── */
function SectionScenario({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 overflow-hidden">
      {/* ambient split canvas */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_85%_-10%,var(--color-accent-light),transparent_55%)]" />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <Reveal className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-warm inline-block bs-float" />
            Meet Nadeen — a student in Budapest
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display font-700 text-[2.6rem] sm:text-6xl lg:text-[4.2rem] leading-[1.02] tracking-tight mb-6">
              You can go away.
              <br />
              Your shift
              <br />
              <span className="text-accent">doesn't have to.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-9">
              Nadeen is going home to visit her family for three weeks. She’s
              thrilled — until she remembers the shifts already on her calendar.
            </p>
          </Reveal>
          <Reveal delay={240} className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('signup')}
              className="px-6 py-3.5 bg-accent text-accent-foreground font-medium text-sm rounded-lg hover:brightness-110 transition-all shadow-sm shadow-accent/30"
            >
              I need a shift covered
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="px-6 py-3.5 border border-border text-foreground font-medium text-sm rounded-lg hover:border-foreground/30 hover:bg-secondary transition-colors"
            >
              I want to cover shifts
            </button>
          </Reveal>
        </div>

        {/* Nadeen — the guide — with floating story UI */}
        <div ref={ref} className="relative flex items-center gap-3 sm:gap-5">
          {/* portrait */}
          <div
            className="relative flex-1 rounded-[1.75rem] overflow-hidden border border-border bg-accent-light shadow-[0_30px_70px_-30px_rgba(10,26,51,0.45)] bs-float"
            style={{
              clipPath: inView ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
              transition: 'clip-path 1s cubic-bezier(.22,1,.36,1)',
            }}
          >
            <img
              src={nadeenHero}
              alt="Nadeen, a student in Budapest, at the airport with her backpack and suitcase, ready to travel"
              className="w-full h-auto object-cover"
            />
            {/* handwritten-style note */}
            <div
              className="absolute top-4 left-4 rounded-xl bg-white/85 backdrop-blur px-3 py-2 shadow-sm"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(-8px)',
                transition: 'all .5s ease .9s',
              }}
            >
              <p className="font-display font-600 text-[13px] leading-tight text-ink">
                Same Nadeen.<br />Different places.<br />
                <span className="text-accent">Same goals.</span>
              </p>
            </div>

            {/* trip card that "moves in" */}
            <div
              className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-[82%] rounded-t-xl bg-ink/92 backdrop-blur text-white p-3.5"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translate(-50%,0)' : 'translate(-50%,28px)',
                transition: 'all .7s cubic-bezier(.22,1,.36,1) .5s',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-warm font-semibold">Trip</p>
                  <p className="font-display font-700 text-sm leading-tight">3 weeks with family</p>
                </div>
                <span className="text-[11px] text-white/70">departs Sep 24 ✈</span>
              </div>
            </div>
          </div>

          {/* Away → Covered → Back rail */}
          <div className="flex flex-col gap-3 shrink-0">
            {[
              { label: 'Away', icon: '✈', active: true },
              { label: 'Covered', icon: <LogoMark size={16} />, active: false },
              { label: 'Back', icon: '⌂', active: false },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 w-16 py-2.5 rounded-xl bg-card border border-border shadow-sm"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'none' : 'translateX(14px)',
                  transition: `all .5s cubic-bezier(.22,1,.36,1) ${0.7 + i * 0.18}s`,
                }}
              >
                <span className="text-base leading-none flex items-center justify-center h-5 text-accent">{s.icon}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── SECTION 1.5 — FOLLOW NADEEN (static grid) ─────────────────── */
function SectionStory() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-secondary overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-12">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">Follow Nadeen</p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl leading-tight">
            Eight moments, one journey.
          </h2>
          <p className="text-muted-foreground mt-4">
            Nadeen’s story — from packing her bag to picking her shifts back up.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {storyBeats.map((b) => (
            <div key={b.step} className="group">
              <div className="relative rounded-xl overflow-hidden border border-border bg-accent-light aspect-[250/162] shadow-sm">
                <img
                  src={b.img}
                  alt={`Nadeen — ${b.title}: ${b.caption}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 font-display font-700 text-xs text-white bg-ink/70 backdrop-blur rounded-md px-1.5 py-0.5">
                  {b.step}
                </span>
                {b.step === '04' && (
                  <span className="absolute top-[19%] right-[13%] flex items-center justify-center w-[23%] aspect-square rounded-lg bg-white">
                    <LogoMark size={26} />
                  </span>
                )}
              </div>
              <h3 className="font-display font-700 text-sm mt-3">{b.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION 2 — THE PROBLEM ───────────────────────── */
function SectionProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const attempts = [
    { channel: 'WhatsApp', msg: 'Hey, can anyone cover my shift?', result: 'Seen. No reply.', r: -6, x: '4%', y: '2%' },
    { channel: 'Friends', msg: 'You free the 25th?', result: 'All busy with exams.', r: 4, x: '38%', y: '14%' },
    { channel: 'Facebook group', msg: 'Looking for shift cover…', result: 'Buried under 200 posts.', r: -3, x: '10%', y: '30%' },
    { channel: 'Manager', msg: 'Can I swap my shifts?', result: '“We need someone reliable.”', r: 6, x: '44%', y: '40%' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 bg-ink text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-xl">
          <p className="text-xs uppercase tracking-widest text-warm font-semibold mb-4">The problem</p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl leading-tight">
            So she starts asking around.
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-10 h-[340px] sm:h-[300px]">
          {attempts.map((a, i) => (
            <div
              key={a.channel}
              className="absolute w-64 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-4"
              style={{
                left: a.x,
                top: a.y,
                opacity: inView ? 1 : 0,
                transform: inView ? `rotate(${a.r}deg) translateY(0)` : 'rotate(0) translateY(24px)',
                transition: `all .55s cubic-bezier(.22,1,.36,1) ${i * 260}ms`,
              }}
            >
              <p className="text-[10px] uppercase tracking-wide text-white/40 font-semibold mb-1.5">{a.channel}</p>
              <p className="text-sm text-white/90">{a.msg}</p>
              <p className="text-xs text-warm mt-2">{a.result}</p>
            </div>
          ))}
        </div>

        <Reveal className="max-w-2xl mt-6">
          <p className="font-display font-700 text-2xl sm:text-3xl leading-snug">
            Finding <span className="text-white/40">someone</span> is easy.
            <br />
            Finding someone you <span className="text-accent-mid">trust</span> is the problem.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION 2b — THE EVIDENCE ─────────────────────────
 * Real figures only. Every number carries its source and, for our own
 * interviews, the sample size — nothing here is demo data.
 * ───────────────────────────────────────────────────────────────────────────── */
function SectionEvidence() {
  const facts = [
    {
      figure: '19 of 22',
      badge: '86%',
      body: 'students we interviewed said they would use BackSoon to get their shifts covered — after each semester and during their mandatory internship.',
      source: 'BackSoon in-person interviews with university students',
      href: undefined,
    },
    {
      figure: '68%',
      badge: undefined,
      body: 'of US hiring managers use staffing agencies — including to fill in for absent permanent staff.',
      source: 'Indeed Flex survey, August 2024',
      href: 'https://www.prnewswire.com/news-releases/us-businesses-lack-quality-temporary-workers-302229682.html',
    },
    {
      figure: '264M',
      badge: undefined,
      body: 'students are enrolled in higher education worldwide.',
      source: 'UNESCO, 2025',
      href: 'https://www.unesco.org/en/articles/record-number-higher-education-students-highlights-global-need-recognition-qualifications',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-xl">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">It’s not just Nadeen</p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl leading-tight">
            Students leave. Shifts stay. Businesses already pay to fill the gap.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {facts.map((f, i) => (
            <Reveal key={f.figure} delay={i * 120}>
              <div className="h-full flex flex-col bg-card border border-border rounded-xl p-6">
                <div className="flex items-baseline gap-3">
                  <p className="bs-figure text-4xl sm:text-5xl">{f.figure}</p>
                  {f.badge && (
                    <span className="text-sm font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-full">
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3 flex-1">{f.body}</p>
                <p className="text-xs text-muted-foreground/80 mt-5 pt-4 border-t border-border">
                  Source:{' '}
                  {f.href ? (
                    <a
                      href={f.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {f.source}
                    </a>
                  ) : (
                    f.source
                  )}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION 3 — THE TRANSITION ───────────────────────── */
function SectionTransition() {
  const [ref, inView] = useInView<SVGSVGElement>(0.5);
  const [headRef, headInView] = useInView<HTMLHeadingElement>(0.6);
  const stops = ['Away', 'Covered', 'Back'];
  return (
    <section className="py-28 px-4 sm:px-6 text-center bg-background">
      <Reveal className="flex flex-col items-center">
        <h2 ref={headRef} className="font-display font-700 text-5xl sm:text-7xl tracking-tight">
          <span className="block text-2xl sm:text-3xl text-muted-foreground mb-3">Meet</span>
          {/* remount when scrolled into view so the swoosh draws in front of the visitor */}
          <Wordmark key={headInView ? 'seen' : 'unseen'} animate />
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-md">
          Temporary coverage for when life takes you somewhere else.
        </p>
      </Reveal>

      {/* Away → Covered → Back path */}
      <div className="max-w-2xl mx-auto mt-14">
        <svg ref={ref} viewBox="0 0 600 120" className="w-full" aria-hidden="true">
          <path
            d="M60 90 C 180 -10, 420 -10, 540 90"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="620"
            strokeDashoffset={inView ? 0 : 620}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)' }}
          />
          {[60, 300, 540].map((cx, i) => (
            <circle
              key={cx}
              cx={cx}
              cy={i === 1 ? 15 : 90}
              r="7"
              fill={i === 1 ? 'var(--color-warm)' : 'var(--color-ink)'}
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity .4s ${0.5 + i * 0.35}s`,
              }}
            />
          ))}
        </svg>
        <div className="flex justify-between px-2 -mt-2">
          {stops.map((s, i) => (
            <span
              key={s}
              className={`font-display font-600 text-sm ${i === 1 ? 'text-warm' : 'text-ink'}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION 4 — HOW IT WORKS ───────────────────────── */
function SectionHowItWorks() {
  const steps = [
    { n: '01', title: 'Post', body: 'Nadeen’s hotel posts the open shifts — role, date, time, pay. Under two minutes.' },
    { n: '02', title: 'Match', body: 'BackSoon surfaces students whose availability, location and skills fit the shift.' },
    { n: '03', title: 'Choose', body: 'The employer reviews verified candidates, ratings and completed shifts — then picks.' },
    { n: '04', title: 'Covered', body: 'The shift flips from open to covered. The calendar updates. The trip goes ahead.' },
  ];
  return (
    <section className="py-24 px-4 sm:px-6 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">How BackSoon works</p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl max-w-lg leading-tight">
            Four steps from problem to peace of mind.
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px mt-12 bg-border rounded-2xl overflow-hidden border border-border">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100} className="bg-card p-7 flex flex-col">
              <span className="font-display font-700 text-2xl text-accent/30 mb-6">{s.n}</span>
              <h3 className="font-display font-700 text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION 5 — THE PRODUCT ───────────────────────── */
function SectionProduct() {
  const [applied, setApplied] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const candidates = [
    { id: 'c1', name: 'Nóra K.', uni: 'ELTE', match: 92, rating: 4.8, done: 12 },
    { id: 'c2', name: 'Bálint T.', uni: 'BME', match: 87, rating: 4.7, done: 8 },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-xl mb-12">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">The real product</p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl leading-tight">
            Two views. One covered shift.
          </h2>
          <p className="text-muted-foreground mt-4">
            Try it — apply as a student, then select a candidate as the business.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Student view */}
          <Reveal className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Student view</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-light text-accent">Hospitality</span>
                  <h3 className="font-display font-700 text-lg mt-2">Waitress</h3>
                  <p className="text-sm text-muted-foreground">Radisson Collection Hotel · Budapest V</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-700 text-2xl text-accent">92%</span>
                  <p className="text-xs text-muted-foreground">match</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <MiniStat label="Date" value="25 Sep" />
                <MiniStat label="Hours" value="16–22" />
                <MiniStat label="Pay" value="2 500 Ft/h" accent />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-success mb-4">
                <CheckIcon /> Student verified employer
              </div>
              <button
                onClick={() => setApplied((a) => !a)}
                className={`w-full py-2.5 text-sm font-medium rounded-lg transition-all ${
                  applied
                    ? 'bg-success/10 text-success border border-success/30'
                    : 'bg-accent text-accent-foreground hover:brightness-110'
                }`}
              >
                {applied ? 'Applied ✓' : 'Apply for this shift'}
              </button>
            </div>
          </Reveal>

          {/* Business view */}
          <Reveal delay={120} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Business view</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-700 text-lg">Waitress</h3>
                  <p className="text-sm text-muted-foreground">25 Sep · 16:00–22:00</p>
                </div>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full transition-colors ${
                    selected ? 'bg-success/10 text-success' : 'bg-warm-light text-warm'
                  }`}
                >
                  {selected ? 'Covered ✓' : 'Open'}
                </span>
              </div>
              <div className="space-y-2.5">
                {candidates.map((c) => {
                  const isSel = selected === c.id;
                  const isOther = selected && !isSel;
                  return (
                    <div
                      key={c.id}
                      className={`rounded-lg border p-3 transition-all ${
                        isSel ? 'border-success bg-success/5' : 'border-border'
                      } ${isOther ? 'opacity-40' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-light text-accent flex items-center justify-center text-xs font-semibold">
                          {c.name.split(' ').map((p) => p[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            {c.name}
                            <span className="text-success"><CheckIcon /></span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {c.uni} · ★ {c.rating} · {c.done} shifts
                          </p>
                        </div>
                        <span className="ml-auto font-display font-700 text-sm text-accent">{c.match}%</span>
                      </div>
                      <button
                        onClick={() => setSelected(isSel ? null : c.id)}
                        className={`w-full mt-3 py-2 text-xs font-medium rounded-md transition-all ${
                          isSel
                            ? 'bg-success text-white'
                            : 'bg-secondary text-foreground hover:bg-muted'
                        }`}
                      >
                        {isSel ? 'Selected — shift covered' : 'Select candidate'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION 6 — TRUST ───────────────────────── */
function SectionTrust() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const checks = [
    { label: 'Identity', value: 'Verified' },
    { label: 'Student status', value: 'ELTE · verified' },
    { label: 'Experience', value: 'Verified' },
    { label: 'Completed shifts', value: '12' },
    { label: 'Rating', value: '★ 4.8' },
  ];
  return (
    <section className="py-24 px-4 sm:px-6 bg-secondary">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">Trust</p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl leading-tight mb-4">
            Temporary doesn’t mean uncertain.
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Every candidate arrives with the signals an employer needs to say yes
            with confidence — checked and rated, shift after shift.
          </p>
        </Reveal>

        <div ref={ref} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-accent-light text-accent flex items-center justify-center font-semibold">NK</div>
            <div>
              <p className="font-display font-600">Nóra K.</p>
              <p className="text-xs text-muted-foreground">Waitress candidate</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {checks.map((c, i) => (
              <div
                key={c.label}
                className="flex items-center justify-between rounded-lg bg-secondary/70 px-3 py-2.5"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'none' : 'translateX(-8px)',
                  transition: `all .45s cubic-bezier(.22,1,.36,1) ${i * 200}ms`,
                }}
              >
                <span className="text-sm text-muted-foreground">{c.label}</span>
                <span className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                  {c.value}
                  <span
                    className="text-success"
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity .3s ${i * 200 + 200}ms`,
                    }}
                  >
                    <CheckIcon />
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION 7 — THE RETURN ───────────────────────── */
function SectionReturn() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-warm font-semibold mb-4">The return</p>
          <h2 className="font-display font-700 text-3xl sm:text-4xl leading-tight">
            The whole point of the name.
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-5 mt-12 text-left">
          <Reveal className="rounded-2xl border border-border bg-card p-7">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Day 1</p>
            <p className="font-display font-700 text-xl mb-3">Nadeen leaves to see family.</p>
            <span className="inline-flex items-center gap-1.5 text-sm text-success font-medium">
              <CheckIcon /> Shift covered
            </span>
          </Reveal>
          <Reveal delay={140} className="rounded-2xl border border-accent/30 bg-accent-light/40 p-7">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Day 21</p>
            <p className="font-display font-700 text-xl mb-3">Nadeen is back.</p>
            <span className="inline-flex items-center gap-1.5 text-sm text-accent font-medium">
              <LogoMark size={16} /> “You’re back.” Her shifts are hers again.
            </span>
          </Reveal>
        </div>
        <Reveal delay={200} className="mt-10 inline-flex items-center gap-3 text-sm font-display font-600 text-muted-foreground">
          <span>Go away</span>
          <ArrowIcon />
          <span className="text-warm">Covered</span>
          <ArrowIcon />
          <span className="text-foreground">Come back</span>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION 8 — TWO SIDES ───────────────────────── */
function SectionTwoSides() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  return (
    <section className="py-24 px-4 sm:px-6 bg-ink text-white overflow-hidden">
      <div ref={ref} className="max-w-5xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
        <Reveal className="text-right">
          <div className="inline-block rounded-2xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 max-w-xs ml-auto">
            <p className="text-[10px] uppercase tracking-widest text-accent-mid font-semibold mb-2">Student</p>
            <p className="font-display font-700 text-xl sm:text-2xl">“I need flexibility.”</p>
          </div>
        </Reveal>

        {/* connecting handoff */}
        <div className="relative flex flex-col items-center justify-center">
          <svg width="56" height="24" viewBox="0 0 56 24" aria-hidden="true">
            <path
              d="M2 12 H 54"
              stroke="var(--color-warm)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="52"
              strokeDashoffset={inView ? 0 : 52}
              style={{ transition: 'stroke-dashoffset 1s .3s' }}
            />
          </svg>
          <span
            className="mt-3"
            style={{ opacity: inView ? 1 : 0, transition: 'opacity .5s 1.1s' }}
          >
            <LogoMark size={30} />
          </span>
        </div>

        <Reveal delay={120} className="text-left">
          <div className="inline-block rounded-2xl bg-white/[0.06] border border-white/10 p-6 sm:p-8 max-w-xs">
            <p className="text-[10px] uppercase tracking-widest text-warm font-semibold mb-2">Business</p>
            <p className="font-display font-700 text-xl sm:text-2xl">“I need reliability.”</p>
          </div>
        </Reveal>
      </div>
      <Reveal className="text-center mt-10">
        <p className="text-white/60">They meet through BackSoon.</p>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── SECTION 9 — FINAL CTA ───────────────────────── */
function SectionFinalCTA({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section className="py-28 px-4 sm:px-6 bg-background text-center">
      <Reveal className="flex flex-col items-center">
        <LogoMark size={52} />
        <h2 className="font-display font-700 text-4xl sm:text-5xl tracking-tight mt-6 leading-[1.05]">
          Go where you need to go.
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-md">
          We’ll help cover what’s waiting for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-9">
          <button
            onClick={() => onNavigate('signup')}
            className="px-6 py-3.5 bg-accent text-accent-foreground font-medium text-sm rounded-lg hover:brightness-110 transition-all shadow-sm shadow-accent/30"
          >
            I need someone to cover a shift
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="px-6 py-3.5 bg-ink text-white font-medium text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            I want to cover shifts
          </button>
        </div>
      </Reveal>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <footer className="border-t border-border py-9 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <button onClick={() => onNavigate('landing')}>
          <Logo size={22} />
        </button>
        <p className="text-xs text-muted-foreground">© 2026 BackSoon · Budapest, Hungary · MVP demo</p>
      </div>
    </footer>
  );
}

/* ───────────────────────── shared bits ───────────────────────── */
function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-secondary/70 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold ${accent ? 'text-accent' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" fill="currentColor" opacity="0.14" />
      <path d="M4.2 7.2l1.8 1.8 3.8-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true">
      <path d="M1 6h16m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
