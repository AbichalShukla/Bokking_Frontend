import { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';

export function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    roomService.getRooms()
      .then(setRooms)
      .catch(err => setError(err.response?.data?.error?.message || 'Failed to fetch rooms.'))
      .finally(() => setLoading(false));
  }, []);

  return { rooms, loading, error };
}