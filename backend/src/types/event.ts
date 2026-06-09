export interface CreateEventInput {
  title: string;
  description?: string;
  location: string;
  category: string;
  start_date: string;
  end_date: string;
  venue_name?: string;
  venue_address?: string;
  latitude?: number;
  longitude?: number;
  tickets?: {
    name: string;
    price: number;
    quota: number;
  }[];
}