import { useState } from 'react';
import type { UserType } from '../types';
import { useDemo } from '../store';

interface DemoBarProps {
  userType: Exclude<UserType, null>;
  onSwitchRole: (type: Exclude<UserType, null>) => void;
}

/**
 * Presentation aid. Lets you jump between the two sides of the marketplace
 * during a live demo without logging out, and puts the demo data back to its
 * starting state. It also states plainly that the data on screen is fictional.
 */
export default function DemoBar({ userType, onSwitchRole }: DemoBarProps) {
  const { resetDemo, business, currentStudent } = useDemo();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Demo
        </span>
        <span className="hidden sm:inline text-xs text-muted-foreground">
          All businesses, students and ratings shown are fictional.
        </span>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <RoleBtn
              label={`Student · ${currentStudent.name.split(' ')[0]}`}
              active={userType === 'student'}
              onClick={() => onSwitchRole('student')}
            />
            <RoleBtn
              label={`Business · ${business.name}`}
              active={userType === 'business'}
              onClick={() => onSwitchRole('business')}
            />
          </div>

          {confirmReset ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { resetDemo(); setConfirmReset(false); }}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground"
              >
                Reset everything
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Reset demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}
