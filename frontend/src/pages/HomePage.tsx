import { Link } from 'react-router-dom';
import { starterEvents } from '../data/starterEvents';
import { ParticleField } from '../components/ParticleField';

/* ── Brand Logo SVGs ── */

/* Stellar Network Logo */
function StellarLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Stellar">
      {/* Stellar star emblem */}
      <path d="M20 2L25.5 14L38 15L28.5 23.5L31 36L20 29L9 36L11.5 23.5L2 15L14.5 14L20 2Z" fill="currentColor" opacity="0.9" />
      <circle cx="20" cy="19" r="4" fill="currentColor" opacity="0.6" />
      {/* Stellar wordmark */}
      <text x="44" y="24" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" fill="currentColor" letterSpacing="-0.5">Stellar</text>
    </svg>
  );
}

/* Soroban Smart Contracts Logo */
function SorobanLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Soroban">
      {/* Interlocking rings symbol */}
      <circle cx="16" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.8" />
      <circle cx="24" cy="16" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
      <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
      {/* Soroban wordmark */}
      <text x="38" y="24" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" fill="currentColor" letterSpacing="-0.3">Soroban</text>
    </svg>
  );
}

/* Freighter Wallet Logo */
function FreighterLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Freighter">
      {/* Freighter rocket/ship emblem */}
      <path d="M12 32L20 4L28 32L20 26L12 32Z" fill="currentColor" opacity="0.9" />
      <path d="M16 18L20 8L24 18L20 22L16 18Z" fill="currentColor" opacity="0.5" />
      <circle cx="20" cy="30" r="3" fill="currentColor" opacity="0.4" />
      {/* Freighter wordmark */}
      <text x="34" y="24" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" fill="currentColor" letterSpacing="-0.3">Freighter</text>
    </svg>
  );
}

/* Thermal gradient bars, the signature Altius visual */
function HeroBars() {
  const bars = [40, 55, 70, 80, 70, 60, 75, 85, 65, 50, 45, 55];
  return (      <div className="flex items-end justify-center gap-[4px] sm:gap-[8px] mt-8 sm:mt-16" aria-hidden="true">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-[18px] sm:w-[50px] md:w-[65px] rounded-t-sm"
          style={{
            height: `${height * 3}px`,
            opacity: 0.3 + (height / 100) * 0.7,
            backgroundColor: '#ff6a3d',
          }}
        />
      ))}
    </div>
  );
}

