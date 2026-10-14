import React from 'react';
import { GeoLocationResult } from '../types/weather';
import { POPULAR_CITIES } from './SearchBar';
import { Bookmark, Sparkles, X, MapPin } from 'lucide-react';

interface SavedLocationsBarProps {
  currentLocation: GeoLocationResult;
  bookmarkedLocations: GeoLocationResult[];
  onSelectCity: (city: GeoLocationResult) => void;
  onRemoveBookmark: (cityId: number) => void;
}

export const SavedLocationsBar: React.FC<SavedLocationsBarProps> = ({
  currentLocation,
  bookmarkedLocations,
  onSelectCity,
  onRemoveBookmark,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1">
      {/* Popular locations label */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 font-medium mr-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Hubs:</span>
      </div>

      {/* Popular Hubs */}
      {POPULAR_CITIES.map((city) => {
        const isActive =
          Math.abs(city.latitude - currentLocation.latitude) < 0.05 &&
          Math.abs(city.longitude - currentLocation.longitude) < 0.05;

        return (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
              isActive
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{city.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">{city.country_code}</span>
          </button>
        );
      })}

      {/* Bookmarked locations if any */}
      {bookmarkedLocations.length > 0 && (
        <>
          <div className="h-4 w-px bg-slate-800 shrink-0 mx-1" />
          <div className="flex items-center gap-1 text-xs text-amber-400/90 shrink-0 font-medium">
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Saved:</span>
          </div>

          {bookmarkedLocations.map((city) => {
            const isActive =
              Math.abs(city.latitude - currentLocation.latitude) < 0.05 &&
              Math.abs(city.longitude - currentLocation.longitude) < 0.05;

            return (
              <div
                key={city.id}
                className={`group px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => onSelectCity(city)}
                  className="flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{city.name}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(city.id);
                  }}
                  title="Remove bookmark"
                  className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
