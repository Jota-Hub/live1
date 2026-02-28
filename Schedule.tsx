import { useState, useEffect } from 'react';
import { Event } from '../types';
import { format, parseISO, isPast, isToday, isSaturday, isSunday } from 'date-fns';
import { Calendar, Clock, Ticket, Edit, Trash2, Plus, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JapaneseHolidays from 'japanese-holidays';

const getDoorPrice = (event: Event) => {
  if (event.doorPrice) return event.doorPrice;
  // Fallback for old data: +500 calculation
  if (!event.ticketPrice) return '---';
  const num = parseInt(event.ticketPrice.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return '---';
  return `¥${(num + 500).toLocaleString()}`;
};

const getDayColor = (dateStr: string) => {
  const date = parseISO(dateStr);
  if (JapaneseHolidays.isHoliday(date)) {
    return 'text-red-500';
  }
  if (isSunday(date)) {
    return 'text-red-500';
  }
  if (isSaturday(date)) {
    return 'text-blue-500';
  }
  return 'text-zinc-500';
};

const TIME_OPTIONS = Array.from({ length: 96 }).map((_, i) => {
  const hour = Math.floor(i / 4);
  const min = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
});

const formatCurrency = (value: string) => {
  const num = parseInt(value.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return value;
  return `¥${num.toLocaleString()}`;
};

export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<Partial<Event>>({});

  useEffect(() => {
    fetchEvents();
    // Check for admin session (simple simulation)
    const admin = localStorage.getItem('isAdmin');
    if (admin === 'true') setIsAdmin(true);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowLoginModal(false);
      setLoginPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!formData.date || !formData.title) {
      alert('Date and Title are required');
      return;
    }

    try {
      if (editingId) {
        await fetch(`/api/events/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(event.id);
    setFormData(event);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      title: '',
      description: '',
      openTime: '18:00',
      startTime: '19:00',
      ticketPrice: '¥2,000'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-bold tracking-tighter text-white uppercase glitch-text">
          Live Schedule
        </h2>
        <div className="flex gap-4">
          {isAdmin ? (
            <>
              <button 
                onClick={startAdd}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus size={18} /> Add Event
              </button>
              <button 
                onClick={handleLogout}
                className="text-zinc-400 hover:text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="text-zinc-600 hover:text-zinc-400 text-sm"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg mb-8"
            >
              <h3 className="text-xl text-white mb-4">New Event</h3>
              <EventForm 
                data={formData} 
                onChange={setFormData} 
                onSave={handleSave} 
                onCancel={() => setIsAdding(false)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {events.map((event) => (
          <div key={event.id} className="relative group">
            {editingId === event.id ? (
              <div className="bg-zinc-900 border border-emerald-500/50 p-6 rounded-lg">
                <EventForm 
                  data={formData} 
                  onChange={setFormData} 
                  onSave={handleSave} 
                  onCancel={() => setEditingId(null)} 
                />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedEvent(event)}
                className={`
                  flex flex-col md:flex-row gap-6 p-6 rounded-lg border transition-all duration-300 cursor-pointer
                  ${isToday(parseISO(event.date)) 
                    ? 'bg-zinc-900/80 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/60'}
                  ${isPast(parseISO(event.date)) && !isToday(parseISO(event.date)) ? 'opacity-60 grayscale' : ''}
                `}
              >
                {/* Date Column */}
                <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 pb-4 md:pb-0 md:pr-6">
                  <span className="text-xl font-bold text-zinc-500 leading-none">
                    {format(parseISO(event.date), 'M')}
                  </span>
                  <span className="text-sm text-zinc-400 uppercase tracking-widest mb-1">
                    {format(parseISO(event.date), 'MMM')}
                  </span>
                  <span className="text-4xl font-bold text-white leading-none mb-1">
                    {format(parseISO(event.date), 'dd')}
                  </span>
                  <span className={`text-sm font-bold ${getDayColor(event.date)}`}>
                    {format(parseISO(event.date), 'EEE')}
                  </span>
                </div>

                {/* Content Column */}
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  {event.artists && (
                    <p className="text-emerald-400 font-bold mb-4 whitespace-pre-wrap">{event.artists}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-300 font-mono">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-emerald-500" />
                      <span>Open {event.openTime} / Start {event.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="text-emerald-500" />
                      <span>Adv. {event.ticketPrice} / Door {getDoorPrice(event)}</span>
                    </div>
                  </div>
                </div>

                {/* Image Column (Right) */}
                <div className="md:w-48 flex-shrink-0 hidden md:flex items-center justify-center bg-black/20 rounded overflow-hidden">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center text-zinc-700">
                      <span className="text-xs uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => startEdit(event, e)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(event.id, e)}
                      className="p-2 bg-red-900/50 hover:bg-red-900 text-white rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No events scheduled yet.
          </div>
        )}
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-zinc-900 border border-zinc-700 w-full max-w-sm p-8 rounded-xl shadow-2xl z-10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Admin Login</h3>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Password</label>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
                    placeholder="Enter password"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold"
                  >
                    Login
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-zinc-900 border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
            >
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full z-10 transition-colors"
              >
                <X size={20} />
              </button>

              {selectedEvent.imageUrl && (
                <div className="w-full h-64 md:h-80 relative">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 text-emerald-500 font-mono text-sm mb-4">
                  <span className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {format(parseISO(selectedEvent.date), 'yyyy.MM.dd (EEE)')}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {selectedEvent.title}
                </h2>
                
                {selectedEvent.artists && (
                  <p className="text-xl text-emerald-400 font-bold mb-6">{selectedEvent.artists}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Clock className="text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">Time</p>
                      <p className="text-white font-mono">Open {selectedEvent.openTime} / Start {selectedEvent.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ticket className="text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">Ticket</p>
                      <p className="text-white font-mono">Adv. {selectedEvent.ticketPrice} / Door {getDoorPrice(selectedEvent)}</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventForm({ data, onChange, onSave, onCancel }: { 
  data: Partial<Event>, 
  onChange: (d: Partial<Event>) => void,
  onSave: () => void,
  onCancel: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Date</label>
          <input 
            type="date" 
            value={data.date} 
            onChange={e => onChange({...data, date: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Title</label>
          <input 
            type="text" 
            value={data.title} 
            onChange={e => onChange({...data, title: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
            placeholder="Event Title"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs text-zinc-500 mb-1">Artists / Performers</label>
        <input 
          type="text" 
          value={data.artists || ''} 
          onChange={e => onChange({...data, artists: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
          placeholder="Artist Name, Band Name..."
        />
      </div>
      
      <div>
        <label className="block text-xs text-zinc-500 mb-1">Description</label>
        <textarea 
          value={data.description} 
          onChange={e => onChange({...data, description: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none h-24"
          placeholder="Band names, details..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Open Time</label>
          <select 
            value={data.openTime} 
            onChange={e => onChange({...data, openTime: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none appearance-none"
          >
            {TIME_OPTIONS.map(time => (
              <option key={`open-${time}`} value={time}>{time}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Start Time</label>
          <select 
            value={data.startTime} 
            onChange={e => onChange({...data, startTime: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none appearance-none"
          >
            {TIME_OPTIONS.map(time => (
              <option key={`start-${time}`} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Adv. Price</label>
          <input 
            type="text" 
            value={data.ticketPrice} 
            onChange={e => {
              const val = e.target.value;
              // Allow typing numbers, format on blur or just update
              // User wants: input [1000] -> display [¥1,000]
              // We'll format immediately if it looks like a number
              const num = val.replace(/[^0-9]/g, '');
              if (num) {
                onChange({...data, ticketPrice: `¥${parseInt(num).toLocaleString()}`});
              } else {
                onChange({...data, ticketPrice: val});
              }
            }}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
            placeholder="¥2,000"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Door Price</label>
          <input 
            type="text" 
            value={data.doorPrice || ''} 
            onChange={e => {
              const val = e.target.value;
              const num = val.replace(/[^0-9]/g, '');
              if (num) {
                onChange({...data, doorPrice: `¥${parseInt(num).toLocaleString()}`});
              } else {
                onChange({...data, doorPrice: val});
              }
            }}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
            placeholder="¥2,500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-zinc-500 mb-1">Image</label>
        <div className="flex flex-col gap-2">
           <input 
            type="file" 
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              const formData = new FormData();
              formData.append('image', file);
              
              try {
                const res = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                });
                const responseData = await res.json();
                
                if (!res.ok) {
                  throw new Error(responseData.error || 'Upload failed');
                }

                if (responseData.imageUrl) {
                  onChange({...data, imageUrl: responseData.imageUrl});
                }
              } catch (err: any) {
                console.error('Upload failed', err);
                alert(err.message || 'Failed to upload image');
              }
            }}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
          />
          <div className="text-xs text-zinc-500 text-center my-1">- OR -</div>
          <input 
            type="text" 
            value={data.imageUrl || ''} 
            onChange={e => onChange({...data, imageUrl: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
            placeholder="https://example.com/flyer.jpg"
          />
        </div>
        {data.imageUrl && (
          <div className="mt-2 w-full h-32 bg-zinc-900 rounded overflow-hidden border border-zinc-700">
            <img src={data.imageUrl} alt="Preview" className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-zinc-400 hover:text-white"
        >
          Cancel
        </button>
        <button 
          onClick={onSave}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded"
        >
          <Save size={16} /> Save
        </button>
      </div>
    </div>
  );
}
