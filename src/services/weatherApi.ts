import {
  WeatherApiResponse,
  GeoLocationResult,
  AirQualityData,
  WeatherConditionInfo,
  ApiNetworkLog,
  TemperatureUnit,
  WindSpeedUnit,
  PrecipitationUnit,
} from '../types/weather';

/**
 * WMO Weather interpretation codes (WW)
 * Reference: World Meteorological Organization
 */
export const WMO_CODE_MAP: Record<number, WeatherConditionInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Cloudless, clear atmosphere with optimal solar visibility.',
    iconName: 'Sun',
    group: 'clear',
    gradientDay: 'from-amber-400/20 via-sky-500/15 to-blue-600/20',
    gradientNight: 'from-indigo-950 via-slate-900 to-sky-950',
    accentColor: '#f59e0b',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Scattered high-altitude wisps with abundant sunshine.',
    iconName: 'SunMedium',
    group: 'clear',
    gradientDay: 'from-sky-400/20 via-blue-500/15 to-cyan-600/20',
    gradientNight: 'from-slate-950 via-indigo-950 to-blue-950',
    accentColor: '#0ea5e9',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Broken cloud cover with interspersed sunny intervals.',
    iconName: 'CloudSun',
    group: 'clouds',
    gradientDay: 'from-slate-400/25 via-sky-500/15 to-indigo-600/20',
    gradientNight: 'from-slate-950 via-slate-900 to-indigo-950',
    accentColor: '#38bdf8',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Dense, continuous stratocumulus or stratus cloud deck.',
    iconName: 'Cloud',
    group: 'clouds',
    gradientDay: 'from-slate-500/30 via-zinc-600/20 to-slate-700/30',
    gradientNight: 'from-zinc-950 via-slate-900 to-neutral-950',
    accentColor: '#94a3b8',
  },
  45: {
    code: 45,
    label: 'Fog',
    description: 'Surface visibility reduced significantly by ground condensation.',
    iconName: 'CloudFog',
    group: 'fog',
    gradientDay: 'from-slate-400/25 via-zinc-400/20 to-stone-500/25',
    gradientNight: 'from-stone-950 via-zinc-900 to-slate-950',
    accentColor: '#cbd5e1',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    description: 'Freezing fog coating terrestrial surfaces with delicate ice crystals.',
    iconName: 'CloudFog',
    group: 'fog',
    gradientDay: 'from-teal-500/20 via-slate-500/25 to-blue-600/20',
    gradientNight: 'from-teal-950 via-slate-950 to-zinc-950',
    accentColor: '#5eead4',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Fine liquid precipitation droplets descending gently.',
    iconName: 'CloudDrizzle',
    group: 'drizzle',
    gradientDay: 'from-sky-500/25 via-slate-500/20 to-blue-600/25',
    gradientNight: 'from-slate-950 via-sky-950 to-indigo-950',
    accentColor: '#60a5fa',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Continuous mist-like precipitation dampening exposed surfaces.',
    iconName: 'CloudDrizzle',
    group: 'drizzle',
    gradientDay: 'from-blue-500/25 via-slate-600/25 to-cyan-700/25',
    gradientNight: 'from-slate-950 via-blue-950 to-zinc-950',
    accentColor: '#3b82f6',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Thick drizzle visibly reducing horizontal visibility.',
    iconName: 'CloudDrizzle',
    group: 'drizzle',
    gradientDay: 'from-slate-600/30 via-blue-600/25 to-indigo-700/25',
    gradientNight: 'from-zinc-950 via-slate-950 to-blue-950',
    accentColor: '#2563eb',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Light, steady rainfall from nimbostratus clouds.',
    iconName: 'CloudRain',
    group: 'rain',
    gradientDay: 'from-blue-600/25 via-indigo-500/20 to-slate-700/30',
    gradientNight: 'from-slate-950 via-indigo-950 to-blue-950',
    accentColor: '#60a5fa',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Sustained rain accumulation with damp atmospheric sound.',
    iconName: 'CloudRain',
    group: 'rain',
    gradientDay: 'from-blue-700/30 via-slate-700/30 to-indigo-800/30',
    gradientNight: 'from-blue-950 via-slate-950 to-neutral-950',
    accentColor: '#3b82f6',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Intense rain showers with rapid surface runoff.',
    iconName: 'CloudRainWind',
    group: 'rain',
    gradientDay: 'from-indigo-800/35 via-blue-800/30 to-slate-900/40',
    gradientNight: 'from-slate-950 via-blue-950 to-zinc-950',
    accentColor: '#1d4ed8',
  },
  71: {
    code: 71,
    label: 'Slight Snowfall',
    description: 'Gentle, sparse snowflakes drifting with calm winds.',
    iconName: 'Snowflake',
    group: 'snow',
    gradientDay: 'from-slate-300/30 via-blue-300/20 to-cyan-500/20',
    gradientNight: 'from-slate-950 via-slate-900 to-sky-950',
    accentColor: '#bae6fd',
  },
  73: {
    code: 73,
    label: 'Moderate Snowfall',
    description: 'Steady accumulation of crystalline snowflakes.',
    iconName: 'Snowflake',
    group: 'snow',
    gradientDay: 'from-blue-200/30 via-slate-400/25 to-indigo-500/20',
    gradientNight: 'from-indigo-950 via-slate-950 to-zinc-950',
    accentColor: '#7dd3fc',
  },
  75: {
    code: 75,
    label: 'Heavy Snowfall',
    description: 'Dense snowfall with rapid ground blanket accumulation.',
    iconName: 'Snowflake',
    group: 'snow',
    gradientDay: 'from-slate-400/35 via-blue-500/30 to-slate-700/35',
    gradientNight: 'from-slate-950 via-indigo-950 to-blue-950',
    accentColor: '#38bdf8',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Opaque, granular ice pellet precipitation.',
    iconName: 'Snowflake',
    group: 'snow',
    gradientDay: 'from-slate-400/30 via-cyan-600/25 to-blue-700/25',
    gradientNight: 'from-slate-950 via-teal-950 to-zinc-950',
    accentColor: '#67e8f9',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Intermittent precipitation bursts with variable cloud gaps.',
    iconName: 'CloudRain',
    group: 'rain',
    gradientDay: 'from-sky-600/30 via-blue-500/25 to-slate-700/30',
    gradientNight: 'from-slate-950 via-sky-950 to-slate-900',
    accentColor: '#38bdf8',
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Periodic heavy bursts of localized rainfall.',
    iconName: 'CloudRain',
    group: 'rain',
    gradientDay: 'from-blue-700/35 via-indigo-600/30 to-slate-800/35',
    gradientNight: 'from-blue-950 via-slate-950 to-neutral-950',
    accentColor: '#2563eb',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Severe, high-rate downpours with strong atmospheric updrafts.',
    iconName: 'CloudRainWind',
    group: 'rain',
    gradientDay: 'from-indigo-900/40 via-blue-900/35 to-slate-950/50',
    gradientNight: 'from-indigo-950 via-slate-950 to-black',
    accentColor: '#1e40af',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    description: 'Gusty bursts of localized snowfall with shifting winds.',
    iconName: 'Snowflake',
    group: 'snow',
    gradientDay: 'from-slate-400/30 via-sky-500/25 to-indigo-600/25',
    gradientNight: 'from-slate-950 via-blue-950 to-zinc-950',
    accentColor: '#93c5fd',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Blustery, heavy snow flurry bursts with sudden visibility drops.',
    iconName: 'Snowflake',
    group: 'snow',
    gradientDay: 'from-blue-600/35 via-slate-600/35 to-indigo-800/35',
    gradientNight: 'from-slate-950 via-indigo-950 to-black',
    accentColor: '#60a5fa',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Convective storm activity with audible thunder and lightning.',
    iconName: 'CloudLightning',
    group: 'thunderstorm',
    gradientDay: 'from-purple-900/40 via-slate-800/40 to-blue-950/45',
    gradientNight: 'from-purple-950 via-slate-950 to-black',
    accentColor: '#c084fc',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Slight Hail',
    description: 'Severe electrical activity accompanied by small ice pellets.',
    iconName: 'CloudLightning',
    group: 'thunderstorm',
    gradientDay: 'from-purple-900/45 via-blue-900/40 to-slate-950/50',
    gradientNight: 'from-purple-950 via-indigo-950 to-black',
    accentColor: '#e879f9',
  },
  99: {
    code: 99,
    label: 'Thunderstorm with Heavy Hail',
    description: 'High-energy supercell producing intense lightning and damaging hail.',
    iconName: 'CloudLightning',
    group: 'thunderstorm',
    gradientDay: 'from-violet-950/50 via-slate-900/50 to-blue-950/50',
    gradientNight: 'from-violet-950 via-slate-950 to-black',
    accentColor: '#f43f5e',
  },
};

