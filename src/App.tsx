import { lazy, Suspense, useEffect, useState } from 'react';
import type { View, UserType } from './types';
import { DemoProvider } from './store';
import Nav from './components/Nav';
import Landing from './pages/Landing';

/*
 * The landing page ships in the first bundle. The app screens are split out so
 * a first-time visitor downloads only what they see, then fetched during idle
 * time right after the landing page renders — ready before anyone clicks.
 */
const loadStudent = () => import('./pages/StudentScreens');
const loadBusiness = () => import('./pages/BusinessScreens');
const loadAuth = () => import('./pages/Auth');
const loadDemoBar = () => import('./components/DemoBar');

const Auth = lazy(loadAuth);
const DemoBar = lazy(loadDemoBar);
const StudentDashboard = lazy(() => loadStudent().then(m => ({ default: m.StudentDashboard })));
const BrowseShifts = lazy(() => loadStudent().then(m => ({ default: m.BrowseShifts })));
const ShiftDetail = lazy(() => loadStudent().then(m => ({ default: m.ShiftDetail })));
const ConfirmedShifts = lazy(() => loadStudent().then(m => ({ default: m.ConfirmedShifts })));
const StudentProfile = lazy(() => loadStudent().then(m => ({ default: m.StudentProfile })));
const BusinessDashboard = lazy(() => loadBusiness().then(m => ({ default: m.BusinessDashboard })));
const CreateShift = lazy(() => loadBusiness().then(m => ({ default: m.CreateShift })));
const ManageShifts = lazy(() => loadBusiness().then(m => ({ default: m.ManageShifts })));
const Applicants = lazy(() => loadBusiness().then(m => ({ default: m.Applicants })));
const CandidateProfile = lazy(() => loadBusiness().then(m => ({ default: m.CandidateProfile })));

function prefetchAppScreens() {
  const run = () => {
    void loadAuth();
    void loadStudent();
    void loadBusiness();
    void loadDemoBar();
  };
  const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(run);
  else window.setTimeout(run, 1500);
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [userType, setUserType] = useState<UserType>(null);
  const [activeShiftId, setActiveShiftId] = useState<string>('1');
  const [activeCandidateId, setActiveCandidateId] = useState<string>('s1');

  useEffect(prefetchAppScreens, []);

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

        {/* app screens load on demand; the blank fallback keeps the page from jumping */}
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
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

        </Suspense>

        {userType && (
          <Suspense fallback={null}>
            <DemoBar userType={userType} onSwitchRole={switchRole} />
          </Suspense>
        )}
      </div>
    </DemoProvider>
  );
}
