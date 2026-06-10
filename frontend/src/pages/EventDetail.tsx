import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getEventById } from "../services/eventService";
import {
  createTransaction,
  uploadPaymentProof,
} from "../services/transactionService";
import type { Event } from "../types/event";
import { formatCurrency } from "../utils/formatCurrency";

function EventDetail() {
  /* ROUTE PARAMS */
  const { id } = useParams();

  /* STATES */
  const [event, setEvent] =
    useState<Event | null>(null);

  const [selectedTicket, setSelectedTicket] =
    useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [transaction, setTransaction] =
    useState<any>(null);

  const [proof, setProof] =
    useState<File | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);

  const [usePoints, setUsePoints] =
    useState(false);

  const [selectedVoucher, setSelectedVoucher] =
    useState<number | null>(null);

  /* FETCH EVENT */
  useEffect(() => {
    if (!id) return;

    getEventById(id)
      .then(setEvent)
      .catch(() => setEvent(null));
  }, [id]);

  /* TRANSACTION COUNTDOWN */
  useEffect(() => {
    if (!transaction) return;

    const interval = setInterval(() => {
      const diff =
        new Date(
          transaction.expired_at
        ).getTime() - Date.now();

      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [transaction]);

  /* LOADING STATE */
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading event...
      </div>
    );
  }

  /* TEMP USER VOUCHERS */
  const userVouchers = [
    {
      id: 1,
      name: "Discount 100K",
      amount: 100000,
    },
    {
      id: 2,
      name: "Discount 250K",
      amount: 250000,
    },
  ];

  /* PRICE CALCULATION */
  const selectedTicketData =
    event.tickets?.find(
      (t) => t.id === selectedTicket
    );

  const basePrice =
    (selectedTicketData?.price || 0) *
    quantity;

  const voucherDiscount =
    userVouchers.find(
      (v) => v.id === selectedVoucher
    )?.amount || 0;

  const pointsDiscount = usePoints
    ? Math.min(
        basePrice - voucherDiscount,
        20000
      )
    : 0;

  const totalPrice = Math.max(
    basePrice -
      voucherDiscount -
      pointsDiscount,
    0
  );

  /* TICKET STATISTICS */
  const totalQuota =
    event.tickets?.reduce(
      (sum, t) => sum + (t.quota || 0),
      0
    ) || 0;

  const totalSold =
    event.tickets?.reduce(
      (sum, t) => sum + (t.sold || 0),
      0
    ) || 0;

  const remaining =
    totalQuota - totalSold;

  const progress =
    totalQuota > 0
      ? (totalSold / totalQuota) * 100
      : 0;

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="pt-28 px-6 max-w-5xl mx-auto space-y-10">

        {/* HERO BANNER */}
        <div className="h-64 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl shadow-lg" />

        
        {/* EVENT INFORMATION */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h1 className="text-3xl font-bold">
            {event.title}
          </h1>

        <div className="space-y-1 text-gray-600">
          {event.venue_name && (
            <p>
              📍 {event.venue_name}
            </p>
          )}

          {event.venue_address && (
            <p>
              {event.venue_address}
           </p>
          )}

          <p>
            {event.location}
          </p>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-purple-600 h-2 rounded-full"
            style={{
              width: `${progress}%`,
           }}
          />
        </div>

        <p>
          {remaining} seats remaining
        </p>
      </div>

        {/* EVENT LOCATION */}
        {event.latitude &&
          event.longitude && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                Event Location
              </h2>

              <iframe
                title="event-location"
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                className="rounded-xl"
                src={`https://maps.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`}
              />

              <div className="mt-4 text-gray-600">
                {event.venue_name && (
                  <p>
                    📍 {event.venue_name}
                  </p>
                )}

                {event.venue_address && (
                 <p>
                   {event.venue_address}
                  </p>
                )}

                <p>
                   {event.location}
                </p>
              </div>
            </div>
          )}

        {/* TICKETS */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h2 className="font-semibold text-lg">
            Tickets
          </h2>

          {event.tickets?.map((ticket) => {
            const isFull =
              (ticket.sold || 0) >=
              (ticket.quota || 0);

            return (
              <div
                key={ticket.id}
                className="flex justify-between border p-4 rounded-xl"
              >
                <div>
                  <p>{ticket.name}</p>

                  <p>
                    {ticket.quota} seats
                  </p>
                </div>

                <div>
                  <p>
                    Rp {formatCurrency(ticket.price)}
                  </p>

                  {!isFull && (
                    <button
                      onClick={() =>
                        setSelectedTicket(
                          ticket.id
                        )
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* VOUCHERS */}
        {selectedTicket && (
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <h2 className="font-semibold text-lg">
              Vouchers
            </h2>

            {userVouchers.map((v) => (
              <div
                key={v.id}
                className={`flex justify-between p-4 border rounded ${
                  selectedVoucher === v.id
                    ? "bg-purple-100"
                    : ""
                }`}
              >
                <div>
                  <p>{v.name}</p>

                  <p>
                    Rp {v.amount}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedVoucher(
                      selectedVoucher === v.id
                        ? null
                        : v.id
                    )
                  }
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                >
                  {selectedVoucher === v.id
                    ? "Used"
                    : "Use"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PURCHASE */}
        {selectedTicket && (
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <h2>Purchase</h2>

            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number(e.target.value)
                )
              }
            />

            <label>
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
            </label>

            <p>
              Total: Rp {totalPrice}
            </p>
          </div>
        )}

        {/* PAYMENT */}
        {selectedTicket && (
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">

            {!transaction && (
              <button
                onClick={async () => {
                  try {
                    const res =
                      await createTransaction({
                        ticket_id:
                          selectedTicket!,
                        quantity,
                        use_points:
                          usePoints,
                        voucher_id:
                          selectedVoucher,
                      });

                    setTransaction(
                      res.data
                    );

                    alert(
                      "✅ Transaction created!"
                    );
                  } catch (error: any) {
                    console.error(
                      error
                    );

                    alert(
                      error.message
                    );
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full p-3 rounded"
              >
                Secure Your Spot
              </button>
            )}

            {transaction && (
              <>
                {/* PAYMENT PROOF */}
                <h2 className="text-lg font-semibold">
                  Upload Payment Proof
                </h2>

                {/* COUNTDOWN TIMER */}
                <p className="text-red-500">
                  Time left:{" "}
                  {Math.floor(
                    timeLeft / 60000
                  )}
                  :
                  {Math.floor(
                    (timeLeft %
                      60000) /
                      1000
                  )
                    .toString()
                    .padStart(2, "0")}
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (
                      e.target.files?.[0]
                    ) {
                      setProof(
                        e.target
                          .files[0]
                      );
                    }
                  }}
                  className="border p-2 rounded w-full"
                />

                <button
                  onClick={async () => {
                    try {
                      if (!proof) {
                        alert(
                          "Please select an image"
                        );
                        return;
                      }

                      await uploadPaymentProof(
                        transaction.id,
                        proof
                      );

                      alert(
                        "✅ Payment proof uploaded!"
                      );
                    } catch (
                      error: any
                    ) {
                      alert(
                        error.message
                      );
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                >
                  Upload Proof
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;