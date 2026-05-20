import { useState } from 'react';
import { motion } from 'motion/react';
import { Shirt, BarChart3, Sparkles, ShoppingBag, Sun, Cloud, CloudRain, Thermometer } from 'lucide-react';
import { OUTFITS, Outfit } from '../constants';

export default function Dashboard() {
  const [temperature] = useState(24); // Mock temperature
  const [weatherCondition] = useState<'sunny' | 'cloudy' | 'rainy'>('sunny');

  // Recommendation logic: Find 3 outfits for different occasions that fit the temperature
  const recommendations = OUTFITS.filter(outfit => {
    const min = outfit.minTemp ?? -100;
    const max = outfit.maxTemp ?? 100;
    return temperature >= min && temperature <= max;
  }).slice(0, 3);

  const WeatherIcon = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
  }[weatherCondition];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 pt-24 pb-32 flex flex-col gap-10">
      {/* Weather Header Section */}
      <section className="w-full flex justify-between items-center bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner">
            <WeatherIcon size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Seoul, Current</p>
            <h2 className="text-2xl font-serif">{temperature}°C <span className="text-sm font-sans font-normal opacity-60 ml-1">{weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1)}</span></h2>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Forecast</p>
          <div className="flex gap-4 mt-1">
            <span className="text-sm opacity-40 italic font-serif">H: 28°</span>
            <span className="text-sm opacity-40 italic font-serif">L: 18°</span>
          </div>
        </div>
      </section>

      {/* Main Curation Section */}
      <section className="w-full">
        <div className="flex justify-between items-end mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary"></div>
            <div>
              <span className="text-[10px] text-on-surface-variant font-bold tracking-[0.2em] uppercase">Weather Curation</span>
              <h1 className="text-2xl md:text-3xl font-serif mt-0.5">Recommended for Today</h1>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row overflow-x-auto no-scrollbar md:grid md:grid-cols-3 gap-6 pb-4">
          {recommendations.map((outfit, idx) => (
            <motion.div 
              key={outfit.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-[280px] md:w-auto group relative"
            >
              <div className="relative aspect-[4/6] rounded-2xl overflow-hidden shadow-md border border-outline-variant/20">
                <img 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  src={outfit.image} 
                  alt={outfit.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/30">
                      {outfit.occasion}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-[9px] font-bold tracking-tight">{outfit.matchPercentage}% Match</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl text-white font-serif mb-1 leading-tight">{outfit.name}</h3>
                  <p className="text-white/60 text-[9px] leading-relaxed mb-6 font-sans tracking-wide line-clamp-2">
                    {outfit.notes}
                  </p>
                  
                  <button className="w-full py-3.5 bg-white text-black text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-xl active:scale-95">
                    Explore Details
                  </button>
                </div>
              </div>
              <div className="mt-4 px-2">
                <div className="flex gap-2">
                  {outfit.tags.map(tag => (
                    <span key={tag} className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">#{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Action Grid (Condensed for mobile-first) */}
      <section className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shirt, label: 'Wardrobe' },
            { icon: BarChart3, label: 'Analysis' },
            { icon: Sparkles, label: 'Suggestions' },
            { icon: ShoppingBag, label: 'Shopping Helper' },
          ].map((action) => (
            <motion.div 
              key={action.label}
              whileTap={{ scale: 0.98 }}
              className="bg-surface-container-lowest border border-outline-variant/30 p-6 py-8 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer group hover:bg-secondary-container transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-white transition-colors">
                <action.icon size={20} className="text-primary" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-center opacity-60 group-hover:opacity-100">{action.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Style Stats */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-secondary-container p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
          <div className="flex-1 z-10">
            <h3 className="text-2xl font-serif italic mb-2">Confidence Score</h3>
            <p className="text-[11px] text-on-secondary-container/70 mb-6 leading-relaxed uppercase tracking-wider font-bold">
              Based on your {temperature}°C daily forecast
            </p>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-inner">
                <span className="font-serif text-2xl">94</span>
              </div>
              <button className="text-[10px] font-bold underline underline-offset-4 uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">View Insights</button>
            </div>
          </div>
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full md:w-1/2 h-[180px] rounded-xl overflow-hidden shadow-sm"
          >
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5jTM3v6yz6hZgABuy6_scLu1jzmS3pmnOVYLxMBFGOiq0Ds0SCrvpDroLPc4pTfmkfT3IU_TyMGaaw6PWc460IKfPe4mFW6uU6N_5pNi7stKdvR915rcWfDbOhuwpe5ChCV9ARG9NSwwIB5Mkt5m5e7oPQu3WKDUTayvcV8CyHZju4HwJKeOpL9XRLfZMhVUb4yEyKY0s13YZvVDaMCqHVSxqvfEGQTJIYP2tjq-pfW-NXrVRedf41pkhXB7LXV_uXMs1fUQMwFc" 
              alt="Style match"
            />
          </motion.div>
        </div>

        <div className="bg-surface-container-high p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif mb-1">Trending</h3>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-6">Quiet Luxury</p>
          </div>
          <div className="aspect-square bg-white rounded-xl overflow-hidden relative border border-outline-variant p-4">
            <img 
              className="w-full h-full object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKOOhrpxGJAAZqoM-FpI_-JfGUk_1UXLR2wtv0hpB3Tqw9xyaeMDBaYNrDoeASbhhuJr6wsIF_wKCJo8gZu8MbBeAwnyI4nm08dDtfM5wcOjyN8_UvT8do3t1s1fBdy986V8jWXMFQmPhmxe8dyvUk-KeU8v6Gtp29peY5-9v2kYi6FhAmdzd80Crvr0itK3fKF8-huPFPSpKAzUI6GpYVst7RsiawUc5DqSW1RXF6OxZTJPzUsUmFSNfq_4jQd2kZnP3XBgN3I9U" 
              alt="Trending"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

