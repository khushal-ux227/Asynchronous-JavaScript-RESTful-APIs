import React, { useState, useEffect } from 'react';
import {
  WeatherApiResponse,
  GeoLocationResult,
  WeatherConditionInfo,
  TemperatureUnit,
} from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Bookmark,
  BookmarkCheck,
  Check,
  Share2,
  Compass,
} from 'lucide-react';

interface HeroWeatherCardProps {
  weather: WeatherApiResponse;
  location: GeoLocationResult;
  condition: WeatherConditionInfo;
  temperatureUnit: TemperatureUnit;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const HeroWeatherCard: React.FC<HeroWeatherCardProps> = ({
  weather,
  location,
  condition,
  temperatureUnit,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [localTime, setLocalTime] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const { current, daily } = weather;
  const isDay = Boolean(current.is_day);
  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  // Calculate high/low for today
  const highToday = daily?.temperature_2m_max?.[0] !== undefined ? Math.round(daily.temperature_2m_max[0]) : null;
  const lowToday = daily?.temperature_2m_min?.[0] !== undefined ? Math.round(daily.temperature_2m_min[0]) : null;

  // Real-time clock in target city's timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeZone = location.timezone || weather.timezone || 'UTC';
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setLocalTime(formatted);
      } catch {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [location.timezone, weather.timezone]);

  const handleShare = async () => {
    const text = `Current weather in ${location.name}, ${location.country}: ${Math.round(current.temperature_2m)}${tempSymbol}, ${condition.label}. Feels like ${Math.round(current.apparent_temperature)}${tempSymbol}.`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const bgGradient = isDay ? condition.gradientDay : condition.gradientNight;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br ${bgGradient} p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 shadow-2xl`}
    >
      {/* Subtle atmospheric ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: condition.accentColor }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: isDay ? '#38bdf8' : '#6366f1' }}
      />

      <div className="relative z-10">
        {/* Top bar: location info & actions */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {location.name}
              </h1>
              {location.country_code && (
                <span className="text-sm font-medium text-slate-300 font-mono">
                  {location.country_code}
                </span>
              )}
            </div>

            {/* Clean unboxed metadata with typographic separators (anti-slop) */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {location.admin1 && (
                <>
                  <span>{location.admin1}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                </>
              )}
              <span>{location.country}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono tabular-nums">
                {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
              </span>
              {weather.elevation !== undefined && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="tabular-nums">Elev {Math.round(weather.elevation)}m</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              title={isBookmarked ? 'Remove from favorites' : 'Bookmark this city'}
              className={`p-2.5 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-400/30" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleShare}
              title="Copy weather summary"
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Central Weather Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Temperature and Icon */}
          <div className="md:col-span-7 flex flex-wrap items-baseline gap-5">
            <div className="flex items-center gap-4">
              <WeatherIcon
                weatherCode={current.weather_code}
                isDay={current.is_day}
                className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg"
              />
              <div>
                <div className="flex items-baseline">
                  <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white tabular-nums">
                    {Math.round(current.temperature_2m)}
                  </span>
                  <span className="text-2xl sm:text-3xl font-light text-slate-300 ml-1">
                    {tempSymbol}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
                <span>{condition.label}</span>
                <span className="text-xs font-normal text-slate-400">
                  (WMO {current.weather_code})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                {condition.description}
              </p>
            </div>
          </div>

          {/* Secondary stats & Local Time */}
          <div className="md:col-span-5 flex flex-col justify-between sm:items-end space-y-4 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6">
            {/* Real-time Local Clock */}
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/40">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono tabular-nums">{localTime || 'Synchronizing...'}</span>
            </div>

            {/* Daily range & feels like */}
            <div className="space-y-2 text-sm text-slate-200">
              <div className="flex items-center gap-4 sm:justify-end">
                <span className="text-xs text-slate-400">Feels Like</span>
                <span className="font-semibold text-white tabular-nums">
                  {Math.round(current.apparent_temperature)}{tempSymbol}
                </span>
              </div>

              {highToday !== null && lowToday !== null && (
                <div className="flex items-center gap-4 sm:justify-end text-xs">
                  <span className="text-slate-400">Today's Range</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-rose-400 font-medium tabular-nums">
                      <ArrowUp className="w-3 h-3 mr-0.5" />
                      {highToday}{tempSymbol}
                    </span>
                    <span className="text-slate-600">/</span>
                    <span className="flex items-center text-sky-400 font-medium tabular-nums">
                      <ArrowDown className="w-3 h-3 mr-0.5" />
                      {lowToday}{tempSymbol}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 sm:justify-end text-xs">
                <span className="text-slate-400">Atmospheric Wind</span>
                <span className="font-medium text-slate-200 font-mono tabular-nums flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  {Math.round(current.wind_speed_10m)} {weather.current_units?.wind_speed_10m || 'km/h'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
