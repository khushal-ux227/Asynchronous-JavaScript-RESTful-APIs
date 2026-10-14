import React, { useState } from 'react';
import { ApiNetworkLog } from '../types/weather';
import {
  Code,
  Activity,
  Copy,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Search,
  ExternalLink,
  Wifi,
  FileJson,
} from 'lucide-react';

interface JsonInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: any;
  networkLogs: ApiNetworkLog[];
  currentEndpoint?: string;
}

export const JsonInspectorModal: React.FC<JsonInspectorModalProps> = ({
  isOpen,
  onClose,
  jsonData,
  networkLogs,
  currentEndpoint,
}) => {
  const [activeTab, setActiveTab] = useState<'tree' | 'logs' | 'code'>('tree');
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({
    root: true,
    'root.current': true,
    'root.current_units': false,
    'root.hourly': false,
    'root.daily': false,
  });

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpand = (path: string) => {
    setExpandedPaths((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const latestLog = networkLogs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  REST API & JSON Inspector
                </h3>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                  HTTP 200 OK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect raw payloads, async fetch telemetry, and nested data trees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium border border-slate-700"
              title="Copy Full JSON"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry quick bar */}
        {latestLog && (
          <div className="px-6 py-2 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2 truncate max-w-md">
              <span className="text-sky-400 font-bold">{latestLog.method}</span>
              <span className="truncate text-slate-300">{latestLog.url}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] shrink-0">
              <span className="flex items-center gap-1 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                {latestLog.durationMs}ms latency
              </span>
              {latestLog.sizeBytes && (
                <span className="text-slate-300">
                  {(latestLog.sizeBytes / 1024).toFixed(1)} KB payload
                </span>
              )}
              <span className="text-slate-500">{latestLog.timestamp}</span>
            </div>
          </div>
        )}

        {/* Tab navigation buttons */}
        <div className="px-6 pt-3 bg-slate-900 border-b border-slate-800 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tree'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Interactive JSON Tree</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Network Fetch Logs ({networkLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Async JavaScript Code</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs">
          {activeTab === 'tree' && (
            <div>
              {/* Search filter input */}
              <div className="relative mb-4">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter keys or properties (e.g., temperature, wind, humidity)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* JSON tree render */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 overflow-x-auto">
                <JsonTreeRenderer
                  data={jsonData}
                  path="root"
                  filter={searchFilter}
                  expandedPaths={expandedPaths}
                  onToggle={toggleExpand}
                />
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              {networkLogs.length === 0 ? (
                <div className="text-slate-500 text-center py-8">
                  No network requests recorded yet.
                </div>
              ) : (
                networkLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sky-400">{log.method}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            log.ok
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {log.status > 0 ? log.status : 'ERR'} {log.statusText}
                        </span>
                        <span className="text-slate-500">{log.timestamp}</span>
                      </div>
                      <span className="text-teal-400 text-[11px] font-semibold">
                        {log.durationMs}ms
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 break-all bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                      {log.url}
                    </div>

                    {log.error && (
                      <div className="text-[11px] text-rose-400 bg-rose-950/20 p-2 rounded-lg border border-rose-900/40">
                        Error: {log.error}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="text-slate-300 font-sans text-sm">
                This dashboard uses modern <strong>Fetch API</strong> with <strong>async/await</strong>, robust error handling, and <strong>AbortController</strong> for cancelling stale requests:
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-200 overflow-x-auto leading-relaxed">
{`// Modern Asynchronous JavaScript REST Client
async function fetchWeatherForecast(lat, lon, units, signal) {
  // Construct URL with query parameters
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    hourly: 'temperature_2m,precipitation_probability,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
    temperature_unit: units.temperature,
    wind_speed_unit: units.windSpeed,
    timezone: 'auto'
  });

  const url = \`https://api.open-meteo.com/v1/forecast?\${params.toString()}\`;

  try {
    // Asynchronous network request with cancellation signal
    const response = await fetch(url, {
      signal,
      headers: { 'Accept': 'application/json' }
    });

    // Check HTTP status code
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    // Parse nested JSON response payload
    const data = await response.json();
    return data;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Request was cancelled.');
    } else {
      console.error('Network or parsing failure:', error.message);
      throw error;
    }
  }
}`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Recursive JSON tree component
const JsonTreeRenderer: React.FC<{
  data: any;
  path: string;
  filter: string;
  expandedPaths: Record<string, boolean>;
  onToggle: (path: string) => void;
}> = ({ data, path, filter, expandedPaths, onToggle }) => {
  if (data === null) return <span className="text-rose-400">null</span>;
  if (data === undefined) return <span className="text-slate-600">undefined</span>;

  if (typeof data === 'boolean') {
    return <span className="text-amber-400">{data ? 'true' : 'false'}</span>;
  }
  if (typeof data === 'number') {
    return <span className="text-emerald-400 font-semibold">{data}</span>;
  }
  if (typeof data === 'string') {
    return <span className="text-sky-300">"{data}"</span>;
  }

  const isArray = Array.isArray(data);
  const isExpanded = expandedPaths[path] ?? false;
  const entries = Object.entries(data);

  // If array is very long, summarize it
  if (isArray && data.length > 12 && !isExpanded) {
    return (
      <span
        onClick={() => onToggle(path)}
        className="cursor-pointer text-slate-400 hover:text-slate-200"
      >
        Array({data.length}) [ <span className="text-sky-400 text-[10px]">click to expand</span> ]
      </span>
    );
  }

  return (
    <div className="pl-3 border-l border-slate-800/60 my-0.5">
      <div
        onClick={() => onToggle(path)}
        className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-200 select-none py-0.5"
      >
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        )}
        <span className="font-semibold text-slate-300">
          {path.split('.').pop()}
        </span>
        <span className="text-slate-500 text-[10px]">
          {isArray ? `[${data.length}]` : `{${entries.length}}`}
        </span>
      </div>

      {isExpanded && (
        <div className="space-y-0.5 mt-0.5">
          {entries.map(([key, val]) => {
            const childPath = `${path}.${key}`;
            const matchesFilter =
              !filter ||
              key.toLowerCase().includes(filter.toLowerCase()) ||
              (typeof val === 'string' && val.toLowerCase().includes(filter.toLowerCase()));

            if (filter && !matchesFilter && typeof val !== 'object') {
              return null;
            }

            return (
              <div key={key} className="flex items-start gap-1 py-0.5 text-[11px]">
                <span className="text-indigo-400 font-medium">{key}:</span>
                <JsonTreeRenderer
                  data={val}
                  path={childPath}
                  filter={filter}
                  expandedPaths={expandedPaths}
                  onToggle={onToggle}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
