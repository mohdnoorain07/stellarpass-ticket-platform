import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm animate-fade-in">
        <h1 className="text-[8rem] font-bold leading-none text-[var(--color-brand)]">404</h1>
        <h2 className="mt-6 text-2xl font-semibold text-[var(--color-text)] tracking-tight">Page not found</h2>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn-primary mt-8 inline-flex"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go back home
        </Link>
      </div>
    </main>
  );
}
