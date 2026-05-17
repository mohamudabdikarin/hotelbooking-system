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

  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: '', price: '', maxCount: '', description: '' });
  
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '' });
  
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingForm, setBookingForm] = useState({ fromDate: '', toDate: '', totalAmount: '' });
  
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: '', status: '' });
  
  const [editingUser, setEditingUser] = useState(null);
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
        (user?.role === 'admin' || user?.role === 'receptionist') ? api.getAllUsers(token) : Promise.resolve([])
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

  // Room handlers
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

  const handleEditRoom = (room) => {
    setEditingRoom(room._id);
    setRoomForm({ name: room.name, price: room.price, maxCount: room.maxCount, description: room.description });
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      const room = { ...roomForm, price: parseFloat(roomForm.price), maxCount: parseInt(roomForm.maxCount) };
      const result = await api.updateRoom(editingRoom, room, token);
      if (result._id) {
        setRooms(rooms.map(r => r._id === editingRoom ? result : r));
        setEditingRoom(null);
        setRoomForm({ name: '', price: '', maxCount: '', description: '' });
      }
    } catch (err) {
      setError('Error updating room');
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

  // Customer handlers
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

  const handleEditCustomer = (c) => {
    setEditingCustomer(c._id);
    setCustomerForm({ name: c.name, email: c.email, phone: c.phone });
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const result = await api.updateCustomer(editingCustomer, customerForm, token);
      if (result._id) {
        setCustomers(customers.map(c => c._id === editingCustomer ? result : c));
        setEditingCustomer(null);
        setCustomerForm({ name: '', email: '', phone: '' });
      }
    } catch (err) {
      setError('Error updating customer');
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

  // Booking handlers
  const handleEditBooking = (b) => {
    setEditingBooking(b._id);
    setBookingForm({ 
      fromDate: b.fromDate ? b.fromDate.split('T')[0] : '', 
      toDate: b.toDate ? b.toDate.split('T')[0] : '', 
      totalAmount: b.totalAmount 
    });
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      const result = await api.updateBooking(editingBooking, bookingForm, token);
      if (result._id) {
        setBookings(bookings.map(b => b._id === editingBooking ? result : b));
        setEditingBooking(null);
        setBookingForm({ fromDate: '', toDate: '', totalAmount: '' });
      }
    } catch (err) {
      setError('Error updating booking');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setBookings(bookings.filter(b => b._id !== id));
      } else {
        setError(result.message || 'Error cancelling booking');
      }
    } catch (err) {
      setError('Error cancelling booking: ' + err.message);
    }
  };

  // Payment handlers
  const handleEditPayment = (p) => {
    setEditingPayment(p._id);
    setPaymentForm({ amount: p.amount, method: p.paymentMethod || '', status: p.isPaid ? 'paid' : 'pending' });
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      const result = await api.updatePayment(editingPayment, paymentForm, token);
      if (result._id) {
        setPayments(payments.map(p => p._id === editingPayment ? result : p));
        setEditingPayment(null);
        setPaymentForm({ amount: '', method: '', status: '' });
      }
    } catch (err) {
      setError('Error updating payment');
    }
  };

  // User handlers
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

  const handleEditUser = (u) => {
    setEditingUser(u._id);
    setUserForm({ name: u.name, email: u.email, password: '', role: u.role });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = { name: userForm.name, email: userForm.email, role: userForm.role };
      if (userForm.password) updateData.password = userForm.password;
      const result = await api.updateUser(editingUser, updateData, token);
      if (result.id) {
        setUsers(users.map(u => u._id === editingUser ? { ...u, ...updateData } : u));
        setEditingUser(null);
        setUserForm({ name: '', email: '', password: '', role: 'customer' });
      }
    } catch (err) {
      setError('Error updating user');
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
    { id: 'users', label: 'Users', roles: ['admin', 'receptionist'] }
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
                  <form onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom} className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-2 gap-2">
                    <input placeholder="Name" value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} className="border p-2" required />
                    <input placeholder="Price" type="number" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})} className="border p-2" required />
                    <input placeholder="Max Count" type="number" value={roomForm.maxCount} onChange={e => setRoomForm({...roomForm, maxCount: e.target.value})} className="border p-2" required />
                    <input placeholder="Description" value={roomForm.description} onChange={e => setRoomForm({...roomForm, description: e.target.value})} className="border p-2" required />
                    <button type="submit" className="bg-green-600 text-white p-2 rounded col-span-2">{editingRoom ? 'Update Room' : 'Add Room'}</button>
                    {editingRoom && <button type="button" onClick={() => { setEditingRoom(null); setRoomForm({ name: '', price: '', maxCount: '', description: '' }); }} className="bg-gray-500 text-white p-2 rounded col-span-2">Cancel</button>}
                  </form>
                )}
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">Name</th><th className="p-2">Price</th><th className="p-2">Max</th><th className="p-2">Description</th><th className="p-2">Actions</th></tr></thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room._id} className="border-t">
                        <td className="p-2">{room.name}</td>
                        <td className="p-2">${room.price}</td>
                        <td className="p-2">{room.maxCount}</td>
                        <td className="p-2">{room.description}</td>
                        <td className="p-2">
                          {user?.role === 'admin' && (
                            <>
                              <button onClick={() => handleEditRoom(room)} className="text-blue-600 mr-2">Edit</button>
                              <button onClick={() => handleDeleteRoom(room._id)} className="text-red-600">Delete</button>
                            </>
                          )}
                        </td>
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
                  <form onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer} className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-3 gap-2">
                    <input placeholder="Name" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} className="border p-2" required />
                    <input placeholder="Email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} className="border p-2" required />
                    <input placeholder="Phone" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} className="border p-2" required />
                    <button type="submit" className="bg-green-600 text-white p-2 rounded col-span-3">{editingCustomer ? 'Update Customer' : 'Add Customer'}</button>
                    {editingCustomer && <button type="button" onClick={() => { setEditingCustomer(null); setCustomerForm({ name: '', email: '', phone: '' }); }} className="bg-gray-500 text-white p-2 rounded col-span-3">Cancel</button>}
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
                        <td className="p-2">
                          {(user?.role === 'admin' || user?.role === 'receptionist') && (
                            <>
                              <button onClick={() => handleEditCustomer(c)} className="text-blue-600 mr-2">Edit</button>
                              {user?.role === 'admin' && <button onClick={() => handleDeleteCustomer(c._id)} className="text-red-600">Delete</button>}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl font-bold mb-4">All Bookings</h2>
                {(user?.role === 'admin' || user?.role === 'receptionist') && editingBooking && (
                  <form onSubmit={handleUpdateBooking} className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-3 gap-2">
                    <input type="date" value={bookingForm.fromDate} onChange={e => setBookingForm({...bookingForm, fromDate: e.target.value})} className="border p-2" required />
                    <input type="date" value={bookingForm.toDate} onChange={e => setBookingForm({...bookingForm, toDate: e.target.value})} className="border p-2" required />
                    <input type="number" placeholder="Amount" value={bookingForm.totalAmount} onChange={e => setBookingForm({...bookingForm, totalAmount: e.target.value})} className="border p-2" required />
                    <button type="submit" className="bg-green-600 text-white p-2 rounded col-span-3">Update Booking</button>
                    <button type="button" onClick={() => { setEditingBooking(null); setBookingForm({ fromDate: '', toDate: '', totalAmount: '' }); }} className="bg-gray-500 text-white p-2 rounded col-span-3">Cancel</button>
                  </form>
                )}
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">ID</th><th className="p-2">From</th><th className="p-2">To</th><th className="p-2">Amount</th><th className="p-2">Actions</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} className="border-t">
                        <td className="p-2">{b._id?.slice(-6)}</td>
                        <td className="p-2">{new Date(b.fromDate).toLocaleDateString()}</td>
                        <td className="p-2">{new Date(b.toDate).toLocaleDateString()}</td>
                        <td className="p-2">${b.totalAmount}</td>
                        <td className="p-2">
                          {(user?.role === 'admin' || user?.role === 'receptionist') && <button onClick={() => handleEditBooking(b)} className="text-blue-600 mr-2">Edit</button>}
                          {(user?.role === 'admin' || user?.role === 'receptionist') && <button onClick={() => handleDeleteBooking(b._id)} className="text-red-600">Cancel</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl font-bold mb-4">All Payments</h2>
                {user?.role === 'admin' && editingPayment && (
                  <form onSubmit={handleUpdatePayment} className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-3 gap-2">
                    <input type="number" placeholder="Amount" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} className="border p-2" required />
                    <input placeholder="Method" value={paymentForm.method} onChange={e => setPaymentForm({...paymentForm, method: e.target.value})} className="border p-2" required />
                    <select value={paymentForm.status} onChange={e => setPaymentForm({...paymentForm, status: e.target.value})} className="border p-2">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                    <button type="submit" className="bg-green-600 text-white p-2 rounded col-span-3">Update Payment</button>
                    <button type="button" onClick={() => { setEditingPayment(null); setPaymentForm({ amount: '', method: '', status: '' }); }} className="bg-gray-500 text-white p-2 rounded col-span-3">Cancel</button>
                  </form>
                )}
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">ID</th><th className="p-2">Amount</th><th className="p-2">Method</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id} className="border-t">
                        <td className="p-2">{p._id?.slice(-6)}</td>
                        <td className="p-2">${p.amount}</td>
                        <td className="p-2">{p.paymentMethod || '-'}</td>
                        <td className="p-2">{p.isPaid ? 'Paid' : 'Pending'}</td>
                        <td className="p-2">
                          {user?.role === 'admin' && <button onClick={() => handleEditPayment(p)} className="text-blue-600">Edit</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && (user?.role === 'admin' || user?.role === 'receptionist') && (
              <div className="bg-white p-4 rounded">
                <h2 className="text-xl font-bold mb-4">All Users</h2>
                {user?.role === 'admin' && (
                  <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-4 gap-2">
                    <input placeholder="Name" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="border p-2" required />
                    <input placeholder="Email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="border p-2" required />
                    <input placeholder="Password" type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="border p-2" />
                    <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="border p-2">
                      <option value="customer">Customer</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="bg-green-600 text-white p-2 rounded col-span-4">{editingUser ? 'Update User' : 'Create User'}</button>
                    {editingUser && <button type="button" onClick={() => { setEditingUser(null); setUserForm({ name: '', email: '', password: '', role: 'customer' }); }} className="bg-gray-500 text-white p-2 rounded col-span-4">Cancel</button>}
                  </form>
                )}
                <table className="w-full">
                  <thead><tr className="bg-gray-200"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Actions</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-t">
                        <td className="p-2">{u.name}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.role}</td>
                        <td className="p-2">
                          {user?.role === 'admin' && (
                            <>
                              <button onClick={() => handleEditUser(u)} className="text-blue-600 mr-2">Edit</button>
                              <button onClick={() => handleDeleteUser(u._id)} className="text-red-600">Delete</button>
                            </>
                          )}
                        </td>
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