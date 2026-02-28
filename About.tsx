import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { Calendar, ArrowRight } from 'lucide-react';
import { Event } from '../types';

export default function About({ onNavigate }: { onNavigate: () => void }) {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then((data: Event[]) => {
        const upcoming = data.find(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)));
        if (upcoming) setNextEvent(upcoming);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h2 className="font-bold tracking-tighter text-white uppercase mb-6 leading-none">
            <span className="text-3xl md:text-5xl block mb-2">We Are</span>
            <span className="text-5xl md:text-7xl font-black font-chelsea">
              <span className="text-emerald-500">GACHI</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">D.I.Y.</span>
            </span>
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed mb-6">
            Established in 2024, LIVE SPACE GACHI D.I.Y. is Tokyo's premier destination for alternative sounds. 
            Located in the heart of Shibuya, we provide a sanctuary for artists and fans who live for the music.
          </p>
          
          {/* Mobile Image */}
          <div className="md:hidden relative aspect-square bg-zinc-800 rounded-lg overflow-hidden mb-8">
            <img 
              src="https://picsum.photos/seed/concert/800/800?grayscale" 
              alt="Venue Crowd" 
              className="object-cover w-full h-full opacity-60 hover:opacity-80 transition-opacity duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          {nextEvent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-zinc-900/80 border border-emerald-500/30 p-6 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-emerald-400 mb-2 font-bold uppercase tracking-widest text-xs">
                <Calendar size={14} /> Next Show
              </div>
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-2xl font-bold text-white">{format(parseISO(nextEvent.date), 'MMM dd')}</span>
                <span className="text-zinc-500 uppercase">{format(parseISO(nextEvent.date), 'EEE')}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{nextEvent.title}</h3>
              <button 
                onClick={onNavigate}
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold uppercase tracking-wider"
              >
                View Details <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </motion.div>
        
        {/* Desktop Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:block relative aspect-square bg-zinc-800 rounded-lg overflow-hidden"
        >
          <img 
            src="https://picsum.photos/seed/concert/800/800?grayscale" 
            alt="Venue Crowd" 
            className="object-cover w-full h-full opacity-60 hover:opacity-80 transition-opacity duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-8 border-t-2 border-emerald-500">
          <h3 className="text-2xl font-bold text-white mb-2">Sound</h3>
          <p className="text-zinc-400 mb-4">
            L-Acoustics K Series system tuned for maximum clarity and impact across all genres.
          </p>
          <div className="aspect-video bg-zinc-800 rounded overflow-hidden">
             <img src="https://picsum.photos/seed/sound/400/300" alt="Sound System" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="bg-zinc-900 p-8 border-t-2 border-cyan-500">
          <h3 className="text-2xl font-bold text-white mb-2">Bar</h3>
          <p className="text-zinc-400 mb-4">
            Extensive selection of craft beers, spirits, and signature cocktails to keep the night flowing.
          </p>
          <div className="aspect-video bg-zinc-800 rounded overflow-hidden">
             <img src="https://picsum.photos/seed/bar/400/300" alt="Bar Counter" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="bg-zinc-900 p-8 border-t-2 border-purple-500">
          <h3 className="text-2xl font-bold text-white mb-2">Space</h3>
          <p className="text-zinc-400 mb-4">
            Industrial brutalist design with high ceilings and excellent sightlines from anywhere in the room.
          </p>
          <div className="aspect-video bg-zinc-800 rounded overflow-hidden">
             <img src="https://picsum.photos/seed/space/400/300" alt="Venue Space" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </div>
  );
}
