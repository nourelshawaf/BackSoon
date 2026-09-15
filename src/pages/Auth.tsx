import { useState } from 'react';
import type { View, UserType } from '../types';

interface AuthProps {
  view: 'login' | 'signup';
  onNavigate: (view: View) => void;
  onAuth: (type: UserType) => void;
}

export default function Auth({ view, onNavigate, onAuth }: AuthProps) {
  const [selected, setSelected] = useState<UserType>(null);
  const [step, setStep] = useState<'choose' | 'form'>(view === 'signup' ? 'choose' : 'form');

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-14">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display font-700 text-2xl text-foreground mb-1">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Log in to your BackSoon account</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onAuth('student'); }}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                defaultValue="anna.kovacs@elte.hu"
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                defaultValue="password"
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                onClick={() => onAuth('student')}
                className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Log in as Student (demo)
              </button>
              <button
                type="button"
                onClick={() => onAuth('business')}
                className="w-full py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                Log in as Business (demo)
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            No account?{' '}
            <button onClick={() => onNavigate('signup')} className="text-accent hover:underline font-medium">
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Sign up
  if (step === 'choose') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-14">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-display font-700 text-2xl text-foreground mb-1">Join BackSoon</h1>
            <p className="text-sm text-muted-foreground">Who are you signing up as?</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <AccountTypeCard
              type="student"
              title="I'm a student"
              desc="Browse and apply for flexible temporary shifts"
              icon={<StudentCapIcon />}
              selected={selected === 'student'}
              onClick={() => setSelected('student')}
            />
            <AccountTypeCard
              type="business"
              title="I'm a business"
              desc="Post shifts and find reliable student coverage"
              icon={<BusinessIconLg />}
              selected={selected === 'business'}
              onClick={() => setSelected('business')}
            />
          </div>

          <button
            onClick={() => { if (selected) setStep('form'); }}
            disabled={!selected}
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-accent hover:underline font-medium">
              Log in
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Sign up form
  const isStudent = selected === 'student';
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-14">
      <div className="w-full max-w-sm">
        <button
          onClick={() => setStep('choose')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Back
        </button>

        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${isStudent ? 'bg-accent-light text-accent' : 'bg-primary/10 text-primary'}`}>
            {isStudent ? 'Student account' : 'Business account'}
          </div>
          <h1 className="font-display font-700 text-2xl text-foreground mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground">Set up your BackSoon profile</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onAuth(selected); }}>
          {isStudent ? (
            <>
              <FormField label="Full name" placeholder="Anna Kovács" type="text" />
              <FormField label="University email" placeholder="anna@elte.hu" type="email" />
              <FormField label="University" placeholder="ELTE, BME, BCE…" type="text" />
              <FormField label="Password" placeholder="At least 8 characters" type="password" />
            </>
          ) : (
            <>
              <FormField label="Business name" placeholder="Kávé & Kő" type="text" />
              <FormField label="Contact email" placeholder="hello@business.hu" type="email" />
              <FormField label="Industry" placeholder="Hospitality, Retail…" type="text" />
              <FormField label="Password" placeholder="At least 8 characters" type="password" />
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isStudent
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              Create account
            </button>
          </div>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          By continuing you agree to BackSoon's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function AccountTypeCard({ type, title, desc, icon, selected, onClick }: {
  type: UserType; title: string; desc: string; icon: React.ReactNode; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-5 rounded-xl border-2 transition-all ${
        selected ? 'border-accent bg-accent-light' : 'border-border bg-card hover:border-foreground/20'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selected ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
        {icon}
      </div>
      <p className="font-display font-600 text-sm text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
    </button>
  );
}

function FormField({ label, placeholder, type }: { label: string; placeholder: string; type: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

function StudentCapIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l8 4.5-8 4.5-8-4.5L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M4 9v5c0 1.8 2.5 3 6 3s6-1.2 6-3V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M18 6.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function BusinessIconLg() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="6" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 18V12h6v6M2 9l8-5 8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
