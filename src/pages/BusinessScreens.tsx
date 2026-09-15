import { useState } from 'react';
import type { Student, View } from '../types';
import { useDemo, matchScore } from '../store';
import { CATEGORY_SKILLS } from '../data';
import ShiftCard from '../components/ShiftCard';
import { estimateHours } from './StudentScreens';

interface BusinessProps {
  onNavigate: (view: View, data?: string) => void;
  activeShiftId?: string;
  activeCandidateId?: string;
}

/* ─── Business Dashboard ─────────────────────────────────────── */
export function BusinessDashboard({ onNavigate }: BusinessProps) {
  const { shifts, business, businessId, applications, student } = useDemo();
  const myShifts = shifts.filter(s => s.businessId === businessId);
  const myShiftIds = new Set(myShifts.map(s => s.id));
  const myApplications = applications.filter(a => myShiftIds.has(a.shiftId));
  const openCount = myShifts.filter(s => s.status === 'open').length;
  const filledCount = myShifts.filter(s => s.status !== 'open').length;

  return (
    <PageWrap>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Logged in as</p>
          <h1 className="font-display font-700 text-2xl text-foreground">{business.name}</h1>
          <p className="text-xs text-muted-foreground mt-1">{business.district} · {business.category}</p>
        </div>
        <button
          onClick={() => onNavigate('create-shift')}
          className="self-start sm:self-auto px-4 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          + Post new shift
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Open shifts" value={openCount} />
        <StatCard label="Total applicants" value={myApplications.length} accent />
        <StatCard label="Shifts covered" value={filledCount} />
      </div>

      {/* Active shifts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-600 text-base text-foreground">Active shifts</h2>
          <button onClick={() => onNavigate('manage-shifts')} className="text-xs font-medium text-accent hover:underline">
            Manage all →
          </button>
        </div>
        {myShifts.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {myShifts.slice(0, 2).map(shift => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                variant="manage"
                applicants={applications.filter(a => a.shiftId === shift.id).length}
                onClick={() => onNavigate('applicants', shift.id)}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl py-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">No shifts posted yet.</p>
            <button onClick={() => onNavigate('create-shift')} className="text-sm text-accent underline">
              Post your first shift
            </button>
          </div>
        )}
      </section>

      {/* Recent applicants */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-600 text-base text-foreground">Recent applicants</h2>
        </div>
        {myApplications.length > 0 ? (
          <div className="border border-border rounded-xl overflow-hidden">
            {myApplications.slice(-3).reverse().map((application, i, arr) => {
              const candidate = student(application.studentId);
              if (!candidate) return null;
              return (
                <button
                  key={application.id}
                  onClick={() => onNavigate('applicants', application.shiftId)}
                  className={`w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-secondary transition-colors ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {candidate.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                      {candidate.verified && <VerifiedBadge />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{candidate.faculty} · {candidate.university}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-foreground">★ {candidate.rating}</p>
                    <p className="text-xs text-muted-foreground">{candidate.completedShifts} shifts</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground flex-shrink-0"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl py-10 text-center">
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          </div>
        )}
      </section>
    </PageWrap>
  );
}

/* ─── Create Shift ───────────────────────────────────────────── */
export function CreateShift({ onNavigate }: BusinessProps) {
  const { postShift, business } = useDemo();
  const [postedId, setPostedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    date: '',
    start: '16:00',
    end: '22:00',
    district: business.district,
    pay: '2500',
    category: business.category,
    description: '',
    requirements: '',
  });

  const set = (key: keyof typeof form) => (value: string) => setForm(f => ({ ...f, [key]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const date = form.date
      ? new Date(form.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '25 September 2026';
    const id = postShift({
      title: form.title.trim() || 'Café Assistant',
      district: form.district.trim() || business.district,
      date,
      time: `${form.start}–${form.end}`,
      pay: parseInt(form.pay, 10) || 2500,
      category: form.category,
      skillTags: CATEGORY_SKILLS[form.category] ?? ['Customer Service'],
      description: form.description.trim() || 'Temporary cover needed for this shift.',
      requirements: form.requirements
        .split('\n')
        .map(r => r.trim())
        .filter(Boolean),
    });
    setPostedId(id);
  }

  if (postedId) {
    return (
      <PageWrap>
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" fill="#D1FAE5"/><path d="M9 14l3.5 3.5L19 10" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="font-display font-700 text-2xl text-foreground mb-2">Shift posted</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Your shift is live. Students matching your requirements can see it in Browse shifts and apply.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onNavigate('applicants', postedId)}
              className="w-full py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              View this shift
            </button>
            <button
              onClick={() => onNavigate('business-dashboard')}
              className="w-full py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <div className="max-w-lg">
        <button
          onClick={() => onNavigate('business-dashboard')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Back
        </button>

        <div className="mb-7">
          <h1 className="font-display font-700 text-2xl text-foreground mb-1">Post a shift</h1>
          <p className="text-sm text-muted-foreground">Tell students what you need</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormField label="Role / Job title" placeholder="e.g. Café Assistant, Waiter, Cashier" value={form.title} onChange={set('title')} />
          <FormField label="Date" type="date" value={form.date} onChange={set('date')} />

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start time" type="time" value={form.start} onChange={set('start')} />
            <FormField label="End time" type="time" value={form.end} onChange={set('end')} />
          </div>

          <FormField label="Location (district)" placeholder="e.g. Budapest VII" value={form.district} onChange={set('district')} />
          <FormField label="Pay (HUF per hour)" type="number" placeholder="e.g. 2500" value={form.pay} onChange={set('pay')} />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="category">Category</label>
            <select
              id="category"
              value={form.category}
              onChange={e => set('category')(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors bg-background"
            >
              <option>Hospitality</option>
              <option>Retail</option>
              <option>Food &amp; Beverage</option>
              <option>Events</option>
              <option>Other</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1.5">
              Sets the skills we match students against: {(CATEGORY_SKILLS[form.category] ?? []).join(', ')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={e => set('description')(e.target.value)}
              placeholder="Describe the role, tasks, and what the student will be doing…"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="requirements">Requirements (optional)</label>
            <textarea
              id="requirements"
              rows={3}
              value={form.requirements}
              onChange={e => set('requirements')(e.target.value)}
              placeholder={"One per line\ne.g. Friendly attitude\nEnglish speaking"}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-accent text-accent-foreground font-medium text-sm rounded-lg hover:bg-accent/90 transition-colors"
            >
              Post shift
            </button>
          </div>
        </form>
      </div>
    </PageWrap>
  );
}

/* ─── Manage Shifts ──────────────────────────────────────────── */
export function ManageShifts({ onNavigate }: BusinessProps) {
  const { shifts, businessId, applications } = useDemo();
  const mine = shifts.filter(s => s.businessId === businessId);
  const [tab, setTab] = useState<'open' | 'covered'>('open');
  const filtered = mine.filter(s => (tab === 'open' ? s.status === 'open' : s.status !== 'open'));

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-700 text-2xl text-foreground mb-1">Manage shifts</h1>
          <p className="text-sm text-muted-foreground">Review and manage your posted shifts</p>
        </div>
        <button
          onClick={() => onNavigate('create-shift')}
          className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          + Post shift
        </button>
      </div>

      <div className="flex border-b border-border mb-6">
        <TabBtn label={`Open (${mine.filter(s => s.status === 'open').length})`} active={tab === 'open'} onClick={() => setTab('open')} />
        <TabBtn label={`Covered (${mine.filter(s => s.status !== 'open').length})`} active={tab === 'covered'} onClick={() => setTab('covered')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(shift => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            variant="manage"
            applicants={applications.filter(a => a.shiftId === shift.id).length}
            onClick={() => onNavigate('applicants', shift.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-muted-foreground text-sm">No {tab} shifts yet.</p>
            {tab === 'open' && (
              <button onClick={() => onNavigate('create-shift')} className="text-accent text-sm underline mt-2">Post a shift</button>
            )}
          </div>
        )}
      </div>
    </PageWrap>
  );
}

/* ─── Shift + applicants (the review & select screen) ────────── */
export function Applicants({ onNavigate, activeShiftId }: BusinessProps) {
  const {
    shifts, businessId, applicantsFor, student, selectApplicant,
    addDemoApplicants, completeShift, rateStudent, reviewFor,
  } = useDemo();

  const mine = shifts.filter(s => s.businessId === businessId);
  const shift = shifts.find(s => s.id === activeShiftId) ?? mine[0] ?? shifts[0];
  const applications = applicantsFor(shift.id);
  const assigned = shift.assignedStudentId ? student(shift.assignedStudentId) : undefined;
  const review = reviewFor(shift.id);

  const ranked = applications
    .map(a => ({ application: a, candidate: student(a.studentId) }))
    .filter((x): x is { application: typeof applications[0]; candidate: Student } => Boolean(x.candidate))
    .map(x => ({ ...x, match: matchScore(x.candidate, shift) }))
    .sort((a, b) => b.match.score - a.match.score);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [rated, setRated] = useState(false);

  return (
    <PageWrap>
      <button
        onClick={() => onNavigate('manage-shifts')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        Back to shifts
      </button>

      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-700 text-2xl text-foreground mb-1">{shift.title}</h1>
          <p className="text-muted-foreground text-sm">
            {shift.district} · {shift.date} · {shift.time} · {shift.pay.toLocaleString('hu-HU')} HUF/hr
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
          shift.status === 'open' ? 'bg-accent-light text-accent' : 'bg-muted text-muted-foreground'
        }`}>
          {shift.status}
        </span>
      </div>

      {/* Confirmed / completed state */}
      {assigned && (
        <div className="mb-8 border border-accent/20 bg-accent-light/50 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {assigned.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {shift.status === 'completed' ? 'Covered by' : 'Confirmed —'} {assigned.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {shift.status === 'completed'
                  ? `${estimateHours(shift.time)} hours worked`
                  : 'They can see this shift in their dashboard.'}
              </p>
            </div>
            {shift.status === 'confirmed' && (
              <button
                onClick={() => completeShift(shift.id)}
                className="px-3 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Mark shift completed
              </button>
            )}
          </div>

          {/* Rating */}
          {shift.status === 'completed' && (
            review || rated ? (
              <div className="mt-4 pt-4 border-t border-accent/20">
                <p className="text-sm font-medium text-foreground">
                  You rated {assigned.name} {'★'.repeat(review?.rating ?? rating)}
                </p>
                {review?.comment && <p className="text-xs text-muted-foreground mt-1">“{review.comment}”</p>}
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-accent/20">
                <p className="text-sm font-medium text-foreground mb-2">How did it go?</p>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n === 1 ? '' : 's'}`}
                      className={`text-xl leading-none transition-colors ${n <= rating ? 'text-warning' : 'text-border'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Optional note for other businesses…"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none mb-3"
                />
                <button
                  onClick={() => { rateStudent(shift.id, rating, comment.trim() || undefined); setRated(true); }}
                  className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Submit rating
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Applicants */}
      {shift.status === 'open' && (
        ranked.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              {ranked.length} applicant{ranked.length === 1 ? '' : 's'} · best match first
            </p>
            {ranked.map(({ application, candidate, match }) => (
              <ApplicantRow
                key={application.id}
                student={candidate}
                match={match.score}
                reasons={match.reasons}
                onViewProfile={() => onNavigate('candidate-profile', candidate.id)}
                onConfirm={() => selectApplicant(shift.id, candidate.id)}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl py-14 text-center">
            <h3 className="font-display font-600 text-foreground mb-1">Waiting for applications</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              Students matching this shift can see it now. Applications appear here as they come in.
            </p>
            <button
              onClick={() => addDemoApplicants(shift.id)}
              className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Simulate incoming applications (demo)
            </button>
          </div>
        )
      )}

      {/* Non-selected applicants, once covered */}
      {shift.status !== 'open' && ranked.length > 1 && (
        <div>
          <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Other applicants
          </h2>
          <div className="space-y-3">
            {ranked
              .filter(r => r.candidate.id !== shift.assignedStudentId)
              .map(({ application, candidate, match }) => (
                <div key={application.id} className="flex items-center gap-4 p-4 border border-border rounded-xl opacity-70">
                  <div className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {candidate.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">{match.score}% match · not selected</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </PageWrap>
  );
}

/* ─── Candidate Profile ──────────────────────────────────────── */
export function CandidateProfile({ onNavigate, activeShiftId, activeCandidateId }: BusinessProps) {
  const { shifts, students, student, selectApplicant, businessId } = useDemo();
  const candidate = student(activeCandidateId ?? '') ?? students[0];
  const mine = shifts.filter(s => s.businessId === businessId);
  const shift = shifts.find(s => s.id === activeShiftId) ?? mine[0] ?? shifts[0];
  const { score, reasons } = matchScore(candidate, shift);
  const [confirming, setConfirming] = useState(false);

  return (
    <PageWrap>
      <button
        onClick={() => onNavigate('applicants', shift.id)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        Back to applicants
      </button>

      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-start gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-display font-700 text-xl flex-shrink-0">
            {candidate.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display font-700 text-xl text-foreground">{candidate.name}</h1>
              {candidate.verified && <VerifiedBadge />}
            </div>
            <p className="text-sm text-muted-foreground">{candidate.faculty} · {candidate.university}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium text-foreground">★ {candidate.rating}</span>
              <span className="text-sm text-muted-foreground">{candidate.completedShifts} shifts completed</span>
            </div>
          </div>
          <div className="text-center bg-accent-light rounded-xl px-4 py-3 flex-shrink-0">
            <p className="text-2xl font-display font-700 text-accent">{score}%</p>
            <p className="text-xs text-accent/70">match</p>
          </div>
        </div>

        {/* Why this match */}
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Why they match “{shift.title}”
          </h2>
          <ul className="space-y-1.5">
            {reasons.map(r => (
              <li key={r} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-accent mt-0.5">✓</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Bio */}
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-2">About</h2>
          <p className="text-sm text-foreground leading-relaxed">{candidate.bio}</p>
        </div>

        {/* Skills */}
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map(skill => (
              <span
                key={skill}
                className={`px-3 py-1 text-sm rounded-full ${
                  shift.skillTags.includes(skill) ? 'bg-accent-light text-accent font-medium' : 'bg-muted text-foreground'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-8 pb-6 border-b border-border">
          <h2 className="font-display font-600 text-sm text-muted-foreground uppercase tracking-wide mb-2">Availability</h2>
          <p className="text-sm text-foreground">{candidate.availability} · {candidate.district}</p>
        </div>

        {/* CTA */}
        {shift.status !== 'open' ? (
          <div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground">
            This shift is already covered by {student(shift.assignedStudentId ?? '')?.name ?? 'another student'}.
          </div>
        ) : !confirming ? (
          <div className="flex gap-3">
            <button
              onClick={() => setConfirming(true)}
              className="flex-1 py-3 bg-accent text-accent-foreground font-medium text-sm rounded-lg hover:bg-accent/90 transition-colors"
            >
              Select for this shift
            </button>
            <button
              onClick={() => onNavigate('applicants', shift.id)}
              className="px-4 py-3 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              View others
            </button>
          </div>
        ) : (
          <div className="bg-accent-light border border-accent/20 rounded-xl p-5">
            <h3 className="font-display font-600 text-foreground mb-1">Select {candidate.name}?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              They will see the confirmed shift in their dashboard. Other applicants are told the shift was filled.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { selectApplicant(shift.id, candidate.id); onNavigate('applicants', shift.id); }}
                className="flex-1 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                Yes, confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="px-4 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrap>
  );
}

/* ─── Shared sub-components ─────────────────────────────────── */
function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {children}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 text-center ${accent ? 'bg-accent-light' : 'bg-muted'}`}>
      <p className={`font-display font-700 text-2xl leading-tight ${accent ? 'text-accent' : 'text-foreground'}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
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

function FormField({ label, placeholder, type = 'text', value, onChange }: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="mt-1.5 w-full px-3 py-2.5 border border-border rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors placeholder:text-muted-foreground/60"
        />
      </label>
    </div>
  );
}

function ApplicantRow({ student, match, reasons, onViewProfile, onConfirm }: {
  student: Student;
  match: number;
  reasons: string[];
  onViewProfile: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-xl hover:border-foreground/20 transition-colors">
      <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
        {student.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-foreground">{student.name}</p>
          {student.verified && <VerifiedBadge />}
          <span className="ml-1 text-xs font-semibold text-accent">{match}% match</span>
        </div>
        <p className="text-xs text-muted-foreground">{student.faculty} · ★ {student.rating} · {student.completedShifts} shifts</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {reasons.slice(0, 2).map(r => (
            <span key={r} className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{r}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onViewProfile}
          className="px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-lg hover:bg-secondary transition-colors"
        >
          Profile
        </button>
        <button
          onClick={onConfirm}
          className="px-3 py-1.5 bg-accent text-accent-foreground text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Select
        </button>
      </div>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Verified</title>
      <circle cx="8" cy="8" r="7" fill="#059669"/>
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
