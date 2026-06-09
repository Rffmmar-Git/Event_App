import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getTransactions } from "../services/transactionService";

function Inbox() {
  /* HOOKS */
  const navigate = useNavigate();

  /* STATES */
  const [transactions, setTransactions] =
    useState<any[]>([]);

  /* FETCH TRANSACTIONS */
  useEffect(() => {
    getTransactions().then(
      setTransactions
    );
  }, []);

  /* READY TICKETS */
  const readyTickets =
    transactions.filter(
      (trx) =>
        trx.status === "ACCEPTED"
    );

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto pt-28 px-6">
        <h1 className="text-3xl font-bold mb-8">
          Inbox
        </h1>

        {/* EMPTY STATE */}
        {readyTickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-5xl mb-4">
              🎟️
            </div>

            <h2 className="text-xl font-semibold mb-2">
              No E-Tickets Available
            </h2>

            <p className="text-gray-500">
              Once your payment is approved,
              your e-ticket will appear
              here.
            </p>
          </div>
        ) : (
          /* TICKET LIST */
          <div className="space-y-4">
            {readyTickets.map((trx) => {
              /* TRANSACTION ITEM */
              const item =
                trx.transaction_items?.[0];

              return (
                <div
                  key={trx.id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">

                    {/* TICKET ICON */}
                    <div className="text-5xl">
                      🎟️
                    </div>

                    <div className="flex-1">

                      {/* EVENT TITLE */}
                      <h2 className="text-xl font-bold text-gray-800">
                        {trx.events?.title}
                      </h2>

                      {/* TICKET DETAILS */}
                      <div className="mt-4 space-y-1 text-gray-600">
                        <p>
                          Ticket Type:{" "}
                          <span className="font-medium">
                            {
                              item?.tickets
                                ?.name
                            }
                          </span>
                        </p>

                        <p>
                          Quantity:{" "}
                          <span className="font-medium">
                            {
                              item?.quantity
                            }
                          </span>
                        </p>

                        <p>
                          Transaction ID:{" "}
                          <span className="font-medium">
                            #{trx.id}
                          </span>
                        </p>

                        <p>
                          Purchase Date:{" "}
                          <span className="font-medium">
                            {new Date(
                              trx.created_at
                            ).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </p>
                      </div>

                      {/* VIEW TICKET BUTTON */}
                      <button
                        onClick={() =>
                          navigate(
                            `/eticket/${trx.id}`
                          )
                        }
                        className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition"
                      >
                        View E-Ticket
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inbox;