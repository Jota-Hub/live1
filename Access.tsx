import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Access() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold tracking-tighter text-white uppercase mb-12 glitch-text">
        Access
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800">
            <div className="flex flex-col leading-none mb-6">
              <span className="font-bold text-sm tracking-widest uppercase text-zinc-300">LIVE SPACE</span>
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                <span className="font-black text-2xl tracking-tighter uppercase text-white font-chelsea">GACHI D.I.Y.</span>
                <span className="text-[10px] tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                  ～Diverse Innovative Yard～
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Address</p>
                  <p className="text-zinc-400">
                    B1F Sound Building, 2-14-8 Dogenzaka<br />
                    Shibuya-ku, Tokyo 150-0043
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Phone</p>
                  <p className="text-zinc-400">03-1234-5678</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-zinc-400">info@gachidiy-live.jp</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Office Hours</p>
                  <p className="text-zinc-400">14:00 - 22:00 (Mon-Fri)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-zinc-400 text-sm leading-relaxed">
            <p className="mb-4">
              <strong className="text-white">By Train:</strong><br/>
              5 minutes walk from Shibuya Station (Hachiko Exit). 
              Walk up Dogenzaka street, turn right at the 109 building, 
              and we are located in the basement of the black building next to the convenience store.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-[400px] bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 relative"
        >
           {/* Placeholder for map - in a real app, use Google Maps Embed API */}
           <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
             <div className="text-center">
               <MapPin className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
               <p className="text-zinc-500">Map View Placeholder</p>
               <p className="text-xs text-zinc-600 mt-2">(Google Maps API requires key)</p>
             </div>
           </div>
           {/* Example of how an iframe would look if we had a key or public embed link */}
           {/* <iframe 
             src="https://www.google.com/maps/embed?..." 
             width="100%" 
             height="100%" 
             style={{border:0}} 
             allowFullScreen 
             loading="lazy" 
           /> */}
        </motion.div>
      </div>
    </div>
  );
}
