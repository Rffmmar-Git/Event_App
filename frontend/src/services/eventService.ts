import type {
  Event,
  CreateEventPayload,
} from "../types/event";

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

  const res = await fetch(
    `${API_URL}?${query.toString()}`
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch events"
    );
  }

  const data = await res.json();

  return data.data;
};

/* GET MY EVENTS */
export const getMyEvents =
  async (): Promise<Event[]> => {
    const token =
      localStorage.getItem(
        "token"
      );

    const res = await fetch(
      `${API_URL}/my-events`,
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
          "Failed to fetch events"
      );
    }

    return data.data;
  };

/* GET EVENT BY ID */
export const getEventById =
  async (
    id: string
  ): Promise<Event> => {
    const res = await fetch(
      `${API_URL}/${id}`
    );

    if (!res.ok) {
      throw new Error(
        "Event not found"
      );
    }

    const data =
      await res.json();

    return data.data;
  };

/* CREATE EVENT */
export const createEvent =
  async (
    event: CreateEventPayload
  ) => {
    const token =
      localStorage.getItem(
        "token"
      );

    const res = await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(
          event
        ),
      }
    );

    const data =
      await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Failed to create event"
      );
    }

    return data;
  };

  /* UPDATE EVENT */
export const updateEvent = async (
  id: number,
  event: Partial<CreateEventPayload>
) => {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(event),
    }
  );

  const data =
    await res.json();

  if (!res.ok) {
    throw new Error(
      data.message ||
        "Failed to update event"
    );
  }

  return data.data;
};