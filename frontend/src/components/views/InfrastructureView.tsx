import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { 
  Server, 
  Database, 
  RefreshCw, 
  Radio, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

interface HealthData {
  success: boolean;
  message: string;
  data: {
    database: {
      driver: string;
      database: string;
      status: string;
    };
    redis: {
      client: string;
      status: string;
    };
    reverb: {
      host: string;
      port: number;
    };
  };
  meta: {
    timestamp: string;
    environment: string;
  };
}

export const InfrastructureView: React.FC = () => {
  const { data: health, isLoading, refetch, isFetching } = useQuery<HealthData>({
    queryKey: ['healthStatus'],
    queryFn: async () => {
      const res = await apiClient.get<HealthData>('/health');
      return res.data;
    },
    refetchInterval: 15000,
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sky-100 text-sky-600 shrink-0">
              <Server className="h-5 w-5" />
            </div>
            <span>Status Fondasi Infrastruktur (Sprint 0)</span>
          </h2>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 text-xs font-semibold transition border border-slate-200 shadow-2xs active:scale-[0.98] touch-manipulation"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin text-sky-600' : 'text-slate-500'}`} />
            <span>Refresh Status</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          PostgreSQL 18+ (ULID CHAR 26 & JSONB GIN Index), Redis 7+ buffer session, dan Laravel Reverb native WebSocket.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {/* PostgreSQL Card */}
        <div className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-5 space-y-3.5 sm:space-y-4 shadow-sm hover:border-sky-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-2xs">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">PostgreSQL 18+</h3>
                <p className="text-xs text-slate-500">Primary Key ULID (CHAR 26)</p>
              </div>
            </div>
            {health?.data.database.status === 'connected' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                <XCircle className="h-3 w-3" /> {isLoading ? 'Checking...' : 'Offline'}
              </span>
            )}
          </div>
          <div className="text-xs space-y-2 pt-3 border-t border-slate-100 text-slate-600">
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-slate-900 font-mono font-medium">{health?.data.database.database ?? 'db_learn_flow'}</span>
            </div>
            <div className="flex justify-between">
              <span>JSONB & GIN Index:</span>
              <span className="text-sky-700 font-semibold">Didukung Penuh</span>
            </div>
          </div>
        </div>

        {/* Redis Card */}
        <div className="rounded-2xl border border-orange-100 bg-white p-5 space-y-4 shadow-sm hover:border-orange-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 shadow-2xs">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Redis 7+ Cache</h3>
                <p className="text-xs text-slate-500">Predis Client Driver</p>
              </div>
            </div>
            {health?.data.redis.status === 'connected' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                <XCircle className="h-3 w-3" /> {isLoading ? 'Checking...' : 'Offline'}
              </span>
            )}
          </div>
          <div className="text-xs space-y-2 pt-3 border-t border-slate-100 text-slate-600">
            <div className="flex justify-between">
              <span>Driver Client:</span>
              <span className="text-slate-900 font-mono font-medium">{health?.data.redis.client ?? 'predis'}</span>
            </div>
            <div className="flex justify-between">
              <span>Exam Session Buffer:</span>
              <span className="text-orange-600 font-semibold">Siap Digunakan</span>
            </div>
          </div>
        </div>

        {/* Reverb WebSocket Card */}
        <div className="rounded-2xl border border-blue-100 bg-white p-5 space-y-4 shadow-sm hover:border-blue-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Laravel Reverb</h3>
                <p className="text-xs text-slate-500">Native WebSocket Server</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" /> Port 8080
            </span>
          </div>
          <div className="text-xs space-y-2 pt-3 border-t border-slate-100 text-slate-600">
            <div className="flex justify-between">
              <span>Listening:</span>
              <span className="text-slate-900 font-mono font-medium">0.0.0.0:8080</span>
            </div>
            <div className="flex justify-between">
              <span>Pusher Protocol:</span>
              <span className="text-blue-600 font-semibold">Terintegrasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
