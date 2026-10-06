import { api } from '../api/axios';

export const bookingService = {
  async getBookings(date, roomId = '') {
    let url = `/bookings?date=${date}`;
    if (roomId) url += `&roomId=${roomId}`;
    
    const response = await api.get(url);
    const data = response.data;
    
    // Safely normalize data into an array
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.bookings)) return data.bookings;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  },

  async createBooking(payload) {
    const response = await api.post('/bookings', payload);
    return response.data;
  },

  async cancelBooking(id) {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};