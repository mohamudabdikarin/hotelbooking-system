import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [roomForm, setRoomForm] = useState({ name: '', price: '', maxCount: '', description: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'customer' });

  useEffect(() => {
    if (!token || (user?.role !== 'admin' && user?.role !== 'receptionist')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [token, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsData, bookingsData, customersData, paymentsData, usersData] = await Promise.all([
        api.getRooms(token),
        api.getBookings(token),
        api.getCustomers(token),
        api.getPayments(token),
        user?.role === 'admin' ? api.getAllUsers(token) : Promise.resolve([])
      ]);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const room = { ...roomForm, price: parseFloat(roomForm.price), maxCount: parseInt(roomForm.maxCount) };
      const result = await api.createRoom(room, token);
      if (result._id) {
        setRooms([...rooms, result]);
        setRoomForm({ name: '', price: '', maxCount: '', description: '' });
      }
    } catch (err) {
      setError('Error adding room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await api.deleteRoom(roomId, token);
      setRooms(rooms.filter(r => r._id !== roomId));
    } catch (err) {
      setError('Error deleting room');
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const result = await api.createCustomer(customerForm, token);
      if (result._id) {
        setCustomers([...customers, result]);
        setCustomerForm({ name: '', email: '', phone: '' });
      }
    } catch (err) {
      setError('Error adding customer');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await api.deleteCustomer(id, token);
      setCustomers(customers.filter(c => c._id !== id));
    } catch (err) {
      setError('Error deleting customer');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.deleteBooking(id, token);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      setError('Error deleting booking');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const result = await api.register(userForm.name, userForm.email, userForm.password, userForm.role);
      if (result.user) {
        setUsers([...users, result.user]);
        setUserForm({ name: '', email: '', password: '', role: 'customer' });
      }
    } catch (err) {
      setError('Error creating user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.deleteUser(id, token);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      setError('Error deleting user');
    }
  };

  const tabs = [
    { id: 'rooms', label: 'Rooms', roles: ['admin', 'receptionist'] },
    { id: 'customers', label: 'Customers', roles: ['admin', 'receptionist'] },
    { id: 'bookings', label: 'Bookings', roles: ['admin', 'receptionist'] },
    { id: 'payments', label: 'Payments', roles: ['admin', 'receptionist'] },
    { id: 'users', label: 'Users', roles: ['admin'] }
  ].filter(t => t.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard - {user?.role}</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
        {loading ? <p>Loading...</p> : (
          <>
            <div className="flex border-b mb-4">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'rooms' && (
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl font-bold mb-4">Manage Rooms</h2>
                {(user?.role === 'admin' || user?.role === 'receptionist') && (
                  <form onSubmit={handleAddRoom} className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-2 gap-2">
                    <input placeholder="Name" value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} className="border p-2" required />
                    <input placeholder="Price" type="number" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})} className="border p-2" required />
                    <input placeholder="Max Count" type="number" value={roomForm.maxCount} onChange={e => setRoomForm({...roomForm, maxCount: e.target.value})} className="border p-2" required />
                    <input placeholder="Description" value={roomForm.description} onChange={e => setRoomForm({...roomForm, description: e.target.value})} className="border p-2" required />
                    <button type="submit" className="bg-green-600 text-white p-2 rounded col-span-2">Add Room</button>
                  </form>
                )}
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">Name</th><th className="p-2">Price</th><th className="p-2">Max</th><th className="p-2">Actions</th></tr></thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room._id} className="border-t">
                        <td className="p-2">{room.name}</td>
                        <td className="p-2">${room.price}</td>
                        <td className="p-2">{room.maxCount}</td>
                        <td className="p-2">{user?.role === 'admin' && <button onClick={() => handleDeleteRoom(room._id)} className="text-red-600">Delete</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl font-bold mb-4">Manage Customers</h2>
                {(user?.role === 'admin' || user?.role === 'receptionist') && (
                  <form onSubmit={handleAddCustomer} className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-3 gap-2">
                    <input placeholder="Name" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} className="border p-2" required />
                    <input placeholder="Email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} className="border p-2" required />
                    <input placeholder="Phone" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} className="border p-2" required />
                    <button type="submit" className="bg-green-600 text-white p-2 rounded col-span-3">Add Customer</button>
                  </form>
                )}
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Phone</th><th className="p-2">Actions</th></tr></thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c._id} className="border-t">
                        <td className="p-2">{c.name}</td>
                        <td className="p-2">{c.email}</td>
                        <td className="p-2">{c.phone}</td>
                        <td className="p-2">{user?.role === 'admin' && <button onClick={() => handleDeleteCustomer(c._id)} className="text-red-600">Delete</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl font-bold mb-4">All Bookings</h2>
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">ID</th><th className="p-2">From</th><th className="p-2">To</th><th className="p-2">Amount</th><th className="p-2">Actions</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} className="border-t">
                        <td className="p-2">{b._id?.slice(-6)}</td>
                        <td className="p-2">{new Date(b.fromDate).toLocaleDateString()}</td>
                        <td className="p-2">{new Date(b.toDate).toLocaleDateString()}</td>
                        <td className="p-2">${b.totalAmount}</td>
                        <td className="p-2">{(user?.role === 'admin' || user?.role === 'receptionist') && <button onClick={() => handleDeleteBooking(b._id)} className="text-red-600">Cancel</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl font-bold mb-4">All Payments</h2>
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">ID</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id} className="border-t">
                        <td className="p-2">{p._id?.slice(-6)}</td>
                        <td className="p-2">${p.amount}</td>
                        <td className="p-2">{p.isPaid ? 'Paid' : 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && user?.role === 'admin' && (
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl font-bold mb-4">Manage Users</h2>
                <form onSubmit={handleAddUser} className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-4 gap-2">
                  <input placeholder="Name" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="border p-2" required />
                  <input placeholder="Email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="border p-2" required />
                  <input placeholder="Password" type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="border p-2" required />
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="border p-2">
                    <option value="customer">Customer</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" className="bg-green-600 text-white p-2 rounded col-span-4">Create User</button>
                </form>
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Actions</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-t">
                        <td className="p-2">{u.name}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.role}</td>
                        <td className="p-2"><button onClick={() => handleDeleteUser(u._id)} className="text-red-600">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;