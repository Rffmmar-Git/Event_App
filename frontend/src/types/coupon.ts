export type Coupon = {
  id: number;
  user_id: number;
  discount_amount: number;
  expired_at: string;
  is_used: boolean;
};