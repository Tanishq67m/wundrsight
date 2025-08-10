import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authFetch } from "../api/auth";

export default function Bookings() {
  const { token, role } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError(null);
      try {
        const url =
          role === "admin"
            ? "http://localhost:5001/api/all-bookings"
            : "http://localhost:5001/api/my-bookings";
        const res = await authFetch(url, token);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load bookings");
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [role, token]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        {role === "admin" ? "All Bookings" : "My Bookings"}
      </h2>
      {bookings.length === 0 && <p>No bookings found</p>}
      <ul>
        {bookings.map(({ id, slot, user }) => (
          <li key={id} className="mb-3 border p-3 rounded">
            <div>
              <strong>Slot:</strong> {new Date(slot.startAt).toLocaleString()} -{" "}
              {new Date(slot.endAt).toLocaleString()}
            </div>
            {role === "admin" && user && (
              <div>
                <strong>User:</strong> {user.name} ({user.email})
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
