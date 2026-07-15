import { useEffect, useState } from 'react';
import { fetchRecentContractEvents, type LiveContractEvent } from '../lib/liveEvents';

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function LiveActivity() {
  const [events, setEvents] = useState<LiveContractEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const next = await fetchRecentContractEvents();
        if (active) {
          setEvents(next);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Live activity unavailable.');
          setIsLoading(false);
        }
      }
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), 10_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 rounded-xl bg-[var(--color-bg-tertiary)] p-3.5">
            <div className="h-4 w-14 rounded-lg bg-[var(--color-border)]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 rounded-lg bg-[var(--color-border)]" />
              <div className="h-2 w-1/3 rounded-lg bg-[var(--color-border)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl bg-[var(--color-warning-subtle)] p-4 text-center animate-fade-in">
        <p className="text-xs text-[var(--color-warning)]">{error}</p>
      </div>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-tertiary)]">
          <svg className="h-5 w-5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">No contract activity yet.</p>
        <p className="mt-1 text-xs text-[var(--color-text-tertiary)] max-w-xs">Deploy contracts to Stellar testnet and events will appear here.</p>
      </div>
    );
  }

  // Event list
  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <li
          key={event.id}
          className="group rounded-xl bg-[var(--color-bg-secondary)] p-3.5 transition-all duration-200 hover:bg-[var(--color-bg-tertiary)]"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {event.action}
            </span>
            <span className="shrink-0 text-[10px] text-[var(--color-text-tertiary)] font-mono">
              {formatTimestamp(event.occurredAt)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-[var(--color-text-tertiary)]">
              ledger <span className="font-mono text-[var(--color-text-secondary)]">{event.ledger}</span>
            </span>
            {event.transactionHash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${event.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--color-brand)]/60 transition-colors hover:text-[var(--color-brand)]"
              >
                {event.transactionHash.slice(0, 8)}...
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
