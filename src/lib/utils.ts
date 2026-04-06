export function formatDuration(ms: number | null): string {
  if (ms === null) return 'En curso...';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(timestamp));
}

export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function isSameMonth(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth();
}

export function isSameYear(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear();
}

export function exportToCSV(events: any[]) {
  const headers = ['ID', 'Fecha Desconexion', 'Hora Desconexion', 'Hora Reconexion', 'Duracion'];
  const rows = events.map(e => [
    e.id,
    formatDate(e.disconnectTime),
    formatTime(e.disconnectTime),
    e.reconnectTime ? formatTime(e.reconnectTime) : 'En curso',
    e.duration ? formatDuration(e.duration) : 'En curso'
  ]);
  
  const csvContent = "data:text/csv;charset=utf-8," + 
    [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `historial_conexiones_${formatDate(Date.now()).replace(/\//g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function calculateUptimeToday(events: any[]): number {
  const now = new Date();
  const dayEvents = events.filter(e => isSameDay(new Date(e.disconnectTime), now));
  
  const downtime = dayEvents.reduce((acc, e) => {
    if (e.duration) return acc + e.duration;
    // If currently disconnected, calculate downtime up to now
    return acc + (Date.now() - e.disconnectTime);
  }, 0);
  
  // Milliseconds passed today so far
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const totalMsSoFar = Date.now() - startOfDay;
  
  if (totalMsSoFar === 0) return 100;
  
  const uptime = Math.max(0, 100 - (downtime / totalMsSoFar) * 100);
  return Number(uptime.toFixed(2));
}
