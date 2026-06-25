const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/events";

const API_BASE = API_URL.replace(
  "/events",
  ""
);

export const getOrganizerAnalytics =
  async () => {
    const token =
      localStorage.getItem(
        "token"
      );

    const res = await fetch(
      `${API_BASE}/analytics`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch analytics"
      );
    }

    return data.data;
  };