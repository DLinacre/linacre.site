import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Activity,
  Compass,
  Eye,
  Globe,
  Moon,
  Orbit,
  RefreshCw,
  Rocket,
  Satellite,
  Sparkles,
  Sun,
} from 'lucide-react';
import { WORLD_LAND_PATH } from '../data/worldLand';
import {
  HOME,
  formatCountdown,
  haversineKm,
  isDaylight,
  moonPhase,
  nightPath,
  project,
  projectOrthographic,
  quakeColour,
  splitTrack,
  stargazingScore,
  subsolarPoint,
  weatherLabel,
} from '../lib/orbit';

interface IssTelemetry {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  footprint: number;
  timestamp: number;
}

interface QuakeFeature {
  id: string;
  mag: number;
  place: string;
  time: number;
  lon: number;
  lat: number;
  depthKm: number;
  url: string;
}

interface LaunchItem {
  id: string;
  name: string;
  net: string;
  statusName: string;
  statusAbbrev: string;
}

interface HomeWeather {
  temperatureC: number;
  cloudCover: number;
  windKmh: number;
  weatherCode: number;
  isDay: boolean;
}

const FALLBACK_ISS: IssTelemetry = {
  latitude: 51.64,
  longitude: -0.92,
  altitude: 418.4,
  velocity: 27582,
  visibility: 'daylight',
  footprint: 4512,
  timestamp: Math.floor(Date.now() / 1000),
};

const FALLBACK_QUAKES: QuakeFeature[] = [
  {
    id: 'fallback-1',
    mag: 5.4,
    place: '112 km SE of Kuril’sk, Kuril Islands',
    time: Date.now() - 1000 * 60 * 75,
    lon: 148.9,
    lat: 44.5,
    depthKm: 42.1,
    url: 'https://earthquake.usgs.gov/earthquakes/map/',
  },
  {
    id: 'fallback-2',
    mag: 4.9,
    place: 'Mid-Atlantic Ridge',
    time: Date.now() - 1000 * 60 * 190,
    lon: -43.2,
    lat: 16.8,
    depthKm: 10.0,
    url: 'https://earthquake.usgs.gov/earthquakes/map/',
  },
  {
    id: 'fallback-3',
    mag: 4.7,
    place: '88 km WSW of Coquimbo, Chile',
    time: Date.now() - 1000 * 60 * 320,
    lon: -72.1,
    lat: -30.2,
    depthKm: 35.0,
    url: 'https://earthquake.usgs.gov/earthquakes/map/',
  },
];

const FALLBACK_LAUNCHES: LaunchItem[] = [
  {
    id: 'fallback-launch-1',
    name: 'Electron | The Sea God Surveys (iQPS Launch 9)',
    net: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
    statusName: 'Go for Launch',
    statusAbbrev: 'Go',
  },
  {
    id: 'fallback-launch-2',
    name: 'Falcon 9 Block 5 | Starlink Group 12-9',
    net: new Date(Date.now() + 1000 * 60 * 60 * 64).toISOString(),
    statusName: 'To Be Confirmed',
    statusAbbrev: 'TBC',
  },
];

const FALLBACK_WEATHER: HomeWeather = {
  temperatureC: 11.4,
  cloudCover: 24,
  windKmh: 12.8,
  weatherCode: 1,
  isDay: false,
};

/** Generate a realistic 90-minute orbital ground track around the current ISS point. */
function buildIssGroundTrack(iss: IssTelemetry): Array<{ lat: number; lon: number }> {
  const inclination = 51.64 * (Math.PI / 180);
  const clampedRatio = Math.max(
    -1,
    Math.min(1, Math.sin(iss.latitude * (Math.PI / 180)) / Math.sin(inclination)),
  );
  const phase0 = Math.asin(clampedRatio);
  const points: Array<{ lat: number; lon: number }> = [];
  for (let min = -45; min <= 45; min += 2) {
    const u = phase0 + (min / 92.68) * 2 * Math.PI;
    const lat = Math.asin(Math.sin(inclination) * Math.sin(u)) * (180 / Math.PI);
    const lon = iss.longitude + min * (360 / 92.68 - 360 / 1440);
    points.push({ lat, lon });
  }
  return points;
}

