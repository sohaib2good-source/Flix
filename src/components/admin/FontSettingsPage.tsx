import { motion } from 'motion/react';
import { Type, Check } from 'lucide-react';
import { useState } from 'react';

const FONTS = [
  { name: 'Inter', value: "'Inter', sans-serif", category: 'Sans-Serif', description: 'Clean, modern — the default choice for UI' },
  { name: 'Roboto', value: "'Roboto', sans-serif", category: 'Sans-Serif', description: 'Versatile and highly readable at all sizes' },
  { name: 'Playfair Display', value: "'Playfair Display', serif", category: 'Serif', description: 'Elegant and editorial — great for headings' },
  { name: 'Monospace', value: "monospace", category: 'Monospace', description: 'Technical and precise — fixed-width characters' },
];

export default function FontSettingsPage() {
  const [currentFont, setCurrentFont] = useState(
    localStorage.getItem('admin_font_preference') || "'Inter', sans-serif"
  );

  const handleFontChange = (fontFamily: string) => {
    document.documentElement.style.setProperty('--font-sans', fontFamily);
    localStorage.setItem('admin_font_preference', fontFamily);
    setCurrentFont(fontFamily);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center">
            <Type className="w-6 h-6 text-navy" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-navy tracking-tight uppercase">Interface Font</h1>
            <p className="text-muted-foreground font-medium">Choose a global typeface for the entire application.</p>
          </div>
        </div>
      </div>

      {/* Font Grid */}
      <div className="space-y-4">
        {FONTS.map((font, i) => {
          const isActive = currentFont === font.value;
          return (
            <motion.button
              key={font.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleFontChange(font.value)}
              className={`w-full text-left p-8 rounded-[2rem] border-2 transition-all group ${
                isActive
                  ? 'border-navy bg-navy/[0.03] shadow-xl shadow-navy/10'
                  : 'border-gray-100 bg-white hover:border-navy/20 hover:shadow-lg shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{font.category}</span>
                  <h3 className="text-2xl font-black text-navy mt-1" style={{ fontFamily: font.value }}>
                    {font.name}
                  </h3>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'bg-navy text-white scale-110' : 'bg-gray-100 text-transparent group-hover:bg-gray-200'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">{font.description}</p>
              <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-50" style={{ fontFamily: font.value }}>
                <p className="text-navy font-medium text-lg mb-1">The quick brown fox jumps over the lazy dog.</p>
                <p className="text-gray-400 text-sm">ABCDEFGHIJKLMNOPQRSTUVWXYZ · abcdefghijklmnopqrstuvwxyz · 0123456789</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Current Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-navy/[0.03] rounded-2xl border border-navy/10 text-center"
      >
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Currently Active</p>
        <p className="text-navy font-black text-lg" style={{ fontFamily: currentFont }}>
          {FONTS.find(f => f.value === currentFont)?.name || 'Inter'}
        </p>
      </motion.div>
    </div>
  );
}
