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