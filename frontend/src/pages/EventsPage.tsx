import { useEffect, useState, type FormEvent } from 'react';
import { checkWalletConnection, type WalletState } from '../lib/wallet';
import { EventCard } from '../components/EventCard';
import { TicketCard } from '../components/TicketCard';
import { EventForm, type EventFormData } from '../components/EventForm';
import { ActivityFeed, type FeedItem } from '../components/ActivityFeed';
import {
  getTicketContractId,
  submitContractAction,
  submitEventCreation,
  submitOwnerCheckIn,
  submitPrimaryTicketPurchase,
  submitTicketListing,
  submitTicketResale
} from '../lib/contracts';
import { starterEvents } from '../data/starterEvents';
import type { EventItem, TicketItem } from '../types';

const DEFAULT_FEED_ITEMS: FeedItem[] = [
  { id: 'f1', type: 'info', message: 'StellarPass smart contract listener initialized.', timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 'f2', type: 'event', message: 'Event "Launch Night" created on-chain by Nova Studios', timestamp: new Date(Date.now() - 400000).toISOString() },
  { id: 'f3', type: 'mint', message: 'Ticket #1 minted by user GB...2S', timestamp: new Date(Date.now() - 250000).toISOString() },
  { id: 'f4', type: 'checkin', message: 'Ticket #1 checked in at venue door (on-chain verified)', timestamp: new Date(Date.now() - 120000).toISOString() }
];

