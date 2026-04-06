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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Usamos ipwho.is para obtener datos de la red de forma gratuita y sin CORS
    fetch('https://ipwho.is/', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeoutId);
        if (!data.success) throw new Error(data.message || 'Error fetching info');
        setInfo({
          ip: data.ip,
          isp: data.connection?.isp || data.connection?.org || 'Desconocido',
          city: data.city || 'Desconocida',
          country_name: data.country || 'Desconocido',
          org: data.connection?.asn?.toString() || ''
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

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return { info, loading };
}
