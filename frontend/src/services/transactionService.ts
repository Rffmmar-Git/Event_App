const API_URL = "http://localhost:5000/transactions";

/* CREATE TRANSACTION */
export const createTransaction = async (data: {
  ticket_id: number;
  quantity: number;
  voucher_id?: number | null;
  use_points?: boolean;
}) => {
  const res = await fetch(API_URL, {
    method: "POST",

    /* REQUEST HEADERS */
    headers: {
      "Content-Type": "application/json",
    },

    /* REQUEST BODY */
    body: JSON.stringify(data),
  });

  /* HANDLE ERROR */
  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      error.message || "Transaction failed"
    );
  }

  return res.json();
};

/* GET TRANSACTIONS */
export const getTransactions = async () => {
  const res = await fetch(API_URL);

  /* HANDLE ERROR */
  if (!res.ok) {
    throw new Error(
      "Failed to fetch transactions"
    );
  }

  const data = await res.json();

  return data.data;
};

/* UPLOAD PAYMENT PROOF */
export const uploadPaymentProof = async (
  transactionId: number,
  file: File
) => {
  const formData = new FormData();

  /* APPEND FILE */
  formData.append(
    "payment_proof",
    file
  );

  const res = await fetch(
    `${API_URL}/${transactionId}/payment-proof`,
    {
      method: "PATCH",
      body: formData,
    }
  );

  /* HANDLE ERROR */
  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      error.message || "Upload failed"
    );
  }

  return res.json();
};

/* GET TRANSACTION BY ID */
export const getTransactionById = async (
  id: string
) => {
  const res = await fetch(
    `${API_URL}/${id}`
  );

  /* HANDLE ERROR */
  if (!res.ok) {
    throw new Error(
      "Failed to fetch transaction"
    );
  }

  return res.json();
};