export function getWeatherCondition(code: number): WeatherConditionInfo {
  return (
    WMO_CODE_MAP[code] || {
      code,
      label: 'Atmospheric State',
      description: 'Standard atmospheric meteorological condition.',
      iconName: 'CloudSun',
      group: 'clouds',
      gradientDay: 'from-slate-500/20 via-sky-500/20 to-blue-600/20',
      gradientNight: 'from-slate-950 via-slate-900 to-indigo-950',
      accentColor: '#38bdf8',
    }
  );
}

/**
 * Helper to compute cardinal wind direction from degrees
 */
export function getWindCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Calculate UV index risk category
 */
export function getUvCategory(uv: number): { label: string; color: string; advice: string } {
  if (uv < 3) return { label: 'Low', color: '#10b981', advice: 'No protection needed. Safe outdoors.' };
  if (uv < 6) return { label: 'Moderate', color: '#f59e0b', advice: 'Wear sun protection during midday.' };
  if (uv < 8) return { label: 'High', color: '#f97316', advice: 'Protection essential. Seek shade.' };
  if (uv < 11) return { label: 'Very High', color: '#ef4444', advice: 'Extra precautions. Avoid midday sun.' };
  return { label: 'Extreme', color: '#a855f7', advice: 'Take full precautions. Skin burns rapidly.' };
}

