import React, { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const Button = ({ children, variant = "primary", size = "md", disabled, className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Spinner = ({ size = "md" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  return <Loader2 className={`${sizes[size]} animate-spin`} />;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
    {children}
  </div>
);

export default function PatientDashboard({ token }) {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // default today

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  async function fetchSlots() {
    setLoadingSlots(true);
    const fromDate = new Date().toISOString().slice(0, 10);
    const toDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 14 days ahead
      .toISOString()
      .slice(0, 10);
    try {
      const res = await fetch(
        `http://https://wundrsight.onrender.com/api/slots?from=${fromDate}&to=${toDate}`
      );
      if (!res.ok) throw new Error("Failed to load slots");
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingSlots(false);
    }
  }

  async function fetchBookings() {
    setLoadingBookings(true);
    try {
      const res = await fetch("http://https://wundrsight.onrender.com/api/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingBookings(false);
    }
  }

  async function bookSlot(slotId) {
    setBookingSlotId(slotId);
    try {
      const res = await fetch("http://https://wundrsight.onrender.com/api/book", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slotId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.code === "SLOT_TAKEN") {
          toast.error("Slot already booked!");
        } else {
          throw new Error(data.error?.message || "Booking failed");
        }
      } else {
        toast.success("Booked successfully!");
        fetchSlots();
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBookingSlotId(null);
    }
  }

  // Create a Set of booked slot IDs for quick lookup
  const bookedSlotIds = new Set(bookings.map(b => b.slot.id));

  // Filter slots by selected date
  const filteredSlots = slots.filter(slot => {
    const slotDate = new Date(slot.startAt).toISOString().slice(0, 10);
    return slotDate === selectedDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
          <p className="text-gray-600">Book appointments and manage your schedule</p>
        </div>

        {/* Date picker */}
        <div className="mb-6 flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().slice(0, 10)}
            max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600">Select a date (up to 7 days ahead)</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Available Slots */}
          <div className="xl:col-span-2">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Available Slots</h2>
                  <p className="text-sm text-gray-600">{selectedDate}</p>
                </div>
              </div>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : filteredSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No slots available for booking on this date</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSlots.map((slot) => {
                    const isBooked = bookedSlotIds.has(slot.id);
                    return (
                      <div
                        key={slot.id}
                        className={`border rounded-lg p-4 transition-shadow ${
                          isBooked ? "bg-red-50 border-red-300" : "border-gray-200 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Clock className={`w-5 h-5 ${isBooked ? "text-red-400" : "text-gray-400"}`} />
                            <div>
                              <p className={`font-medium ${isBooked ? "text-red-600" : "text-gray-900"}`}>
                                {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => bookSlot(slot.id)}
                            disabled={bookingSlotId === slot.id || isBooked}
                            size="sm"
                            variant={isBooked ? "primary" : "primary"}
                            className={isBooked ? "cursor-not-allowed opacity-50" : ""}
                          >
                            {bookingSlotId === slot.id ? <Spinner size="sm" /> : isBooked ? "Booked" : "Book"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* My Bookings */}
          <div>
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
                  <p className="text-sm text-gray-600">{bookings.length} appointment{bookings.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {loadingBookings ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-900">
                          {new Date(booking.slot.startAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-green-700">
                          {new Date(booking.slot.startAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
