import type { Shift } from '../types';

interface ShiftCardProps {
  shift: Shift;
  onClick?: () => void;
  variant?: 'browse' | 'manage';
  /** match score for the viewing student (browse variant) */
  match?: number;
  /** number of applications received (manage variant) */
  applicants?: number;
  /** overrides the status pill, e.g. an application's own status */
  statusLabel?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Hospitality: 'bg-accent-light text-accent',
  Retail: 'bg-muted text-foreground',
  'Food & Beverage': 'bg-warm-light text-deep',
  Events: 'bg-secondary text-secondary-foreground',
};

export default function ShiftCard({ shift, onClick, variant = 'browse', match, applicants, statusLabel }: ShiftCardProps) {
  const status = statusLabel ?? shift.status;
  const statusColor = status === 'completed'
    ? 'bg-muted text-muted-foreground'
    : 'bg-accent-light text-accent';

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-card border border-border rounded-xl p-5 hover:border-foreground/20 hover:shadow-sm transition-all duration-150"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[shift.category] ?? 'bg-muted text-muted-foreground'}`}>
              {shift.category}
            </span>
            {status !== 'open' && (
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor}`}>
                {status}
              </span>
            )}
          </div>
          <h3 className="font-display font-600 text-base text-foreground leading-tight">
            {shift.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">{shift.business}</p>
        </div>

        {/* Match score (student view) */}
        {match !== undefined && variant === 'browse' && (
          <div className="flex-shrink-0 text-right">
            <span className="text-lg font-display font-700 text-accent">{match}%</span>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">match</p>
          </div>
        )}

        {/* Applicants count (business view) */}
        {variant === 'manage' && applicants !== undefined && (
          <div className="flex-shrink-0 text-right">
            <span className="text-lg font-display font-700 text-foreground">{applicants}</span>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">
              {applicants === 1 ? 'applicant' : 'applicants'}
            </p>
          </div>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-3 gap-3">
        <InfoItem icon={<LocationIcon />} label="Location" value={shift.district} />
        <InfoItem icon={<CalendarIcon />} label="Date" value={shift.date.replace(' 2026', '')} />
        <InfoItem icon={<ClockIcon />} label="Time" value={shift.time} />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="font-display font-600 text-foreground">
          {shift.pay.toLocaleString('hu-HU')} HUF
          <span className="text-muted-foreground font-normal text-sm">/hr</span>
        </span>
        {variant === 'browse' && shift.status === 'open' && (
          <span className="text-xs font-medium text-accent group-hover:underline">
            View & Apply →
          </span>
        )}
        {variant === 'manage' && (
          <span className="text-xs font-medium text-accent group-hover:underline">
            View applicants →
          </span>
        )}
      </div>
    </button>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-0.5 text-muted-foreground">{icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  );
}

function LocationIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1a3 3 0 0 1 3 3c0 2-3 7-3 7S3 6 3 4a3 3 0 0 1 3-3z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6" cy="4" r="1" fill="currentColor"/></svg>;
}

function CalendarIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 1v2M8 1v2M1 5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}

function ClockIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}
