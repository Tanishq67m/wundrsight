import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authFetch } from "../api/auth";

export default function Slots() {
  const { token } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      setBookingError(null);
      try {
        const from = new Date().toISOString();
        const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const res = await fetch(`http://https://wundrsight.onrender.com/api/slots?from=${from}&to=${to}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load slots");
        setSlots(data);
      } catch (err) {
        setBookingError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, []);

  async function bookSlot(slotId) {
    setBookingError(null);
    setSuccess(null);
    try {
      const res = await authFetch(
        "http://https://wundrsight.onrender.com/api/book",
        token,
        {
          method: "POST",
          body: JSON.stringify({ slotId }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.code === "SLOT_TAKEN") {
          throw new Error("Slot already booked, please select another");
        }
        throw new Error(data.error?.message || "Booking failed");
      }
      setSuccess("Booking successful!");
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err) {
      setBookingError(err.message);
    }
  }

  if (loading) return <p>Loading slots...</p>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Available Slots</h2>
      {bookingError && <p className="text-red-600 mb-2">{bookingError}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {slots.length === 0 && <p>No slots available</p>}
      <ul>
        {slots.map((slot) => (
          <li key={slot.id} className="mb-3 flex justify-between items-center border p-2 rounded">
            <div>
              {new Date(slot.startAt).toLocaleString()} - {new Date(slot.endAt).toLocaleString()}
            </div>
            <button
              onClick={() => bookSlot(slot.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
