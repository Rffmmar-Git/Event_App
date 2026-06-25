import type { Event, CreateEventPayload } from "../types/event";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/events";

export const IMAGE_URL = `${API_URL.replace("/events", "")}/uploads/banners`;

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
    query.append("page", params.page.toString());
  }

  if (params?.limit) {
    query.append("limit", params.limit.toString());
  }

  const res = await fetch(`${API_URL}?${query.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await res.json();

  return data.data;
};

/* GET MY EVENTS */
export const getMyEvents = async (): Promise<Event[]> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/my-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch events");
  }

  return data.data;
};

/* GET EVENT BY ID */
export const getEventById = async (id: string): Promise<Event> => {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Event not found");
  }

  const data = await res.json();

  return data.data;
};

/* CREATE EVENT */
export const createEvent = async (
  event: CreateEventPayload,
  banner?: File | null,
) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("title", event.title);
  formData.append("description", event.description);
  formData.append("location", event.location);
  formData.append("category", event.category);
  formData.append("start_date", event.start_date);
  formData.append("end_date", event.end_date);

  if (event.venue_name) {
    formData.append("venue_name", event.venue_name);
  }

  if (event.venue_address) {
    formData.append("venue_address", event.venue_address);
  }

  if (event.latitude !== undefined) {
    formData.append("latitude", event.latitude.toString());
  }

  if (event.longitude !== undefined) {
    formData.append("longitude", event.longitude.toString());
  }

  formData.append("tickets", JSON.stringify(event.tickets));

  if (banner) {
    formData.append("banner", banner);
  }

  const res = await fetch(API_URL, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create event");
  }

  return data;
};

/* UPDATE EVENT */
export const updateEvent = async (
  id: number,
  event: Partial<CreateEventPayload>,
  banner?: File | null,
) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("title", event.title || "");
  formData.append("description", event.description || "");
  formData.append("location", event.location || "");
  formData.append("category", event.category || "");
  formData.append("start_date", event.start_date || "");
  formData.append("end_date", event.end_date || "");

  formData.append("venue_name", event.venue_name || "");

  formData.append("venue_address", event.venue_address || "");

  if (event.latitude !== undefined) {
    formData.append("latitude", String(event.latitude));
  }

  if (event.longitude !== undefined) {
    formData.append("longitude", String(event.longitude));
  }

  formData.append("tickets", JSON.stringify(event.tickets || []));

  if (banner) {
    formData.append("banner", banner);
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update event");
  }

  return data.data;
};

/* GET EVENT VOUCHERS */
export const getEventVouchers = async (eventId: number) => {
  const API_BASE = API_URL.replace("/events", "");

  const res = await fetch(`${API_BASE}/vouchers/event/${eventId}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch vouchers");
  }

  return data.data;
};

/* CREATE VOUCHER */
export const createVoucher = async (voucher: {
  event_id: number;
  code: string;
  discount_amount: number;
  quota: number;
  start_date: string;
  end_date: string;
}) => {
  const API_BASE = API_URL.replace("/events", "");

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/vouchers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(voucher),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

/* DELETE VOUCHER */
export const deleteVoucher = async (voucherId: number) => {
  const API_BASE = API_URL.replace("/events", "");

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/vouchers/${voucherId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

/* GET EVENT ATTENDEES */
export const getEventAttendees = async (eventId: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${eventId}/attendees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch attendees");
  }

  return data.data;
};

/* DELETE EVENT */
export const deleteEvent = async (eventId: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${eventId}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete event");
  }

  return data;
};
