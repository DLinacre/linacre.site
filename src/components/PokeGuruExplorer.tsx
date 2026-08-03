import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Search } from 'lucide-react';

interface TcgSet {
  name: string;
  series: string;
  releaseYear: number;
  totalCards: number;
  featuredCard: string;
  avgValueGbp: string;
  badge: string;
}

const TCG_SETS: TcgSet[] = [
  {
    name: 'Paldean Fates',
    series: 'Scarlet & Violet',
    releaseYear: 2024,
    totalCards: 245,
    featuredCard: 'Shiny Charizard ex',
    avgValueGbp: '£120.00',
    badge: 'Popular Shiny Vault',
  },
  {
    name: '151 (Scarlet & Violet)',
    series: 'Scarlet & Violet',
    releaseYear: 2023,
    totalCards: 207,
    featuredCard: 'Charizard ex SIR',
    avgValueGbp: '£115.00',
    badge: 'Classic Kanto Roster',
  },
  {
    name: 'Crown Zenith',
    series: 'Sword & Shield',
    releaseYear: 2023,
    totalCards: 230,
    featuredCard: 'Giratina VSTAR GG',
    avgValueGbp: '£95.00',
    badge: 'Galarian Gallery Masterpiece',
  },
  {
    name: 'Evolving Skies',
    series: 'Sword & Shield',
    releaseYear: 2021,
    totalCards: 237,
    featuredCard: 'Umbreon VMAX Alt Art',
    avgValueGbp: '£650.00',
    badge: 'High Value Alt-Art Holy Grail',
  },
];

export default function PokeGuruExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');

  const filteredSets = TCG_SETS.filter(set => {
    const matchesSearch =
      set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.featuredCard.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeries = selectedSeries === 'All' || set.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#120826] via-[#1a0c36] to-[#080314] p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> UK Pokémon Card Index
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Browse 126+ UK Pokémon TCG Sets & Market Values
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Search recent expansion releases, track chase card market values in GBP (£), and evaluate card rarity tier lists with UK collector data.
          </p>
        </div>
      </section>

      {/* Search & Series Filters */}
      <section className="rounded-2xl border border-border-color bg-[#071927] p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search set name or featured card..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#041019] border border-border-color text-slate-100 text-sm focus:outline-none focus:border-cyan/50"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {(['All', 'Scarlet & Violet', 'Sword & Shield'] as const).map(series => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedSeries === series
                    ? 'bg-purple-500 text-white font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {series}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sets Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSets.map(set => (
          <motion.div
            key={set.name}
            whileHover={{ y: -4 }}
            className="flex flex-col justify-between rounded-2xl border border-border-color bg-[#071927] p-6 space-y-4 hover:border-purple-500/40 transition-all shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {set.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">{set.releaseYear}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-slate-100">{set.name}</h3>
                <span className="text-xs font-mono text-slate-400">{set.series}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#041019] border border-border-color">
                  <div className="text-xs text-slate-400 font-mono">Chase Card</div>
                  <div className="text-sm font-bold text-cyan truncate">{set.featuredCard}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#041019] border border-border-color">
                  <div className="text-xs text-slate-400 font-mono">Est. Market Value</div>
                  <div className="text-sm font-bold text-emerald-400">{set.avgValueGbp}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
