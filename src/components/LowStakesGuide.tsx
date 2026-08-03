import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calculator,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sparkles,
  Coins,
  CreditCard,
  Layers,
  Award,
  Lock,
} from 'lucide-react';

interface Operator {
  name: string;
  minDeposit: string;
  minBet: string;
  rating: number;
  license: 'UKGC' | 'Crypto' | 'MGA';
  perks: string[];
  tag: string;
  badgeColor: string;
}

const OPERATORS: Operator[] = [
  {
    name: 'Betfred',
    minDeposit: '£5.00',
    minBet: '1p',
    rating: 4.9,
    license: 'UKGC',
    perks: ['£5 Min Deposit', '1p Minimum Spins', 'Fast Debit Card Cashouts'],
    tag: 'Best Overall UKGC Low Stakes',
    badgeColor: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Unibet UK',
    minDeposit: '£5.00',
    minBet: '5p',
    rating: 4.8,
    license: 'UKGC',
    perks: ['£5 Min Deposit', '5p Penny Roulette', 'Live Casino Low Tables'],
    tag: 'Best Low Stakes Live Casino',
    badgeColor: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Stake.com',
    minDeposit: '£1.00 (Crypto)',
    minBet: '0.1p',
    rating: 4.7,
    license: 'Crypto',
    perks: ['Zero Min Deposit', 'Micro Crypto Bets', 'Instant VIP Rakeback'],
    tag: 'Top Micro-Stakes Crypto',
    badgeColor: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Bwin UK',
    minDeposit: '£5.00',
    minBet: '1p',
    rating: 4.6,
    license: 'UKGC',
    perks: ['£5 Min Deposit', 'Micro Slots', 'Daily Prize Drops'],
    tag: 'Great Penny Slots Selection',
    badgeColor: 'from-purple-500 to-pink-600',
  },
];

export default function LowStakesGuide() {
  const [deposit, setDeposit] = useState<number>(10);
  const [spinValue, setSpinValue] = useState<number>(0.1);
  const [filterLicense, setFilterLicense] = useState<'All' | 'UKGC' | 'Crypto'>('All');

  const totalSpins = Math.floor(deposit / spinValue);
  const totalRoundsMinutes = Math.round((totalSpins * 4) / 60);

  const filteredOperators = OPERATORS.filter(
    op => filterLicense === 'All' || op.license === filterLicense
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-gradient-to-br from-[#061826] via-[#092233] to-[#041019] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> 2026 Micro-Stakes Guide
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-none">
            Stretch <span className="bg-gradient-to-r from-cyan via-teal-300 to-emerald-400 bg-clip-text text-transparent">£10 Further</span> with Low Stakes
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Maximize entertainment value with 1p–10p spins, £5 deposit limits, and verified UKGC and Crypto micro-stake operators. No high risk, maximum playtime.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-border-color bg-surface/50 backdrop-blur">
              <div className="text-2xl font-bold text-cyan">1p - 5p</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Min Bet Range</div>
            </div>
            <div className="p-4 rounded-xl border border-border-color bg-surface/50 backdrop-blur">
              <div className="text-2xl font-bold text-emerald-400">£5.00</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Min UK Deposit</div>
            </div>
            <div className="p-4 rounded-xl border border-border-color bg-surface/50 backdrop-blur">
              <div className="text-2xl font-bold text-amber-400">100+</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Penny Games</div>
            </div>
            <div className="p-4 rounded-xl border border-border-color bg-surface/50 backdrop-blur">
              <div className="text-2xl font-bold text-purple-400">100%</div>
              <div className="text-xs text-slate-400 font-mono mt-1">UKGC Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Budget Calculator */}
      <section className="rounded-2xl border border-border-color bg-[#071927] p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-border-color pb-4">
          <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Playtime & Spin Calculator</h2>
            <p className="text-sm text-slate-400">Calculate how long your bankroll will last at micro-stakes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300">Bankroll / Deposit Amount</span>
                <span className="text-cyan font-mono font-bold">£{deposit.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={deposit}
                onChange={e => setDeposit(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                <span>£5</span>
                <span>£25</span>
                <span>£50</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300">Stake Per Spin / Bet</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {spinValue < 0.1 ? `${Math.round(spinValue * 100)}p` : `£${spinValue.toFixed(2)}`}
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.50"
                step="0.01"
                value={spinValue}
                onChange={e => setSpinValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                <span>1p (Penny)</span>
                <span>10p</span>
                <span>50p</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl bg-[#041019] border border-cyan/20 p-6 space-y-4 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Estimated Entertainment Duration</div>
            <div className="text-4xl font-extrabold text-cyan font-mono">
              {totalSpins.toLocaleString()} <span className="text-xl font-normal text-slate-300">spins</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
              <Zap className="w-4 h-4" /> ~{totalRoundsMinutes} Minutes of gameplay (at 4s / spin)
            </div>
            <p className="text-xs text-slate-400">
              Low stakes extend your session time by up to <strong className="text-slate-200">10x</strong> compared to standard 50p/£1 minimum bets.
            </p>
          </div>
        </div>
      </section>

      {/* Operator Comparison Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" /> Recommended Micro-Stake Operators
            </h2>
            <p className="text-sm text-slate-400">Verified sites supporting £5 minimum deposits and micro bets</p>
          </div>

          <div className="flex gap-2">
            {(['All', 'UKGC', 'Crypto'] as const).map(license => (
              <button
                key={license}
                onClick={() => setFilterLicense(license)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterLicense === license
                    ? 'bg-cyan text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {license}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOperators.map(op => (
            <motion.div
              key={op.name}
              whileHover={{ y: -4 }}
              className="flex flex-col justify-between rounded-2xl border border-border-color bg-[#071927] p-6 space-y-4 hover:border-cyan/40 transition-all shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-800 text-cyan border border-cyan/20">
                    {op.tag}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                    ★ {op.rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-slate-100">{op.name}</h3>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                    {op.license}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#041019] border border-border-color">
                    <div className="text-xs text-slate-400 font-mono">Min Deposit</div>
                    <div className="text-base font-bold text-emerald-400">{op.minDeposit}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#041019] border border-border-color">
                    <div className="text-xs text-slate-400 font-mono">Min Bet / Spin</div>
                    <div className="text-base font-bold text-cyan">{op.minBet}</div>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {op.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Low Stakes Strategy Tips */}
      <section className="rounded-2xl border border-cyan/20 bg-gradient-to-r from-[#061826] to-[#0a2336] p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan" /> Top 4 Micro-Stakes Rules for 2026
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#041019] border border-border-color space-y-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-sm text-slate-200">1p Penny Slots</h4>
            <p className="text-xs text-slate-400">
              Look for games like Book of Dead or Rainbow Riches set to 1 line for true 1p spins.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#041019] border border-border-color space-y-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-sm text-slate-200">Use £5 Min Deposits</h4>
            <p className="text-xs text-slate-400">
              Avoid £10/£20 deposit minimums by sticking with debit cards at Betfred or Unibet.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#041019] border border-border-color space-y-2">
            <Lock className="w-5 h-5 text-cyan" />
            <h4 className="font-bold text-sm text-slate-200">Check UKGC Licensing</h4>
            <p className="text-xs text-slate-400">
              UKGC license guarantees GAMSTOP protection, deposit limits, and audited game payout RTP.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#041019] border border-border-color space-y-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-sm text-slate-200">Set Hard Limits</h4>
            <p className="text-xs text-slate-400">
              Treat deposits as pure entertainment spend. Set daily or monthly deposit limits in account settings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
