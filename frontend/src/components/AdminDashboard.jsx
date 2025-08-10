import React, { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const Spinner = ({ size = "md" }) => {
  const sizes = {
    lg: "w-6 h-6"
  };
  
  return <Loader2 className={`${sizes[size]} animate-spin`} />;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
    {children}
  </div>
);

export default function AdminDashboard({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/all-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all appointments and bookings</p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>
                <p className="text-sm text-gray-600">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600">Bookings will appear here once patients start scheduling</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="hidden md:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appointment Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{booking.id.toString().padStart(4, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                            <div className="text-sm text-gray-500">{booking.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(booking.slot.startAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(booking.slot.startAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view */}
              <div className="md:hidden space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.user.name}</h3>
                        <p className="text-sm text-gray-600">{booking.user.email}</p>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">#{booking.id.toString().padStart(4, '0')}</span>
                      <span className="font-medium">
                        {new Date(booking.slot.startAt).toLocaleDateString()} at {new Date(booking.slot.startAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}