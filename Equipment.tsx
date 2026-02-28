import { motion } from 'motion/react';
import { Mic2, Speaker, Music, Settings } from 'lucide-react';

export default function Equipment() {
  const equipment = [
    {
      category: "PA System",
      icon: <Speaker className="w-6 h-6 text-emerald-500" />,
      items: [
        "Main Console: Yamaha CL5",
        "Main Speakers: L-Acoustics KARA (x6 per side)",
        "Subwoofers: L-Acoustics SB18 (x4)",
        "Monitor Console: Yamaha QL1",
        "Wedges: d&b audiotechnik M4 (x8)"
      ]
    },
    {
      category: "Microphones",
      icon: <Mic2 className="w-6 h-6 text-emerald-500" />,
      items: [
        "Shure SM58 (x10)",
        "Shure SM57 (x8)",
        "Sennheiser MD421 (x4)",
        "AKG C414 (x2)",
        "Shure Beta 52A (x2)"
      ]
    },
    {
      category: "Backline",
      icon: <Music className="w-6 h-6 text-emerald-500" />,
      items: [
        "Guitar Amp: Marshall JCM900 + 1960A",
        "Guitar Amp: Roland JC-120",
        "Bass Amp: Ampeg SVT-3PRO + 810E",
        "Drums: Pearl Masters Maple Complete (22, 16, 13, 12)",
        "DJ: Pioneer CDJ-2000NXS2 (x2) + DJM-900NXS2"
      ]
    },
    {
      category: "Lighting",
      icon: <Settings className="w-6 h-6 text-emerald-500" />,
      items: [
        "Console: Avolites Tiger Touch II",
        "Moving Heads: Martin MAC Aura (x8)",
        "Spots: Clay Paky Mythos (x4)",
        "Strobes: Atomic 3000 (x2)",
        "Haze: Hazebase Base Hazer Pro"
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold tracking-tighter text-white uppercase mb-12 glitch-text">
        Equipment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {equipment.map((section, idx) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-lg hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
              {section.icon}
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                {section.category}
              </h3>
            </div>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="text-zinc-400 font-mono text-sm flex items-start gap-2">
                  <span className="text-emerald-500/50 mt-1">▹</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
