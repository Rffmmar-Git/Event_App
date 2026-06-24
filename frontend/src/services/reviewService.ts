const API_URL = "http://localhost:5000/reviews";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getEventReviews = async (eventId: number) => {
  const res = await fetch(`${API_URL}/event/${eventId}`);

  const data = await res.json();

  return data.data;
};

export const createReview = async (data: {
  event_id: number;
  rating: number;
  comment: string;
}) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const getMyReview = async (eventId: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/my/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch review");
  }

  return data.data;
};