import { useEffect, useState } from 'react';
import { checkWalletConnection, connectWallet, type WalletState } from '../lib/wallet';

export function WalletPage() {
  const [wallet, setWallet] = useState<WalletState>({ isConnected: false, publicKey: null, error: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const state = await checkWalletConnection();
      setWallet(state);
      setLoading(false);
    })();
  }, []);

  async function handleConnect() {
    setLoading(true);
    const state = await connectWallet();
    setWallet(state);
    setLoading(false);
  }

  return (
    <main className="py-16 px-6">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Wallet</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Connect to Freighter to sign and verify transactions on Stellar Testnet.
          </p>
        </div>

        {/* Connection card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-elevated dark:shadow-dark-elevated animate-slide-up">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  wallet.isConnected
                    ? 'bg-[var(--color-success)] shadow-sm shadow-[var(--color-success)]/40'
                    : 'bg-[var(--color-text-tertiary)]'
                }`}
              />
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  {loading ? 'Checking...' : wallet.isConnected ? 'Connected to Freighter' : 'Disconnected'}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">Stellar Testnet</p>
              </div>
            </div>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="w-full sm:w-auto rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Connecting...' : wallet.isConnected ? 'Reconnect' : 'Connect Wallet'}
            </button>
          </div>

          {wallet.publicKey && (
            <div className="mt-6 rounded-xl bg-[var(--color-bg-secondary)] p-4 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Public Key
                </span>
                <span className="text-xs rounded-lg bg-[var(--color-success-subtle)] px-2 py-0.5 font-medium text-[var(--color-success)]">
                  Active
                </span>
              </div>
              <p className="break-all font-mono text-sm text-[var(--color-text)]">{wallet.publicKey}</p>
            </div>
          )}

          {wallet.error && (
            <div className="mt-6 rounded-xl bg-[var(--color-error-subtle)] p-4 animate-slide-up">
              <div className="flex gap-3 items-start">
                <svg className="h-5 w-5 shrink-0 mt-0.5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-sm text-[var(--color-error)]">Connection Error</p>
                  <p className="mt-1 text-xs text-[var(--color-error)]/80">{wallet.error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-soft animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Requirements</h3>
          <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            {[
              'Freighter Chrome extension installed and unlocked.',
              'Freighter set to Testnet or Custom network.',
              'A funded account (use Stellar Laboratory Friendbot if needed).',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <svg className="h-4 w-4 mt-0.5 shrink-0 text-[var(--color-brand)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
