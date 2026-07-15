import { QRCodeSVG } from 'qrcode.react';
import type { TicketItem } from '../types';
import type { WalletState } from '../lib/wallet';

interface TicketCardProps {
  ticket: TicketItem;
  wallet: WalletState;
  isSubmitting: boolean;
  transferRecipient: string;
  resalePrice: string;
  onChangeTransferRecipient: (value: string) => void;
  onChangeResalePrice: (value: string) => void;
  onTransfer: (ticket: TicketItem) => void;
  onOwnerCheckIn: (ticket: TicketItem) => void;
  onListForResale: (ticket: TicketItem) => void;
  onBuyResale: (ticket: TicketItem) => void;
}

export function TicketCard({
  ticket,
  wallet,
  isSubmitting,
  transferRecipient,
  resalePrice,
  onChangeTransferRecipient,
  onChangeResalePrice,
  onTransfer,
  onOwnerCheckIn,
  onListForResale,
  onBuyResale,
}: TicketCardProps) {
  const isOwner = wallet.publicKey === ticket.owner;

  return (
    <article className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-elevated dark:hover:shadow-dark-elevated">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-[var(--color-brand)] font-semibold">#{ticket.id}</span>
          <span className={`text-xs px-2.5 py-1 rounded-xl font-medium ${
            ticket.forSale
              ? 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]'
              : isOwner
                ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)]'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]'
          }`}>
            {ticket.forSale ? `${ticket.salePrice} XLM` : isOwner ? 'Owned' : 'Transferred'}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{ticket.eventTitle}</h3>
        <p className="mt-1.5 text-xs text-[var(--color-text-tertiary)] font-mono break-all">
          {ticket.owner.slice(0, 12)}...{ticket.owner.slice(-4)}
        </p>
      </div>

      {/* Owner controls */}
      {isOwner && (
        <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row gap-4 items-center p-4 rounded-xl bg-[var(--color-bg-secondary)]">
            <div className="bg-white dark:bg-[var(--color-dark-elevated)] p-2.5 rounded-xl shadow-soft shrink-0">
              <QRCodeSVG
                value={`stellarpass:ticket:${ticket.id}`}
                size={72}
                bgColor="#ffffff"
                fgColor="#18181b"
                level="Q"
              />
            </div>
            <div className="space-y-2.5 w-full">
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">Check-in Code</p>
              <p className="text-[10px] font-mono bg-[var(--color-bg)] px-2.5 py-1.5 rounded-lg text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                stellarpass:ticket:{ticket.id}
              </p>
              <div className="flex gap-2">
                <input
                  value={transferRecipient}
                  onChange={(e) => onChangeTransferRecipient(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
                  placeholder="G... recipient"
                  aria-label="Recipient wallet address"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onTransfer(ticket)}
                  className="rounded-xl bg-brand-gradient px-3.5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>

          {/* Self check-in */}
          {!ticket.forSale && !ticket.used && (
            <div className="mt-3">
              <button
                onClick={() => onOwnerCheckIn(ticket)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[var(--color-success-subtle)] bg-[var(--color-success-subtle)] px-3 py-2.5 text-xs font-semibold text-[var(--color-success)] transition-all duration-200 hover:shadow-soft active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? 'Checking In...' : 'Check In as Owner'}
              </button>
            </div>
          )}

          {/* Resale listing */}
          {!ticket.forSale && !ticket.used && (
            <div className="mt-3 flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  value={resalePrice}
                  onChange={(e) => onChangeResalePrice(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
                  placeholder="Price"
                  type="number"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-tertiary)]">XLM</span>
              </div>
              <button
                onClick={() => onListForResale(ticket)}
                disabled={isSubmitting}
                className="shrink-0 rounded-xl border border-[var(--color-warning-subtle)] bg-[var(--color-warning-subtle)] px-3.5 py-2 text-xs font-semibold text-[var(--color-warning)] transition-all duration-200 hover:shadow-soft active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? 'Listing...' : 'List for Resale'}
              </button>
            </div>
          )}

          {/* Used badge */}
          {ticket.used && (
            <div className="mt-4 rounded-xl bg-[var(--color-bg-tertiary)] px-4 py-2.5 text-center text-xs font-medium text-[var(--color-text-tertiary)]">
              This ticket has been used for entry.
            </div>
          )}
        </div>
      )}

      {/* Buy resale ticket */}
      {ticket.forSale && !isOwner && (
        <div className="mt-6 pt-5 border-t border-[var(--color-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--color-text-tertiary)]">Resale Price</p>
            <p className="text-xl font-bold gradient-text">{ticket.salePrice} XLM</p>
          </div>
          <button
            onClick={() => onBuyResale(ticket)}
            disabled={isSubmitting}
            className="rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? 'Purchasing...' : 'Purchase'}
          </button>
        </div>
      )}
    </article>
  );
}
