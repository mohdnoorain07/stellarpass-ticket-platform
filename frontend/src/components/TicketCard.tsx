import { memo } from 'react';
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

export const TicketCard = memo(function TicketCard({
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
    <article className="rounded-[8px] bg-[var(--color-card)] p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 border border-[var(--color-border)] hover:border-[var(--color-border-hover)]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-[var(--color-brand)] font-semibold">#{ticket.id}</span>
          <span className={`text-xs px-2.5 py-1 rounded font-medium border ${
            ticket.forSale
              ? 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border-[var(--color-warning)]/30'
              : isOwner
                ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)] border-[var(--color-success)]/30'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] border-transparent'
          }`}>
            {ticket.forSale ? `${ticket.salePrice} XLM` : isOwner ? 'Owned' : 'Transferred'}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)] tracking-tight">{ticket.eventTitle}</h3>
        <p className="mt-1.5 text-xs text-[var(--color-text-tertiary)] font-mono break-all">
          {ticket.owner.slice(0, 12)}...{ticket.owner.slice(-4)}
        </p>
      </div>

      {/* Owner controls */}
      {isOwner && (
        <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center p-3 sm:p-4 rounded bg-[var(--color-bg-secondary)]">
            <div className="bg-[var(--color-bg)] p-2.5 rounded shrink-0 border border-[var(--color-border)]">
              <QRCodeSVG
                value={`stellarpass:ticket:${ticket.id}`}
                size={72}
                bgColor="transparent"
                fgColor="#ffffff"
                level="Q"
              />
            </div>              <div className="space-y-2 w-full">
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">Check-in Code</p>
              <p className="text-[10px] font-mono bg-[var(--color-bg)] px-2 sm:px-2.5 py-1.5 rounded text-[var(--color-text-secondary)] border border-[var(--color-border)] break-all">
                stellarpass:ticket:{ticket.id}
              </p>
              <div className="flex gap-2">                  <input
                  value={transferRecipient}
                  onChange={(e) => onChangeTransferRecipient(e.target.value)}
                  className="min-w-0 flex-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 sm:py-2 text-xs text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
                  placeholder="G... recipient"
                  aria-label="Recipient wallet address"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onTransfer(ticket)}
                  className="btn-primary !text-xs !px-3.5 !py-2.5 sm:!py-2"
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
                className="w-full rounded bg-[var(--color-success-subtle)] border border-[var(--color-success)]/30 px-3 py-2.5 text-xs font-semibold text-[var(--color-success)] transition-all duration-200 hover:opacity-80 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
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
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
                  placeholder="Price"
                  type="number"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-tertiary)]">XLM</span>
              </div>
              <button
                onClick={() => onListForResale(ticket)}
                disabled={isSubmitting}
                className="shrink-0 rounded bg-[var(--color-warning-subtle)] border border-[var(--color-warning)]/30 px-3.5 py-2 text-xs font-semibold text-[var(--color-warning)] transition-all duration-200 hover:opacity-80 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? 'Listing...' : 'List for Resale'}
              </button>
            </div>
          )}

          {/* Used badge */}
          {ticket.used && (
            <div className="mt-4 rounded bg-[var(--color-bg-tertiary)] px-4 py-2.5 text-center text-xs font-medium text-[var(--color-text-tertiary)]">
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
            <p className="text-xl font-bold text-[var(--color-brand)]">{ticket.salePrice} XLM</p>
          </div>
          <button
            onClick={() => onBuyResale(ticket)}
            disabled={isSubmitting}
            className="btn-primary !text-sm !px-5 !py-2.5"
          >
            {isSubmitting ? 'Purchasing...' : 'Purchase'}
          </button>
        </div>
      )}
    </article>
  );
});
