import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getTransactionById,
  uploadPaymentProof,
} from "../services/transactionService";

import { formatCurrency } from "../utils/formatCurrency";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] =
    useState<any>(null);

  const [proof, setProof] =
    useState<File | null>(null);

  const [timeLeft, setTimeLeft] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  /* LOAD TRANSACTION */
  useEffect(() => {
    const loadTransaction =
      async () => {
        try {
          if (!id) return;

          const data =
            await getTransactionById(id);

          setTransaction(data.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadTransaction();
  }, [id]);

  /* COUNTDOWN */
  useEffect(() => {
    if (!transaction) return;

    const interval =
      setInterval(() => {
        const diff =
          new Date(
            transaction.expired_at
          ).getTime() -
          Date.now();

        setTimeLeft(
          diff > 0 ? diff : 0
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [transaction]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="pt-32 text-center">
          Loading payment...
        </div>
      </>
    );
  }

  if (!transaction) {
    return (
      <>
        <Navbar />

        <div className="pt-32 text-center">
          Transaction not found
        </div>
      </>
    );
  }

  const minutes = Math.floor(
    timeLeft / 60000
  );

  const seconds = Math.floor(
    (timeLeft % 60000) / 1000
  );

  const handleUpload =
    async () => {
      try {
        if (!proof) {
          alert(
            "Please select a payment proof"
          );

          return;
        }

        await uploadPaymentProof(
          transaction.id,
          proof
        );

        alert(
          "Payment proof uploaded successfully!"
        );

        navigate("/transactions");
      } catch (error: any) {
        alert(error.message);
      }
    };

  return (
    <div className="bg-[#f8f5ff] min-h-screen">
      <Navbar />

      <div className="pt-28 max-w-5xl mx-auto px-6 space-y-6">
        <h1 className="text-3xl font-bold">
          Payment
        </h1>

        {/* PAYMENT INSTRUCTIONS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Payment Instructions
          </h2>

          <div className="space-y-2">
            <p>
              <strong>
                Bank:
              </strong>{" "}
              BCA
            </p>

            <p>
              <strong>
                Account Number:
              </strong>{" "}
              1234567891
            </p>

            <p>
              <strong>
                Account Name:
              </strong>{" "}
              EventHub Indonesia
            </p>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-gray-600">
              Transfer Amount
            </p>

            <p className="text-2xl font-bold text-purple-700">
              Rp{" "}
              {formatCurrency(
                transaction.final_price ||
                  0
              )}
            </p>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-3">
            Payment Deadline
          </h2>

          <p className="text-red-600 text-2xl font-bold">
            {minutes}:
            {seconds
              .toString()
              .padStart(2, "0")}
          </p>

          <p className="text-gray-500 mt-2">
            Complete your payment
            before the timer expires.
          </p>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          <p>
            Event:
            {" "}
            {
              transaction.events
                ?.title
            }
          </p>

          <p>
            Ticket:
            {" "}
            {
              transaction
                .transaction_items?.[0]
                ?.tickets?.name
            }
          </p>

          <p>
            Quantity:
            {" "}
            {
              transaction
                .transaction_items?.[0]
                ?.quantity
            }
          </p>
        </div>

        {/* PAYMENT PROOF */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Upload Payment Proof
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (
                e.target.files?.[0]
              ) {
                setProof(
                  e.target.files[0]
                );
              }
            }}
            className="w-full border p-3 rounded-xl"
          />

          <button
            onClick={
              handleUpload
            }
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl"
          >
            Upload Proof
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;