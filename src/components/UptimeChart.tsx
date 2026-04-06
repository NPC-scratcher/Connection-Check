import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DisconnectionEvent } from '../hooks/useConnectionMonitor';
import { isSameDay } from '../lib/utils';
import { useSettings } from '../hooks/useSettings';
import { translations } from '../lib/translations';

export function UptimeChart({ events }: { events: DisconnectionEvent[] }) {
  const { settings } = useSettings();
  const t = translations[settings.language];

  // Generate data for the last 7 days
  const data = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    
    const dayEvents = events.filter(e => isSameDay(new Date(e.disconnectTime), d));
    const downtime = dayEvents.reduce((acc, e) => acc + (e.duration || 0), 0);
    const totalMs = 24 * 60 * 60 * 1000;
    const uptime = Math.max(0, 100 - (downtime / totalMs) * 100);

    return {
      name: d.toLocaleDateString(settings.language === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' }),
      uptime: Number(uptime.toFixed(2))
    };
  });

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-colors">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t.stability}</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `${val}%`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`${value}%`, 'Uptime']}
            />
            <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
