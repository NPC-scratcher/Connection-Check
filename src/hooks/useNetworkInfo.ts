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
    const fetchWithTimeout = async (url: string, timeout = 5000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
      } catch (e) {
        clearTimeout(id);
        throw e;
      }
    };

    const getInfo = async () => {
      setLoading(true);
      
      // Intento 1: ipwho.is (Suele ser muy fiable y sin CORS)
      try {
        const res = await fetchWithTimeout('https://ipwho.is/');
        const data = await res.json();
        if (data.success) {
          setInfo({
            ip: data.ip,
            isp: data.connection?.isp || data.connection?.org || 'Desconocido',
            city: data.city || 'Desconocida',
            country_name: data.country || 'Desconocido',
            org: data.connection?.asn?.toString() || ''
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('ipwho.is falló, intentando ipapi.co...', e);
      }

      // Intento 2: ipapi.co
      try {
        const res = await fetchWithTimeout('https://ipapi.co/json/');
        const data = await res.json();
        if (!data.error) {
          setInfo({
            ip: data.ip,
            isp: data.org || data.isp || 'Desconocido',
            city: data.city || 'Desconocida',
            country_name: data.country_name || 'Desconocido',
            org: data.asn || ''
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('ipapi.co falló, intentando ipify...', e);
      }

      // Intento 3: Cloudflare Trace (Muy fiable si el usuario está en Cloudflare)
      try {
        const res = await fetchWithTimeout('https://www.cloudflare.com/cdn-cgi/trace');
        const text = await res.text();
        const lines = text.split('\n');
        const data: any = {};
        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) data[key] = value;
        });
        
        if (data.ip) {
          setInfo({
            ip: data.ip,
            isp: 'Cloudflare Network',
            city: 'Ubicación aproximada (' + data.loc + ')',
            country_name: data.loc || 'Desconocido',
            org: 'AS' + (data.as || '')
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Cloudflare trace falló, intentando ipify...', e);
      }

      // Intento 4: freeipapi.com (Muy fiable y sin registro)
      try {
        const res = await fetchWithTimeout('https://freeipapi.com/api/json');
        const data = await res.json();
        if (data.ipAddress) {
          setInfo({
            ip: data.ipAddress,
            isp: data.org || 'Desconocido',
            city: data.cityName || 'Desconocida',
            country_name: data.countryName || 'Desconocido',
            org: data.asn || ''
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('freeipapi.com falló, intentando ipify...', e);
      }

      // Fallback final: ipify (Solo IP)
      try {
        const res = await fetchWithTimeout('https://api.ipify.org?format=json');
        const data = await res.json();
        setInfo({
          ip: data.ip,
          isp: 'Proveedor no detectado',
          city: 'Ubicación no detectada',
          country_name: '',
          org: ''
        });
      } catch (e) {
        console.error('Todos los intentos de obtener info de red fallaron:', e);
      } finally {
        setLoading(false);
      }
    };

    getInfo();
  }, []);

  return { info, loading };
}
