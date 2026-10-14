import React, { useState } from 'react';
import { HourlyWeatherData, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Thermometer, CloudRain, Wind, Sun, ChevronRight, ChevronLeft } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyWeatherData;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: string;
}

type MetricView = 'temperature' | 'precipitation' | 'wind' | 'uv';

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  temperatureUnit,
  windSpeedUnit,
}) => {
  const [metric, setMetric] = useState<MetricView>('temperature');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  // Find index of current hour
  const now = new Date();
  const currentHourIso = now.toISOString().slice(0, 13); // 'YYYY-MM-DDTHH'
  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentHourIso));
  if (startIndex === -1) startIndex = 0;

  // Next 24 hours
  const next24 = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, i) => {
    const originalIdx = startIndex + i;
    const date = new Date(timeStr);
    const hourNum = date.getHours();
    const isNow = i === 0;
    const isDay = hourNum >= 6 && hourNum < 20;

    return {
      time: timeStr,
      displayTime: isNow ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      temp: Math.round(hourly.temperature_2m[originalIdx]),
      rainChance: hourly.precipitation_probability[originalIdx] ?? 0,
      windSpeed: Math.round(hourly.wind_speed_10m[originalIdx] ?? 0),
      weatherCode: hourly.weather_code[originalIdx] ?? 0,
      uv: (hourly.uv_index?.[originalIdx] ?? 0).toFixed(1),
      isDay,
      isNow,
    };
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
      {/* Header and Interactive Metric Selector Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>24-Hour Atmospheric Trajectory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly parsed forecast sequence from Open-Meteo REST API
          </p>
        </div>

        {/* Interactive segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setMetric('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              metric === 'temperature'
                ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp</span>
          </button>

          <button
            onClick={() => setMetric('precipitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              metric === 'precipitation'
                ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>

          <button
            onClick={() => setMetric('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              metric === 'wind'
                ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind</span>
          </button>

          <button
            onClick={() => setMetric('uv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              metric === 'uv'
                ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>UV</span>
          </button>
        </div>
      </div>

      {/* Hourly Scroll Container */}
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent scroll-smooth focus:outline-none"
          tabIndex={0}
          aria-label="24 hour forecast list"
        >
          {next24.map((item, idx) => (
            <div
              key={`${item.time}-${idx}`}
              className={`shrink-0 w-20 flex flex-col items-center justify-between p-3 rounded-2xl border transition-all ${
                item.isNow
                  ? 'bg-sky-950/40 border-sky-600/60 ring-1 ring-sky-500/30 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Hour Label */}
              <span
                className={`text-xs font-medium ${
                  item.isNow ? 'text-sky-300 font-bold' : 'text-slate-400'
                }`}
              >
                {item.displayTime}
              </span>

              {/* Weather Condition Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  weatherCode={item.weatherCode}
                  isDay={item.isDay}
                  className="w-7 h-7"
                />
              </div>

              {/* Dynamic metric value based on active tab */}
              {metric === 'temperature' && (
                <div className="text-sm font-semibold text-white tabular-nums">
                  {item.temp}{tempSymbol}
                </div>
              )}

              {metric === 'precipitation' && (
                <div className="flex flex-col items-center">
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      item.rainChance > 40 ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  >
                    {item.rainChance}%
                  </span>
                  <div className="w-8 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${item.rainChance}%` }}
                    />
                  </div>
                </div>
              )}

              {metric === 'wind' && (
                <div className="text-xs font-semibold text-slate-200 tabular-nums">
                  {item.windSpeed}
                  <span className="text-[10px] text-slate-500 block text-center font-normal">
                    {windSpeedUnit}
                  </span>
                </div>
              )}

              {metric === 'uv' && (
                <div className="text-xs font-semibold text-amber-300 tabular-nums">
                  {item.uv}
                  <span className="text-[10px] text-slate-500 block text-center font-normal">
                    Index
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scroll arrows */}
        <button
          onClick={() => scroll('left')}
          title="Scroll earlier hours"
          aria-label="Scroll earlier hours"
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 p-1.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden sm:block"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll('right')}
          title="Scroll later hours"
          aria-label="Scroll later hours"
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 p-1.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden sm:block"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
