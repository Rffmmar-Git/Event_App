import type { Event } from "../types/event";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/events";

/* GET ALL EVENTS */
export const getEvents = async (params?: {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}): Promise<Event[]> => {
  const query = new URLSearchParams();

  /* BUILD QUERY PARAMS */
  if (params?.search) {
    query.append("search", params.search);
  }

  if (params?.category) {
    query.append("category", params.category);
  }

  if (params?.location) {
    query.append("location", params.location);
  }

  if (params?.page) {
    query.append(
      "page",
      params.page.toString()
    );
  }

  if (params?.limit) {
    query.append(
      "limit",
      params.limit.toString()
    );
  }

  /* FETCH EVENTS */
  const res = await fetch(
    `${API_URL}?${query.toString()}`
  );

  /* HANDLE ERROR */
  if (!res.ok) {
    throw new Error(
      "Failed to fetch events"
    );
  }

  const data = await res.json();

  return data.data;
};

/* GET EVENT BY ID */
export const getEventById = async (
  id: string
): Promise<Event> => {
  const res = await fetch(
    `${API_URL}/${id}`
  );

  /* HANDLE ERROR */
  if (!res.ok) {
    throw new Error("Event not found");
  }

  const data = await res.json();

  return data.data;
};

/* CREATE EVENT */
export const createEvent = async (
  event: Omit<Event, "id">
) => {
  const res = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(event),
  });

  /* HANDLE ERROR */
  if (!res.ok) {
    throw new Error(
      "Failed to create event"
    );
  }

  return res.json();
};