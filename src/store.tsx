import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Application, Review, Shift, Student } from './types';
import {
  APPLICATIONS,
  BUSINESSES,
  CATEGORY_SKILLS,
  DEMO_BUSINESS_ID,
  DEMO_STUDENT_ID,
  SHIFTS,
  STUDENTS,
} from './data';

/**
 * Single source of truth for the demo. Both sides of the marketplace read and
 * write the same state, so a student applying, a business selecting, a shift
 * being completed and a rating being left are all visible from the other role.
 *
 * State is kept in localStorage so an accidental refresh mid-presentation does
 * not wipe the demo; "Reset demo" puts everything back to the seed.
 */

const STORAGE_KEY = 'backsoon-demo-v1';

interface DemoState {
  shifts: Shift[];
  students: Student[];
  applications: Application[];
  reviews: Review[];
}

// JSON copy rather than structuredClone — the seed is plain data, and
// structuredClone is missing on older iOS Safari.
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

const seed = (): DemoState => ({
  shifts: clone(SHIFTS),
  students: clone(STUDENTS),
  applications: clone(APPLICATIONS),
  reviews: [],
});

/** Saved state is only trusted if it has the shape every screen relies on. */
function isValidState(v: unknown): v is DemoState {
  const s = v as DemoState;
  return (
    !!s &&
    Array.isArray(s.shifts) && s.shifts.length > 0 &&
    s.shifts.every(sh => typeof sh?.id === 'string' && Array.isArray(sh.skillTags) && typeof sh.time === 'string') &&
    Array.isArray(s.students) &&
    s.students.some(st => st?.id === DEMO_STUDENT_ID) &&
    s.students.every(st => Array.isArray(st?.skills) && typeof st.availability === 'string') &&
    Array.isArray(s.applications) &&
    Array.isArray(s.reviews)
  );
}

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed: unknown = JSON.parse(raw);
    return isValidState(parsed) ? parsed : seed();
  } catch {
    return seed();
  }
}

/** Used by the error screen to recover from a bad saved demo. */
export function clearSavedDemo() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable — nothing to clear */
  }
}

/* ─── Match score ───────────────────────────────────────────────
 * Deliberately simple and explainable — no black box. A candidate is
 * scored on the four things the business can see on the profile:
 * skills asked for, district, availability, and track record.
 * ───────────────────────────────────────────────────────────── */
export interface MatchResult {
  score: number;
  reasons: string[];
}

function isWeekendDate(date: string): boolean {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}

export function matchScore(student: Student, shift: Shift): MatchResult {
  const reasons: string[] = [];
  const tags = shift.skillTags.length ? shift.skillTags : CATEGORY_SKILLS[shift.category] ?? [];

  const matched = tags.filter(t => student.skills.includes(t));
  const skillShare = tags.length ? matched.length / tags.length : 0;
  let score = Math.round(skillShare * 55);
  if (matched.length) {
    reasons.push(`${matched.length} of ${tags.length} skills: ${matched.join(', ')}`);
  }

  if (student.district === shift.district) {
    score += 15;
    reasons.push(`Same district (${shift.district})`);
  } else {
    score += 5;
  }

  const startHour = parseInt(shift.time.slice(0, 2), 10);
  const weekend = isWeekendDate(shift.date);
  const avail = student.availability.toLowerCase();
  const availableThen =
    avail.includes('flexible') ||
    (weekend && avail.includes('weekend')) ||
    (!weekend && (avail.includes('weekday') || (startHour >= 16 && avail.includes('evening'))));
  if (availableThen) {
    score += 15;
    reasons.push(`Available ${weekend ? 'weekends' : startHour >= 16 ? 'evenings' : 'weekdays'}`);
  }

  if (student.verified) {
    score += 10;
    reasons.push('Verified student');
  }

  score += Math.round((student.rating / 5) * 5);
  if (student.completedShifts > 0) {
    reasons.push(`★ ${student.rating} over ${student.completedShifts} shifts`);
  }

  return { score: Math.max(35, Math.min(99, score)), reasons };
}

