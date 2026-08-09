import type { EventItem } from '../types';

/**
 * Demo events published on-chain on the fresh Event contract.
 * IDs match the real on-chain event IDs (Launch Night = 3, Stellar Summit = 4),
 * so the Mint Ticket button calls purchase_ticket against the real contract event.
 */
export const starterEvents: EventItem[] = [
  {
    id: 3,
    title: 'Launch Night',
    organizer: 'Nova Studios',
    price: 120,
    totalSupply: 200,
    isOnChain: true,
    creatorShareBps: 8000,
    platformShareBps: 2000,
  },
  {
    id: 4,
    title: 'Stellar Summit',
    organizer: 'Blue Harbor',
    price: 90,
    totalSupply: 150,
    isOnChain: true,
    creatorShareBps: 8000,
    platformShareBps: 2000,
  },
];
