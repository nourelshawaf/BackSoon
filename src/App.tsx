import { useState } from 'react';
import type { View, UserType } from './types';
import { DemoProvider } from './store';
import Nav from './components/Nav';
import DemoBar from './components/DemoBar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import {
  StudentDashboard,
  BrowseShifts,
  ShiftDetail,
  ConfirmedShifts,
  StudentProfile,
} from './pages/StudentScreens';
import {
  BusinessDashboard,
  CreateShift,
  ManageShifts,
  Applicants,
  CandidateProfile,
} from './pages/BusinessScreens';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [userType, setUserType] = useState<UserType>(null);
  const [activeShiftId, setActiveShiftId] = useState<string>('1');
  const [activeCandidateId, setActiveCandidateId] = useState<string>('s1');

  function navigate(nextView: View, data?: string) {
    if (nextView === 'shift-detail' && data) setActiveShiftId(data);
    if (nextView === 'applicants' && data) setActiveShiftId(data);
    if (nextView === 'candidate-profile' && data) setActiveCandidateId(data);
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleAuth(type: UserType) {
    setUserType(type);
    setView(type === 'student' ? 'student-dashboard' : 'business-dashboard');
  }

  /** switch role without losing demo state — used by the demo bar */
  function switchRole(type: Exclude<UserType, null>) {
    setUserType(type);
    setView(type === 'student' ? 'student-dashboard' : 'business-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <DemoProvider>
      <div className="min-h-screen bg-background font-sans">
        <Nav onNavigate={navigate} userType={userType} currentView={view} />

        {view === 'landing' && <Landing onNavigate={navigate} />}

        {(view === 'login' || view === 'signup') && (
          <Auth view={view} onNavigate={navigate} onAuth={handleAuth} />
        )}

        {view === 'student-dashboard' && (
          <StudentDashboard onNavigate={navigate} />
        )}
        {view === 'browse-shifts' && (
          <BrowseShifts onNavigate={navigate} />
        )}
        {view === 'shift-detail' && (
          <ShiftDetail onNavigate={navigate} activeShiftId={activeShiftId} />
        )}
        {view === 'confirmed-shifts' && (
          <ConfirmedShifts onNavigate={navigate} />
        )}
        {view === 'student-profile' && (
          <StudentProfile onNavigate={navigate} />
        )}

        {view === 'business-dashboard' && (
          <BusinessDashboard onNavigate={navigate} />
        )}
        {view === 'create-shift' && (
          <CreateShift onNavigate={navigate} />
        )}
        {view === 'manage-shifts' && (
          <ManageShifts onNavigate={navigate} />
        )}
        {view === 'applicants' && (
          <Applicants onNavigate={navigate} activeShiftId={activeShiftId} />
        )}
        {view === 'candidate-profile' && (
          <CandidateProfile
            onNavigate={navigate}
            activeShiftId={activeShiftId}
            activeCandidateId={activeCandidateId}
          />
        )}

        {userType && <DemoBar userType={userType} onSwitchRole={switchRole} />}
      </div>
    </DemoProvider>
  );
}
