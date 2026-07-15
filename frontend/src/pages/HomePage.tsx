import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Event Registry',
    description: 'Deploy events on Stellar. Track organizers, supply, and pricing through Soroban smart contracts with full on-chain transparency.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: 'Smart Tickets',
    description: 'Mint unique tokenized passes as verifiable tickets. Owners can transfer, resell, or check in securely at the door.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    title: 'Royalty Engine',
    description: 'Secondary market resales distribute royalties automatically to organizers and platforms on-chain. No manual settlement required.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-subtle-glow dark:bg-subtle-glow-dark pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-brand-gradient opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      <section className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-24 sm:py-32 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] shadow-soft animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)] animate-pulse-soft" />
          Soroban Smart Contract MVP
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-[var(--color-text)] animate-slide-up">
          Decentralized event ticketing
        </h1>
        <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl gradient-text animate-slide-up" style={{ animationDelay: '100ms' }}>
          built on Stellar.
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)] leading-relaxed animate-slide-up" style={{ animationDelay: '150ms' }}>
          Create events, mint verifiable tickets, transfer ownership, verify attendance with QR codes, and settle secondary market royalties - all on-chain with Soroban smart contracts.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link
            to="/events"
            className="inline-flex items-center justify-center rounded-xl bg-brand-gradient px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
          >
            Explore Events
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            to="/wallet"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-8 py-3.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-200 hover:border-[var(--color-border-hover)] hover:shadow-soft hover:scale-[1.02] active:scale-[0.98]"
          >
            Connect Wallet
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-elevated dark:hover:shadow-dark-elevated animate-slide-up"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-brand-subtle)] text-[var(--color-brand)] transition-colors duration-300 group-hover:bg-brand-gradient group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{feature.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
