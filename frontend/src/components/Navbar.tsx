import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../lib/ThemeContext';
import { checkWalletConnection, type WalletState } from '../lib/wallet';

export function Navbar() {
  const [wallet, setWallet] = useState<WalletState>({ isConnected: false, publicKey: null, error: null });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkConn = async () => {
      const state = await checkWalletConnection();
      setWallet(state);
    };
    checkConn();
    const interval = setInterval(checkConn, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on Escape and outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-[var(--color-brand)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-2.5 px-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-[var(--color-brand)] bg-[var(--color-brand-subtle)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)]'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gradient text-xs font-bold text-white transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
            SP
          </div>
          <span className="text-base font-semibold tracking-tight text-[var(--color-text)]">
            StellarPass
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/events', label: 'Events' },
            { to: '/check-in', label: 'Check-in' },
            { to: '/wallet', label: 'Wallet' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
            >
              {({ isActive }) => (
                <span className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-[var(--color-brand-subtle)]' : 'hover:bg-[var(--color-bg-tertiary)]'}`}>
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-gradient" />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Wallet status */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 shadow-soft">
            <span
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                wallet.isConnected ? 'bg-[var(--color-success)] shadow-sm shadow-[var(--color-success)]/30' : 'bg-[var(--color-text-tertiary)]'
              }`}
            />
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              {wallet.isConnected && wallet.publicKey
                ? `${wallet.publicKey.slice(0, 6)}...${wallet.publicKey.slice(-4)}`
                : 'Disconnected'}
            </span>
          </div>

          {!wallet.isConnected && (
            <NavLink
              to="/wallet"
              className="rounded-xl bg-brand-gradient px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-brand-gradient-hover hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Connect
            </NavLink>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 md:hidden animate-slide-down">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/events" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Events</NavLink>
            <NavLink to="/check-in" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Check-in</NavLink>
            <NavLink to="/wallet" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Wallet</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
