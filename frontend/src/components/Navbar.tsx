import { memo, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../lib/ThemeContext';
import type { WalletState } from '../lib/wallet';

export const Navbar = memo(function Navbar() {
  const [wallet, setWallet] = useState<WalletState>({ isConnected: false, publicKey: null, error: null });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Dynamic import so @stellar/freighter-api is loaded after paint, not before
    // Use requestIdleCallback (with setTimeout fallback) to avoid competing with LCP
    const scheduleCheck = () => {
      const checkConn = async () => {
        const { checkWalletConnection } = await import('../lib/wallet');
        const state = await checkWalletConnection();
        setWallet(state);
      };
      checkConn();
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(scheduleCheck, { timeout: 500 });
    } else {
      setTimeout(scheduleCheck, 200);
    }

    // Poll less frequently (10s instead of 3s) and let wallet page handle explicit reconnect
    const interval = setInterval(async () => {
      const { checkWalletConnection } = await import('../lib/wallet');
      const state = await checkWalletConnection();
      setWallet(state);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
    `relative text-sm font-medium tracking-tight transition-colors duration-200 ${
      isActive
        ? 'text-[var(--color-brand)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-2.5 px-3 rounded text-sm font-medium tracking-tight transition-colors duration-200 ${
      isActive
        ? 'text-[var(--color-brand)] bg-[var(--color-brand-subtle)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)]'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <img
            src="/favicon.svg"
            alt="StellarPass"
            className="h-8 w-8 rounded object-contain transition-all duration-300 group-hover:scale-105"
          />
          <span className="text-base font-semibold tracking-tight text-[var(--color-text)]">
            StellarPass
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
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
                <span className={`relative px-3 py-2 rounded transition-colors duration-200 ${isActive ? 'bg-[var(--color-brand-subtle)]' : 'hover:bg-[var(--color-bg-tertiary)]'}`}>
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--color-brand)]" />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Wallet status */}
          <div className="hidden sm:flex items-center gap-2 rounded border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                wallet.isConnected ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-tertiary)]'
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
              className="btn-primary text-xs !px-3 !py-1.5"
            >
              Connect
            </NavLink>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav - render always for SEO but hidden via CSS */}        <div
          id="mobile-navigation"
          className={`border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 md:hidden ${
            mobileMenuOpen ? 'animate-slide-down' : 'hidden'
          }`}
          role="navigation"
          aria-label="Mobile navigation"
        >
        <nav className="flex flex-col gap-1">
          <NavLink to="/" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/events" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Events</NavLink>
          <NavLink to="/check-in" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Check-in</NavLink>
          <NavLink to="/wallet" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Wallet</NavLink>
        </nav>
      </div>
    </header>
  );
});