/* Solution Card: Dark Cocoa card, Signal Red border */
function SolutionCard({ number, title, description, icon }: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[8px] bg-surface-dark-secondary p-6 sm:p-8 border border-[rgba(255,106,61,0.25)] transition-colors duration-300 hover:border-[#ff6a3d] group">
      <div className="flex items-start justify-between mb-6">
        <span className="text-xs sm:text-sm font-medium tracking-tight text-[#ff6a3d] font-mono">{number}</span>
        <span className="text-[#ff6a3d] transition-colors duration-300 group-hover:text-[#ff7e57] flex-shrink-0 ml-3">
          {icon}
        </span>
      </div>
      <h3 className="text-[24px] font-bold text-[#ffffff] leading-[1.16] tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-[16px] text-[#ffffff] opacity-80 leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
}

/* Feature icons, Flare Orange line-art */
const CalendarIcon = () => (    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const TicketIcon = () => (    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

const RoyaltyIcon = () => (    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* Code + blockchain tech illustration for the problem section */
function CodeChainIllustration() {
  return (
    <svg
      viewBox="0 0 280 180"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="code-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6a3d" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ff6a3d" stopOpacity="0.05" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background dot grid */}
      <g opacity="0.12">
        {Array.from({ length: 10 }).map((_, i) =>
          Array.from({ length: 7 }).map((_, j) => (
            <circle
              key={`dot-${i}-${j}`}
              cx={20 + i * 28}
              cy={18 + j * 26}
              r="1.5"
              fill="#ff6a3d"
            />
          ))
        )}
      </g>

      {/* Subtle background glow */}
      <rect x="80" y="40" width="120" height="100" rx="12" fill="url(#code-glow)" />

      {/* Blockchain node chain — left side */}
      <g opacity="0.6">
        <line x1="35" y1="50" x2="55" y2="70" stroke="#ff6a3d" strokeWidth="1" opacity="0.4" />
        <line x1="55" y1="70" x2="45" y2="98" stroke="#ff6a3d" strokeWidth="1" opacity="0.4" />
        <line x1="45" y1="98" x2="58" y2="120" stroke="#ff6a3d" strokeWidth="1" opacity="0.4" />
        <line x1="55" y1="70" x2="80" y2="70" stroke="#ff6a3d" strokeWidth="1" opacity="0.25" />
        <line x1="45" y1="98" x2="80" y2="98" stroke="#ff6a3d" strokeWidth="1" opacity="0.25" />

        <circle cx="35" cy="50" r="3" fill="#ff6a3d" opacity="0.5" className="animate-pulse-soft" />
        <circle cx="55" cy="70" r="3.5" fill="#ff6a3d" opacity="0.7" />
        <circle cx="45" cy="98" r="3" fill="#ff6a3d" opacity="0.6" />
        <circle cx="58" cy="120" r="2.5" fill="#ff6a3d" opacity="0.4" />
      </g>

      {/* Blockchain node chain — right side */}
      <g opacity="0.6">
        <line x1="245" y1="55" x2="225" y2="75" stroke="#ff6a3d" strokeWidth="1" opacity="0.4" />
        <line x1="225" y1="75" x2="235" y2="100" stroke="#ff6a3d" strokeWidth="1" opacity="0.4" />
        <line x1="235" y1="100" x2="222" y2="125" stroke="#ff6a3d" strokeWidth="1" opacity="0.4" />
        <line x1="225" y1="75" x2="200" y2="75" stroke="#ff6a3d" strokeWidth="1" opacity="0.25" />
        <line x1="235" y1="100" x2="200" y2="100" stroke="#ff6a3d" strokeWidth="1" opacity="0.25" />

        <circle cx="245" cy="55" r="3" fill="#ff6a3d" opacity="0.5" />
        <circle cx="225" cy="75" r="3.5" fill="#ff6a3d" opacity="0.7" className="animate-pulse-soft" />
        <circle cx="235" cy="100" r="3" fill="#ff6a3d" opacity="0.6" />
        <circle cx="222" cy="125" r="2.5" fill="#ff6a3d" opacity="0.4" />
      </g>

      {/* Center: Stylized code brackets with angled brackets */}
      <g filter="url(#glow)">
        {/* Opening angle bracket */}
        <text
          x="105"
          y="95"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="44"
          fontWeight="700"
          fill="#ff6a3d"
          opacity="0.9"
        >
          &lt;
        </text>
        {/* Slash */}
        <text
          x="128"
          y="95"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="44"
          fontWeight="700"
          fill="#ff6a3d"
          opacity="0.55"
        >
          /
        </text>
        {/* Closing angle bracket */}
        <text
          x="148"
          y="95"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="44"
          fontWeight="700"
          fill="#ff6a3d"
          opacity="0.9"
        >
          &gt;
        </text>
      </g>

      {/* Chain link connecting brackets to nodes */}
      <path
        d="M75 85 C85 80, 95 90, 105 90"
        stroke="#ff6a3d"
        strokeWidth="1"
        opacity="0.25"
        strokeDasharray="3 2"
      />
      <path
        d="M165 90 C175 90, 185 80, 200 75"
        stroke="#ff6a3d"
        strokeWidth="1"
        opacity="0.25"
        strokeDasharray="3 2"
      />

      {/* Horizontal divider line under the brackets */}
      <line x1="110" y1="110" x2="170" y2="110" stroke="#ff6a3d" strokeWidth="1" opacity="0.2" />
      <line x1="110" y1="112" x2="155" y2="112" stroke="#ff6a3d" strokeWidth="0.5" opacity="0.12" />

      {/* Small label under */}
      <text
        x="140"
        y="132"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="8"
        fontWeight="500"
        fill="#ff6a3d"
        opacity="0.35"
      >
        soroban_smart_contract
      </text>
    </svg>
  );
}

export function HomePage() {
  return (
    <main>
      {/* SECTION 1: Hero - Obsidian Ember full-viewport */}
      <section className="relative overflow-hidden bg-[#0f1115] min-h-[85dvh] flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-12 sm:py-32">
        {/* Stellar-inspired particle network animation */}
        <ParticleField />
        {/* Thermal background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,106,61,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Display headline */}
          <h1 className="text-[34px] sm:text-[48px] md:text-[60px] font-bold text-[#ffffff] leading-[1.08] tracking-[-1.36px] sm:tracking-[-2.58px] animate-slide-up">
            Decentralized event ticketing
          </h1>
          <h2 className="mt-1 sm:mt-2 text-[34px] sm:text-[48px] md:text-[60px] font-bold text-[#ff6a3d] leading-[1.08] tracking-[-1.36px] sm:tracking-[-2.58px] animate-slide-up" style={{ animationDelay: '100ms' }}>
            built on Stellar.
          </h2>

          {/* Subtext */}
          <p className="mt-4 sm:mt-6 max-w-2xl text-[14px] sm:text-[16px] text-[#ffffff] opacity-70 leading-relaxed animate-slide-up px-2 sm:px-0" style={{ animationDelay: '150ms' }}>
            Create events, mint verifiable tickets, transfer ownership, verify attendance with QR codes, and settle secondary market royalties all on-chain with Soroban smart contracts.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col w-full sm:w-auto sm:flex-row gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-5 py-3 sm:py-2 min-h-[44px] text-[15px] sm:text-[16px] font-medium text-[#ffffff] bg-gradient-to-b from-[#ff6a3d] to-[#e55a2b] rounded-[4px] shadow-[rgba(255,106,61,0.2)_0px_0px_20px_0px_inset] transition-all duration-200 hover:from-[#ff7e57] hover:to-[#ff6a3d] hover:scale-[1.01] active:scale-[0.99] active:opacity-90"
            >
              Explore Events
              <svg className="ml-2 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/wallet"
              className="inline-flex items-center justify-center px-5 py-3 sm:py-2 min-h-[44px] text-[15px] sm:text-[16px] font-medium text-[#ffffff] bg-transparent border border-[#ffffff] rounded-[4px] transition-all duration-200 hover:bg-[rgba(255,255,255,0.08)] hover:scale-[1.01] active:scale-[0.99] active:opacity-90"
            >
              Connect Wallet
            </Link>
          </div>

          {/* Hero Gradient Bars */}
          <HeroBars />
        </div>
      </section>

      {/* SECTION 2: Investor Logos + Soroban MVP - content-visibility for offscreen optimization */}
      <section className="bg-surface-dark border-t border-surface-dark-secondary py-12 sm:py-16 px-4 sm:px-6" style={{ contentVisibility: 'auto', containIntrinsicSize: '280px' }}>
        <div className="mx-auto max-w-5xl text-center">
          {/* Soroban MVP badge — moved from hero */}
          <div className="mb-5 inline-flex items-center gap-2 rounded border border-[#171a21] bg-[#171a21] px-2.5 sm:px-3 py-1.5">
            <span className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-[#ff6a3d] animate-pulse-soft" />
            <span className="text-[10px] sm:text-xs font-medium tracking-tight text-[#ff6a3d] uppercase font-mono">Soroban MVP</span>
          </div>

          <span className="text-[11px] sm:text-sm font-medium tracking-tight text-[#ff6a3d] uppercase font-mono mb-6 sm:mb-8 block">
            Trusted by leading investors and builders
          </span>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 sm:gap-10 items-center justify-items-center">
            <div className="flex items-center justify-center opacity-50 hover:opacity-90 transition-all duration-300 hover:scale-105">
              <StellarLogo className="h-7 sm:h-8 text-[#ffffff]" />
            </div>
            <div className="flex items-center justify-center opacity-50 hover:opacity-90 transition-all duration-300 hover:scale-105">
              <SorobanLogo className="h-7 sm:h-8 text-[#ffffff]" />
            </div>
            <div className="flex items-center justify-center opacity-50 hover:opacity-90 transition-all duration-300 hover:scale-105">
              <FreighterLogo className="h-7 sm:h-8 text-[#ffffff]" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Problem - Vapor Peach breathing space */}
      <section className="bg-[var(--color-bg)] py-16 sm:py-28 px-4 sm:px-6" style={{ contentVisibility: 'auto', containIntrinsicSize: '400px' }}>
        <div className="mx-auto max-w-5xl">
          {/* Section header */}
          <div className="mb-4 sm:mb-6">
            <span className="text-[11px] sm:text-sm font-medium tracking-tight text-[#ff6a3d] uppercase font-mono">
              THE PROBLEM
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[40px] md:text-[48px] font-bold text-[var(--color-text)] leading-[1.13] tracking-[-1.12px] sm:tracking-[-1.92px] mb-8 sm:mb-12">
            Event ticketing is broken.
          </h2>

          {/* Problem statement card */}
          <div className="rounded-[8px] bg-[var(--color-card)] p-6 sm:p-10 border border-[var(--color-border)]">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Code + blockchain illustration */}
              <div className="hidden md:flex items-center justify-center h-48 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <CodeChainIllustration />
              </div>
              <div>
                <p className="text-[16px] text-[var(--color-text)] leading-relaxed">
                  Traditional ticketing platforms charge excessive fees, fail to prevent scalping,
                  and rarely compensate creators when tickets are resold. Organizers lose control of
                  secondary markets, fans pay inflated prices, and the entire system lacks transparency.
                </p>
                <p className="text-[16px] text-[var(--color-text)] leading-relaxed mt-4">
                  StellarPass solves this by encoding every ticket as a Soroban smart contract asset,
                  enforcing royalty payments on secondary sales, and providing verifiable on-chain
                  attendance records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Solutions - Dark Cocoa card grid */}
      <section className="bg-surface-dark py-16 sm:py-28 px-4 sm:px-6" style={{ contentVisibility: 'auto', containIntrinsicSize: '500px' }}>
        <div className="mx-auto max-w-5xl">
          {/* Section header */}
          <div className="mb-6">
            <span className="text-sm font-medium tracking-tight text-[#ff6a3d] uppercase font-mono">
              SOLUTIONS
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[40px] md:text-[48px] font-bold text-[var(--color-text)] leading-[1.13] tracking-[-1.12px] sm:tracking-[-1.92px] mb-8 sm:mb-12">
            Built on Soroban.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <SolutionCard
              number="01"
              title="Event Registry"
              description="Deploy events on Stellar. Track organizers, supply, and pricing through Soroban smart contracts with full on-chain transparency."
              icon={<CalendarIcon />}
            />
            <SolutionCard
              number="02"
              title="Smart Tickets"
              description="Mint unique tokenized passes as verifiable tickets. Owners can transfer, resell, or check in securely at the door."
              icon={<TicketIcon />}
            />
            <SolutionCard
              number="03"
              title="Royalty Engine"
              description="Secondary market resales distribute royalties automatically to organizers and platforms on-chain. No manual settlement required."
              icon={<RoyaltyIcon />}
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: Ongoing Events Glimpse */}
      <section className="bg-[var(--color-bg)] py-16 sm:py-28 px-4 sm:px-6" style={{ contentVisibility: 'auto', containIntrinsicSize: '550px' }}>
        <div className="mx-auto max-w-5xl">
          {/* Section header */}
          <div className="mb-4 sm:mb-6">
            <span className="text-[11px] sm:text-sm font-medium tracking-tight text-[#ff6a3d] uppercase font-mono">
              LIVE EVENTS
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[40px] md:text-[48px] font-bold text-[var(--color-text)] leading-[1.13] tracking-[-1.12px] sm:tracking-[-1.92px] mb-8 sm:mb-12">
            Ongoing events.
          </h2>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {starterEvents.slice(0, 2).map((event) => (
              <Link
                key={event.id}
                to="/events"
                className="group block rounded-[8px] bg-[var(--color-card)] p-5 sm:p-7 border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-ember-glow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] leading-snug tracking-tight group-hover:text-[var(--color-brand)] transition-colors">
                    {event.title}
                  </h3>
                  <span className="shrink-0 rounded px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[var(--color-brand)] border border-[var(--color-brand)]/30">
                    {event.price} XLM
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] uppercase tracking-wider font-mono font-medium mb-4">
                  by {event.organizer}
                </p>

                {/* Ticket progress bar — visual flair */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)] mb-1.5">
                    <span>Sold</span>
                    <span>{Math.floor(event.totalSupply * 0.65)} / {event.totalSupply}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#ff7e57] transition-all duration-700"
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-text-tertiary)]">{event.totalSupply} tickets max</span>
                  <span className="text-xs font-medium text-[var(--color-brand)] group-hover:underline transition-all">
                    View details &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center animate-fade-in">
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-6 py-3 sm:py-2.5 min-h-[44px] text-[15px] sm:text-[16px] font-medium text-[var(--color-brand)] border border-[var(--color-brand)] rounded-[4px] transition-all duration-200 hover:bg-[var(--color-brand-subtle)] hover:scale-[1.01] active:scale-[0.99]"
            >
              View All Events
              <svg className="ml-2 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: Footer */}
      <footer className="bg-surface-dark border-t border-surface-dark-secondary">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/favicon.svg" alt="StellarPass logo" className="h-7 w-7 rounded object-contain" />
                <span className="text-lg font-semibold tracking-tight text-[var(--color-text)]">StellarPass</span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Decentralized event ticketing built on Stellar. Create events, mint verifiable tickets, and settle royalties on-chain with Soroban smart contracts.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {/* X (Twitter) - official Stellar */}
                <a
                  href="https://x.com/StellarOrg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded border border-[#ff6a3d] text-[#ff6a3d] hover:bg-[rgba(255,106,61,0.12)] hover:scale-105 transition-all duration-200"
                  aria-label="Stellar on X (Twitter)"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* GitHub */}
                <a
                  href="https://github.com/stellar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded border border-[#ff6a3d] text-[#ff6a3d] hover:bg-[rgba(255,106,61,0.12)] hover:scale-105 transition-all duration-200"
                  aria-label="Stellar on GitHub"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                {/* LinkedIn - official Stellar Development Foundation */}
                <a
                  href="https://www.linkedin.com/company/stellar-development-foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded border border-[#ff6a3d] text-[#ff6a3d] hover:bg-[rgba(255,106,61,0.12)] hover:scale-105 transition-all duration-200"
                  aria-label="Stellar Development Foundation on LinkedIn"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-4 tracking-tight">Platform</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Home</Link></li>
                <li><Link to="/events" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Events</Link></li>
                <li><Link to="/wallet" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Wallet</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-4 tracking-tight">Resources</h4>
              <ul className="space-y-3">
                <li><a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Stellar Network</a></li>
                <li><a href="https://soroban.stellar.org" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Soroban Docs</a></li>
                <li><a href="https://github.com/stellar" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">GitHub</a></li>
                <li><a href="https://stellar.org/community" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-4 tracking-tight">Developers</h4>
              <ul className="space-y-3">
                <li><a href="https://developers.stellar.org" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Developer Docs</a></li>
                <li><a href="https://github.com/stellar" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Source Code</a></li>
                <li><Link to="/" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">API Reference</Link></li>
                <li><a href="https://stellar.org/network-status" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">Network Status</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
            <p>&copy; {new Date().getFullYear()} StellarPass. Built on the Stellar network.</p>
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-text-tertiary)]">Powered by Soroban smart contracts</span>
              <span className="hidden sm:inline text-[var(--color-text-tertiary)]">|</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)] animate-pulse-soft" />
                Stellar Testnet
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
