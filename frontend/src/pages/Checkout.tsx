import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getEventById,
  getEventVouchers,
} from "../services/eventService";

import {
  createTransaction,
} from "../services/transactionService";

import type { Event } from "../types/event";
import type { Voucher } from "../types/voucher";

import { formatCurrency } from "../utils/formatCurrency";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    eventId,
    ticketId,
    quantity,
  } = location.state || {};

  const [event, setEvent] =
    useState<Event | null>(null);

  const [vouchers, setVouchers] =
    useState<Voucher[]>([]);

  const [selectedVoucher, setSelectedVoucher] =
    useState<number | null>(null);

  const [usePoints, setUsePoints] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  /* LOAD EVENT */
  useEffect(() => {
    const loadData = async () => {
      try {
        const eventData =
          await getEventById(
            String(eventId)
          );

        setEvent(eventData);

        const voucherData =
          await getEventVouchers(
            Number(eventId)
          );

        const now = new Date();

        const activeVouchers =
          voucherData.filter(
            (voucher: Voucher) =>
              new Date(
                voucher.start_date
              ) <= now &&
              new Date(
                voucher.end_date
              ) >= now &&
              (voucher.used_count ?? 0) <
                (voucher.quota ?? 0)
          );

        setVouchers(
          activeVouchers
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadData();
    }
  }, [eventId]);

  if (
    !eventId ||
    !ticketId ||
    !quantity
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid checkout data
      </div>
    );
  }

  if (loading || !event) {
    return (
      <>
        <Navbar />

        <div className="pt-32 text-center">
          Loading checkout...
        </div>
      </>
    );
  }

  const ticket =
    event.tickets?.find(
      (t) => t.id === ticketId
    );

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ticket not found
      </div>
    );
  }

  /* PRICE CALCULATION */
  const subtotal =
    ticket.price * quantity;

  const voucherDiscount =
    vouchers.find(
      (v) => v.id === selectedVoucher
    )?.discount_amount || 0;

  const pointsDiscount =
    usePoints
      ? Math.min(
          subtotal -
            voucherDiscount,
          20000
        )
      : 0;

  const totalPrice =
    Math.max(
      subtotal -
        voucherDiscount -
        pointsDiscount,
      0
    );

  const handleCheckout =
    async () => {
      try {
        const res =
          await createTransaction({
            ticket_id: ticket.id,
            quantity,
            voucher_id:
              selectedVoucher,
            use_points:
              usePoints,
          });

        alert(
          "Transaction created!"
        );

        navigate(
          `/payment/${res.data.id}`
        );
      } catch (error: any) {
        alert(error.message);
      }
    };

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      <div className="pt-28 max-w-5xl mx-auto px-6 space-y-6">
        <h1 className="text-3xl font-bold">
          Checkout
        </h1>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold text-lg mb-4">
            Order Summary
          </h2>

          <p>
            Event:
            {" "}
            {event.title}
          </p>

          <p>
            Ticket:
            {" "}
            {ticket.name}
          </p>

          <p>
            Quantity:
            {" "}
            {quantity}
          </p>

          <p>
            Price:
            {" "}
            Rp{" "}
            {formatCurrency(
              ticket.price
            )}
          </p>
        </div>

        {/* VOUCHERS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold text-lg mb-4">
            Vouchers
          </h2>

          {vouchers.length === 0 ? (
            <p className="text-gray-500">
              No active vouchers
              available.
            </p>
          ) : (
            <div className="space-y-3">
              {vouchers.map(
                (voucher) => (
                  <div
                    key={voucher.id}
                    className={`flex justify-between items-center border p-4 rounded-xl ${
                      selectedVoucher ===
                      voucher.id
                        ? "bg-purple-100"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium">
                        {voucher.code}
                      </p>

                      <p>
                        Rp{" "}
                        {formatCurrency(
                          voucher.discount_amount
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedVoucher(
                          selectedVoucher ===
                            voucher.id
                            ? null
                            : voucher.id
                        )
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded-lg"
                    >
                      {selectedVoucher ===
                      voucher.id
                        ? "Applied"
                        : "Apply"}
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* POINTS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold text-lg mb-4">
            Points
          </h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={usePoints}
              onChange={(e) =>
                setUsePoints(
                  e.target.checked
                )
              }
            />

            Use Points
            (Max Rp 20.000)
          </label>
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold text-lg mb-4">
            Price Breakdown
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>
                Rp{" "}
                {formatCurrency(
                  subtotal
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Voucher</span>

              <span>
                - Rp{" "}
                {formatCurrency(
                  voucherDiscount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Points</span>

              <span>
                - Rp{" "}
                {formatCurrency(
                  pointsDiscount
                )}
              </span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>

              <span>
                Rp{" "}
                {formatCurrency(
                  totalPrice
                )}
              </span>
            </div>
          </div>
        </div>

        {/* CONFIRM */}
        <button
          onClick={handleCheckout}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl font-semibold"
        >
          Confirm Purchase
        </button>
      </div>
    </div>
  );
}

export default Checkout;