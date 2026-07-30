import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ShieldCheck,
  HardDrive,
  Cpu,
  Terminal,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export default function StatusPage() {
  const [latencyMap, setLatencyMap] = useState({
    cdn: 12,
    api: 34,
    db: 1,
    ai: 245,
  });

  const [systemLoad, setSystemLoad] = useState({
    cpu: 8.5,
    mem: 41.2,
    disk: 18.7,
  });

  const [logs, setLogs] = useState<string[]>([
    '[12:49:01] SYS: Daemon initialising check...',
    '[12:49:02] NET: Edge latency resolver matching local CDN...',
    '[12:49:03] DB: Local cache indices valid. Syncing state...',
    '[12:49:03] SYS: ALL SYSTEMS OPERATIONAL.',
  ]);

  // Periodically fluctuate values to simulate live server tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyMap(prev => ({
        cdn: Math.max(8, prev.cdn + Math.floor(Math.random() * 5) - 2),
        api: Math.max(28, prev.api + Math.floor(Math.random() * 9) - 4),
        db: Math.max(1, prev.db + (Math.random() > 0.85 ? 1 : 0) - (Math.random() > 0.85 ? 1 : 0)),
        ai: Math.max(180, prev.ai + Math.floor(Math.random() * 41) - 20),
      }));

      setSystemLoad(prev => ({
        cpu: Math.max(2, Math.min(99, prev.cpu + Number((Math.random() * 3 - 1.5).toFixed(1)))),
        mem: Math.max(30, Math.min(95, prev.mem + Number((Math.random() * 0.8 - 0.4).toFixed(1)))),
        disk: prev.disk,
      }));

      // Append logs occasionally
      if (Math.random() > 0.8) {
        const services = ['SYS', 'NET', 'DB', 'AI', 'SEC'];
        const msgs = [
          'Health check passed successfully.',
          'Pruning stale transient sessions.',
          'Ping response received from host.',
          'Central secrets key synchronized.',
          'Rate limiting token bucket flushed.',
        ];
        const randomService = services[Math.floor(Math.random() * services.length)];
        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
        const timestamp = new Date().toTimeString().split(' ')[0];

        setLogs(prev => {
          const newLogs = [...prev, `[${timestamp}] ${randomService}: ${randomMsg}`];
          return newLogs.slice(-6); // keep last 6 logs
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 110, damping: 14 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 animate-fade-in"
    >
      {/* Title Hero — clearly labelled as demo (audit UX-02, 11 Jul 2026) */}
      <motion.section
        variants={itemVariants}
        className="text-center md:text-left space-y-4 max-w-3xl"
        id="status-hero"
      >
        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
          <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/40 px-2.5 py-1 rounded-full">
            Demo &middot; Simulated data
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/80 uppercase tracking-widest">
            Not a real status page
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
          Systems <span className="text-emerald-color">Status</span>{' '}
          <span className="text-amber-color">(Demo)</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          This is a client-side UI demo of a status console. Latency, uptime, logs and load values
          below are generated in your browser to showcase interface patterns &mdash; they do not
          reflect real infrastructure. For genuine linacre.site availability,{' '}
          <a href="mailto:david@linacre.site" className="text-amber-color hover:underline">
            email david@linacre.site
          </a>
          .
        </p>
      </motion.section>

      {/* Simulation Disclosure Banner */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 p-4 rounded-xl border border-amber-color/30 bg-[#061923] text-amber-color font-mono text-xs shadow-md"
        id="simulated-data-disclosure"
      >
        <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-color" />
        <div className="space-y-0.5">
          <div className="font-bold uppercase tracking-wider">Simulated Console Feed</div>
          <p className="text-muted-foreground text-[10px] leading-relaxed">
            All telemetry metrics, server ping logs, and response latency values rendered below are
            local mock simulations designed to demonstrate console interfaces. No real-world server
            infrastructure is monitored.
          </p>
        </div>
      </motion.div>

      {/* Global Status Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-emerald-950/15 border border-emerald-500/35 rounded-xl p-5 flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
        id="global-status-banner"
      >
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-color animate-ping" />
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-color absolute" />
          <div>
            <h2 className="font-mono text-sm font-bold text-foreground uppercase">
              Simulated Engine State: Running
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground/80 mt-0.5">
              Mock Uptime: 99.98% · SSL verified · Simulated Latency Metrics
            </p>
          </div>
        </div>
        <span className="font-mono text-xs text-emerald-color font-bold tracking-wider hidden sm:inline-block">
          MOCK_SANDBOX: ACTIVE
        </span>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="status-metrics-grid">
        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color rounded-xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              Vercel CDN Edge
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-color" />
          </div>
          <div className="font-mono text-lg font-bold text-foreground">{latencyMap.cdn}ms</div>
          <div className="font-mono text-[9px] text-emerald-color flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-color" />
            <span>Optimal latency</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color rounded-xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              Express Server
            </span>
            <Activity className="w-4 h-4 text-emerald-color" />
          </div>
          <div className="font-mono text-lg font-bold text-foreground">{latencyMap.api}ms</div>
          <div className="font-mono text-[9px] text-emerald-color flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-color" />
            <span>Nominal responder</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color rounded-xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              Local DB Sandbox
            </span>
            <HardDrive className="w-4 h-4 text-emerald-color" />
          </div>
          <div className="font-mono text-lg font-bold text-foreground">{latencyMap.db}ms</div>
          <div className="font-mono text-[9px] text-emerald-color flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-color" />
            <span>Fast SQLite reads</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted/10 border border-border-color rounded-xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              AI Node Ping
            </span>
            <Cpu className="w-4 h-4 text-emerald-color" />
          </div>
          <div className="font-mono text-lg font-bold text-foreground">{latencyMap.ai}ms</div>
          <div className="font-mono text-[9px] text-emerald-color flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-color" />
            <span>Gemini API online</span>
          </div>
        </motion.div>
      </div>

      {/* Grid: Console Logs & Load Meters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Terminal logs */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-8 bg-[#030c14] border border-border-color rounded-xl p-5 space-y-4 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border-color/30 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-color" />
              <span className="font-mono text-xs font-bold text-foreground uppercase">
                Console Log Output
              </span>
            </div>
            <RefreshCw
              className="w-3.5 h-3.5 text-muted-foreground/60 animate-spin"
              style={{ animationDuration: '4s' }}
            />
          </div>
          <div className="font-mono text-[11px] space-y-2.5 h-[160px] text-muted-foreground overflow-hidden">
            {logs.map((log, index) => {
              const isGreen = log.includes('ALL SYSTEMS') || log.includes('OPERATIONAL');
              return (
                <div key={index} className={isGreen ? 'text-emerald-color font-semibold' : ''}>
                  {log}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* System load stats */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-4 bg-muted/10 border border-border-color rounded-xl p-5 space-y-5"
        >
          <h2 className="font-mono text-xs font-bold text-foreground uppercase border-b border-border-color/25 pb-3">
            Resource Monitors
          </h2>

          <div className="space-y-4 text-muted-foreground font-mono text-[11px]">
            {/* CPU */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span>CPU Load</span>
                <span>{systemLoad.cpu}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 border border-border-color/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-color"
                  style={{ width: `${systemLoad.cpu}%`, transition: 'width 0.5s ease-out' }}
                />
              </div>
            </div>

            {/* Memory */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Memory usage</span>
                <span>{systemLoad.mem}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 border border-border-color/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-color"
                  style={{ width: `${systemLoad.mem}%`, transition: 'width 0.5s ease-out' }}
                />
              </div>
            </div>

            {/* Disk space */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Local directory disk</span>
                <span>{systemLoad.disk}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 border border-border-color/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-color" style={{ width: `${systemLoad.disk}%` }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
