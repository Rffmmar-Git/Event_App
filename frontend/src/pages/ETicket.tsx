import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getTransactionById } from "../services/transactionService";

function ETicket() {
  /* ROUTE PARAMS */
  const { id } = useParams();

  /* STATES */
  const [transaction, setTransaction] =
    useState<any>(null);

  /* FETCH TRANSACTION */
  useEffect(() => {
    if (!id) return;

    getTransactionById(id).then((res) => {
      setTransaction(res.data);
    });
  }, [id]);

  /* LOADING STATE */
  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading E-Ticket...
      </div>
    );
  }

  /* TRANSACTION ITEM */
  const item =
    transaction.transaction_items?.[0];

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto pt-28 px-6">
        <div className="bg-white rounded-3xl shadow-lg p-8">

          {/* HEADER */}
          <div className="text-center">
            <div className="text-6xl mb-4">
              🎟️
            </div>

            <h1 className="text-3xl font-bold">
              E-Ticket
            </h1>
          </div>

          {/* TICKET INFORMATION */}
          <div className="mt-8 space-y-4">

            <p>
              <strong>Event:</strong>{" "}
              {transaction.events?.title}
            </p>

            <p>
              <strong>Venue:</strong>{" "}
              {transaction.events?.venue_name}
            </p>

            <p>
              <strong>Ticket Type:</strong>{" "}
              {item?.tickets?.name}
            </p>

            <p>
              <strong>Quantity:</strong>{" "}
              {item?.quantity}
            </p>

            <p>
              <strong>Transaction ID:</strong>{" "}
              #{transaction.id}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                transaction.events?.start_date
              ).toLocaleDateString("id-ID")}
            </p>
          </div>

          {/* QR CODE */}
          <div className="mt-10 flex justify-center">
            <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center">
              QR CODE
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ETicket;