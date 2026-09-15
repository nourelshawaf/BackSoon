import { useState } from 'react';
import type { NavProps } from '../types';
import Logo from './Logo';

export default function Nav({ onNavigate, userType, currentView }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isPublic = currentView === 'landing' || currentView === 'login' || currentView === 'signup';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="group transition-opacity hover:opacity-80"
          aria-label="BackSoon home"
        >
          <Logo size={24} className="text-lg" />
        </button>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-2">
          {isPublic ? (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign up
              </button>
            </>
          ) : userType === 'student' ? (
            <>
              <NavLink label="Browse shifts" active={currentView === 'browse-shifts'} onClick={() => onNavigate('browse-shifts')} />
              <NavLink label="My shifts" active={currentView === 'confirmed-shifts'} onClick={() => onNavigate('confirmed-shifts')} />
              <NavLink label="Dashboard" active={currentView === 'student-dashboard'} onClick={() => onNavigate('student-dashboard')} />
              <button
                onClick={() => onNavigate('student-profile')}
                className="ml-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold"
              >
                AK
              </button>
            </>
          ) : (
            <>
              <NavLink label="Dashboard" active={currentView === 'business-dashboard'} onClick={() => onNavigate('business-dashboard')} />
              <NavLink label="Shifts" active={currentView === 'manage-shifts'} onClick={() => onNavigate('manage-shifts')} />
              <button
                onClick={() => onNavigate('create-shift')}
                className="ml-2 px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
              >
                + Post shift
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {isPublic ? (
            <>
              <MobileNavBtn label="Log in" onClick={() => { onNavigate('login'); setMenuOpen(false); }} />
              <MobileNavBtn label="Sign up" onClick={() => { onNavigate('signup'); setMenuOpen(false); }} primary />
            </>
          ) : userType === 'student' ? (
            <>
              <MobileNavBtn label="Browse shifts" onClick={() => { onNavigate('browse-shifts'); setMenuOpen(false); }} />
              <MobileNavBtn label="My shifts" onClick={() => { onNavigate('confirmed-shifts'); setMenuOpen(false); }} />
              <MobileNavBtn label="Dashboard" onClick={() => { onNavigate('student-dashboard'); setMenuOpen(false); }} />
            </>
          ) : (
            <>
              <MobileNavBtn label="Dashboard" onClick={() => { onNavigate('business-dashboard'); setMenuOpen(false); }} />
              <MobileNavBtn label="Manage shifts" onClick={() => { onNavigate('manage-shifts'); setMenuOpen(false); }} />
              <MobileNavBtn label="+ Post shift" onClick={() => { onNavigate('create-shift'); setMenuOpen(false); }} primary />
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function MobileNavBtn({ label, onClick, primary }: { label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
        primary ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
      }`}
    >
      {label}
    </button>
  );
}
