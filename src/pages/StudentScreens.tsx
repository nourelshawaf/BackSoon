import { useState } from 'react';
import type { Shift, View } from '../types';
import { useDemo, matchScore } from '../store';
import ShiftCard from '../components/ShiftCard';

interface StudentProps {
  onNavigate: (view: View, data?: string) => void;
  activeShiftId?: string;
}

/* ─── Dashboard ─────────────────────────────────────────────── */
export function StudentDashboard({ onNavigate }: StudentProps) {
  const { currentStudent: student, shifts, applications, studentId } = useDemo();

  const myApplications = applications.filter(a => a.studentId === studentId);
  const upcomingShifts = shifts.filter(s => s.assignedStudentId === studentId && s.status === 'confirmed');
  const appliedIds = new Set(myApplications.map(a => a.shiftId));
  const openShifts = shifts
    .filter(s => s.status === 'open' && !appliedIds.has(s.id))
    .map(s => ({ shift: s, match: matchScore(student, s).score }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  const pendingCount = myApplications.filter(a => a.status === 'pending').length;

  return (
    <PageWrap>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Welcome back</p>
          <h1 className="font-display font-700 text-2xl text-foreground">
            {student.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatPill label="Completed shifts" value={student.completedShifts} />
          <StatPill label="Rating" value={`${student.rating} ★`} accent />
        </div>
      </div>

      {/* Profile completeness */}
      <div className="bg-accent-light border border-accent/20 rounded-xl p-4 mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Profile {student.verified ? 'verified' : '80% complete'}</p>
          <p className="text-xs text-accent/70 mt-0.5">
            {student.verified ? 'Your identity and university are verified.' : 'Add your ID to unlock verified badge.'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {student.verified && <VerifiedBadge />}
          <button
            onClick={() => onNavigate('student-profile')}
            className="text-xs font-medium text-accent underline"
          >
            View profile
          </button>
        </div>
      </div>

      {/* Upcoming confirmed shifts */}
      {upcomingShifts.length > 0 && (
        <section className="mb-10">
          <SectionHeader title="Upcoming confirmed shifts" action="View all" onAction={() => onNavigate('confirmed-shifts')} />
          <div className="grid sm:grid-cols-2 gap-4">
            {upcomingShifts.map(shift => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                onClick={() => onNavigate('shift-detail', shift.id)}
              />
            ))}
          </div>
        </section>
      )}

      {pendingCount > 0 && (
        <button
          onClick={() => onNavigate('confirmed-shifts')}
          className="w-full text-left mb-10 p-4 border border-border rounded-xl hover:border-foreground/20 transition-colors flex items-center justify-between"
        >
          <span className="text-sm text-foreground">
            <strong>{pendingCount}</strong> application{pendingCount === 1 ? '' : 's'} waiting for a decision
          </span>
          <span className="text-xs font-medium text-accent">Track →</span>
        </button>
      )}

      {/* Recommended shifts */}
      <section>
        <SectionHeader title="Shifts for you" action="Browse all" onAction={() => onNavigate('browse-shifts')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {openShifts.map(({ shift, match }) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              match={match}
              onClick={() => onNavigate('shift-detail', shift.id)}
            />
          ))}
        </div>
      </section>
    </PageWrap>
  );
}

/* ─── Browse Shifts ─────────────────────────────────────────── */
export function BrowseShifts({ onNavigate }: StudentProps) {
  const { shifts, currentStudent } = useDemo();
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Hospitality', 'Retail', 'Food & Beverage', 'Events'];
  const [search, setSearch] = useState('');

  const filtered = shifts
    .filter(s => {
      if (s.status !== 'open') return false;
      if (category !== 'All' && s.category !== category) return false;
      if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.business.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .map(s => ({ shift: s, match: matchScore(currentStudent, s).score }))
    .sort((a, b) => b.match - a.match);

  return (
    <PageWrap>
      <div className="mb-6">
        <h1 className="font-display font-700 text-2xl text-foreground mb-1">Browse shifts</h1>
        <p className="text-sm text-muted-foreground">Find temporary work that fits your schedule</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <input
            type="text"
            placeholder="Search shifts or businesses…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} shifts available · sorted by match</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ shift, match }) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            match={match}
            onClick={() => onNavigate('shift-detail', shift.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-muted-foreground text-sm">No shifts match your search.</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="text-accent text-sm underline mt-2">Clear filters</button>
          </div>
        )}
      </div>
    </PageWrap>
  );
}

/* ─── Shift Detail ──────────────────────────────────────────── */
export function ShiftDetail({ onNavigate, activeShiftId }: StudentProps) {
  const { shifts, currentStudent, studentId, applicantsFor, applicationOf, applyToShift, reviewFor } = useDemo();
  const shift = shifts.find(s => s.id === activeShiftId) ?? shifts[0];
  const application = applicationOf(shift.id, studentId);
  const { score, reasons } = matchScore(currentStudent, shift);
  const applicantCount = applicantsFor(shift.id).length;
  const review = reviewFor(shift.id);
  const [showReasons, setShowReasons] = useState(false);

  const hours = estimateHours(shift.time);

  return (
    <PageWrap>
      <button
        onClick={() => onNavigate('browse-shifts')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        Back to shifts
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-foreground">{shift.category}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                  shift.status === 'open' ? 'bg-accent-light text-accent' : 'bg-muted text-muted-foreground'
                }`}>
                  {shift.status}
                </span>
              </div>
              <h1 className="font-display font-700 text-2xl text-foreground mb-1">{shift.title}</h1>
              <p className="text-muted-foreground">{shift.business}</p>
            </div>
            <button
              onClick={() => setShowReasons(v => !v)}
              className="text-center bg-accent-light rounded-xl px-4 py-3 hover:bg-accent-light/70 transition-colors"
              aria-expanded={showReasons}
            >
              <p className="text-3xl font-display font-700 text-accent">{score}%</p>
              <p className="text-xs text-accent/70">match · why?</p>
            </button>
          </div>

          {showReasons && (
            <div className="mb-6 border border-accent/20 bg-accent-light/50 rounded-xl p-4">
              <p className="text-xs font-medium text-accent uppercase tracking-wide mb-2">How this match is calculated</p>
              <ul className="space-y-1.5">
                {reasons.map(r => (
                  <li key={r} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-accent mt-0.5">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Based only on your profile: skills asked for, district, availability and track record. No hidden scoring.
              </p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <DetailCard label="Location" value={shift.district} />
            <DetailCard label="Date" value={shift.date} />
            <DetailCard label="Time" value={shift.time} />
            <DetailCard label="Pay" value={`${shift.pay.toLocaleString('hu-HU')} HUF/hr`} accent />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-display font-600 text-base text-foreground mb-3">About this shift</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{shift.description}</p>
          </div>

          {/* Requirements */}
          {shift.requirements && shift.requirements.length > 0 && (
            <div>
              <h2 className="font-display font-600 text-base text-foreground mb-3">What they need</h2>
              <ul className="space-y-2">
                {shift.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review && shift.assignedStudentId === studentId && (
            <div className="mt-8 border border-border rounded-xl p-5">
              <h2 className="font-display font-600 text-base text-foreground mb-2">
                Review from {shift.business}
              </h2>
              <p className="text-sm text-foreground">{'★'.repeat(review.rating)}<span className="text-muted-foreground">{'★'.repeat(5 - review.rating)}</span></p>
              {review.comment && <p className="text-sm text-muted-foreground mt-2">“{review.comment}”</p>}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-card border border-border rounded-xl p-5">
            <div className="mb-4 pb-4 border-b border-border">
              <p className="text-xl font-display font-700 text-foreground">
                {shift.pay.toLocaleString('hu-HU')} HUF
                <span className="text-sm font-normal text-muted-foreground">/hr</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Est. {(shift.pay * hours).toLocaleString('hu-HU')} HUF for {hours} hours
              </p>
            </div>

            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applicants</span>
                <span className="font-medium">{applicantCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posted</span>
                <span className="font-medium">{shift.postedLabel}</span>
              </div>
            </div>

            {application?.status === 'selected' ? (
              <div className="bg-accent-light rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-accent">You are confirmed for this shift</p>
                <p className="text-xs text-accent/70 mt-1">
                  {shift.business} selected you. Turn up at {shift.time.split('–')[0]} on {shift.date}.
                </p>
              </div>
            ) : application?.status === 'not-selected' ? (
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-foreground">Not selected this time</p>
                <p className="text-xs text-muted-foreground mt-1">The business chose another candidate.</p>
                <button onClick={() => onNavigate('browse-shifts')} className="text-xs text-accent underline mt-2">
                  Find another shift
                </button>
              </div>
            ) : application ? (
              <div className="bg-accent-light rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-accent">Application sent</p>
                <p className="text-xs text-accent/70 mt-0.5">Waiting for {shift.business} to review candidates.</p>
              </div>
            ) : shift.status === 'open' ? (
              <button
                onClick={() => applyToShift(shift.id)}
                className="w-full py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                Apply for this shift
              </button>
            ) : (
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-foreground">This shift is covered</p>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center mt-3">Free to apply · No fees for students</p>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

/* ─── My shifts ─────────────────────────────────────────────── */
export function ConfirmedShifts({ onNavigate }: StudentProps) {
  const { shifts, applications, studentId } = useDemo();
  const mine = shifts.filter(s => s.assignedStudentId === studentId);
  const upcoming = mine.filter(s => s.status === 'confirmed');
  const done = mine.filter(s => s.status === 'completed');
  const myApplications = applications
    .filter(a => a.studentId === studentId && a.status !== 'selected')
    .map(a => ({ application: a, shift: shifts.find(s => s.id === a.shiftId) }))
    .filter((x): x is { application: typeof applications[0]; shift: Shift } => Boolean(x.shift));
  const [tab, setTab] = useState<'upcoming' | 'applied'>('upcoming');

  return (
    <PageWrap>
      <div className="mb-6">
        <h1 className="font-display font-700 text-2xl text-foreground mb-1">My shifts</h1>
        <p className="text-sm text-muted-foreground">Track your upcoming work and applications</p>
      </div>

      <div className="flex border-b border-border mb-6">
        <TabBtn label={`Upcoming (${upcoming.length})`} active={tab === 'upcoming'} onClick={() => setTab('upcoming')} />
        <TabBtn label={`Applications (${myApplications.length})`} active={tab === 'applied'} onClick={() => setTab('applied')} />
      </div>

      {tab === 'upcoming' ? (
        upcoming.length > 0 || done.length > 0 ? (
          <div className="space-y-8">
            {upcoming.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {upcoming.map(shift => (
                  <ShiftCard key={shift.id} shift={shift} onClick={() => onNavigate('shift-detail', shift.id)} />
                ))}
              </div>
            )}
            {done.length > 0 && (
              <div>
                <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-3">Completed</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {done.map(shift => (
                    <ShiftCard key={shift.id} shift={shift} onClick={() => onNavigate('shift-detail', shift.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No upcoming shifts"
            desc="Once a business confirms you, your shifts will appear here."
            action="Browse shifts"
            onAction={() => onNavigate('browse-shifts')}
          />
        )
      ) : myApplications.length > 0 ? (
        <div className="space-y-3">
          {myApplications.map(({ application, shift }) => (
            <ApplicationRow
              key={application.id}
              shift={shift}
              status={application.status}
              onClick={() => onNavigate('shift-detail', shift.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          desc="Apply for a shift and you can track the decision here."
          action="Browse shifts"
          onAction={() => onNavigate('browse-shifts')}
        />
      )}
    </PageWrap>
  );
}

/* ─── Student Profile ───────────────────────────────────────── */
export function StudentProfile(_: StudentProps) {
  const { currentStudent: student } = useDemo();

  return (
    <PageWrap>
      <div className="max-w-2xl">
        <div className="flex items-start gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-display font-700 text-xl flex-shrink-0">
            {student.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display font-700 text-xl text-foreground">{student.name}</h1>
              {student.verified && <VerifiedBadge />}
            </div>
            <p className="text-sm text-muted-foreground">{student.faculty} · {student.university}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium text-foreground">★ {student.rating}</span>
              <span className="text-sm text-muted-foreground">{student.completedShifts} shifts completed</span>
            </div>
          </div>
          <button className="px-3 py-1.5 border border-border text-sm font-medium rounded-lg hover:bg-secondary transition-colors">
            Edit
          </button>
        </div>

        {/* Bio */}
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-2">About</h2>
          <p className="text-sm text-foreground leading-relaxed">{student.bio}</p>
        </div>

        {/* Skills */}
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {student.skills.map(skill => (
              <span key={skill} className="px-3 py-1 bg-muted text-foreground text-sm rounded-full">{skill}</span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-2">Availability</h2>
          <p className="text-sm text-foreground">{student.availability} · {student.district}</p>
        </div>

        {/* Verification status */}
        <div className="bg-accent-light rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-accent">Identity verified</p>
            <p className="text-xs text-accent/70 mt-0.5">University email and student ID confirmed</p>
          </div>
          <VerifiedBadge large />
        </div>
      </div>
    </PageWrap>
  );
}

/* ─── Shared sub-components ─────────────────────────────────── */
export function estimateHours(time: string): number {
  const [start, end] = time.split('–');
  const h = parseInt(end, 10) - parseInt(start, 10);
  return Number.isFinite(h) && h > 0 ? h : 6;
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {children}
    </div>
  );
}

function SectionHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-600 text-base text-foreground">{title}</h2>
      <button onClick={onAction} className="text-xs font-medium text-accent hover:underline">{action} →</button>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-lg text-center ${accent ? 'bg-accent-light' : 'bg-muted'}`}>
      <p className={`font-display font-700 text-base leading-tight ${accent ? 'text-accent' : 'text-foreground'}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function DetailCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-muted rounded-xl p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-medium ${accent ? 'text-accent' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function ApplicationRow({ shift, status, onClick }: { shift: Shift; status: string; onClick: () => void }) {
  const style = status === 'not-selected'
    ? 'bg-muted text-muted-foreground'
    : 'bg-warning/10 text-warning';
  const label = status === 'not-selected' ? 'Not selected' : 'Pending';

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between p-4 border border-border rounded-xl hover:border-foreground/20 transition-colors"
    >
      <div>
        <p className="font-medium text-sm text-foreground">{shift.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{shift.business} · {shift.date}</p>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style}`}>{label}</span>
    </button>
  );
}

function EmptyState({ title, desc, action, onAction }: { title: string; desc: string; action: string; onAction: () => void }) {
  return (
    <div className="py-16 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="12" rx="1.5" stroke="#9CA3AF" strokeWidth="1.3"/><path d="M7 5V3.5a3 3 0 0 1 6 0V5" stroke="#9CA3AF" strokeWidth="1.3"/></svg>
      </div>
      <h3 className="font-display font-600 text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{desc}</p>
      <button onClick={onAction} className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors">
        {action}
      </button>
    </div>
  );
}

function VerifiedBadge({ large }: { large?: boolean }) {
  const size = large ? 24 : 16;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <title>Verified</title>
      <circle cx="8" cy="8" r="7" fill="#059669"/>
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
