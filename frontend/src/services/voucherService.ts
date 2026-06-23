import type { Voucher } from "../types/voucher";

const API_URL =
  "http://localhost:5000/vouchers";

export const getEventVouchers =
  async (
    eventId: number
  ): Promise<Voucher[]> => {
    const res = await fetch(
      `${API_URL}/event/${eventId}`
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch vouchers"
      );
    }

    const data =
      await res.json();

    return data.data;
  };