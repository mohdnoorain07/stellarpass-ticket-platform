import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityFeed, type FeedItem } from '../ActivityFeed';

const mockItems: FeedItem[] = [
  {
    id: '1',
    type: 'mint',
    message: 'Ticket #1 minted for "Test Event"',
    timestamp: new Date('2024-01-01T12:00:00Z').toISOString(),
    txHash: 'abc123def456',
  },
  {
    id: '2',
    type: 'checkin',
    message: 'Ticket #2 checked in at gate entrance',
    timestamp: new Date('2024-01-01T12:05:00Z').toISOString(),
  },
];

describe('ActivityFeed', () => {
  it('renders the network activity header', () => {
    render(<ActivityFeed items={mockItems} />);
    expect(screen.getByText('Network Activity')).toBeInTheDocument();
  });

  it('renders each feed item message', () => {
    render(<ActivityFeed items={mockItems} />);
    expect(screen.getByText('Ticket #1 minted for "Test Event"')).toBeInTheDocument();
    expect(screen.getByText('Ticket #2 checked in at gate entrance')).toBeInTheDocument();
  });

  it('renders type badges with correct labels', () => {
    render(<ActivityFeed items={mockItems} />);
    expect(screen.getByText('mint')).toBeInTheDocument();
    expect(screen.getByText('checkin')).toBeInTheDocument();
  });

  it('renders transaction link when txHash is present', () => {
    render(<ActivityFeed items={mockItems} />);
    const txLink = screen.getByText(/abc123def4/);
    expect(txLink).toBeInTheDocument();
    expect(txLink.closest('a')).toHaveAttribute('href', 'https://stellar.expert/explorer/testnet/tx/abc123def456');
  });

  it('shows simulated events label', () => {
    render(<ActivityFeed items={mockItems} />);
    expect(screen.getByText('Simulated events')).toBeInTheDocument();
  });

  it('renders empty state gracefully when items array is empty', () => {
    render(<ActivityFeed items={[]} />);
    expect(screen.getByText('Network Activity')).toBeInTheDocument();
    const feedContainer = screen.getByText('Network Activity').closest('aside');
    expect(feedContainer).toBeInTheDocument();
  });

  it('handles unknown type with fallback styling', () => {
    const unknownItem: FeedItem = {
      id: '3',
      type: 'unknown_type',
      message: 'Some unknown event',
      timestamp: new Date().toISOString(),
    };
    render(<ActivityFeed items={[unknownItem]} />);
    expect(screen.getByText('Some unknown event')).toBeInTheDocument();
    expect(screen.getByText('unknown_type')).toBeInTheDocument();
  });
});
