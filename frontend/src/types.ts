export type EventItem = {
  id: number;
  title: string;
  organizer: string;
  price: number;
  totalSupply: number;
  isOnChain?: boolean;
  txHash?: string;
  creatorShareBps?: number;
  platformShareBps?: number;
};

export type TicketItem = {
  id: number;
  eventId: number;
  eventTitle: string;
  owner: string;
  used?: boolean;
  forSale?: boolean;
  salePrice?: number;
};
