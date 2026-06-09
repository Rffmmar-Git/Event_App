import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getTransactions } from "../services/transactionService";

function TransactionHistory() {
  /* STATES */
  const [transactions, setTransactions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* FETCH TRANSACTIONS */
  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .finally(() =>
        setLoading(false)
      );
  }, []);

  /* STATUS COLOR */
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
        return "bg-gray-200 text-gray-700";

      case "CANCELED":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto pt-28 px-6">
        <h1 className="text-3xl font-bold mb-8">
          Transaction History
        </h1>

        {/* EMPTY STATE */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            No transactions found
          </div>
        ) : (
          /* TRANSACTION LIST */
          <div className="space-y-4">
            {transactions.map((trx) => (
              <div
                key={trx.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                {/* TRANSACTION HEADER */}
                <div className="flex justify-between items-start">
                  <div>

                    {/* EVENT TITLE */}
                    <h2 className="font-semibold text-lg">
                      {trx.events?.title}
                    </h2>

                    {/* TRANSACTION ID */}
                    <p className="text-sm text-gray-500">
                      Transaction #{trx.id}
                    </p>

                    {/* TRANSACTION DATE */}
                    <p className="text-sm text-gray-500">
                      {new Date(
                        trx.created_at
                      ).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>

                  </div>

                  {/* TRANSACTION STATUS */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      trx.status
                    )}`}
                  >
                    {trx.status}
                  </span>
                </div>

                {/* TRANSACTION TOTAL */}
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold">
                    Total: Rp{" "}
                    {new Intl.NumberFormat(
                      "id-ID"
                    ).format(
                      trx.final_price || 0
                    )}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;