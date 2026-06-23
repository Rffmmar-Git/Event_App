import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
  getOrganizerTransactions,
  approveTransaction,
  rejectTransaction,
} from "../services/transactionService";

function OrganizerTransactions() {
  const [transactions, setTransactions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchTransactions =
    async () => {
      try {
        const data =
          await getOrganizerTransactions();

        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove =
    async (id: number) => {
      try {
        await approveTransaction(id);

        fetchTransactions();
      } catch (error) {
        console.error(error);
      }
    };

  const handleReject =
    async (id: number) => {
      try {
        await rejectTransaction(id);

        fetchTransactions();
      } catch (error) {
        console.error(error);
      }
    };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "WAITING_FOR_PAYMENT":
        return "bg-yellow-100 text-yellow-700";

      case "WAITING_CONFIRMATION":
        return "bg-blue-100 text-blue-700";

      case "DONE":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "EXPIRED":
        return "bg-gray-100 text-gray-700";

      case "CANCELED":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="pt-32 text-center">
          Loading...
        </div>
      </>
    );
  }

  return (
    <div className="bg-[#fef7ff] min-h-screen">
      <Navbar />

      <section className="pt-32 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Organizer Transactions
        </h1>

        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            No transactions found
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((trx) => (
              <div
                key={trx.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-lg">
                      {trx.events?.title}
                    </h2>

                    <p>
                      Customer:{" "}
                      {trx.users?.name}
                    </p>

                    <p>
                      Email:{" "}
                      {trx.users?.email}
                    </p>

                    <p>
                      Ticket:{" "}
                      {
                        trx
                          .transaction_items?.[0]
                          ?.tickets?.name
                      }
                    </p>

                    <p>
                      Quantity:{" "}
                      {
                        trx
                          .transaction_items?.[0]
                          ?.quantity
                      }
                    </p>

                    <p>
                      Total: Rp{" "}
                      {new Intl.NumberFormat(
                        "id-ID"
                      ).format(
                        trx.final_price
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-center font-medium ${getStatusColor(
                        trx.status
                      )}`}
                    >
                      {trx.status}
                    </span>

                    {trx.payment_proof && (
                      <a
                        href={`http://localhost:5000${trx.payment_proof}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gray-200 px-4 py-2 rounded-xl text-center"
                      >
                        View Proof
                      </a>
                    )}

                    {trx.status ===
                      "WAITING_CONFIRMATION" && (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(
                              trx.id
                            )
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-xl"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleReject(
                              trx.id
                            )
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-xl"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OrganizerTransactions;