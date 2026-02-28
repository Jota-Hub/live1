import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setStatus('sent');
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold tracking-tighter text-white uppercase mb-8 glitch-text text-center">
        Contact Us
      </h2>
      <p className="text-zinc-400 text-center mb-12">
        For booking inquiries, lost & found, or general questions, please use the form below.
      </p>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6 bg-zinc-900/50 p-8 rounded-lg border border-zinc-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:border-emerald-500 outline-none transition-colors"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:border-emerald-500 outline-none transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Subject</label>
          <select className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:border-emerald-500 outline-none transition-colors">
            <option>Booking Inquiry</option>
            <option>Ticket Information</option>
            <option>Lost & Found</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
          <textarea 
            required
            rows={6}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:border-emerald-500 outline-none transition-colors"
            placeholder="How can we help?"
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={status !== 'idle'}
          className={`
            w-full py-4 rounded-md font-bold uppercase tracking-widest transition-all
            flex items-center justify-center gap-2
            ${status === 'sent' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-white text-black hover:bg-zinc-200'}
          `}
        >
          {status === 'idle' && <>Send Message <Send size={18} /></>}
          {status === 'sending' && 'Sending...'}
          {status === 'sent' && 'Message Sent!'}
        </button>
      </motion.form>
    </div>
  );
}
