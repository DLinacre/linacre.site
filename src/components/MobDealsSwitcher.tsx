import { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Check, Zap, ShieldCheck } from 'lucide-react';

interface SIMPlan {
  network: string;
  dataGb: number;
  monthlyCost: number;
  contractMonths: number;
  networkType: '5G' | '4G';
  perks: string[];
  recommended?: boolean;
}

const SIM_PLANS: SIMPlan[] = [
  {
    network: 'Smarty',
    dataGb: 60,
    monthlyCost: 10,
    contractMonths: 1,
    networkType: '5G',
    perks: ['No contract (30 days)', 'EU Roaming included', 'Powered by Three 5G'],
    recommended: true,
  },
  {
    network: 'voxi',
    dataGb: 75,
    monthlyCost: 12,
    contractMonths: 1,
    networkType: '5G',
    perks: ['Endless Social Media & Video', 'Unlimited Texts & Calls', 'Powered by Vodafone'],
    recommended: true,
  },
  {
    network: 'giffgaff',
    dataGb: 25,
    monthlyCost: 10,
    contractMonths: 1,
    networkType: '5G',
    perks: ['Flexible monthly plans', 'Free giffgaff to giffgaff calls', 'Powered by O2'],
  },
  {
    network: 'Lebara',
    dataGb: 20,
    monthlyCost: 7,
    contractMonths: 1,
    networkType: '5G',
    perks: ['100 International mins included', 'No credit check', 'Powered by Vodafone'],
  },
  {
    network: 'ID Mobile',
    dataGb: 100,
    monthlyCost: 10,
    contractMonths: 12,
    networkType: '5G',
    perks: ['Data Rollover to next month', 'EU Roaming up to 30GB', 'Powered by Three'],
  },
];

export default function MobDealsSwitcher() {
  const [maxBudget, setMaxBudget] = useState<number>(15);
  const [minData, setMinData] = useState<number>(30);

  const filteredPlans = SIM_PLANS.filter(
    plan => plan.monthlyCost <= maxBudget && plan.dataGb >= minData
  );

  const pacSteps = [
    {
      step: 1,
      title: 'Text "PAC" to 65075',
      desc: 'Send a free SMS with the word PAC to 65075 from your current phone. Your provider will reply within 60 seconds with your 9-digit PAC code and any early termination fee info.',
    },
    {
      step: 2,
      title: 'Order your new SIM plan',
      desc: 'Select your preferred SIM-only deal and place your order online. Your new SIM card will arrive within 1-2 working days.',
    },
    {
      step: 3,
      title: 'Submit PAC code to new provider',
      desc: 'Log in to your new network account portal or submit the 9-digit PAC code online. Number switching completes within 24 hours automatically.',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-gradient-to-br from-[#061826] via-[#092233] to-[#041019] p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-xs font-mono font-semibold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" /> UK Mobile Savings Calculator
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Compare UK SIM-Only Deals & Keep Your Number
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Filter 5G UK SIM-only contracts by monthly budget and data allowance. Follow our 3-step PAC code guide to switch networks seamlessly without losing your number.
          </p>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="rounded-2xl border border-border-color bg-[#071927] p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border-color pb-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan" /> Interactive SIM Filter
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredPlans.length} plans match your criteria
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-300">Max Monthly Budget</span>
              <span className="text-cyan font-mono font-bold">£{maxBudget}/mo</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
              <span>£5/mo</span>
              <span>£15/mo</span>
              <span>£25/mo</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-300">Minimum Monthly Data</span>
              <span className="text-emerald-400 font-mono font-bold">{minData} GB</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={minData}
              onChange={e => setMinData(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
              <span>10 GB</span>
              <span>50 GB</span>
              <span>100 GB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Results Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map(plan => (
          <motion.div
            key={plan.network}
            whileHover={{ y: -4 }}
            className={`flex flex-col justify-between rounded-2xl border p-6 space-y-4 shadow-lg transition-all ${
              plan.recommended
                ? 'border-cyan/50 bg-[#061e30]'
                : 'border-border-color bg-[#071927]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-100">{plan.network}</span>
                {plan.recommended && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan/20 text-cyan border border-cyan/40">
                    Recommended
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-cyan font-mono">
                  £{plan.monthlyCost}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ month</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2">
                <div className="p-2 rounded bg-[#041019] border border-border-color">
                  <span className="text-slate-400">Data:</span>{' '}
                  <strong className="text-emerald-400">{plan.dataGb} GB</strong>
                </div>
                <div className="p-2 rounded bg-[#041019] border border-border-color">
                  <span className="text-slate-400">Term:</span>{' '}
                  <strong className="text-slate-200">
                    {plan.contractMonths === 1 ? '30 Days' : `${plan.contractMonths} mo`}
                  </strong>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300">
                {plan.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </section>

      {/* PAC Code Switching Guide */}
      <section className="rounded-2xl border border-cyan/20 bg-gradient-to-r from-[#061826] to-[#0a2336] p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Keep Your Mobile Number (PAC Guide)</h2>
            <p className="text-sm text-slate-400">UK Ofcom standard process for 100% free number transfers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pacSteps.map(s => (
            <div key={s.step} className="p-5 rounded-xl bg-[#041019] border border-border-color space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-sm font-bold font-mono">
                  {s.step}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-100">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
