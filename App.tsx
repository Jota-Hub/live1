/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Schedule from './components/Schedule';
import Equipment from './components/Equipment';
import Access from './components/Access';
import Contact from './components/Contact';
import About from './components/About';
import { Menu, X, Music2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const navItems = [
    { id: 'home', label: 'About' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'access', label: 'Access' },
    { id: 'contact', label: 'Contact' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <About onNavigate={() => setActiveTab('schedule')} />;
      case 'schedule': return <Schedule />;
      case 'equipment': return <Equipment />;
      case 'access': return <Access />;
      case 'contact': return <Contact />;
      default: return <About onNavigate={() => setActiveTab('schedule')} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-sm font-bold text-xl group-hover:bg-emerald-500 transition-colors flex-shrink-0">
              <Music2 size={28} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm tracking-widest uppercase text-zinc-300">LIVE SPACE</span>
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                <span className="font-black text-2xl tracking-tighter uppercase text-white font-chelsea">GACHI D.I.Y.</span>
                <span className="text-[10px] tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                  ～Diverse Innovative Yard～
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  text-sm font-bold uppercase tracking-widest transition-colors relative
                  ${activeTab === item.id ? 'text-emerald-500' : 'text-zinc-400 hover:text-white'}
                `}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute -bottom-8 left-0 right-0 h-1 bg-emerald-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-4 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`
                    text-3xl font-bold uppercase tracking-tighter text-left
                    ${activeTab === item.id ? 'text-emerald-500' : 'text-zinc-500'}
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-20 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            
            {/* Left: Venue Info */}
            <div className="text-center md:text-left w-full md:w-auto">
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 mb-4 justify-center md:justify-start">
                <h4 className="font-bold text-white uppercase tracking-widest text-lg">LIVE SPACE GACHI D.I.Y.</h4>
                <span className="text-[10px] tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                  ～Diverse Innovative Yard～
                </span>
              </div>
              
              <div className="text-zinc-400 text-sm space-y-2 font-mono">
                <p>B1F Sound Building, 2-14-8 Dogenzaka, Shibuya-ku, Tokyo 150-0043</p>
                <p>Office Hours: 14:00 - 22:00 (Mon-Fri)</p>
              </div>
            </div>

            {/* Right: Socials */}
            <div className="flex gap-6 w-full md:w-auto justify-center md:justify-end">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">Facebook</a>
            </div>
          </div>

          {/* Bottom: Copyright */}
          <div className="text-center border-t border-white/5 pt-8">
            <p className="text-zinc-600 text-xs">© 2024 LIVE SPACE GACHI D.I.Y. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

