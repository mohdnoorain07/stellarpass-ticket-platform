import { memo } from 'react';
import type { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  isSubmitting: boolean;
  onMintTicket: (eventId: number) => void;
}

export const EventCard = memo(function EventCard({ event, isSubmitting, onMintTicket }: EventCardProps) {
  return (
    <article className="rounded-[8px] bg-[var(--color-card)] p-4 sm:p-6 flex flex-col justify-between transition-shadow duration-300 hover:shadow-ember-glow-sm border border-[var(--color-border)] hover:border-[var(--color-border-hover)]">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-[var(--color-text)] leading-snug tracking-tight">{event.title}</h2>
          <span className="shrink-0 rounded px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-[var(--color-brand)] border border-[var(--color-brand)]/30">
            {event.price} XLM
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-mono font-medium">
          {event.organizer.slice(0, 18)}{event.organizer.length > 18 ? '...' : ''}
        </p>

        {event.isOnChain && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-success)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            On-chain
          </div>
        )}

        {event.creatorShareBps && (
          <div className="mt-4 rounded bg-[var(--color-bg-secondary)] p-3.5 text-xs">
            <p className="font-medium text-[var(--color-text-secondary)] mb-2.5">Resale Royalties</p>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-tertiary)]">Creator</span>
                <span className="font-medium text-[var(--color-text)]">{Number(event.creatorShareBps) / 100}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-tertiary)]">Platform</span>
                <span className="font-medium text-[var(--color-text)]">{Number(event.platformShareBps) / 100}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-xs text-[var(--color-text-tertiary)] font-mono">{event.totalSupply} max</span>
        <button
          onClick={() => onMintTicket(event.id)}
          disabled={isSubmitting}
          className="btn-primary !text-xs !px-4 !py-2.5 sm:!py-2"
        >
          {isSubmitting ? 'Minting...' : 'Mint Ticket'}
        </button>
      </div>
    </article>
  );
});
