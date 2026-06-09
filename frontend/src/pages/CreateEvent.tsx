import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

function CreateEvent() {
  /* STATES */
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("event");

  /* REFS */
  const eventRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const ticketsRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);

  /* SCROLL TO SECTION */
  const scrollTo = (
    ref: React.RefObject<HTMLDivElement | null>,
    key: string
  ) => {
    setActiveSection(key);

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
            const found = sections.find(
              (s) => s.ref.current === entry.target
            );

            if (found) {
              setActiveSection(found.key);
            }
          }
        });
      },
      {
        rootMargin: "-120px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  /* HANDLE BANNER UPLOAD */
  const handleBanner = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setBannerPreview(
        URL.createObjectURL(e.target.files[0])
      );
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
                onClick={() =>
                  scrollTo(item.ref, item.key)
                }
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
            <h2 className="text-xl font-bold mb-4">
              Event Information
            </h2>

            <label className="block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer mb-4">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  className="h-48 w-full object-cover rounded-xl"
                />
              ) : (
                "Upload Banner"
              )}

              <input
                type="file"
                hidden
                onChange={handleBanner}
              />
            </label>

            <input
              placeholder="Event Name"
              className="w-full p-3 border rounded-xl mb-3"
            />

            <select className="w-full p-3 border rounded-xl mb-3">
              <option>Select Category</option>
              <option>Music</option>
              <option>Sports</option>
            </select>

            <textarea
              placeholder="Description"
              className="w-full p-3 border rounded-xl"
            />
          </div>

          {/* SCHEDULE */}
          <div
            ref={scheduleRef}
            className="scroll-mt-32 bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-bold mb-4">
              Schedule & Location
            </h2>

            <div className="flex gap-4 mb-4">
              <input
                type="datetime-local"
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="datetime-local"
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <input
              placeholder="Venue / Online Link"
              className="w-full p-3 border rounded-xl mb-4"
            />

            <div className="h-40 bg-gray-200 rounded-xl flex items-center justify-center">
              Map Placeholder
            </div>
          </div>

          {/* TICKETS */}
          <div
            ref={ticketsRef}
            className="scroll-mt-32 bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-bold mb-4">
              Tickets & Pricing
            </h2>

            <div className="border p-4 rounded-xl mb-4">
              <p className="font-semibold mb-2">
                General Admission
              </p>

              <div className="flex gap-3">
                <input
                  placeholder="Type"
                  className="flex-1 p-3 border rounded-xl"
                />

                <input
                  placeholder="Price"
                  className="flex-1 p-3 border rounded-xl"
                />

                <input
                  placeholder="Quantity"
                  className="flex-1 p-3 border rounded-xl"
                />
              </div>
            </div>

            <button className="border-dashed border w-full p-3 rounded-xl text-purple-600 hover:bg-purple-50">
              + Add Ticket
            </button>
          </div>

          {/* PROMOTIONS */}
          <div
            ref={promoRef}
            className="scroll-mt-32 bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-bold mb-4">
              Promotions
            </h2>

            <input
              placeholder="Voucher Code"
              className="w-full p-3 border rounded-xl mb-3"
            />

            <input
              placeholder="Discount %"
              className="w-full p-3 border rounded-xl mb-3"
            />

            <div className="flex gap-4">
              <input
                type="date"
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="date"
                className="w-full p-3 border rounded-xl"
              />
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t px-6 py-4 flex justify-between items-center z-50">
        <button className="px-6 py-3 bg-gray-200 rounded-xl">
          Discard
        </button>

        <button className="px-6 py-3 bg-purple-600 text-white rounded-xl">
          Publish Event
        </button>
      </div>
    </div>
  );
}

export default CreateEvent;