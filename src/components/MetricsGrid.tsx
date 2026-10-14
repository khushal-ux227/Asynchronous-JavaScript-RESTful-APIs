import React from 'react';
import {
  WeatherApiResponse,
  AirQualityData,
  TemperatureUnit,
} from '../types/weather';
import {
  Droplets,
  Wind,
  Gauge,
  Sun,
  Eye,
  Cloud,
  CloudRain,
  Sunrise,
  Sunset,
  Activity,
  Compass,
} from 'lucide-react';
import {
  getWindCardinal,
  getUvCategory,
  getAqiCategory,
  getHumidityComfort,
  getPressureTrend,
} from '../services/weatherApi';

interface MetricsGridProps {
  weather: WeatherApiResponse;
  airQuality: AirQualityData | null;
  temperatureUnit: TemperatureUnit;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  weather,
  airQuality,
  temperatureUnit,
}) => {
  const { current, daily, hourly } = weather;
  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  // Calculations
  const humidityComfort = getHumidityComfort(current.relative_humidity_2m);
  const windCardinal = getWindCardinal(current.wind_direction_10m);
  const uvInfo = getUvCategory(current.uv_index);
  const pressureTrend = getPressureTrend(current.pressure_msl);

  // Latest dew point from hourly or approximate
  const currentDewPoint = hourly?.dew_point_2m?.[0] !== undefined
    ? Math.round(hourly.dew_point_2m[0])
    : Math.round(current.temperature_2m - (100 - current.relative_humidity_2m) / 5);

  // Visibility from hourly (meters to km)
  const visibilityMeters = hourly?.visibility?.[0] ?? 10000;
  const visibilityKm = (visibilityMeters / 1000).toFixed(1);

  // Sunrise and Sunset calculation
  const sunriseStr = daily?.sunrise?.[0];
  const sunsetStr = daily?.sunset?.[0];

  const formatSunTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString.split('T')[1]?.substring(0, 5) || isoString;
    }
  };

  // Daylight remaining percentage
  let daylightPercentage = 50;
  let daylightStatus = 'Daylight active';
  if (sunriseStr && sunsetStr) {
    const now = new Date().getTime();
    const rise = new Date(sunriseStr).getTime();
    const set = new Date(sunsetStr).getTime();
    if (now < rise) {
      daylightPercentage = 0;
      daylightStatus = 'Before sunrise';
    } else if (now > set) {
      daylightPercentage = 100;
      daylightStatus = 'Night time';
    } else {
      daylightPercentage = Math.round(((now - rise) / (set - rise)) * 100);
      daylightStatus = `${100 - daylightPercentage}% daylight remaining`;
    }
  }

  // AQI calculations
  const usAqi = airQuality?.current?.us_aqi;
  const aqiInfo = usAqi !== undefined ? getAqiCategory(usAqi) : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* 1. Humidity & Dew Point */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span className="font-medium text-slate-300">Humidity</span>
          </div>
          <span className="text-[11px] font-mono">{humidityComfort.label}</span>
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
            {Math.round(current.relative_humidity_2m)}%
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Dew Point</div>
            <div className="text-sm font-semibold text-slate-200 tabular-nums">
              {currentDewPoint}{tempSymbol}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, current.relative_humidity_2m))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Dry</span>
            <span>Comfortable</span>
            <span>Humid</span>
          </div>
        </div>
      </div>

      {/* 2. Wind Speed, Direction & Gusts */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-400" />
            <span className="font-medium text-slate-300">Wind & Gusts</span>
          </div>
          <span className="text-[11px] font-mono text-teal-300">{windCardinal} ({current.wind_direction_10m}°)</span>
        </div>

        <div className="my-3 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {Math.round(current.wind_speed_10m)}
              <span className="text-sm font-normal text-slate-400 ml-1">
                {weather.current_units?.wind_speed_10m || 'km/h'}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Gusts to <span className="font-semibold text-slate-200">{Math.round(current.wind_gusts_10m)} {weather.current_units?.wind_speed_10m || 'km/h'}</span>
            </div>
          </div>

          {/* Compass Rose */}
          <div className="relative w-12 h-12 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center shrink-0">
            <span className="absolute top-0.5 text-[8px] font-bold text-slate-400">N</span>
            <span className="absolute right-0.5 text-[8px] font-bold text-slate-500">E</span>
            <span className="absolute bottom-0.5 text-[8px] font-bold text-slate-500">S</span>
            <span className="absolute left-0.5 text-[8px] font-bold text-slate-500">W</span>
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            >
              <Compass className="w-6 h-6 text-teal-400 drop-shadow" />
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 truncate">
          Wind blowing from {windCardinal} heading {current.wind_direction_10m}°
        </div>
      </div>

      {/* 3. Atmospheric Pressure */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-400" />
            <span className="font-medium text-slate-300">Barometric Pressure</span>
          </div>
          <span className="text-[11px] font-mono text-indigo-300">MSL</span>
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
            {Math.round(current.pressure_msl)}
            <span className="text-sm font-normal text-slate-400 ml-1">hPa</span>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Surface</div>
            <div className="text-sm font-semibold text-slate-200 tabular-nums">
              {Math.round(current.surface_pressure)} hPa
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 leading-snug">
          {pressureTrend}
        </div>
      </div>

      {/* 4. UV Index */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-slate-300">UV Index</span>
          </div>
          <span
            className="text-[11px] font-semibold"
            style={{ color: uvInfo.color }}
          >
            {uvInfo.label}
          </span>
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
            {current.uv_index.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ 12+</span>
          </div>
          {daily?.uv_index_max?.[0] !== undefined && (
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Max Today</div>
              <div className="text-sm font-semibold text-slate-200 tabular-nums">
                {daily.uv_index_max[0].toFixed(1)}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (current.uv_index / 11) * 100)}%`,
                backgroundColor: uvInfo.color,
              }}
            />
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {uvInfo.advice}
          </div>
        </div>
      </div>

      {/* 5. Visibility & Cloud Cover */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="font-medium text-slate-300">Visibility & Clouds</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Clear line</span>
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div>
            <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {visibilityKm}
              <span className="text-sm font-normal text-slate-400 ml-1">km</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Horizontal clarity
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-[11px] text-slate-400">
              <Cloud className="w-3.5 h-3.5 text-slate-400" />
              <span>Cover</span>
            </div>
            <div className="text-lg font-bold text-slate-200 tabular-nums">
              {current.cloud_cover}%
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          {current.cloud_cover < 20
            ? 'Clear ceiling, optimal astronomical sight'
            : current.cloud_cover < 70
            ? 'Partially scattered cloud coverage'
            : 'Dense overcast cloud ceiling'}
        </div>
      </div>

      {/* 6. Precipitation & Rain Probability */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-slate-300">Precipitation</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-300">
            {current.precipitation > 0 ? 'Active' : 'Dry'}
          </span>
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div>
            <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {current.precipitation.toFixed(1)}
              <span className="text-sm font-normal text-slate-400 ml-1">
                {weather.current_units?.precipitation || 'mm'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Accumulation in past hour
            </div>
          </div>

          {daily?.precipitation_probability_max?.[0] !== undefined && (
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Rain Chance</div>
              <div className="text-lg font-bold text-cyan-400 tabular-nums">
                {daily.precipitation_probability_max[0]}%
              </div>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400">
          {daily?.precipitation_sum?.[0] !== undefined
            ? `24h expected total: ${daily.precipitation_sum[0].toFixed(1)} ${weather.current_units?.precipitation || 'mm'}`
            : 'No significant rain anticipated'}
        </div>
      </div>

      {/* 7. Sunrise, Sunset & Celestial Progression */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-slate-300">Solar Progression</span>
          </div>
          <span className="text-[11px] font-mono text-amber-300">{daylightStatus}</span>
        </div>

        <div className="my-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Sunrise</div>
              <div className="text-sm font-semibold text-white font-mono tabular-nums">
                {formatSunTime(sunriseStr)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-[10px] text-slate-400">Sunset</div>
              <div className="text-sm font-semibold text-white font-mono tabular-nums">
                {formatSunTime(sunsetStr)}
              </div>
            </div>
            <Sunset className="w-4 h-4 text-orange-400 shrink-0" />
          </div>
        </div>

        {/* Solar arc progress */}
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${daylightPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Dawn</span>
            <span>Solar Noon</span>
            <span>Dusk</span>
          </div>
        </div>
      </div>

      {/* 8. Air Quality Index (US AQI & PM2.5) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-slate-300">Air Quality</span>
          </div>
          {aqiInfo && (
            <span
              className="text-[11px] font-semibold"
              style={{ color: aqiInfo.color }}
            >
              {aqiInfo.label}
            </span>
          )}
        </div>

        <div className="my-3 flex items-baseline justify-between">
          {usAqi !== undefined ? (
            <>
              <div>
                <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
                  {Math.round(usAqi)}
                  <span className="text-xs font-normal text-slate-400 ml-1.5">US AQI</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  PM2.5: {airQuality?.current?.pm2_5 ? `${airQuality.current.pm2_5.toFixed(1)} µg/m³` : 'N/A'}
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-[10px] text-slate-400">PM10</div>
                <div className="font-semibold text-slate-200 tabular-nums">
                  {airQuality?.current?.pm10 ? `${airQuality.current.pm10.toFixed(0)} µg/m³` : 'N/A'}
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400 py-1">
              Air quality sensor data synchronizing...
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 truncate">
          {aqiInfo?.advice || 'Atmospheric particulate levels are within expected range.'}
        </div>
      </div>
    </div>
  );
};