export function EventsPage() {
  const [wallet, setWallet] = useState<WalletState>({ isConnected: false, publicKey: null, error: null });
  const [events, setEvents] = useState<EventItem[]>(starterEvents);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<'events' | 'tickets' | 'create'>('events');
  const [transferRecipients, setTransferRecipients] = useState<Record<number, string>>({});
  const [resalePrices, setResalePrices] = useState<Record<number, string>>({});
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const [form, setForm] = useState<EventFormData>({
    title: '',
    organizer: '',
    price: '100',
    totalSupply: '200',
    createOnChain: false,
    creatorShareBps: '8000',
    platformShareBps: '2000'
  });

  // Load from local storage
  useEffect(() => {
    try {
      const storedEvents = window.localStorage.getItem('stellarpass-events');
      if (storedEvents) setEvents(JSON.parse(storedEvents) as EventItem[]);
      const storedTickets = window.localStorage.getItem('stellarpass-tickets');
      if (storedTickets) setTickets(JSON.parse(storedTickets) as TicketItem[]);
      const storedFeed = window.localStorage.getItem('stellarpass-feed');
      if (storedFeed) {
        setFeed(JSON.parse(storedFeed) as FeedItem[]);
      } else {
        setFeed(DEFAULT_FEED_ITEMS);
        window.localStorage.setItem('stellarpass-feed', JSON.stringify(DEFAULT_FEED_ITEMS));
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to local storage
  useEffect(() => {
    window.localStorage.setItem('stellarpass-events', JSON.stringify(events));
    window.localStorage.setItem('stellarpass-tickets', JSON.stringify(tickets));
    window.localStorage.setItem('stellarpass-feed', JSON.stringify(feed));
  }, [events, tickets, feed]);

  // Sync state between tabs
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedFeed = window.localStorage.getItem('stellarpass-feed');
        if (storedFeed) setFeed(JSON.parse(storedFeed) as FeedItem[]);
        const storedTickets = window.localStorage.getItem('stellarpass-tickets');
        if (storedTickets) setTickets(JSON.parse(storedTickets) as TicketItem[]);
        const storedEvents = window.localStorage.getItem('stellarpass-events');
        if (storedEvents) setEvents(JSON.parse(storedEvents) as EventItem[]);
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Simulated live activity ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const types = ['mint', 'checkin', 'resale', 'transfer'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      let msg = '';
      if (chosenType === 'mint') {
        const id = Math.floor(Math.random() * 200) + 10;
        msg = `Ticket #${id} minted by user G${Math.random().toString(36).substring(2, 6).toUpperCase()}...`;
      } else if (chosenType === 'checkin') {
        const id = Math.floor(Math.random() * 200) + 1;
        msg = `Ticket #${id} checked in at gate entrance`;
      } else if (chosenType === 'resale') {
        const id = Math.floor(Math.random() * 200) + 1;
        const price = Math.floor(Math.random() * 50) + 70;
        msg = `Ticket #${id} resold for ${price} XLM (Royalties split)`;
      } else {
        const id = Math.floor(Math.random() * 200) + 1;
        msg = `Ticket #${id} transferred to user G${Math.random().toString(36).substring(2, 6).toUpperCase()}...`;
      }
      setFeed(prev => [
        { id: Math.random().toString(), type: chosenType, message: msg, timestamp: new Date().toISOString() },
        ...prev
      ].slice(0, 20));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    void (async () => {
      const state = await checkWalletConnection();
      setWallet(state);
    })();
  }, []);

  function addFeedEvent(type: string, message: string, txHash?: string) {
    setFeed(prev => [{
      id: Math.random().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      txHash
    }, ...prev].slice(0, 20));
  }

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title || !form.organizer) {
      setMessage('Please provide a title and organizer name.');
      return;
    }

    const priceValue = Number(form.price);
    const supplyValue = Number(form.totalSupply);
    const creatorBps = Number(form.creatorShareBps);
    const platformBps = Number(form.platformShareBps);

    setIsSubmitting(true);
    setMessage(form.createOnChain ? 'Submitting to Stellar Testnet...' : 'Creating local draft...');

    let newEventId = Date.now();
    let txHash: string | undefined;

    if (form.createOnChain) {
      if (!wallet.isConnected || !wallet.publicKey) {
        setMessage('Connect your wallet to publish an event on-chain.');
        setIsSubmitting(false);
        return;
      }
      try {
        const result = await submitEventCreation({
          organizer: wallet.publicKey,
          title: form.title,
          price: priceValue,
          totalSupply: supplyValue,
          source: wallet.publicKey,
        });
        if (!result.ok) {
          setMessage(`On-chain event creation failed. ${result.error}`);
          setIsSubmitting(false);
          return;
        }
        newEventId = Number(result.returnValue) || Math.floor(Math.random() * 1000000);
        txHash = result.txHash;
        setMessage(`Event "${form.title}" published on-chain!`);
      } catch (error) {
        setMessage(error instanceof Error ? `Error: ${error.message}` : 'Failed to publish event.');
        setIsSubmitting(false);
        return;
      }
    } else {
      setMessage(`Created local draft for "${form.title}".`);
    }

    const newEvent: EventItem = {
      id: newEventId,
      title: form.title,
      organizer: form.organizer,
      price: Number.isFinite(priceValue) ? priceValue : 100,
      totalSupply: Number.isFinite(supplyValue) ? supplyValue : 200,
      isOnChain: form.createOnChain,
      txHash,
      creatorShareBps: creatorBps,
      platformShareBps: platformBps
    };

    setEvents((current) => [newEvent, ...current]);
    addFeedEvent(
      'event',
      form.createOnChain
        ? `On-Chain Event: "${form.title}" by ${wallet.publicKey?.slice(0, 8)}...`
        : `Local Draft: "${form.title}"`,
      txHash
    );

    setForm({ title: '', organizer: '', price: '100', totalSupply: '200', createOnChain: false, creatorShareBps: '8000', platformShareBps: '2000' });
    setIsSubmitting(false);
    setActiveTab('events');
  }

  async function handleMintTicket(eventId: number) {
    if (!wallet.isConnected || !wallet.publicKey) {
      setMessage('Connect your wallet before minting a ticket.');
      return;
    }
    const event = events.find((item) => item.id === eventId);
    if (!event) return;

    setIsSubmitting(true);
    setMessage(`Preparing wallet signing for ${event.title}...`);

    const ticket: TicketItem = {
      id: Date.now(),
      eventId: event.id,
      eventTitle: event.title,
      owner: wallet.publicKey,
      used: false
    };

    try {
      const contractResult = await submitPrimaryTicketPurchase({
        eventId: event.id,
        buyer: wallet.publicKey,
        metadata: event.title,
        source: wallet.publicKey,
      });
      if (!contractResult.ok) {
        setMessage(`Ticket mint failed. ${contractResult.error}`);
        return;
      }
      const ticketId = Number(contractResult.returnValue);
      if (!Number.isSafeInteger(ticketId) || ticketId < 1) {
        setMessage('Ticket mint succeeded but did not return a valid ticket ID.');
        return;
      }
      ticket.id = ticketId;
      setTickets((current) => [ticket, ...current]);
      addFeedEvent('mint', `On-Chain: Ticket #${ticketId} minted for "${event.title}"`, contractResult.txHash);
      setMessage(`Ticket minted on Stellar testnet.`);
      setActiveTab('tickets');
    } catch (error) {
      setMessage(error instanceof Error ? `Mint failed. ${error.message}` : 'Ticket mint failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTransferTicket(ticket: TicketItem) {
    const recipient = transferRecipients[ticket.id]?.trim();
    if (!recipient || !/^G[A-Z2-7]{55}$/.test(recipient)) {
      setMessage('Enter a valid Stellar public key.');
      return;
    }
    if (!wallet.publicKey || wallet.publicKey !== ticket.owner) {
      setMessage('Connect the ticket-owner wallet before transferring.');
      return;
    }
    setIsSubmitting(true);
    setMessage(`Signing transfer of ticket #${ticket.id}...`);
    try {
      const result = await submitContractAction({
        contractId: getTicketContractId(),
        method: 'transfer_ticket',
        args: [
          { type: 'u32', value: ticket.id },
          { type: 'address', value: wallet.publicKey },
          { type: 'address', value: recipient },
        ],
        source: wallet.publicKey,
      });
      if (!result.ok) {
        setMessage(`Transfer failed. ${result.error}`);
        return;
      }
      setTickets((current) => current.map((item) => (item.id === ticket.id ? { ...item, owner: recipient } : item)));
      setTransferRecipients((current) => ({ ...current, [ticket.id]: '' }));
      addFeedEvent('xfer', `On-Chain: Ticket #${ticket.id} transferred to ${recipient.slice(0, 8)}...`, result.txHash);
      setMessage(`Ticket #${ticket.id} transferred on-chain.`);
    } catch (error) {
      setMessage(error instanceof Error ? `Transfer failed. ${error.message}` : 'Transfer failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleListForResale(ticket: TicketItem) {
    const priceStr = resalePrices[ticket.id]?.trim();
    const price = Number(priceStr);
    if (!priceStr || isNaN(price) || price <= 0) {
      setMessage('Enter a valid price greater than 0.');
      return;
    }
    if (!wallet.publicKey || wallet.publicKey !== ticket.owner) {
      setMessage('Connect the ticket-owner wallet before listing.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitTicketListing({
        ticketId: ticket.id,
        seller: ticket.owner,
        salePrice: price,
        source: wallet.publicKey,
      });
      if (!result.ok) {
        setMessage(`Resale listing failed. ${result.error}`);
        return;
      }
      setTickets((current) =>
        current.map((t) => (t.id === ticket.id ? { ...t, forSale: true, salePrice: price } : t))
      );
      addFeedEvent('listed', `On-Chain: Ticket #${ticket.id} listed for ${price} XLM`, result.txHash);
      setMessage(`Ticket #${ticket.id} listed for resale.`);
    } catch (error) {
      setMessage(error instanceof Error ? `Listing failed. ${error.message}` : 'Listing failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOwnerCheckIn(ticket: TicketItem) {
    if (!wallet.isConnected || !wallet.publicKey) {
      setMessage('Connect your wallet before checking in.');
      return;
    }
    if (wallet.publicKey !== ticket.owner) {
      setMessage('Only the ticket owner can self-check-in.');
      return;
    }
    setIsSubmitting(true);
    setMessage(`Signing check-in for ticket #${ticket.id}...`);
    try {
      const result = await submitOwnerCheckIn({
        ticketId: ticket.id,
        owner: wallet.publicKey,
        source: wallet.publicKey,
      });
      if (!result.ok) {
        setMessage(`Check-in failed. ${result.error}`);
        return;
      }
      setTickets((current) => current.map((t) => (t.id === ticket.id ? { ...t, used: true } : t)));
      addFeedEvent('checkin', `On-Chain: Ticket #${ticket.id} checked in by owner`, result.txHash);
      setMessage(`Ticket #${ticket.id} checked in on-chain.`);
    } catch (error) {
      setMessage(error instanceof Error ? `Check-in failed. ${error.message}` : 'Check-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBuyResaleTicket(ticket: TicketItem) {
    if (!wallet.publicKey) {
      setMessage('Connect your wallet to purchase.');
      return;
    }
    if (wallet.publicKey === ticket.owner) {
      setMessage('You cannot buy your own ticket.');
      return;
    }
    if (!ticket.salePrice) return;

    setIsSubmitting(true);
    setMessage(`Executing resale purchase for ticket #${ticket.id}...`);
    try {
      const result = await submitTicketResale({
        ticketId: ticket.id,
        buyer: wallet.publicKey,
        source: wallet.publicKey
      });
      if (!result.ok) {
        setMessage(`Resale purchase failed. ${result.error}`);
        return;
      }
      setTickets((current) =>
        current.map((t) => (t.id === ticket.id ? { ...t, owner: wallet.publicKey!, forSale: false, salePrice: undefined } : t))
      );
      addFeedEvent('sold', `On-Chain: Ticket #${ticket.id} purchased for ${ticket.salePrice} XLM. Royalties paid.`, result.txHash);
      setMessage(`Purchased Ticket #${ticket.id} on-chain.`);
    } catch (error) {
      setMessage(error instanceof Error ? `Purchase failed. ${error.message}` : 'Purchase failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-10 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">Events</h1>            <p className="mt-1.5 sm:mt-2 text-sm text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Browse events, mint tickets, transfer ownership, or list them for resale. All actions verified via Soroban on Stellar testnet.
          </p>
        </div>

        {/* Status bar */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${wallet.isConnected ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-tertiary)]'}`} />
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {wallet.isConnected ? 'Freighter Connected' : 'Not Connected'}
              </p>
              {wallet.publicKey && (
                <p className="text-xs text-[var(--color-text-tertiary)] font-mono">{wallet.publicKey.slice(0, 12)}...</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
            <span className="rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] px-2.5 py-1 font-medium font-mono">{events.length} events</span>
            <span className="rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] px-2.5 py-1 font-medium font-mono">{tickets.length} tickets</span>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 flex items-start gap-3 rounded border border-[var(--color-brand)]/30 bg-[var(--color-brand-subtle)] px-5 py-3.5 text-sm text-[var(--color-brand)]">
            <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <p>{message}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 flex gap-1 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] p-1 overflow-x-auto">
          {(['events', 'tickets', 'create'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab === 'events' && 'All Events'}
              {tab === 'tickets' && `My Tickets (${tickets.filter(t => t.owner === wallet.publicKey).length})`}
              {tab === 'create' && 'Host Event'}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="grid items-start gap-8 lg:grid-cols-[1.3fr,0.7fr]">
            <section className="grid gap-5 md:grid-cols-2">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSubmitting={isSubmitting}
                  onMintTicket={handleMintTicket}
                />
              ))}
            </section>
            <ActivityFeed items={feed} />
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <section>
            {tickets.length === 0 ? (
              <div className="rounded-[8px] border border-dashed border-[var(--color-border)] bg-[var(--color-card)] py-16 text-center animate-fade-in">
                <p className="text-lg font-medium text-[var(--color-text-secondary)]">No tickets yet</p>
                <p className="text-sm text-[var(--color-text-tertiary)] mt-1.5">Go to All Events and mint one to see it here.</p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    wallet={wallet}
                    isSubmitting={isSubmitting}
                    transferRecipient={transferRecipients[ticket.id] ?? ''}
                    resalePrice={resalePrices[ticket.id] ?? ''}
                    onChangeTransferRecipient={(value) => setTransferRecipients((curr) => ({ ...curr, [ticket.id]: value }))}
                    onChangeResalePrice={(value) => setResalePrices((curr) => ({ ...curr, [ticket.id]: value }))}
                    onTransfer={handleTransferTicket}
                    onOwnerCheckIn={handleOwnerCheckIn}
                    onListForResale={handleListForResale}
                    onBuyResale={handleBuyResaleTicket}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Create Event Tab */}
        {activeTab === 'create' && (
          <EventForm
            form={form}
            onChange={(field, value) => setForm((c) => ({ ...c, [field]: value }))}
            isSubmitting={isSubmitting}
            onSubmit={handleCreateEvent}
          />
        )}
      </div>
    </main>
  );
}
