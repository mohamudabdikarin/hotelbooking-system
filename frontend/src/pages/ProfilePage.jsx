import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">My Profile</h1>

        <div className="space-y-6">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Full Name</p>
              <p className="text-xl font-semibold text-gray-900">{user.name}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Email Address</p>
              <p className="text-xl font-semibold text-gray-900">{user.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">User Role</p>
              <p className="text-xl font-semibold text-gray-900 capitalize">{user.role}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Account Status</p>
              <p className="text-xl font-semibold text-green-600">Active</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/bookings')}
                className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/rooms')}
                className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Browse Rooms
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Go to Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
