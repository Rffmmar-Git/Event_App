import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventCategories } from "../constants/categories";
import Navbar from "../components/Navbar";
import {
  getEventForEdit,
  updateEvent,
  getEventVouchers,
  createVoucher,
  deleteVoucher,
} from "../services/eventService";

import type { CreateEventPayload, TicketForm, Voucher } from "../types/event";

type EditTicketForm = TicketForm & {
  id?: number;
};

function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* STATES */
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState("event");
  const [eventData, setEventData] = useState<CreateEventPayload>({
    title: "",
    description: "",
    location: "",
    category: "",
    start_date: "",
    end_date: "",

    venue_name: "",
    venue_address: "",

    latitude: undefined,
    longitude: undefined,

    tickets: [],
  });

  const [tickets, setTickets] = useState<EditTicketForm[]>([
    {
      name: "",
      price: "",
      quota: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [locationQuery, setLocationQuery] = useState("");

  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const [voucherCode, setVoucherCode] = useState("");

  const [voucherDiscount, setVoucherDiscount] = useState("");

  const [voucherQuota, setVoucherQuota] = useState("");

  const [voucherStartDate, setVoucherStartDate] = useState("");

  const [voucherEndDate, setVoucherEndDate] = useState("");

  /* REFS */
  const eventRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const ticketsRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);

  /* SCROLL TO SECTION */
  const scrollTo = (
    ref: React.RefObject<HTMLDivElement | null>,
    key: string,
  ) => {
    setActiveSection(key);

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* LOAD EVENT VOUCHERS */
  useEffect(() => {
    if (!id) return;

    getEventVouchers(Number(id)).then(setVouchers).catch(console.error);
  }, [id]);

  /* SCROLL SPY */
  useEffect(() => {
    const sections = [
      { ref: eventRef, key: "event" },
      { ref: scheduleRef, key: "schedule" },
      { ref: ticketsRef, key: "tickets" },
      { ref: promoRef, key: "promo" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const found = sections.find((s) => s.ref.current === entry.target);

            if (found) {
              setActiveSection(found.key);
            }
          }
        });
      },
      {
        rootMargin: "-120px 0px -60% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  /* HANDLE BANNER UPLOAD */
  const addTicket = () => {
    setTickets((prev) => [
      ...prev,
      {
        name: "",
        price: "",
        quota: "",
      },
    ]);
  };

  useEffect(() => {
    if (!id) return;

    getEventForEdit(id)
      .then((event) => {
        if (event.banner_url) {
          setBannerPreview(event.banner_url || null);
        }

        setEventData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          category: event.category || "",
          start_date: event.start_date ? event.start_date.slice(0, 16) : "",
          end_date: event.end_date ? event.end_date.slice(0, 16) : "",
          venue_name: event.venue_name || "",
          venue_address: event.venue_address || "",
          latitude: event.latitude,
          longitude: event.longitude,
          tickets: [],
        });

        setTickets(
          event.tickets?.map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            price: String(ticket.price),
            quota: String(ticket.quota),
          })) || [],
        );
      })
      .catch((error: Error) => {
        alert(error.message);
        navigate("/my-events", { replace: true });
      });
  }, [id]);

  const updateTicket = (
    index: number,
    field: keyof TicketForm,
    value: string,
  ) => {
    const updated = [...tickets];

    updated[index] = {
      ...updated[index],
      [field]: value,
    } as any;

    setTickets(updated);
  };

  const handlePublish = async () => {
    try {
      if (!id) return;

      setLoading(true);

      const ticketNames = tickets.map((ticket) =>
        ticket.name.trim().toLowerCase(),
      );

      if (new Set(ticketNames).size !== ticketNames.length) {
        alert("Ticket names must be unique.");
        return;
      }

      await updateEvent(
        Number(id),
        {
          ...eventData,
          tickets: tickets.map((ticket) => ({
            id: ticket.id,
            name: ticket.name.trim(),
            price: Number(ticket.price),
            quota: Number(ticket.quota),
          })),
        } as any,
        bannerFile,
      );

      alert("Event updated successfully");

      navigate(`/events/${id}`);
    } catch (error) {
      console.error(error);

      alert("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchLocation = async () => {
    try {
      if (!locationQuery.trim()) {
        alert("Please enter a location");
        return;
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationQuery,
        )}`,
      );
      const data = await response.json();

      if (!data.length) {
        alert("Location not found");
        return;
      }

      const result = data[0];

      setEventData((prev) => ({
        ...prev,
        latitude: Number(result.lat),
        longitude: Number(result.lon),
      }));

      alert("location found!");
    } catch (error) {
      console.error(error);

      alert("Failed to search location");
    }
  };

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setBannerFile(file);

    setBannerPreview(URL.createObjectURL(file));
  };

  const handleCreateVoucher = async () => {
    try {
      if (!id) return;

      const voucher = await createVoucher({
        event_id: Number(id),
        code: voucherCode,
        discount_amount: Number(voucherDiscount),
        quota: Number(voucherQuota),
        start_date: voucherStartDate,
        end_date: voucherEndDate,
      });

      setVouchers((prev) => [voucher, ...prev]);

      setVoucherCode("");
      setVoucherDiscount("");
      setVoucherQuota("");
      setVoucherStartDate("");
      setVoucherEndDate("");

      alert("Voucher created!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteVoucher = async (voucherId: number) => {
    try {
      await deleteVoucher(voucherId);

      setVouchers((prev) => prev.filter((v) => v.id !== voucherId));

      alert("Voucher deleted!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-[#fef7ff] min-h-screen">
      <Navbar />

      {/* MAIN */}
      <div className="pt-28 pb-32 max-w-7xl mx-auto px-6 flex gap-10">
        {/* SIDEBAR */}
        <div className="w-60 hidden md:block">
          <div className="sticky top-28 space-y-4">
            {[
              {
                label: "Event Info",
                ref: eventRef,
                key: "event",
              },
              {
                label: "Schedule",
                ref: scheduleRef,
                key: "schedule",
              },
              {
                label: "Tickets",
                ref: ticketsRef,
                key: "tickets",
              },
              {
                label: "Promotions",
                ref: promoRef,
                key: "promo",
              },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollTo(item.ref, item.key)}
                className={`block w-full text-left transition ${
                  activeSection === item.key
                    ? "text-purple-600 font-semibold"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 space-y-10">
          {/* EVENT INFORMATION */}
          <div
            ref={eventRef}
            className="scroll-mt-32 bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-bold mb-4">Event Information</h2>

            <label className="block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer mb-4">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  className="h-48 w-full object-cover rounded-xl"
                />
              ) : (
                "Upload Banner"
              )}

              <input type="file" hidden onChange={handleBanner} />
            </label>

            <input
              value={eventData.title}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  title: e.target.value,
                })
              }
              placeholder="Event Name"
              className="w-full p-3 border rounded-xl mb-3"
            />

            <select
              value={eventData.category}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  category: e.target.value,
                })
              }
              className="w-full p-3 border rounded-xl mb-3"
            >
              <option value="">Select Category</option>

              {eventCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <textarea
              maxLength={1000}
              value={eventData.description}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  description: e.target.value,
                })
              }
              placeholder="Event Description"
              className="w-full p-3 border rounded-xl"
            />

            <p className="text-sm text-gray-500 mt-1 text-right">
              {eventData.description.length}/1000
            </p>
          </div>

          {/* SCHEDULE */}
          <div
            ref={scheduleRef}
            className="scroll-mt-32 bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-bold mb-4">Schedule & Location</h2>

            <input
              value={eventData.location}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  location: e.target.value,
                })
              }
              placeholder="City (Jakarta, Bandung, Surabaya...)"
              className="w-full p-3 border rounded-xl mb-4"
            />

            <div className="flex gap-4 mb-4">
              <input
                type="datetime-local"
                value={eventData.start_date}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    start_date: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="datetime-local"
                value={eventData.end_date}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    end_date: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <input
              value={eventData.venue_name ?? ""}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  venue_name: e.target.value,
                })
              }
              placeholder="Venue"
              className="w-full p-3 border rounded-xl mb-4"
            />

            <input
              value={eventData.venue_address ?? ""}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  venue_address: e.target.value,
                })
              }
              placeholder="Venue Address"
              className="w-full p-3 border rounded-xl mb-4"
            />

            <div className="space-y-4">
              <input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Search Location (Ancol Beach City Jakarta)"
                className="w-full p-3 border rounded-xl"
              />

              <button
                onClick={handleSearchLocation}
                className="w-full p-3 bg-purple-600 text-white rounded-xl"
              >
                Search Location
              </button>

              {eventData.latitude && eventData.longitude && (
                <iframe
                  title="location-preview"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="rounded-xl"
                  src={`https://maps.google.com/maps?q=${eventData.latitude},${eventData.longitude}&z=15&output=embed`}
                />
              )}
            </div>
          </div>

          {/* TICKETS */}
          <div
            ref={ticketsRef}
            className="scroll-mt-32 bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-bold mb-4">Tickets & Pricing</h2>

            {tickets.map((ticket, index) => (
              <div key={index} className="border p-4 rounded-xl mb-4">
                <p className="font-semibold mb-2">Ticket Type #{index + 1}</p>

                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    value={ticket.name}
                    onChange={(e) =>
                      updateTicket(index, "name", e.target.value)
                    }
                    placeholder="Ticket Name (VIP, General Admission...)"
                    className="w-full p-3 border rounded-xl"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={ticket.price}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*$/.test(value)) {
                        updateTicket(index, "price", value);
                      }
                    }}
                    placeholder="Price (IDR)"
                    className="w-full p-3 border rounded-xl"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={ticket.quota}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*$/.test(value)) {
                        updateTicket(index, "quota", value);
                      }
                    }}
                    placeholder="Quota"
                    className="w-full p-3 border rounded-xl"
                  />
                </div>

                {tickets.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setTickets((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="mt-3 text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete Ticket
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addTicket}
              className="border-dashed border w-full p-3 rounded-xl text-purple-600 hover:bg-purple-50"
            >
              + Add Ticket
            </button>
          </div>

          {/* PROMOTIONS */}
          <div
            ref={promoRef}
            className="scroll-mt-32 bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-bold mb-4">Event Vouchers</h2>

            {/* CREATE VOUCHER */}
            <div className="space-y-3 mb-6">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Voucher Code"
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="number"
                value={voucherDiscount}
                onChange={(e) => setVoucherDiscount(e.target.value)}
                placeholder="Discount Amount (IDR)"
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="number"
                value={voucherQuota}
                onChange={(e) => setVoucherQuota(e.target.value)}
                placeholder="Voucher Quota"
                className="w-full p-3 border rounded-xl"
              />

              <div className="flex gap-4">
                <input
                  type="date"
                  value={voucherStartDate}
                  onChange={(e) => setVoucherStartDate(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  type="date"
                  value={voucherEndDate}
                  onChange={(e) => setVoucherEndDate(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              <button
                type="button"
                onClick={handleCreateVoucher}
                className="w-full p-3 bg-purple-600 text-white rounded-xl"
              >
                Create Voucher
              </button>
            </div>

            {/* VOUCHER LIST */}
            <div className="space-y-3">
              {vouchers.length === 0 ? (
                <p className="text-gray-500">No vouchers created yet.</p>
              ) : (
                vouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{voucher.code}</h3>

                      <p className="text-sm text-gray-500">
                        Discount: Rp{" "}
                        {voucher.discount_amount.toLocaleString("id-ID")}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quota: {voucher.quota}
                      </p>

                      <p className="text-sm text-gray-500">
                        Used: {voucher.used_count}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteVoucher(voucher.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t px-6 py-4 flex justify-between items-center z-50">
        <button className="px-6 py-3 bg-gray-200 rounded-xl">Discard</button>

        <button
          onClick={handlePublish}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Event"}
        </button>
      </div>
    </div>
  );
}

export default EditEvent;
