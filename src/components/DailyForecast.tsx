import React, { useState } from 'react';
import { DailyWeatherData, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCondition } from '../services/weatherApi';
import { Calendar, Droplets, Wind, Sun, ChevronDown, ChevronUp } from 'lucide-react';

interface DailyForecastProps {
  daily: DailyWeatherData;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: string;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  temperatureUnit,
  windSpeedUnit,
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  // Compute global min and max for the 7 days to calibrate temperature range bars
  const allMins = daily.temperature_2m_min;
  const allMaxs = daily.temperature_2m_max;
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalSpan = Math.max(1, globalMax - globalMin);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>7-Day Synoptic Forecast</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Extended atmospheric progression model
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-800/80">
        {daily.time.map((timeStr, index) => {
          const date = new Date(timeStr);
          const isToday = index === 0;
          const dayName = isToday
            ? 'Today'
            : date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateFormatted = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const weatherCode = daily.weather_code[index];
          const condition = getWeatherCondition(weatherCode);
          const minTemp = Math.round(daily.temperature_2m_min[index]);
          const maxTemp = Math.round(daily.temperature_2m_max[index]);
          const rainProb = daily.precipitation_probability_max[index] ?? 0;
          const rainSum = daily.precipitation_sum[index] ?? 0;
          const maxWind = Math.round(daily.wind_speed_10m_max[index] ?? 0);
          const maxUv = daily.uv_index_max[index]?.toFixed(1) ?? 'N/A';
          const sunrise = daily.sunrise[index]?.split('T')[1]?.substring(0, 5) ?? '--:--';
          const sunset = daily.sunset[index]?.split('T')[1]?.substring(0, 5) ?? '--:--';

          // Bar offset calculation
          const leftPercent = ((daily.temperature_2m_min[index] - globalMin) / globalSpan) * 100;
          const widthPercent = Math.max(
            8,
            ((daily.temperature_2m_max[index] - daily.temperature_2m_min[index]) / globalSpan) * 100
          );

          const isExpanded = expandedDay === index;

          return (
            <div key={timeStr} className="py-3">
              <div
                onClick={() => setExpandedDay(isExpanded ? null : index)}
                className="flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                {/* Day name and date */}
                <div className="w-24 shrink-0">
                  <div className={`text-sm font-medium ${isToday ? 'text-sky-400 font-bold' : 'text-slate-200'}`}>
                    {dayName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {dateFormatted}
                  </div>
                </div>

                {/* Weather icon & condition */}
                <div className="flex items-center gap-2.5 w-36 sm:w-44 shrink-0">
                  <WeatherIcon
                    weatherCode={weatherCode}
                    isDay={1}
                    className="w-6 h-6 shrink-0"
                  />
                  <div className="truncate text-xs text-slate-300 font-medium">
                    {condition.label}
                  </div>
                </div>

                {/* Rain probability */}
                <div className="w-16 shrink-0 text-right text-xs">
                  {rainProb > 15 ? (
                    <span className="flex items-center justify-end gap-1 text-cyan-400 font-medium tabular-nums">
                      <Droplets className="w-3 h-3" />
                      {rainProb}%
                    </span>
                  ) : (
                    <span className="text-slate-600 font-mono text-[11px]">Dry</span>
                  )}
                </div>

                {/* Temperature Range Bar */}
                <div className="hidden sm:flex flex-1 items-center gap-3 max-w-xs">
                  <span className="w-9 text-right text-xs text-slate-400 tabular-nums font-mono">
                    {minTemp}{tempSymbol}
                  </span>

                  <div className="flex-1 h-2 bg-slate-950 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 opacity-90"
                      style={{
                        left: `${Math.max(0, leftPercent)}%`,
                        width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                      }}
                    />
                  </div>

                  <span className="w-9 text-left text-xs text-white font-medium tabular-nums font-mono">
                    {maxTemp}{tempSymbol}
                  </span>
                </div>

                {/* Mobile temp display */}
                <div className="sm:hidden text-right text-xs tabular-nums font-mono">
                  <span className="text-slate-400">{minTemp}°</span>
                  <span className="text-slate-600 mx-1">/</span>
                  <span className="text-white font-semibold">{maxTemp}°</span>
                </div>

                {/* Expand icon */}
                <div className="text-slate-500">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded details row */}
              {isExpanded && (
                <div className="mt-2.5 mx-2 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">Peak Gusts</div>
                      <div className="font-semibold text-slate-200 tabular-nums">
                        {maxWind} {windSpeedUnit}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">Max UV</div>
                      <div className="font-semibold text-slate-200 tabular-nums">
                        {maxUv}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">Rain Sum</div>
                      <div className="font-semibold text-slate-200 tabular-nums">
                        {rainSum.toFixed(1)} mm
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400">Daylight Sun</div>
                    <div className="font-mono text-slate-300 text-[11px] tabular-nums">
                      {sunrise} – {sunset}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
