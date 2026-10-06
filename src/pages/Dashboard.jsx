import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBookings';

export default function Dashboard() {
  const { rooms, loading: roomsLoading } = useRooms();
  const {
    bookings,
    selectedDate,
    setSelectedDate,
    selectedRoomFilter,
    setSelectedRoomFilter,
    loading: bookingsLoading,
    error,
    success,
    createBooking,
    cancelBooking
  } = useBookings();

  const [form, setForm] = useState({
    roomId: '',
    title: '',
    organizerEmail: '',
    attendees: 1,
    start: '',
    end: ''
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const targetRoomId = form.roomId || rooms[0]?.id;
    if (!targetRoomId) return;

    createBooking({ ...form, roomId: targetRoomId }, () => {
      setForm({
        roomId: rooms[0]?.id || '',
        title: '',
        organizerEmail: '',
        attendees: 1,
        start: '',
        end: ''
      });
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Filters */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
          <div>
            <span className="inline-block bg-indigo-50 text-indigo-600 font-semibold text-xs px-2.5 py-1 rounded-full mb-2 uppercase tracking-wide">
              Workspace Portal
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meeting Room Booking System</h1>
            <p className="text-sm text-slate-500">Manage room schedules, bookings, and availability effortlessly.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Filter Room</label>
              <select 
                value={selectedRoomFilter} 
                onChange={(e) => setSelectedRoomFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">All Rooms</option>
                {Array.isArray(rooms) && rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Schedule Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Global Feedback Banners */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center shadow-sm">
            <span className="font-semibold mr-2">Error:</span> {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center shadow-sm">
            <span className="font-semibold mr-2">Success:</span> {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Create Booking Form Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              New Booking
              <span className="text-xs font-normal text-slate-400">15m – 4h duration</span>
            </h2>
            
            <form onSubmit={onSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Room</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={form.roomId || (rooms[0]?.id ?? '')}
                  onChange={(e) => setForm({...form, roomId: e.target.value})}
                  required
                >
                  {Array.isArray(rooms) && rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Meeting Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sprint Planning"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  required 
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Organizer Email</label>
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={form.organizerEmail}
                  onChange={(e) => setForm({...form, organizerEmail: e.target.value})}
                  required 
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Attendees Count</label>
                <input 
                  type="number" 
                  min="1" 
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={form.attendees}
                  onChange={(e) => setForm({...form, attendees: e.target.value})}
                  required 
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Start Time (Local)</label>
                <input 
                  type="datetime-local" 
                  step="900"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={form.start}
                  onChange={(e) => setForm({...form, start: e.target.value})}
                  required 
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">End Time (Local)</label>
                <input 
                  type="datetime-local" 
                  step="900"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={form.end}
                  onChange={(e) => setForm({...form, end: e.target.value})}
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-[0.99] mt-2"
              >
                Confirm Booking
              </button>
            </form>
          </div>

          {/* Schedule Timeline View */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              Schedule Overview
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">{selectedDate}</span>
            </h2>
            
            {bookingsLoading || roomsLoading ? (
              <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
                Loading schedule timeline...
              </div>
            ) : !Array.isArray(bookings) || bookings.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 space-y-1">
                <p className="font-medium text-slate-500">No bookings scheduled</p>
                <p className="text-xs">Select a different room or date filter above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => {
                  const room = Array.isArray(rooms) ? rooms.find(r => r.id === b.roomId) : null;
                  return (
                    <div 
                      key={b.id} 
                      className="border border-slate-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-indigo-100">
                            {room ? room.name : `Room ID: ${b.roomId}`}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-slate-600">{b.attendees} attendees</span>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-base">{b.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">Organizer: {b.organizerEmail}</p>
                        
                        <div className="text-xs font-semibold text-indigo-600 bg-indigo-50/50 inline-block px-2 py-1 rounded border border-indigo-100/50 mt-1">
                          🕒 {new Date(b.start).toUTCString().slice(17, 22)} UTC — {new Date(b.end).toUTCString().slice(17, 22)} UTC
                        </div>
                      </div>

                      <button 
                        onClick={() => cancelBooking(b.id)}
                        className="bg-white text-rose-600 border border-rose-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-50 hover:border-rose-300 transition shadow-xs self-end sm:self-center"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}