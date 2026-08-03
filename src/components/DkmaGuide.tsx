import { useState } from 'react';
import { BatteryCharging, CheckCircle2, ChevronRight } from 'lucide-react';

interface OemConfig {
  oem: string;
  severity: 'Severe' | 'Medium' | 'Mild';
  badgeness: string;
  steps: string[];
}

const OEM_DATA: OemConfig[] = [
  {
    oem: 'Samsung Galaxy (One UI)',
    severity: 'Severe',
    badgeness: 'Aggressive Background Killing',
    steps: [
      'Open Settings > Apps > [Your App] > Battery > Select "Unrestricted".',
      'Go to Device Care > Battery > Background usage limits > Turn off "Put unused apps to sleep".',
      'Add your app to "Never sleeping apps".',
    ],
  },
  {
    oem: 'Xiaomi / Poco / Redmi (MIUI / HyperOS)',
    severity: 'Severe',
    badgeness: 'Extreme RAM Cleansing',
    steps: [
      'Long press app icon > App Info > Autostart > Enable.',
      'In App Info > Battery Saver > Select "No restrictions".',
      'In Task Switcher / Recent Apps > Long press app > Tap Lock icon to pin in memory.',
    ],
  },
  {
    oem: 'OnePlus / Oppo / Realme (ColorOS / OxygenOS)',
    severity: 'Medium',
    badgeness: 'Aggressive Battery Optimization',
    steps: [
      'Go to Settings > Battery > Advanced settings > Optimize battery use > Select app > "Don\'t optimize".',
      'Enable "Allow background activity" in App info > Battery.',
    ],
  },
  {
    oem: 'Google Pixel (Stock Android)',
    severity: 'Mild',
    badgeness: 'Standard Adaptive Battery',
    steps: [
      'Go to Settings > Apps > See all apps > Select app > App battery usage > Change to "Unrestricted".',
      'Adaptive Battery works cleanly without aggressive background kills.',
    ],
  },
];

export default function DkmaGuide() {
  const [selectedOem, setSelectedOem] = useState<string>('Samsung Galaxy (One UI)');

  const currentConfig = OEM_DATA.find(item => item.oem === selectedOem) || OEM_DATA[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#261506] via-[#361f09] to-[#140a02] p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <BatteryCharging className="w-3.5 h-3.5 text-amber-400" /> Keep Android Background Apps Alive
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Don't Kill My App (DKMA) OEM Fix Guide
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Prevent OEM custom Android ROMs (Samsung, Xiaomi, Poco, OnePlus) from silently killing notifications, background sync, and alarms.
          </p>
        </div>
      </section>

      {/* OEM Selector */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">Select OEM Manufacturer</h3>
          <div className="space-y-2">
            {OEM_DATA.map(item => (
              <button
                key={item.oem}
                onClick={() => setSelectedOem(item.oem)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                  selectedOem === item.oem
                    ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold shadow'
                    : 'border-border-color bg-[#071927] text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{item.oem}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Steps View */}
        <div className="md:col-span-2 rounded-2xl border border-border-color bg-[#071927] p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border-color pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{currentConfig.oem}</h2>
              <p className="text-xs text-amber-400 font-mono mt-1">{currentConfig.badgeness}</p>
            </div>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
              currentConfig.severity === 'Severe'
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : currentConfig.severity === 'Medium'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {currentConfig.severity} Optimization
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">Required Steps to Fix App Kills:</h4>
            <div className="space-y-3">
              {currentConfig.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#041019] border border-border-color">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
