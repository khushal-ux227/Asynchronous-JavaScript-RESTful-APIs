/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  WeatherApiResponse,
  GeoLocationResult,
  AirQualityData,
  WeatherConditionInfo,
  ApiNetworkLog,
  TemperatureUnit,
  WindSpeedUnit,
  PrecipitationUnit,
} from './types/weather';
import {
  fetchWeatherForecast,
  fetchAirQuality,
  reverseGeocode,
  getWeatherCondition,
  subscribeNetworkLogs,
  WeatherApiError,
} from './services/weatherApi';
import { SearchBar, POPULAR_CITIES } from './components/SearchBar';
import { HeroWeatherCard } from './components/HeroWeatherCard';
import { MetricsGrid } from './components/MetricsGrid';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { JsonInspectorModal } from './components/JsonInspectorModal';
import { SavedLocationsBar } from './components/SavedLocationsBar';
import {
  RefreshCw,
  Activity,
  AlertTriangle,
  WifiOff,
  CloudLightning,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';

const STORAGE_KEY_BOOKMARKS = 'nimbus_bookmarked_cities_v1';
const STORAGE_KEY_LAST_CITY = 'nimbus_last_selected_city_v1';
const STORAGE_KEY_TEMP_UNIT = 'nimbus_temp_unit_v1';

export default function App() {
  // Settings & Preferences
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem(STORAGE_KEY_TEMP_UNIT) as TemperatureUnit) || 'celsius';
  });
  const [windSpeedUnit, setWindSpeedUnit] = useState<WindSpeedUnit>('kmh');
  const [precipitationUnit, setPrecipitationUnit] = useState<PrecipitationUnit>('mm');

  // Location & Weather Data
  const [currentLocation, setCurrentLocation] = useState<GeoLocationResult>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAST_CITY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return POPULAR_CITIES[0]; // Default to Tokyo
  });

  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [condition, setCondition] = useState<WeatherConditionInfo>(getWeatherCondition(0));

  // Network, Telemetry & UI States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [networkLogs, setNetworkLogs] = useState<ApiNetworkLog[]>([]);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [bookmarkedLocations, setBookmarkedLocations] = useState<GeoLocationResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const fetchControllerRef = useRef<AbortController | null>(null);

  // Subscribe to real-time network logs
  useEffect(() => {
    const unsubscribe = subscribeNetworkLogs((newLog) => {
      setNetworkLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    });
    return unsubscribe;
  }, []);

  // Listen to browser online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_CITY, JSON.stringify(currentLocation));
    } catch {}
  }, [currentLocation]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedLocations));
    } catch {}
  }, [bookmarkedLocations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMP_UNIT, temperatureUnit);
    } catch {}
  }, [temperatureUnit]);

  // Core Asynchronous Fetch Function
  const fetchWeather = useCallback(
    async (location: GeoLocationResult, isBackgroundRefresh = false) => {
      // Abort previous in-flight weather request
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }

      const controller = new AbortController();
      fetchControllerRef.current = controller;

      if (!isBackgroundRefresh) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        // Fetch weather and air quality concurrently using modern async/await
        const [weatherRes, airQualityRes] = await Promise.all([
          fetchWeatherForecast(
            location.latitude,
            location.longitude,
            {
              temperature: temperatureUnit,
              windSpeed: windSpeedUnit,
              precipitation: precipitationUnit,
            },
            controller.signal
          ),
          fetchAirQuality(location.latitude, location.longitude, controller.signal).catch((err) => {
            console.warn('Air quality data unavailable:', err);
            return null;
          }),
        ]);

        setWeatherData(weatherRes);
        setAirQualityData(airQualityRes);
        setCondition(getWeatherCondition(weatherRes.current.weather_code));
        setLastUpdated(new Date());
        setError(null);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Weather data fetch failure:', err);
        if (err instanceof WeatherApiError) {
          setError(err.message);
        } else if (!navigator.onLine) {
          setError('No internet connection. Please verify your network and retry.');
        } else {
          setError('Unable to retrieve atmospheric metrics from the public REST API. Please retry.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [temperatureUnit, windSpeedUnit, precipitationUnit]
  );

  // Trigger fetch when location or units change
  useEffect(() => {
    fetchWeather(currentLocation);
    return () => {
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, [currentLocation, temperatureUnit, windSpeedUnit, precipitationUnit, fetchWeather]);

  // Auto-refresh interval (polling every 60 seconds)
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      fetchWeather(currentLocation, true);
    }, 60000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, currentLocation, fetchWeather]);

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const resolvedLocation = await reverseGeocode(latitude, longitude);
          if (resolvedLocation) {
            setCurrentLocation(resolvedLocation);
          } else {
            setCurrentLocation({
              id: Date.now(),
              name: 'My GPS Location',
              latitude,
              longitude,
              country: 'Local',
              country_code: 'GPS',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
            });
          }
        } catch (err) {
          console.error('Geocoding coordinates failed', err);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission was denied. Please select a city manually from the search bar.');
        } else if (err.code === err.TIMEOUT) {
          setError('Location request timed out. Please retry or choose a city.');
        } else {
          setError('Unable to determine your physical location coordinates.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Toggle bookmark for current city
  const isBookmarked = bookmarkedLocations.some((b) => b.id === currentLocation.id);
  const handleToggleBookmark = () => {
    if (isBookmarked) {
      setBookmarkedLocations((prev) => prev.filter((b) => b.id !== currentLocation.id));
    } else {
      setBookmarkedLocations((prev) => [...prev, currentLocation]);
    }
  };

  const handleRemoveBookmark = (cityId: number) => {
    setBookmarkedLocations((prev) => prev.filter((b) => b.id !== cityId));
  };

  // Toggle unit Celsius <-> Fahrenheit
  const toggleTemperatureUnit = () => {
    const nextUnit: TemperatureUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTemperatureUnit(nextUnit);
    setWindSpeedUnit(nextUnit === 'celsius' ? 'kmh' : 'mph');
    setPrecipitationUnit(nextUnit === 'celsius' ? 'mm' : 'inch');
  };

  const latestLatency = networkLogs[0]?.durationMs ?? null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-white font-sans antialiased">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-rose-950/90 border-b border-rose-800 text-rose-200 px-4 py-2.5 text-xs flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">
              You are currently offline. Displaying cached atmospheric data. Reconnecting...
            </span>
          </div>
          <button
            onClick={() => fetchWeather(currentLocation)}
            className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-100 rounded-lg text-xs font-semibold border border-rose-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 border-b border-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-slate-950">
              <CloudLightning className="w-5 h-5 fill-white stroke-slate-950 stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-base sm:text-lg text-white">
                  NIMBUS PULSE
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50">
                  LIVE REST API
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Real-Time Meteorological Data & Async JSON Engine
              </p>
            </div>
          </div>

          {/* Search bar in center */}
          <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 max-w-md">
            <SearchBar
              onSelectCity={(city) => setCurrentLocation(city)}
              onUseCurrentLocation={handleUseCurrentLocation}
              isLocating={isLocating}
            />
          </div>

          {/* Controls: Unit toggle, Auto-refresh, Manual refresh, Inspector */}
          <div className="order-2 sm:order-3 flex items-center gap-2 shrink-0">
            {/* Unit Switcher */}
            <button
              onClick={toggleTemperatureUnit}
              title={`Switch to ${temperatureUnit === 'celsius' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono font-semibold rounded-xl text-slate-200 hover:text-white transition-all"
            >
              <span className={temperatureUnit === 'celsius' ? 'text-sky-400 font-bold' : 'text-slate-500'}>°C</span>
              <span className="text-slate-600 mx-1">/</span>
              <span className={temperatureUnit === 'fahrenheit' ? 'text-sky-400 font-bold' : 'text-slate-500'}>°F</span>
            </button>

            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              title={autoRefreshEnabled ? 'Live auto-refresh enabled (60s interval)' : 'Auto-refresh paused'}
              className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                autoRefreshEnabled
                  ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  autoRefreshEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span className="hidden md:inline text-[11px]">
                {autoRefreshEnabled ? 'Live' : 'Paused'}
              </span>
            </button>

            {/* Manual Refresh button */}
            <button
              onClick={() => fetchWeather(currentLocation, true)}
              disabled={isRefreshing || isLoading}
              title="Refresh weather data now"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* REST Inspector button */}
            <button
              onClick={() => setIsInspectorOpen(true)}
              title="Inspect Raw REST JSON and API logs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/50 text-sky-300 text-xs font-medium transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline">REST Inspector</span>
              {latestLatency !== null && (
                <span className="font-mono text-[10px] text-teal-300 bg-teal-950/80 px-1 rounded">
                  {latestLatency}ms
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Saved Hubs and Bookmark Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5">
          <SavedLocationsBar
            currentLocation={currentLocation}
            bookmarkedLocations={bookmarkedLocations}
            onSelectCity={(city) => setCurrentLocation(city)}
            onRemoveBookmark={handleRemoveBookmark}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification Card */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 flex items-start justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-rose-200">
                  Network Request Issue
                </h4>
                <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchWeather(currentLocation)}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-900 hover:bg-rose-800 text-white rounded-xl border border-rose-700 shrink-0 transition-colors"
            >
              Retry Fetch
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 bg-slate-900/60 rounded-3xl border border-slate-800" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-36 bg-slate-900/40 rounded-2xl border border-slate-800/60" />
              ))}
            </div>
          </div>
        )}

        {/* Weather Dashboard Core View */}
        {weatherData && (
          <div className="space-y-6">
            {/* 1. Hero Card */}
            <HeroWeatherCard
              weather={weatherData}
              location={currentLocation}
              condition={condition}
              temperatureUnit={temperatureUnit}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* 2. Key Atmospheric Metrics Grid */}
            <MetricsGrid
              weather={weatherData}
              airQuality={airQualityData}
              temperatureUnit={temperatureUnit}
            />

            {/* 3. 24-Hour Hourly Trajectory */}
            <HourlyForecast
              hourly={weatherData.hourly}
              temperatureUnit={temperatureUnit}
              windSpeedUnit={weatherData.current_units?.wind_speed_10m || 'km/h'}
            />

            {/* 4. 7-Day Synoptic Outlook */}
            <DailyForecast
              daily={weatherData.daily}
              temperatureUnit={temperatureUnit}
              windSpeedUnit={weatherData.current_units?.wind_speed_10m || 'km/h'}
            />
          </div>
        )}

        {/* Last updated footer stamp */}
        {lastUpdated && (
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-900">
            <div>
              <span>Live synchrony via </span>
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:underline"
              >
                Open-Meteo RESTful API
              </a>
              <span> · Coordinates: {currentLocation.latitude.toFixed(4)}°, {currentLocation.longitude.toFixed(4)}°</span>
            </div>
            <div className="font-mono tabular-nums text-[11px]">
              Last refreshed: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        )}
      </main>

      {/* Dedicated REST API & Complex Nested JSON Explorer Modal */}
      <JsonInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        jsonData={weatherData}
        networkLogs={networkLogs}
      />
    </div>
  );
}
