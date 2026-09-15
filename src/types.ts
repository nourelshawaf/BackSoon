export type View =
  | 'landing'
  | 'signup'
  | 'login'
  | 'student-dashboard'
  | 'browse-shifts'
  | 'shift-detail'
  | 'student-profile'
  | 'confirmed-shifts'
  | 'business-dashboard'
  | 'create-shift'
  | 'manage-shifts'
  | 'applicants'
  | 'candidate-profile';

export type UserType = 'student' | 'business' | null;

export type ShiftStatus = 'open' | 'confirmed' | 'completed';

export interface Shift {
  id: string;
  title: string;
  /** owning business */
  businessId: string;
  business: string;
  district: string;
  date: string;
  time: string;
  /** HUF per hour */
  pay: number;
  status: ShiftStatus;
  category: string;
  /** skills the business is looking for — the basis of the match score */
  skillTags: string[];
  description?: string;
  requirements?: string[];
  postedLabel: string;
  /** set when the business selects an applicant */
  assignedStudentId?: string;
}

export interface Student {
  id: string;
  name: string;
  university: string;
  faculty: string;
  rating: number;
  completedShifts: number;
  skills: string[];
  verified: boolean;
  avatar: string;
  bio: string;
  availability: string;
  district: string;
}

export interface Business {
  id: string;
  name: string;
  district: string;
  category: string;
  verified: boolean;
  about: string;
}

export type ApplicationStatus = 'pending' | 'selected' | 'not-selected';

export interface Application {
  id: string;
  shiftId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedLabel: string;
}

export interface Review {
  shiftId: string;
  studentId: string;
  rating: number;
  comment?: string;
}

export interface NavProps {
  onNavigate: (view: View) => void;
  userType: UserType;
  currentView: View;
}
