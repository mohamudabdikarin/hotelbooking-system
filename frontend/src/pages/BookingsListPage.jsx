import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export const BookingsListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const result = await api.getBookings(token);
      if (Array.isArray(result)) {
        setBookings(result);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.deleteBooking(bookingId, token);
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      setError('Error canceling booking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">My Bookings</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-xl text-gray-600">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-6">You haven't made any bookings yet</p>
            <button
              onClick={() => navigate('/rooms')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">Booking ID:</span> {booking._id}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Check-in:</span>{' '}
                        {new Date(booking.fromDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Check-out:</span>{' '}
                        {new Date(booking.toDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Room ID:</span> {booking.room}
                      </p>
                      <p className="text-xl text-blue-600 font-bold">
                        Total: ${booking.totalAmount}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate(`/booking/${booking.room}`)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        View Room
                      </button>
                      <button
                        onClick={() => navigate(`/payment/${booking._id}`)}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Make Payment
                      </button>
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