/**
 * Calculate AQI category
 */
export function getAqiCategory(aqi: number): { label: string; color: string; advice: string } {
  if (aqi <= 50) return { label: 'Good', color: '#10b981', advice: 'Air quality is considered satisfactory.' };
  if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', advice: 'Acceptable for most; sensitive individuals take care.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#f97316', advice: 'Members of sensitive groups may experience health effects.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', advice: 'Everyone may begin to experience health effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#9333ea', advice: 'Health alert: increased risk for everyone.' };
  return { label: 'Hazardous', color: '#7f1d1d', advice: 'Health warning of emergency conditions.' };
}

/**
 * Humidity comfort level
 */
export function getHumidityComfort(humidity: number): { label: string; status: 'dry' | 'comfortable' | 'humid' } {
  if (humidity < 30) return { label: 'Dry & Crisp', status: 'dry' };
  if (humidity <= 60) return { label: 'Optimal Comfort', status: 'comfortable' };
  if (humidity <= 75) return { label: 'Humid & Moist', status: 'humid' };
  return { label: 'Very Muggy', status: 'humid' };
}

/**
 * Pressure trend interpretation
 */
export function getPressureTrend(hPa: number): string {
  if (hPa > 1020) return 'High Pressure (Fair Weather)';
  if (hPa < 1005) return 'Low Pressure (Precipitation Expected)';
  return 'Standard Atmospheric Pressure';
}

/**
 * Network Logger listener type
 */
type NetworkLogListener = (log: ApiNetworkLog) => void;
const networkListeners: Set<NetworkLogListener> = new Set();

export function subscribeNetworkLogs(listener: NetworkLogListener): () => void {
  networkListeners.add(listener);
  return () => networkListeners.delete(listener);
}

function broadcastLog(log: ApiNetworkLog) {
  networkListeners.forEach((fn) => {
    try {
      fn(log);
    } catch (e) {
      console.error('Error in network logger listener', e);
    }
  });
}

/**
 * Custom Error class with HTTP status code and network context
 */
export class WeatherApiError extends Error {
  status?: number;
  url?: string;
  isNetworkError: boolean;

  constructor(message: string, options?: { status?: number; url?: string; isNetworkError?: boolean }) {
    super(message);
    this.name = 'WeatherApiError';
    this.status = options?.status;
    this.url = options?.url;
    this.isNetworkError = !!options?.isNetworkError;
  }
}

/**
 * Robust fetch wrapper using modern Fetch API + AbortController + timing
 */
