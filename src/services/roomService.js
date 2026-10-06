import { api } from "../api/axios";


export const roomService = {
  async getRooms() {
    const response = await api.get('/rooms');
    console.log("RAW ROOMS RESPONSE:", response.data);
    // Handle both direct array responses or wrapped objects like { data: [...] } or { rooms: [...] }
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.rooms)) return data.rooms;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  },

  async getRoomById(roomId) {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  }
};