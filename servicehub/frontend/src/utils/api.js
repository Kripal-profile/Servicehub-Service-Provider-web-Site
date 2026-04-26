import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('servicehub_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('servicehub_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

export const getServices = (params) => API.get('/services', { params });
export const getServiceById = (id) => API.get(`/services/${id}`);
export const createService = (data) => API.post('/services', data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);
export const getMyServices = () => API.get('/services/my-services');

export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my-bookings');
export const getProviderBookings = () => API.get('/bookings/provider-bookings');
export const updateBookingStatus = (id, data) => API.put(`/bookings/${id}/status`, data);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
export const getBookingById = (id) => API.get(`/bookings/${id}`);

export const updateProfile = (data) => API.put('/users/profile', data);
export const changePassword = (data) => API.put('/users/change-password', data);
export const getProviderProfile = (id) => API.get(`/users/provider/${id}`);

export default API;
