import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { useDebounce } from './useDebounce';

export function useBookings() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('');
  
  const debouncedDate = useDebounce(selectedDate, 300);
  const debouncedRoomFilter = useDebounce(selectedRoomFilter, 300);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!debouncedDate) return;
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookings(debouncedDate, debouncedRoomFilter);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch bookings.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedDate, debouncedRoomFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (formData, resetForm) => {
    setError(null);
    setSuccess(null);

    try {
      const startObj = new Date(formData.start);
      const endObj = new Date(formData.end);

      // Frontend Rule R3 Validation: Duration between 15 mins and 4 hours (240 mins)
      const durationMs = endObj - startObj;
      const durationMins = durationMs / (1000 * 60);

      if (durationMins < 15) {
        throw new Error('R3 Validation Error: A booking must last at least 15 minutes.');
      }
      if (durationMins > 240) {
        throw new Error('R3 Validation Error: A booking cannot exceed 4 hours.');
      }

      await bookingService.createBooking({
        roomId: Number(formData.roomId),
        title: formData.title,
        organizerEmail: formData.organizerEmail,
        attendees: Number(formData.attendees),
        start: startObj.toISOString(),
        end: endObj.toISOString()
      });

      setSuccess('Booking created successfully!');
      resetForm();
      fetchBookings();
    } catch (err) {
      setError(err.message || err.response?.data?.error?.message || 'Booking submission failed.');
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setError(null);
    setSuccess(null);
    try {
      await bookingService.cancelBooking(id);
      setSuccess('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Cancellation failed.');
    }
  };

  return {
    bookings,
    selectedDate,
    setSelectedDate,
    selectedRoomFilter,
    setSelectedRoomFilter,
    loading,
    error,
    success,
    createBooking,
    cancelBooking
  };
}