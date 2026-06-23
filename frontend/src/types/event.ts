export type Ticket = {
  id: number;
  event_id: number;
  name: string;
  price: number;
  quota: number;
  sold?: number;
};

export type CreateTicketPayload = {
  name: string;
  price: number;
  quota: number;
};

/* NEW */
export type TicketForm = {
  name: string;
  price: string;
  quota: string;
};

export type Voucher = {
  id: number;
  event_id: number;
  code: string;
  discount_amount: number;
  quota: number;
  used_count: number;
  start_date: string;
  end_date: string;
};

export type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  start_date: string;
  end_date: string;
  organizer_id: number;

  tickets?: Ticket[];
  vouchers?: Voucher[];
  
  venue_name?: string;
  venue_address?: string;
  latitude?: number;
  longitude?: number;
};

export type CreateEventPayload = {
  title: string;
  description: string;
  location: string;
  category: string;
  start_date: string;
  end_date: string;

  venue_name?: string;
  venue_address?: string;
  latitude?: number;
  longitude?: number;

  tickets: CreateTicketPayload[];
};