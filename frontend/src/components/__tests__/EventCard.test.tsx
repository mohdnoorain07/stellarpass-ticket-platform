import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EventCard } from '../EventCard';
import type { EventItem } from '../../types';

const mockEvent: EventItem = {
  id: 42,
  title: 'Test Event',
  organizer: 'GABCDEF123456789',
  price: 100,
  totalSupply: 500,
  isOnChain: true,
  creatorShareBps: 8000,
  platformShareBps: 2000,
};

describe('EventCard', () => {
  it('renders event title and price', () => {
    render(<EventCard event={mockEvent} isSubmitting={false} onMintTicket={vi.fn()} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('100 XLM')).toBeInTheDocument();
    expect(screen.getByText('500 max')).toBeInTheDocument();
  });

  it('renders on-chain badge when event is on-chain', () => {
    render(<EventCard event={mockEvent} isSubmitting={false} onMintTicket={vi.fn()} />);

    expect(screen.getByText('On-chain')).toBeInTheDocument();
  });

  it('renders royalty breakdown when creatorShareBps is present', () => {
    render(<EventCard event={mockEvent} isSubmitting={false} onMintTicket={vi.fn()} />);

    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('shows "Minting..." when isSubmitting is true', () => {
    render(<EventCard event={mockEvent} isSubmitting={true} onMintTicket={vi.fn()} />);

    expect(screen.getByText('Minting...')).toBeInTheDocument();
  });

  it('shows "Mint Ticket" when not submitting', () => {
    render(<EventCard event={mockEvent} isSubmitting={false} onMintTicket={vi.fn()} />);

    expect(screen.getByText('Mint Ticket')).toBeInTheDocument();
  });

  it('does not show On-chain badge when isOnChain is false', () => {
    const localEvent = { ...mockEvent, isOnChain: false };
    render(<EventCard event={localEvent} isSubmitting={false} onMintTicket={vi.fn()} />);

    expect(screen.queryByText('On-chain')).not.toBeInTheDocument();
  });
});
