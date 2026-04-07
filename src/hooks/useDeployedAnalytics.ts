import { useEffect, useState } from 'react';
import { SITE_HOST } from '@/lib/site';

/** True on production hostnames so Vercel Analytics/Speed Insights only load where scripts exist. */
export function useDeployedAnalytics(): boolean {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const h = window.location.hostname;
    setOk(h === SITE_HOST || h.endsWith('.vercel.app'));
  }, []);

  return ok;
}
