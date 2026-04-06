import { useState, useEffect } from 'react';

export interface NetworkInfo {
  ip: string;
  isp: string;
  city: string;
  country_name: string;
  org: string;
}

export function useNetworkInfo() {
  const [info, setInfo] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos ipapi.co para obtener datos de la red de forma gratuita
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.reason);
        setInfo({
          ip: data.ip,
          isp: data.org || data.isp || 'Desconocido',
          city: data.city || 'Desconocida',
          country_name: data.country_name || 'Desconocido',
          org: data.asn || ''
        });
      })
      .catch(err => {
        console.error('Error fetching network info:', err);
        // Fallback a solo IP si falla la API detallada
        fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => setInfo({ ip: data.ip, isp: 'Desconocido', city: 'Desconocida', country_name: 'Desconocido', org: '' }))
          .catch(console.error);
      })
      .finally(() => setLoading(false));
  }, []);

  return { info, loading };
}
