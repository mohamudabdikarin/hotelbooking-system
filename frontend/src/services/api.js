const API_BASE_URL = 'http://localhost:5000/api';

const authHeader = (token) => ({ 'Authorization': `Bearer ${token}` });

export const api = {
  register: async (name, email, password, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  getUserProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  getAllUsers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  getUserById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/${id}`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  updateUser: async (id, userData, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  deleteUser: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/${id}`, {
      method: 'DELETE',
      headers: authHeader(token)
    });
    return response.json();
  },

  getRooms: async (token) => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  getRoomById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  createRoom: async (room, token) => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(room)
    });
    return response.json();
  },

  updateRoom: async (id, room, token) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(room)
    });
    return response.json();
  },

  deleteRoom: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: authHeader(token)
    });
    return response.json();
  },

  getBookings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  getBookingById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  createBooking: async (booking, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(booking)
    });
    return response.json();
  },

  updateBooking: async (id, booking, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(booking)
    });
    return response.json();
  },

  deleteBooking: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: authHeader(token)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete booking');
    }
    return response.json();
  },

  createPayment: async (payment, token) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(payment)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment');
    }
    return response.json();
  },

  getPayments: async (token) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  getPaymentById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  updatePayment: async (id, payment, token) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(payment)
    });
    return response.json();
  },

  deletePayment: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'DELETE',
      headers: authHeader(token)
    });
    return response.json();
  },

  getCustomers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  getCustomerById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: authHeader(token)
    });
    return response.json();
  },

  createCustomer: async (customer, token) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(customer)
    });
    return response.json();
  },

  updateCustomer: async (id, customer, token) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader(token)
      },
      body: JSON.stringify(customer)
    });
    return response.json();
  },

  deleteCustomer: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: authHeader(token)
    });
    return response.json();
  }
};
