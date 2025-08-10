import React, { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setError(null);
      try {
        const res = await api.get("/my-bookings");
        setBookings(res.data);
      } catch (err) {
        setError("Failed to fetch bookings");
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-semibold mb-6">My Bookings</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border p-4 rounded bg-gray-50"
            >
              <p>
                <strong>Slot Start:</strong>{" "}
                {new Date(booking.slot.startAt).toLocaleString()}
              </p>
              <p>
                <strong>Slot End:</strong>{" "}
                {new Date(booking.slot.endAt).toLocaleString()}
              </p>
              <p>
                <strong>Booking Made At:</strong>{" "}
                {new Date(booking.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
