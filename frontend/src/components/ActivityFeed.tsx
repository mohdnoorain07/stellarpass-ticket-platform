import { LiveActivity } from './LiveActivity';

export type FeedItem = {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  txHash?: string;
};

interface ActivityFeedProps {
  items: FeedItem[];
}

const typeStyles: Record<string, { bg: string; border: string; label: string }> = {
  checkin: { bg: 'bg-[var(--color-success-subtle)]', border: 'border-[var(--color-success)]/30', label: 'text-[var(--color-success)]' },
  mint: { bg: 'bg-[var(--color-brand-subtle)]', border: 'border-[var(--color-brand)]/30', label: 'text-[var(--color-brand)]' },
  resale: { bg: 'bg-[var(--color-accent-subtle)]', border: 'border-[var(--color-accent)]/30', label: 'text-[var(--color-accent)]' },
  sold: { bg: 'bg-[var(--color-accent-subtle)]', border: 'border-[var(--color-accent)]/30', label: 'text-[var(--color-accent)]' },
  transfer: { bg: 'bg-[var(--color-accent-subtle)]', border: 'border-[var(--color-accent)]/30', label: 'text-[var(--color-accent)]' },
  xfer: { bg: 'bg-[var(--color-accent-subtle)]', border: 'border-[var(--color-accent)]/30', label: 'text-[var(--color-accent)]' },
  listed: { bg: 'bg-[var(--color-warning-subtle)]', border: 'border-[var(--color-warning)]/30', label: 'text-[var(--color-warning)]' },
  event: { bg: 'bg-[var(--color-brand-subtle)]', border: 'border-[var(--color-brand)]/30', label: 'text-[var(--color-brand)]' },
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <aside className="card-altius h-fit max-h-[760px]">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2 tracking-tight">
          <span className="h-2 w-2 rounded-full bg-[var(--color-brand)] animate-pulse-soft" />
          Network Activity
        </h3>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Real-time Soroban contract events.</p>
      </div>

      <div className="mb-4">
        <LiveActivity />
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--color-card)] px-2 text-[10px] text-[var(--color-text-tertiary)] font-medium uppercase tracking-wider font-mono">Simulated events</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-[320px] pr-1">
        {items.map((item) => {
          const style = typeStyles[item.type] || { bg: 'bg-[var(--color-bg-tertiary)]', border: 'border-transparent', label: 'text-[var(--color-text-tertiary)]' };
          return (
            <div key={item.id} className="text-xs border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between text-[var(--color-text-tertiary)] mb-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${style.bg} ${style.border} ${style.label}`}>
                  {item.type}
                </span>
                <span className="font-mono">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">{item.message}</p>
              {item.txHash && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${item.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[var(--color-brand)]/60 hover:text-[var(--color-brand)] font-mono transition-colors"
                >
                  Tx: {item.txHash.slice(0, 10)}...
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
