import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getEventAttendees,
} from "../services/eventService";

function EventAttendees() {
  const { id } = useParams();

  const [attendees, setAttendees] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchAttendees =
    async () => {
      try {
        const data =
          await getEventAttendees(
            id!
          );

        setAttendees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAttendees();
  }, []);

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-700";

      case "WAITING_CONFIRMATION":
        return "bg-blue-100 text-blue-700";

      case "WAITING_FOR_PAYMENT":
        return "bg-yellow-100 text-yellow-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="pt-32 text-center">
          Loading...
        </div>
      </>
    );
  }

  return (
    <div className="bg-[#fef7ff] min-h-screen">
      <Navbar />

      <section className="pt-32 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Event Attendees
        </h1>

        {attendees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            No attendees found
          </div>
        ) : (
          <div className="space-y-4">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-lg">
                      {
                        attendee.users
                          ?.name
                      }
                    </h2>

                    <p>
                      Email:{" "}
                      {
                        attendee.users
                          ?.email
                      }
                    </p>

                    <p>
                      Ticket:{" "}
                      {
                        attendee
                          .transaction_items?.[0]
                          ?.tickets
                          ?.name
                      }
                    </p>

                    <p>
                      Quantity:{" "}
                      {
                        attendee
                          .transaction_items?.[0]
                          ?.quantity
                      }
                    </p>

                    <p>
                      Total Paid: Rp{" "}
                      {new Intl.NumberFormat(
                        "id-ID"
                      ).format(
                        attendee.final_price
                      )}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        attendee.status
                      )}`}
                    >
                      {
                        attendee.status
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EventAttendees;