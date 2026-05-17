import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export const BookingPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    fromDate: '',
    toDate: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRoom();
  }, [roomId, token]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const result = token ? await api.getRoomById(roomId, token) : await api.getRoomById(roomId);
      setRoom(result);
    } catch (err) {
      setError('Error fetching room details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    if (!bookingData.fromDate || !bookingData.toDate || !room) return 0;
    const from = new Date(bookingData.fromDate);
    const to = new Date(bookingData.toDate);
    const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    return Math.max(0, nights) * room.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!bookingData.fromDate || !bookingData.toDate) {
      setError('Please select both dates');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fromDate = new Date(bookingData.fromDate);
    const toDate = new Date(bookingData.toDate);

    if (fromDate < today) {
      setError('Check-in date cannot be in the past');
      return;
    }

    if (toDate <= fromDate) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (calculateTotalAmount() <= 0) {
      setError('Invalid booking dates');
      return;
    }

    setSubmitting(true);
    try {
      const booking = {
        user: user.id,
        room: roomId,
        fromDate: bookingData.fromDate,
        toDate: bookingData.toDate,
        totalAmount: calculateTotalAmount()
      };

      const result = await api.createBooking(booking, token);
      if (result._id) {
        navigate(`/payment/${result._id}`);
      } else {
        setError(result.message || 'Failed to create booking');
      }
    } catch (err) {
      setError('Error creating booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!room) {
    return <div className="text-center py-12 text-red-600">Room not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Book Room: {room.name}</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Room Details</h2>
            <div className="bg-blue-100 rounded-lg p-6 mb-4 text-center">
              <div className="text-6xl mb-4">🏨</div>
              <p className="text-lg text-gray-700">{room.description}</p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold">Price per night:</span> ${room.price}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Max occupancy:</span> {room.maxCount} people
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={bookingData.fromDate}
                  onChange={(e) => setBookingData({ ...bookingData, fromDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={bookingData.toDate}
                  onChange={(e) => setBookingData({ ...bookingData, toDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">${calculateTotalAmount()}</span>
                </div>
               
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'Booking...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
