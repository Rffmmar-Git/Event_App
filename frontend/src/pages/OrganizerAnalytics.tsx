import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getOrganizerAnalytics } from "../services/analyticsService";
import { formatCurrency } from "../utils/formatCurrency";

type Analytics = {
  totalEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendees: number;
  averageRating: number;

  revenueByEvent: {
  title: string | null;
  revenue: number;
  maxRevenue: number;
}[];

ticketsByEvent: {
  title: string | null;
  sold: number;
  totalSeats: number;
}[];
};

function OrganizerAnalytics() {
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getOrganizerAnalytics()
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-32 text-center">
          Loading analytics...
        </div>
      </>
    );
  }

  if (!analytics) {
    return (
      <>
        <Navbar />
        <div className="pt-32 text-center">
          Failed to load analytics.
        </div>
      </>
    );
  }

  return (
    <div className="bg-[#fef7ff] min-h-screen">
      <Navbar />

      <section className="pt-32 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Organizer Analytics
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-5 gap-5 mb-10">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Total Events
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {analytics.totalEvents}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Revenue
            </p>

            <h2 className="text-2xl font-bold mt-2">
              Rp{" "}
              {formatCurrency(
                analytics.totalRevenue
              )}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Tickets Sold
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {analytics.totalTicketsSold}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Attendees
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {analytics.totalAttendees}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Average Rating
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ⭐ {analytics.averageRating}
            </h2>
          </div>

        </div>

        {/* REVENUE */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">
            Revenue by Event
          </h2>

          <div className="space-y-4">
            {analytics.revenueByEvent.map(
              (event) => {

                return (
                  <div key={event.title}>
                    <div className="flex justify-between mb-1">
                      <span>{event.title}</span>

                      <span>Rp {formatCurrency(event.revenue)}</span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-purple-600"
                        style={{
                          width: `${
                            event.maxRevenue > 0
                              ? (event.revenue / event.maxRevenue) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* TICKETS SOLD */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">
            Tickets Sold by Event
          </h2>

          <div className="space-y-4">
            {analytics.ticketsByEvent.map(
              (event) => {

                return (
                  <div key={event.title}>
                    <div className="flex justify-between mb-1">
                      <span>{event.title}</span>

                      <span>{event.sold}</span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-green-600"
                        style={{
                          width: `${
                            event.totalSeats > 0
                              ? (event.sold / event.totalSeats) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

      </section>
    </div>
  );
}

export default OrganizerAnalytics;