export default function OrbitObservatory() {
  const [now, setNow] = useState(() => new Date());
  const [iss, setIss] = useState<IssTelemetry>(FALLBACK_ISS);
  const [quakes, setQuakes] = useState<QuakeFeature[]>(FALLBACK_QUAKES);
  const [launches, setLaunches] = useState<LaunchItem[]>(FALLBACK_LAUNCHES);
  const [weather, setWeather] = useState<HomeWeather>(FALLBACK_WEATHER);
  const [liveStatus, setLiveStatus] = useState<'connecting' | 'live' | 'cached'>('connecting');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showTerminator, setShowTerminator] = useState(true);
  const [showTrack, setShowTrack] = useState(true);
  const [showQuakes, setShowQuakes] = useState(true);
  const [selectedQuakeId, setSelectedQuakeId] = useState<string | null>(null);
  const [globeTarget, setGlobeTarget] = useState<'iss' | 'home' | 'sun' | 'free'>('iss');
  const [freeCenter, setFreeCenter] = useState<{ lon: number; lat: number }>({
    lon: -1.48,
    lat: 53.55,
  });
  const [dragOrigin, setDragOrigin] = useState<{
    x: number;
    y: number;
    lon: number;
    lat: number;
  } | null>(null);

  const fetchTelemetry = useCallback(async () => {
    if (typeof fetch !== 'function') return;
    setIsRefreshing(true);
    let anyLive = false;

    try {
      const issRes = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      if (issRes.ok) {
        const data = await issRes.json();
        if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          setIss({
            latitude: data.latitude,
            longitude: data.longitude,
            altitude: data.altitude ?? 420,
            velocity: data.velocity ?? 27580,
            visibility: data.visibility ?? 'daylight',
            footprint: data.footprint ?? 4500,
            timestamp: data.timestamp ?? Math.floor(Date.now() / 1000),
          });
          anyLive = true;
        }
      }
    } catch {
      // Retain existing or fallback ISS telemetry
    }

    try {
      const quakeRes = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson',
      );
      if (quakeRes.ok) {
        const data = await quakeRes.json();
        if (Array.isArray(data.features) && data.features.length > 0) {
          const parsed: QuakeFeature[] = data.features.slice(0, 24).map((f: any) => ({
            id: String(f.id),
            mag: Number(f.properties?.mag ?? 4.5),
            place: String(f.properties?.place ?? 'Unknown region'),
            time: Number(f.properties?.time ?? Date.now()),
            lon: Number(f.geometry?.coordinates?.[0] ?? 0),
            lat: Number(f.geometry?.coordinates?.[1] ?? 0),
            depthKm: Number(f.geometry?.coordinates?.[2] ?? 10),
            url: String(f.properties?.url ?? 'https://earthquake.usgs.gov/earthquakes/map/'),
          }));
          setQuakes(parsed);
          anyLive = true;
        }
      }
    } catch {
      // Retain existing or fallback seismic feed
    }

    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${HOME.lat}&longitude=${HOME.lon}&current=temperature_2m,weather_code,cloud_cover,wind_speed_10m,is_day&timezone=Europe%2FLondon&forecast_days=1`,
      );
      if (weatherRes.ok) {
        const data = await weatherRes.json();
        if (data.current) {
          setWeather({
            temperatureC: Number(data.current.temperature_2m ?? 11),
            cloudCover: Number(data.current.cloud_cover ?? 30),
            windKmh: Number(data.current.wind_speed_10m ?? 10),
            weatherCode: Number(data.current.weather_code ?? 1),
            isDay: Boolean(data.current.is_day),
          });
          anyLive = true;
        }
      }
    } catch {
      // Retain existing or fallback weather
    }

    try {
      const launchRes = await fetch(
        'https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=4&mode=list',
      );
      if (launchRes.ok) {
        const data = await launchRes.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          setLaunches(
            data.results.slice(0, 4).map((item: any) => ({
              id: String(item.id),
              name: String(item.name ?? 'Upcoming Orbital Launch'),
              net: String(item.net ?? new Date(Date.now() + 86400000).toISOString()),
              statusName: String(item.status?.name ?? 'Scheduled'),
              statusAbbrev: String(item.status?.abbrev ?? 'TBC'),
            })),
          );
          anyLive = true;
        }
      }
    } catch {
      // Retain existing or fallback launch schedule
    }

    setLiveStatus(anyLive ? 'live' : 'cached');
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchTelemetry();
    const issInterval = window.setInterval(fetchTelemetry, 20000);
    const clockInterval = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearInterval(issInterval);
      window.clearInterval(clockInterval);
    };
  }, [fetchTelemetry]);

  const sun = useMemo(() => subsolarPoint(now), [now]);
  const terminatorSvgPath = useMemo(() => nightPath(sun), [sun]);
  const moon = useMemo(() => moonPhase(now), [now]);
  const issDistanceFromHomeKm = useMemo(
    () => Math.round(haversineKm(HOME.lat, HOME.lon, iss.latitude, iss.longitude)),
    [iss.latitude, iss.longitude],
  );
  const rawTrackPoints = useMemo(() => buildIssGroundTrack(iss), [iss]);
  const trackSegments = useMemo(() => splitTrack(rawTrackPoints), [rawTrackPoints]);

  const [issX, issY] = project(iss.longitude, iss.latitude);
  const [sunX, sunY] = project(sun.lon, sun.lat);
  const [homeX, homeY] = project(HOME.lon, HOME.lat);

  const globeCenter = useMemo(() => {
    if (globeTarget === 'free') {
      return { lon: freeCenter.lon, lat: freeCenter.lat, label: 'Free Drag Orbit' };
    }
    if (globeTarget === 'home') return { lon: HOME.lon, lat: HOME.lat, label: 'Barnsley HQ' };
    if (globeTarget === 'sun') return { lon: sun.lon, lat: sun.lat, label: 'Sub-Solar Zenith' };
    return { lon: iss.longitude, lat: iss.latitude, label: 'ISS Orbital Lock' };
  }, [freeCenter.lat, freeCenter.lon, globeTarget, iss.latitude, iss.longitude, sun.lat, sun.lon]);

  const homeDaylight = isDaylight(HOME.lat, HOME.lon, sun);
  const skyVerdict = stargazingScore(weather.cloudCover, homeDaylight, moon.illumination);
  const selectedQuake = quakes.find(q => q.id === selectedQuakeId) ?? quakes[0];

  return (
    <section className="space-y-8" aria-labelledby="orbit-observatory-title">
      {/* Header Banner */}
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b101d] via-[#070a12] to-[#0d1526] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8fd6ff]/30 bg-[#8fd6ff]/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-[#8fd6ff]">
              <Orbit className="h-3.5 w-3.5" aria-hidden="true" />
              <span>LINACRE // ORBITAL &amp; PLANETARY TELEMETRY</span>
              <span
                className={`ml-1 inline-block h-2 w-2 rounded-full ${
                  liveStatus === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300'
                }`}
                aria-hidden="true"
              />
              <span className="text-[11px] text-white/80">
                {liveStatus === 'live' ? 'LIVE FEED' : 'TELEMETRY READY'}
              </span>
            </div>

            <h1
              id="orbit-observatory-title"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-display"
            >
              Orbit &amp; Earth Observatory
            </h1>

            <p className="text-sm sm:text-base text-[#9aa3b2] leading-relaxed">
              Real-time planetary desk tracking the International Space Station, the solar day/night
              terminator, global M4.5+ seismic events, upcoming orbital launches, and live sky
              conditions over Barnsley ({HOME.lat.toFixed(2)}°N, {Math.abs(HOME.lon).toFixed(2)}°W).
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right font-mono">
              <div className="text-[11px] uppercase tracking-wider text-[#9aa3b2]">
                UTC MISSION CLOCK
              </div>
              <div className="text-lg font-semibold text-white tabular-nums">
                {now.toISOString().replace('T', ' ').slice(0, 19)} UTC
              </div>
            </div>

            <button
              type="button"
              onClick={fetchTelemetry}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-[#8fd6ff]/30 bg-[#8fd6ff]/10 px-3.5 py-2 text-xs font-medium text-[#8fd6ff] hover:bg-[#8fd6ff]/20 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Refresh telemetry</span>
            </button>
          </div>
        </div>

        {/* Top Metric Strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#9aa3b2]">
              <Satellite className="h-3.5 w-3.5 text-[#8fd6ff]" aria-hidden="true" />
              <span>ISS Telemetry</span>
            </div>
            <p className="mt-1.5 text-lg font-semibold text-white tabular-nums">
              {Math.round(iss.altitude)} km · {Math.round(iss.velocity).toLocaleString('en-GB')}{' '}
              km/h
            </p>
            <p className="text-xs text-[#9aa3b2] tabular-nums">
              {iss.latitude.toFixed(2)}°, {iss.longitude.toFixed(2)}° ({iss.visibility})
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#9aa3b2]">
              <Compass className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <span>Range to Barnsley</span>
            </div>
            <p className="mt-1.5 text-lg font-semibold text-white tabular-nums">
              {issDistanceFromHomeKm.toLocaleString('en-GB')} km
            </p>
            <p className="text-xs text-[#9aa3b2]">
              {issDistanceFromHomeKm < 2200
                ? 'Within regional horizon pass'
                : 'Over distant hemisphere'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#9aa3b2]">
              <Moon className="h-3.5 w-3.5 text-purple-300" aria-hidden="true" />
              <span>Lunar Phase</span>
            </div>
            <p className="mt-1.5 text-lg font-semibold text-white">{moon.name}</p>
            <p className="text-xs text-[#9aa3b2] tabular-nums">
              {Math.round(moon.illumination * 100)}% illuminated · age {moon.ageDays.toFixed(1)}d
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#9aa3b2]">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
              <span>Barnsley Sky Index</span>
            </div>
            <p className="mt-1.5 text-lg font-semibold text-white">
              {skyVerdict.label} ({skyVerdict.score}/100)
            </p>
            <p className="text-xs text-[#9aa3b2] tabular-nums">
              {weather.temperatureC.toFixed(1)}°C · {weatherLabel(weather.weatherCode)} ·{' '}
              {weather.cloudCover}% cloud
            </p>
          </div>
        </div>
      </header>

      {/* Main Telemetry Stage: 2D Equirectangular Map + 3D Orthographic Hemisphere */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* 2D World Map (2 columns on xl) */}
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-[#080c16] p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#8fd6ff]" aria-hidden="true" />
                <span>Live Ground Track &amp; Solar Terminator</span>
              </h2>
              <p className="text-xs text-[#9aa3b2]">
                Equirectangular projection · Natural Earth 110m coastline · Click any seismic ring
                to inspect
              </p>
            </div>

            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Map layer controls"
            >
              <button
                type="button"
                aria-pressed={showTerminator}
                onClick={() => setShowTerminator(v => !v)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-mono transition cursor-pointer ${
                  showTerminator
                    ? 'border-[#8fd6ff]/40 bg-[#8fd6ff]/15 text-white'
                    : 'border-white/10 bg-white/[0.03] text-[#9aa3b2]'
                }`}
              >
                Day / Night
              </button>
              <button
                type="button"
                aria-pressed={showTrack}
                onClick={() => setShowTrack(v => !v)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-mono transition cursor-pointer ${
                  showTrack
                    ? 'border-[#8fd6ff]/40 bg-[#8fd6ff]/15 text-white'
                    : 'border-white/10 bg-white/[0.03] text-[#9aa3b2]'
                }`}
              >
                ISS 90m Orbit
              </button>
              <button
                type="button"
                aria-pressed={showQuakes}
                onClick={() => setShowQuakes(v => !v)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-mono transition cursor-pointer ${
                  showQuakes
                    ? 'border-[#8fd6ff]/40 bg-[#8fd6ff]/15 text-white'
                    : 'border-white/10 bg-white/[0.03] text-[#9aa3b2]'
                }`}
              >
                M4.5+ Quakes ({quakes.length})
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050811]">
            <svg
              viewBox="0 0 360 180"
              className="w-full h-auto block select-none"
              role="img"
              aria-label={`World map showing ISS at ${iss.latitude.toFixed(1)} degrees latitude, ${iss.longitude.toFixed(1)} degrees longitude`}
            >
              <defs>
                <radialGradient id="issGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8fd6ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8fd6ff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Graticule grid */}
              {[-60, -30, 0, 30, 60].map(lat => (
                <line
                  key={`lat-${lat}`}
                  x1={0}
                  y1={90 - lat}
                  x2={360}
                  y2={90 - lat}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.3"
                  strokeDasharray={lat === 0 ? undefined : '1.5 1.5'}
                />
              ))}
              {[-120, -60, 0, 60, 120].map(lon => (
                <line
                  key={`lon-${lon}`}
                  x1={lon + 180}
                  y1={0}
                  x2={lon + 180}
                  y2={180}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.3"
                  strokeDasharray={lon === 0 ? undefined : '1.5 1.5'}
                />
              ))}

              {/* Continents */}
              <path
                d={WORLD_LAND_PATH}
                fill="#132035"
                stroke="#2b4468"
                strokeWidth="0.35"
                strokeLinejoin="round"
              />

              {/* Solar Night Terminator */}
              {showTerminator && (
                <>
                  <path d={terminatorSvgPath} fill="rgba(2, 5, 14, 0.58)" />
                  <circle
                    cx={sunX}
                    cy={sunY}
                    r={2.6}
                    fill="#fde047"
                    stroke="#fef08a"
                    strokeWidth="0.6"
                  >
                    <title>
                      Sub-solar point ({sun.lat.toFixed(1)}°, {sun.lon.toFixed(1)}°)
                    </title>
                  </circle>
                </>
              )}

              {/* ISS 90-minute orbital path */}
              {showTrack &&
                trackSegments.map((seg, idx) => (
                  <path
                    key={`track-${idx}`}
                    d={seg}
                    fill="none"
                    stroke="#8fd6ff"
                    strokeWidth="0.7"
                    strokeDasharray="2 1.5"
                    opacity="0.75"
                  />
                ))}

              {/* USGS M4.5+ Earthquakes */}
              {showQuakes &&
                quakes.map(q => {
                  const [qx, qy] = project(q.lon, q.lat);
                  const r = Math.max(1.3, (q.mag - 4) * 1.6);
                  const col = quakeColour(q.mag);
                  const isSelected = selectedQuake?.id === q.id;
                  return (
                    <g
                      key={q.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedQuakeId(q.id)}
                    >
                      <circle
                        cx={qx}
                        cy={qy}
                        r={isSelected ? r + 2.2 : r + 0.8}
                        fill="none"
                        stroke={col}
                        strokeWidth={isSelected ? '0.8' : '0.4'}
                        opacity={isSelected ? 0.95 : 0.5}
                      />
                      <circle cx={qx} cy={qy} r={r} fill={col} fillOpacity="0.75">
                        <title>{`M${q.mag.toFixed(1)} — ${q.place}`}</title>
                      </circle>
                    </g>
                  );
                })}

              {/* Home Station: Barnsley */}
              <g>
                <circle
                  cx={homeX}
                  cy={homeY}
                  r={2.2}
                  fill="#34d399"
                  stroke="#050811"
                  strokeWidth="0.6"
                >
                  <title>Barnsley Home Station (53.55°N, 1.48°W)</title>
                </circle>
              </g>

              {/* ISS Live Marker & Footprint */}
              <g>
                <circle
                  cx={issX}
                  cy={issY}
                  r={14}
                  fill="none"
                  stroke="#8fd6ff"
                  strokeWidth="0.45"
                  strokeDasharray="1.5 1.5"
                  opacity="0.6"
                />
                <circle cx={issX} cy={issY} r={6} fill="url(#issGlow)" />
                <circle
                  cx={issX}
                  cy={issY}
                  r={2.3}
                  fill="#ffffff"
                  stroke="#38bdf8"
                  strokeWidth="0.8"
                >
                  <title>
                    International Space Station ({iss.latitude.toFixed(2)}°,{' '}
                    {iss.longitude.toFixed(2)}°)
                  </title>
                </circle>
              </g>
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#9aa3b2] pt-1">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white ring-2 ring-[#38bdf8]" />
                <span>ISS Live Position</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span>Barnsley HQ</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                <span>Sub-solar Point</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                <span>USGS M4.5+ Seismic Event</span>
              </span>
            </div>
            <span className="font-mono text-[11px]">
              Sub-solar: {sun.lat.toFixed(1)}°N, {sun.lon.toFixed(1)}°E
            </span>
          </div>
        </div>

        {/* 3D Orthographic Hemisphere Lock */}
        <div className="rounded-3xl border border-white/10 bg-[#080c16] p-4 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Orbit className="h-4 w-4 text-[#8fd6ff]" aria-hidden="true" />
                <span>3D Hemisphere Lock</span>
              </h2>
              <p className="text-xs text-[#9aa3b2]">
                Orthographic vector sphere · {globeCenter.label}
              </p>
            </div>
            <div className="flex items-center gap-1" role="group" aria-label="3D globe camera lock">
              {(
                [
                  ['iss', 'ISS'],
                  ['home', 'UK'],
                  ['sun', 'Sun'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setGlobeTarget(id)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition cursor-pointer ${
                    globeTarget === id
                      ? 'border-[#8fd6ff]/40 bg-[#8fd6ff]/15 text-white'
                      : 'border-white/10 bg-white/[0.03] text-[#9aa3b2]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-[260px] aspect-square cursor-grab active:cursor-grabbing select-none"
            onPointerDown={e => {
              e.currentTarget.setPointerCapture?.(e.pointerId);
              setGlobeTarget('free');
              setFreeCenter({ lon: globeCenter.lon, lat: globeCenter.lat });
              setDragOrigin({
                x: e.clientX,
                y: e.clientY,
                lon: globeCenter.lon,
                lat: globeCenter.lat,
              });
            }}
            onPointerMove={e => {
              if (!dragOrigin) return;
              const dx = e.clientX - dragOrigin.x;
              const dy = e.clientY - dragOrigin.y;
              setFreeCenter({
                lon: ((((dragOrigin.lon - dx * 0.65 + 180) % 360) + 360) % 360) - 180,
                lat: Math.max(-75, Math.min(75, dragOrigin.lat + dy * 0.55)),
              });
            }}
            onPointerUp={() => setDragOrigin(null)}
            onPointerCancel={() => setDragOrigin(null)}
            title="Drag to rotate the 3D globe in any direction"
          >
            <svg
              viewBox="-115 -115 230 230"
              className="h-full w-full block"
              aria-label={`3D orthographic hemisphere centered on ${globeCenter.label}`}
            >
              <defs>
                <radialGradient id="sphereShade" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#173054" />
                  <stop offset="65%" stopColor="#091326" />
                  <stop offset="100%" stopColor="#040710" />
                </radialGradient>
              </defs>

              {/* Outer orbital atmosphere halo */}
              <circle
                cx="0"
                cy="0"
                r="106"
                fill="none"
                stroke="rgba(143,214,255,0.2)"
                strokeWidth="0.8"
                strokeDasharray="3 4"
              />
              <circle
                cx="0"
                cy="0"
                r="96"
                fill="url(#sphereShade)"
                stroke="#38bdf8"
                strokeWidth="1.1"
              />

              {/* 3D Latitude & Longitude Wireframe Graticules */}
              {[-60, -30, 0, 30, 60].map(lat => {
                const pts: string[] = [];
                for (let lon = -180; lon <= 180; lon += 8) {
                  const p = projectOrthographic(lon, lat, globeCenter.lon, globeCenter.lat);
                  if (p.visible) pts.push(`${(p.x * 96).toFixed(1)},${(p.y * 96).toFixed(1)}`);
                }
                return pts.length > 1 ? (
                  <polyline
                    key={`glat-${lat}`}
                    points={pts.join(' ')}
                    fill="none"
                    stroke="rgba(143,214,255,0.14)"
                    strokeWidth="0.6"
                  />
                ) : null;
              })}
              {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180].map(lon => {
                const pts: string[] = [];
                for (let lat = -80; lat <= 80; lat += 8) {
                  const p = projectOrthographic(lon, lat, globeCenter.lon, globeCenter.lat);
                  if (p.visible) pts.push(`${(p.x * 96).toFixed(1)},${(p.y * 96).toFixed(1)}`);
                }
                return pts.length > 1 ? (
                  <polyline
                    key={`glon-${lon}`}
                    points={pts.join(' ')}
                    fill="none"
                    stroke="rgba(143,214,255,0.14)"
                    strokeWidth="0.6"
                  />
                ) : null;
              })}

              {/* 3D Orbital Track on Front Hemisphere */}
              {(() => {
                const pts = rawTrackPoints
                  .map(pt =>
                    projectOrthographic(pt.lon, pt.lat, globeCenter.lon, globeCenter.lat),
                  )
                  .filter(p => p.visible)
                  .map(p => `${(p.x * 102).toFixed(1)},${(p.y * 102).toFixed(1)}`);
                return pts.length > 1 ? (
                  <polyline
                    points={pts.join(' ')}
                    fill="none"
                    stroke="#8fd6ff"
                    strokeWidth="1.4"
                    strokeDasharray="3 2"
                  />
                ) : null;
              })()}

              {/* Seismic events on visible hemisphere */}
              {quakes.map(q => {
                const p = projectOrthographic(q.lon, q.lat, globeCenter.lon, globeCenter.lat);
                if (!p.visible) return null;
                return (
                  <circle
                    key={`gq-${q.id}`}
                    cx={p.x * 96}
                    cy={p.y * 96}
                    r={Math.max(1.8, (q.mag - 4) * 1.8)}
                    fill={quakeColour(q.mag)}
                    fillOpacity="0.85"
                  />
                );
              })}

              {/* Barnsley HQ on 3D Globe */}
              {(() => {
                const p = projectOrthographic(HOME.lon, HOME.lat, globeCenter.lon, globeCenter.lat);
                if (!p.visible) return null;
                return (
                  <circle
                    cx={p.x * 96}
                    cy={p.y * 96}
                    r="3.4"
                    fill="#34d399"
                    stroke="#050811"
                    strokeWidth="1"
                  />
                );
              })()}

              {/* ISS on 3D Globe */}
              {(() => {
                const p = projectOrthographic(
                  iss.longitude,
                  iss.latitude,
                  globeCenter.lon,
                  globeCenter.lat,
                );
                if (!p.visible) return null;
                return (
                  <g>
                    <circle
                      cx={p.x * 102}
                      cy={p.y * 102}
                      r="9"
                      fill="none"
                      stroke="#8fd6ff"
                      strokeWidth="0.8"
                      opacity="0.7"
                    />
                    <circle
                      cx={p.x * 102}
                      cy={p.y * 102}
                      r="3.8"
                      fill="#ffffff"
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-[#9aa3b2] flex items-center justify-between font-mono">
            <span>CENTER</span>
            <span className="text-white tabular-nums">
              {globeCenter.lat.toFixed(1)}°, {globeCenter.lon.toFixed(1)}°
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Two-Column Grid: Seismic Feed & Upcoming Rocket Launches */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Seismic Monitor */}
        <section
          className="rounded-3xl border border-white/10 bg-[#080c16] p-6 space-y-4"
          aria-labelledby="seismic-heading"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="seismic-heading"
              className="text-lg font-semibold text-white flex items-center gap-2"
            >
              <Activity className="h-4 w-4 text-orange-400" aria-hidden="true" />
              <span>Global M4.5+ Seismic Feed (24h)</span>
            </h2>
            <span className="text-xs font-mono text-[#9aa3b2]">Source: USGS GeoJSON</span>
          </div>

          {selectedQuake && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase text-[#8fd6ff]">
                  Selected Event Inspector
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  M{selectedQuake.mag.toFixed(1)} — {selectedQuake.place}
                </div>
                <div className="text-xs text-[#9aa3b2] tabular-nums">
                  Depth {selectedQuake.depthKm.toFixed(1)} km · {selectedQuake.lat.toFixed(2)}°,{' '}
                  {selectedQuake.lon.toFixed(2)}°
                </div>
              </div>
              <a
                href={selectedQuake.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#8fd6ff] hover:bg-white/[0.08] transition"
              >
                USGS Bulletin ↗
              </a>
            </div>
          )}

          <ul className="divide-y divide-white/[0.06] max-h-72 overflow-y-auto pr-1">
            {quakes.slice(0, 8).map(q => (
              <li key={q.id} className="py-2.5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedQuakeId(q.id)}
                  className="flex items-center gap-3 text-left hover:text-white transition cursor-pointer min-w-0"
                >
                  <span
                    className="inline-flex h-8 w-11 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-black"
                    style={{ backgroundColor: quakeColour(q.mag) }}
                  >
                    M{q.mag.toFixed(1)}
                  </span>
                  <span className="truncate">
                    <span className="block text-sm text-white truncate">{q.place}</span>
                    <span className="block text-xs text-[#9aa3b2] tabular-nums">
                      Depth {q.depthKm.toFixed(0)} km ·{' '}
                      {new Date(q.time).toISOString().slice(11, 16)} UTC
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Upcoming Launches */}
        <section
          className="rounded-3xl border border-white/10 bg-[#080c16] p-6 space-y-4"
          aria-labelledby="launches-heading"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="launches-heading"
              className="text-lg font-semibold text-white flex items-center gap-2"
            >
              <Rocket className="h-4 w-4 text-[#8fd6ff]" aria-hidden="true" />
              <span>Upcoming Orbital Launches</span>
            </h2>
            <span className="text-xs font-mono text-[#9aa3b2]">Launch Library 2</span>
          </div>

          <ul className="space-y-3">
            {launches.map(launch => {
              const deltaMs = new Date(launch.net).getTime() - now.getTime();
              return (
                <li
                  key={launch.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-[#8fd6ff]/30 bg-[#8fd6ff]/10 px-2 py-0.5 font-mono text-[10px] uppercase text-[#8fd6ff]">
                        {launch.statusAbbrev}
                      </span>
                      <span className="text-xs text-[#9aa3b2]">{launch.statusName}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-white truncate">{launch.name}</p>
                    <p className="text-xs text-[#9aa3b2] tabular-nums">
                      NET: {launch.net.replace('T', ' ').slice(0, 16)} UTC
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#050811] px-3 py-2 font-mono text-xs font-semibold text-[#8fd6ff] tabular-nums">
                    {formatCountdown(deltaMs)}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-xs text-[#9aa3b2] flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
              <span>
                Barnsley daylight: {homeDaylight ? 'Daytime sky' : 'Night sky — optimal for passes'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
              <Eye className="h-3.5 w-3.5 text-[#8fd6ff]" aria-hidden="true" />
              <span>Full moon in {moon.daysToFull.toFixed(1)}d</span>
            </span>
          </div>
        </section>
      </div>
    </section>
  );
}
