import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation, AlertCircle } from 'lucide-react';
import { searchCities } from '../services/weatherApi';
import { GeoLocationResult } from '../types/weather';

interface SearchBarProps {
  onSelectCity: (city: GeoLocationResult) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const POPULAR_CITIES: GeoLocationResult[] = [
  { id: 1850147, name: 'Tokyo', country: 'Japan', country_code: 'JP', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { id: 2643743, name: 'London', country: 'United Kingdom', country_code: 'GB', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', country_code: 'US', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
  { id: 2988507, name: 'Paris', country: 'France', country_code: 'FR', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
  { id: 2147714, name: 'Sydney', country: 'Australia', country_code: 'AU', latitude: -33.8678, longitude: 151.2073, timezone: 'Australia/Sydney' },
  { id: 292223, name: 'Dubai', country: 'United Arab Emirates', country_code: 'AE', latitude: 25.0772, longitude: 55.3093, timezone: 'Asia/Dubai' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced asynchronous fetch
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setSearchError(null);
      return;
    }

    // Abort prior in-flight fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query, controller.signal);
        setResults(data);
        setIsOpen(true);
        setSelectedIndex(-1);
        if (data.length === 0) {
          setSearchError(`No locations found matching "${query}". Check spelling.`);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('City search failed', err);
          setSearchError('Search request failed. Please check network.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (city: GeoLocationResult) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2 || results.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search city, district, or coordinates (e.g., Tokyo, London, Paris)..."
          aria-label="Search city or location"
          className="w-full pl-10 pr-24 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/60 shadow-lg backdrop-blur-md transition-all duration-200"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              title="Clear input"
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            title="Use current GPS location"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-sky-400 hover:text-sky-300 hover:bg-sky-950/60 rounded-lg border border-sky-800/50 transition-colors disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (results.length > 0 || searchError) && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 border border-slate-700/90 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {results.length > 0 && (
            <div className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-800/60">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const locationSubtitle = [item.admin1, item.country].filter(Boolean).join(', ');

                return (
                  <button
                    key={`${item.id}-${index}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm transition-colors ${
                      isSelected ? 'bg-sky-600/20 text-white' : 'text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                      <div className="truncate">
                        <span className="font-medium text-slate-100">{item.name}</span>
                        {locationSubtitle && (
                          <span className="ml-2 text-xs text-slate-400 font-normal">
                            {locationSubtitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-[11px] font-mono text-slate-500 tabular-nums ml-2">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {searchError && (
            <div className="px-4 py-3 text-xs text-amber-300/90 flex items-center gap-2 bg-amber-950/20">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{searchError}</span>
            </div>
          )}

          <div className="px-3.5 py-1.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Powered by Open-Meteo REST Geocoding</span>
            <span className="hidden sm:inline">Use ↑↓ keys to navigate</span>
          </div>
        </div>
      )}
    </div>
  );
};
