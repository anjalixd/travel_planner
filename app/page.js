'use client';

import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Compass, CheckSquare, Square, DollarSign, MapPin, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

// Default dynamic configuration object for standard layout presentation
const mockTripData = {
  preferences: { destination: "Kyoto, Japan", startingLocation: "New York, USA", durationDays: 3 },
  itinerary: [
    {
      dayNumber: 1,
      theme: "Ancient Shrines & Bamboo Paths",
      activities: [
        { timeOfDay: "morning", title: "Fushimi Inari Exploration", description: "Hike the early vermilion torii pathways.", estimatedDuration: "2.5h" },
        { timeOfDay: "afternoon", title: "Kiyomizu-dera Temple", description: "Historic wooden stage offering sweeping city views.", estimatedDuration: "2h" }
      ],
      suggestedRestaurants: [{ name: "Kanezaki Sushi", cuisine: "Traditional Japanese", priceRange: "$$" }]
    },
    {
      dayNumber: 2,
      theme: "Arashiyama Operations & Culinary Hidden Gems",
      activities: [
        { timeOfDay: "morning", title: "Arashiyama Bamboo Grove", description: "Walk through towering stalks of bamboo.", estimatedDuration: "2h" }
      ],
      suggestedRestaurants: [{ name: "Otsuka", cuisine: "Wagyu Beef Specialists", priceRange: "$$$" }]
    }
  ],
  budgetBreakdown: { transportation: 650, accommodation: 450, food: 240, localTransport: 60, attractions: 80, totalEstimatedCost: 1480 },
  packingChecklist: [
    { item: "Light walking shoes", category: "Clothing", packed: false },
    { item: "Universal power adapter", category: "Electronics", packed: true }
  ],
  travelTips: { localCustoms: ["Remove shoes on Tatami floors"], currency: "JPY (¥)", emergencyNumbers: ["110 (Police)"] }
};

export default function Home() {
  const [trip, setTrip] = useState(mockTripData);
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    startingLocation: 'New York, USA',
    destination: 'Kyoto, Japan',
    budgetTier: 'medium'
  });

  const handleGenerateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const useLiveApi = process.env.NEXT_PUBLIC_USE_LIVE_API === 'true';

    if (!useLiveApi) {
      setTimeout(() => {
        setTrip({
          ...mockTripData,
          preferences: {
            destination: formData.destination || "Surprise Destination",
            startingLocation: formData.startingLocation,
            durationDays: 3
          }
        });
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to retrieve structured blueprint from LLM gateway.');
      const dynamicData = await response.json();
      setTrip(dynamicData);
    } catch (err) {
      setError(err.message || 'An unexpected execution architecture fault occurred.');
    } finally {
      setLoading(false);
    }
  };

  const togglePackingItem = (idx) => {
    const list = [...trip.packingChecklist];
    list[idx].packed = !list[idx].packed;
    setTrip({ ...trip, packingChecklist: list });
  };

  const budgetData = Object.keys(trip.budgetBreakdown)
    .filter(k => k !== 'totalEstimatedCost')
    .map(k => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: trip.budgetBreakdown[k] }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      
      {/* Control Configuration Input Engine Form */}
      <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><Sparkles className="text-indigo-400 w-5 h-5"/> Configure Engine Environment</h2>
        <form onSubmit={handleGenerateTrip} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">Starting Hub</label>
            <input 
              type="text" 
              value={formData.startingLocation}
              onChange={(e) => setFormData({...formData, startingLocation: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">Target Destination</label>
            <input 
              type="text" 
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">Capital Strategy</label>
            <select 
              value={formData.budgetTier} 
              onChange={(e) => setFormData({...formData, budgetTier: e.target.value})}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="low">Low Cost Budget</option>
              <option value="medium">Medium Tier Balance</option>
              <option value="luxury">Luxury Operations</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 font-medium text-white rounded-xl px-4 py-2 text-sm flex items-center justify-center gap-2 transition-all h-9"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Compile Blueprint'}
          </button>
        </form>
        {error && <div className="mt-3 text-xs text-red-400 font-medium">Fault Trace: {error}</div>}
      </div>

      {/* Main Framework Dashboard Preview Panel */}
      <header className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Expedition to {trip.preferences.destination}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 text-emerald-400"/> {trip.preferences.durationDays} Days Itinerary</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-right">
          <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Est. Cost</div>
          <div className="text-xl font-black text-emerald-400">${trip.budgetBreakdown.totalEstimatedCost}</div>
        </div>
      </header>

      {/* Core Split Execution Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex gap-3 mb-6 items-center text-lg font-bold"><Compass className="text-indigo-400" /> Itinerary Flow</div>
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-3 overflow-x-auto">
            {trip.itinerary.map(d => (
              <button 
                key={d.dayNumber} 
                onClick={() => setActiveDay(d.dayNumber)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeDay === d.dayNumber ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}
              >
                Day {d.dayNumber}
              </button>
            ))}
          </div>
          {trip.itinerary.filter(d => d.dayNumber === activeDay).map(dayPlan => (
            <div key={dayPlan.dayNumber} className="space-y-4">
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-xs text-indigo-300"><strong>Theme:</strong> {dayPlan.theme}</div>
              {dayPlan.activities.map((act, i) => (
                <div key={i} className="pl-4 border-l-2 border-indigo-500/30 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-400" />
                  <div className="flex justify-between text-xs font-bold text-indigo-400 uppercase"><span>{act.timeOfDay}</span><span>{act.estimatedDuration}</span></div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{act.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-sm font-bold flex items-center gap-2 mb-4"><DollarSign className="text-emerald-400 w-4 h-4"/> Budget Dynamics</div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budgetData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value">
                    {budgetData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor:'#0f172a', border:'none', borderRadius:'6px', fontSize:'11px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-sm font-bold flex items-center gap-2 mb-3"><CheckSquare className="text-indigo-400 w-4 h-4"/> Checklists</div>
            <div className="space-y-2">
              {trip.packingChecklist.map((item, idx) => (
                <div key={idx} onClick={() => togglePackingItem(idx)} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg cursor-pointer text-xs">
                  {item.packed ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-500" />}
                  <span className={item.packed ? 'line-through text-slate-500' : 'text-slate-200'}>{item.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
