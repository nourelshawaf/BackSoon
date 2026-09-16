import ProcessFlow from '../components/ProcessFlow';

/**
 * Full-screen presenting page, opened at /present during the pitch.
 * Nothing but the flowchart and its controls — the presenter narrates.
 */
export default function Present() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-8 py-10">
      <div className="w-full max-w-6xl bg-card border border-border rounded-3xl p-6 sm:p-12">
        <ProcessFlow start="immediate" controls="full" keyboard />
      </div>
    </main>
  );
}