/* ─── Context ───────────────────────────────────────────────── */
interface DemoApi extends DemoState {
  businessId: string;
  studentId: string;
  business: (typeof BUSINESSES)[number];
  currentStudent: Student;
  shift: (id: string) => Shift | undefined;
  student: (id: string) => Student | undefined;
  applicantsFor: (shiftId: string) => Application[];
  applicationOf: (shiftId: string, studentId: string) => Application | undefined;
  reviewFor: (shiftId: string) => Review | undefined;
  applyToShift: (shiftId: string, studentId?: string) => void;
  selectApplicant: (shiftId: string, studentId: string) => void;
  postShift: (draft: Omit<Shift, 'id' | 'businessId' | 'business' | 'status' | 'postedLabel'>) => string;
  addDemoApplicants: (shiftId: string) => void;
  completeShift: (shiftId: string) => void;
  rateStudent: (shiftId: string, rating: number, comment?: string) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoApi | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* private mode / blocked storage — the demo still works in memory */
    }
  }, [state]);

  const business = BUSINESSES.find(b => b.id === DEMO_BUSINESS_ID)!;

  const shift = useCallback((id: string) => state.shifts.find(s => s.id === id), [state.shifts]);
  const student = useCallback((id: string) => state.students.find(s => s.id === id), [state.students]);
  const applicantsFor = useCallback(
    (shiftId: string) => state.applications.filter(a => a.shiftId === shiftId),
    [state.applications],
  );
  const applicationOf = useCallback(
    (shiftId: string, studentId: string) =>
      state.applications.find(a => a.shiftId === shiftId && a.studentId === studentId),
    [state.applications],
  );
  const reviewFor = useCallback(
    (shiftId: string) => state.reviews.find(r => r.shiftId === shiftId),
    [state.reviews],
  );

  const applyToShift = useCallback((shiftId: string, studentId: string = DEMO_STUDENT_ID) => {
    setState(prev => {
      if (prev.applications.some(a => a.shiftId === shiftId && a.studentId === studentId)) return prev;
      return {
        ...prev,
        applications: [
          ...prev.applications,
          {
            id: `a-${shiftId}-${studentId}-${Date.now()}`,
            shiftId,
            studentId,
            status: 'pending',
            appliedLabel: 'Just now',
          },
        ],
      };
    });
  }, []);

  const selectApplicant = useCallback((shiftId: string, studentId: string) => {
    setState(prev => ({
      ...prev,
      shifts: prev.shifts.map(s =>
        s.id === shiftId ? { ...s, status: 'confirmed', assignedStudentId: studentId } : s,
      ),
      applications: prev.applications.map(a =>
        a.shiftId !== shiftId
          ? a
          : { ...a, status: a.studentId === studentId ? 'selected' : 'not-selected' },
      ),
    }));
  }, []);

  const postShift = useCallback<DemoApi['postShift']>(draft => {
    const id = `n${Date.now().toString().slice(-6)}`;
    setState(prev => ({
      ...prev,
      shifts: [
        {
          ...draft,
          id,
          businessId: DEMO_BUSINESS_ID,
          business: BUSINESSES.find(b => b.id === DEMO_BUSINESS_ID)!.name,
          status: 'open',
          postedLabel: 'Just now',
        },
        ...prev.shifts,
      ],
    }));
    return id;
  }, []);

  /** Demo aid: brings in the three strongest unapplied students for a shift. */
  const addDemoApplicants = useCallback((shiftId: string) => {
    setState(prev => {
      const target = prev.shifts.find(s => s.id === shiftId);
      if (!target) return prev;
      const already = new Set(prev.applications.filter(a => a.shiftId === shiftId).map(a => a.studentId));
      const picks = prev.students
        .filter(s => !already.has(s.id))
        .map(s => ({ s, m: matchScore(s, target).score }))
        .sort((a, b) => b.m - a.m)
        .slice(0, 3);
      if (!picks.length) return prev;
      return {
        ...prev,
        applications: [
          ...prev.applications,
          ...picks.map(({ s }, i) => ({
            id: `a-${shiftId}-${s.id}-${Date.now()}-${i}`,
            shiftId,
            studentId: s.id,
            status: 'pending' as const,
            appliedLabel: 'Just now',
          })),
        ],
      };
    });
  }, []);

  const completeShift = useCallback((shiftId: string) => {
    setState(prev => ({
      ...prev,
      shifts: prev.shifts.map(s => (s.id === shiftId ? { ...s, status: 'completed' } : s)),
    }));
  }, []);

  const rateStudent = useCallback((shiftId: string, rating: number, comment?: string) => {
    setState(prev => {
      const target = prev.shifts.find(s => s.id === shiftId);
      const studentId = target?.assignedStudentId;
      if (!target || !studentId) return prev;
      return {
        ...prev,
        reviews: [...prev.reviews.filter(r => r.shiftId !== shiftId), { shiftId, studentId, rating, comment }],
        students: prev.students.map(s => {
          if (s.id !== studentId) return s;
          const total = s.rating * s.completedShifts + rating;
          const count = s.completedShifts + 1;
          return { ...s, completedShifts: count, rating: Math.round((total / count) * 10) / 10 };
        }),
      };
    });
  }, []);

  const resetDemo = useCallback(() => setState(seed()), []);

  const value = useMemo<DemoApi>(
    () => ({
      ...state,
      businessId: DEMO_BUSINESS_ID,
      studentId: DEMO_STUDENT_ID,
      business,
      currentStudent: state.students.find(s => s.id === DEMO_STUDENT_ID)!,
      shift,
      student,
      applicantsFor,
      applicationOf,
      reviewFor,
      applyToShift,
      selectApplicant,
      postShift,
      addDemoApplicants,
      completeShift,
      rateStudent,
      resetDemo,
    }),
    [
      state,
      business,
      shift,
      student,
      applicantsFor,
      applicationOf,
      reviewFor,
      applyToShift,
      selectApplicant,
      postShift,
      addDemoApplicants,
      completeShift,
      rateStudent,
      resetDemo,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoApi {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider>');
  return ctx;
}