async function fetchWithTelemetry<T>(
  url: string,
  options?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<T> {
  const startTime = performance.now();
  const id = Math.random().toString(36).substring(2, 9);
  const timeoutMs = options?.timeoutMs || 10000;

  // Setup abort controller with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Network request timed out after ${timeoutMs}ms`));
  }, timeoutMs);

  // Link caller signal if present
  if (options?.signal) {
    options.signal.addEventListener('abort', () => controller.abort(options.signal?.reason));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage =
      err.name === 'AbortError'
        ? err.message || 'Request aborted'
        : !navigator.onLine
        ? 'No internet connection. Please check your network.'
        : `Network connection failed: ${err.message || 'Server unreachable'}`;

    broadcastLog({
      id,
      url,
      method: 'GET',
      timestamp: new Date().toLocaleTimeString(),
      status: 0,
      statusText: err.name || 'NetworkError',
      durationMs,
      ok: false,
      data: null,
      error: errorMessage,
    });

    throw new WeatherApiError(errorMessage, {
      url,
      isNetworkError: true,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  const durationMs = Math.round(performance.now() - startTime);

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson?.reason) {
        errorDetails += `: ${errJson.reason}`;
      }
    } catch {
      // ignore
    }

    broadcastLog({
      id,
      url,
      method: 'GET',
      timestamp: new Date().toLocaleTimeString(),
      status: response.status,
      statusText: response.statusText,
      durationMs,
      ok: false,
      data: null,
      error: errorDetails,
    });

    if (response.status === 404) {
      throw new WeatherApiError('Requested weather resource was not found (404).', { status: 404, url });
    } else if (response.status === 429) {
      throw new WeatherApiError('API rate limit reached. Please wait a moment before trying again.', { status: 429, url });
    } else if (response.status >= 500) {
      throw new WeatherApiError('Public Weather API service is temporarily unavailable (Server 5xx).', { status: response.status, url });
    } else {
      throw new WeatherApiError(`Weather data request failed: ${errorDetails}`, { status: response.status, url });
    }
  }

  try {
    const rawText = await response.text();
    const data = JSON.parse(rawText) as T;

    broadcastLog({
      id,
      url,
      method: 'GET',
      timestamp: new Date().toLocaleTimeString(),
      status: response.status,
      statusText: response.statusText,
      durationMs,
      ok: true,
      data,
      sizeBytes: rawText.length,
    });

    return data;
  } catch (parseError: any) {
    broadcastLog({
      id,
      url,
      method: 'GET',
      timestamp: new Date().toLocaleTimeString(),
      status: response.status,
      statusText: 'JSON Parse Error',
      durationMs,
      ok: false,
      data: null,
      error: `Failed to parse JSON response: ${parseError.message}`,
    });

    throw new WeatherApiError(`Invalid JSON payload received from weather API: ${parseError.message}`, {
      status: 200,
      url,
    });
  }
}

/**
 * Fetch detailed weather forecast for given coordinates
 */
export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  units: {
    temperature: TemperatureUnit;
    windSpeed: WindSpeedUnit;
    precipitation: PrecipitationUnit;
  },
  signal?: AbortSignal
): Promise<WeatherApiResponse> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'visibility',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    temperature_unit: units.temperature,
    wind_speed_unit: units.windSpeed,
    precipitation_unit: units.precipitation,
    timezone: 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  return await fetchWithTelemetry<WeatherApiResponse>(url, { signal });
}

/**
 * Fetch Air Quality metrics for given coordinates
 */
export async function fetchAirQuality(lat: number, lon: number, signal?: AbortSignal): Promise<AirQualityData> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    current: ['us_aqi', 'european_aqi', 'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone'].join(','),
    timezone: 'auto',
  });

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`;
  return await fetchWithTelemetry<AirQualityData>(url, { signal });
}

/**
 * Search city coordinates using Geocoding API
 */
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const params = new URLSearchParams({
    name: trimmed,
    count: '8',
    language: 'en',
    format: 'json',
  });

  const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;
  const response = await fetchWithTelemetry<{ results?: GeoLocationResult[] }>(url, { signal });
  return response.results || [];
}

/**
 * Reverse geocode coordinates to approximate location name
 */
export async function reverseGeocode(lat: number, lon: number, signal?: AbortSignal): Promise<GeoLocationResult | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`;
    const res = await fetchWithTelemetry<{ results?: GeoLocationResult[] }>(url, { signal });
    if (res.results && res.results.length > 0) return res.results[0];
  } catch {
    // fallback
  }

  // Fallback to coordinates label
  return {
    id: Date.now(),
    name: `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°`,
    latitude: lat,
    longitude: lon,
    country: 'Local Coordinates',
    country_code: 'GPS',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
}
