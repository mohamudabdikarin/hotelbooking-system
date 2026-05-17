import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Header = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <span className="text-xl font-bold">Hotel System</span>
        <nav className="flex gap-6 items-center">
          
          <Link to="/rooms" className="hover:text-blue-200 transition">Rooms</Link>
          
          {token && (
            <>
              <Link to="/bookings" className="hover:text-blue-200 transition">My Bookings</Link>
              {(user?.role === 'admin' || user?.role === 'receptionist') && (
                <>
                  <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
                  <Link to="/customers" className="hover:text-blue-200 transition">Customers</Link>
                </>
              )}
              <Link to="/profile" className="hover:text-blue-200 transition">Profile</Link>
              
              <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded cursor-pointer hover:bg-red-700 transition">Logout</button>
            </>
          )}
          {!token && (
            <>
              <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition">Login</Link>
              <Link to="/register" className="border border-white px-4 py-2 rounded hover:bg-blue-700 transition">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
