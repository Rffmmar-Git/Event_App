import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTransactions } from "../services/transactionService";
import { getMyReview, createReview } from "../services/reviewService";

function TransactionHistory() {
  const navigate = useNavigate();

  /* STATES */
  const [transactions, setTransactions] = useState<any[]>([]);

  const [reviews, setReviews] = useState<Record<number, any>>({});

  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  /* FETCH TRANSACTIONS */
  useEffect(() => {
  getTransactions()
    .then(async (data) => {
      setTransactions(data);

      const reviewMap: Record<
        number,
        any
      > = {};

      for (const trx of data) {
        try {
          const review =
            await getMyReview(
              trx.event_id
            );

          if (review) {
            reviewMap[
              trx.event_id
            ] = review;
          }
        } catch {
          //
        }
      }

      setReviews(reviewMap);
    })
    .finally(() =>
      setLoading(false)
    );
}, []);

  /* STATUS COLOR */
  const getStatusColor = (status: string) => {
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
        <h1 className="text-3xl font-bold mb-8">Transaction History</h1>

        {/* EMPTY STATE */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow text-center">
            No transactions found
          </div>
        ) : (
          /* TRANSACTION LIST */
          <div className="space-y-4">
            {transactions.map((trx) => (
              <div key={trx.id} className="bg-white rounded-2xl shadow p-6">
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
                      {new Date(trx.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  {/* TRANSACTION STATUS */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      trx.status,
                    )}`}
                  >
                    {trx.status}
                  </span>
                </div>

                {/* TRANSACTION TOTAL */}
<div className="mt-4 border-t pt-4">
  <p className="font-semibold">
    Total: Rp{" "}
    {new Intl.NumberFormat("id-ID").format(
      trx.final_price || 0
    )}
  </p>

  {trx.status === "DONE" && (
    <div className="flex flex-wrap gap-3 mt-4">
      <button
        onClick={() =>
          navigate(`/eticket/${trx.id}`)
        }
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
      >
        View E-Ticket
      </button>

      {new Date(
        trx.events?.end_date
      ) < new Date() &&
        !reviews[trx.event_id] && (
          <button
            onClick={() => {
              setSelectedEventId(
                trx.event_id
              );

              setRating(5);
              setComment("");
              setShowReviewModal(true);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition"
          >
            Leave Review
          </button>
        )}

      {reviews[trx.event_id] && (
        <div className="w-full mt-2 bg-gray-50 border rounded-xl p-3">
          <p className="font-medium text-lg">
            {"⭐".repeat(
              reviews[trx.event_id].rating
            )}
          </p>

          <p className="text-gray-600 mt-1">
            {
              reviews[trx.event_id]
                .comment
            }
          </p>
        </div>
      )}
    </div>
  )}
</div>
              </div>
            ))}
          </div>
        )}

        {/* REVIEW MODAL */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-bold mb-4">
                Leave a Review
              </h2>

              <div className="flex justify-center gap-2 text-4xl mb-4">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setRating(star)
                      }
                      className="hover:scale-110 transition"
                    >
                      {star <= rating
                        ? "⭐"
                        : "☆"}
                    </button>
                  )
                )}
              </div>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
                placeholder="Share your experience..."
                className="w-full border rounded-xl p-3 h-32 resize-none"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() =>
                    setShowReviewModal(
                      false
                    )
                  }
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    try {
                      await createReview({
                        event_id:
                          selectedEventId!,
                        rating,
                        comment,
                      });

                      alert(
                        "Review submitted!"
                      );

                      window.location.reload();
                    } catch (
                      error: any
                    ) {
                      alert(
                        error.message
                      );
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;