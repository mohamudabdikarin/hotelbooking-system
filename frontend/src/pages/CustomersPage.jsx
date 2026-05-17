import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export const CustomersPage = () => {
  const { token, user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await api.getCustomers(token);
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) { setError('Name is required'); return; }
    if (!formData.email.trim()) { setError('Email is required'); return; }
    if (!emailRegex.test(formData.email)) { setError('Invalid email format'); return; }
    if (!formData.phone.trim()) { setError('Phone is required'); return; }
    
    try {
      if (editingId) {
        await api.updateCustomer(editingId, formData, token);
      } else {
        const result = await api.createCustomer(formData, token);
        if (!result._id) { setError(result.message || 'Failed to create customer'); return; }
      }
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '' });
      setEditingId(null);
      loadCustomers();
    } catch (err) {
      setError('Failed to save customer');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.deleteCustomer(id, token);
      loadCustomers();
    } catch (err) {
      setError('Failed to delete customer');
    }
  };

  const handleEdit = (customer) => {
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone });
    setEditingId(customer._id);
    setShowForm(true);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        {(user?.role === 'admin' || user?.role === 'receptionist') && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', email: '', phone: '' }); }}
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
          >
            Add Customer
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      {showForm && (
        <div className="bg-gray-100 p-4 mb-4 rounded">
          <h2 className="text-lg font-semibold mb-3">{editingId ? 'Edit' : 'Add'} Customer</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.email}</td>
              <td className="p-3">{c.phone}</td>
              <td className="p-3">
                {(user?.role === 'admin' || user?.role === 'receptionist') && (
                  <>
                    <button onClick={() => handleEdit(c)} className="text-blue-600 mr-2">Edit</button>
                    {user?.role === 'admin' && (
                      <button onClick={() => handleDelete(c._id)} className="text-red-600">Delete</button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersPage;