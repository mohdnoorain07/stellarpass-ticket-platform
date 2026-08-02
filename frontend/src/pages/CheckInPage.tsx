import { useEffect, useRef, useState, type FormEvent } from 'react';
import { checkWalletConnection, type WalletState } from '../lib/wallet';
import { getTicketAdminAddress, getTicketContractId, submitContractAction } from '../lib/contracts';

export function CheckInPage() {
  const [wallet, setWallet] = useState<WalletState>({ isConnected: false, publicKey: null, error: null });
  const [ticketCode, setTicketCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerControls = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    void (async () => setWallet(await checkWalletConnection()))();
    return () => scannerControls.current?.stop();
  }, []);

  function stopScanner() {
    scannerControls.current?.stop();
    scannerControls.current = null;
    setIsScanning(false);
  }

  async function startScanner() {
    if (!videoRef.current) return;

    setMessage(null);
    setIsScanning(true);
    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser');
      const reader = new BrowserQRCodeReader();
      scannerControls.current = await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        videoRef.current,
        (result) => {
          if (!result) return;

          const code = result.getText();
          if (!/^stellarpass:ticket:\d+$/.test(code)) {
            setMessage('This QR code is not a StellarPass ticket.');
            return;
          }

          setTicketCode(code);
          setMessage('Ticket scanned. Review and submit check-in.');
          stopScanner();
        }
      );
    } catch (error) {
      stopScanner();
      setMessage(error instanceof Error ? `Camera error: ${error.message}` : 'Unable to access the camera.');
    }
  }

  async function handleCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ticketId = Number(ticketCode.replace('stellarpass:ticket:', '').trim());
    if (!Number.isSafeInteger(ticketId) || ticketId < 1) {
      setMessage('Enter a valid StellarPass ticket code.');
      return;
    }
    if (!wallet.publicKey) {
      setMessage('Connect the administrator Freighter wallet before checking in.');
      return;
    }

    try {
      const admin = getTicketAdminAddress();
      if (wallet.publicKey !== admin) {
        setMessage('The connected wallet is not the ticket administrator.');
        return;
      }

      setIsSubmitting(true);
      const result = await submitContractAction({
        contractId: getTicketContractId(),
        method: 'check_in_ticket',
        args: [
          { type: 'native', value: ticketId },
          { type: 'address', value: admin },
        ],
        source: wallet.publicKey,
      });
      setMessage(result.ok ? `Ticket #${ticketId} checked in successfully.` : `Check-in failed. ${result.error}`);
      if (result.ok) {
        setTicketCode('');
        try {
          const storedTickets = window.localStorage.getItem('stellarpass-tickets');
          if (storedTickets) {
            const list = JSON.parse(storedTickets);
            const updated = list.map((t: any) => t.id === ticketId ? { ...t, used: true } : t);
            window.localStorage.setItem('stellarpass-tickets', JSON.stringify(updated));
          }
        } catch { /* ignore */ }

        try {
          const storedFeed = window.localStorage.getItem('stellarpass-feed') || '[]';
          const currentFeed = JSON.parse(storedFeed);
          currentFeed.unshift({
            id: Math.random().toString(),
            type: 'checkin',
            message: `On-chain check-in: Ticket #${ticketId} verified at gate entrance`,
            timestamp: new Date().toISOString(),
            txHash: result.txHash
          });
          window.localStorage.setItem('stellarpass-feed', JSON.stringify(currentFeed.slice(0, 30)));
        } catch { /* ignore */ }
      }
    } catch (error) {
      setMessage(error instanceof Error ? `Check-in failed. ${error.message}` : 'Check-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">Gate Check-in</h1>
          <p className="mt-1.5 sm:mt-2 text-sm text-[var(--color-text-secondary)]">
            Scan a ticket QR code or paste the code to verify entry on-chain.
          </p>
        </div>

        <div className="card-altius animate-slide-up">
          {/* Admin warning */}
          <div className="mb-6 flex items-start gap-3 rounded bg-[var(--color-warning-subtle)] border border-[var(--color-warning)]/30 p-4 text-sm animate-slide-down">
            <svg className="h-5 w-5 shrink-0 mt-0.5 text-[var(--color-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-medium text-[var(--color-warning)]">Admin-Only Action</p>
              <p className="mt-1 text-xs text-[var(--color-warning)]/80">
                Only the ticket contract administrator can verify tickets.
              </p>
            </div>
          </div>

          {/* Camera preview */}
          <div className="overflow-hidden rounded bg-[var(--color-bg-secondary)] aspect-video relative flex items-center justify-center border border-[var(--color-border)]">
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <svg className="h-10 w-10 text-[var(--color-text-tertiary)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                <p className="text-xs text-[var(--color-text-tertiary)]">Camera preview inactive</p>
              </div>
            )}
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          </div>

          <button
            type="button"
            onClick={() => void (isScanning ? stopScanner() : startScanner())}
            className="mt-4 w-full rounded border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:border-[var(--color-border-hover)] active:scale-[0.98]"
          >
            {isScanning ? 'Stop Scanner' : 'Scan QR Code'}
          </button>

          <form className="mt-6 space-y-4" onSubmit={handleCheckIn}>
            <div>
              <label htmlFor="ticket-code" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Ticket Code
              </label>
              <input
                id="ticket-code"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] font-mono"
                placeholder="stellarpass:ticket:42"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full !text-sm !py-2.5"
            >
              {isSubmitting ? 'Verifying...' : 'Confirm Gate Entry'}
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded bg-[var(--color-brand-subtle)] border border-[var(--color-brand)]/30 px-4 py-3.5 text-sm text-[var(--color-brand)] animate-slide-up">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
