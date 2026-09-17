import { useEffect, useState, useRef } from "react";

const API_BANNERS = "https://api.cyberawareness.ngo/api/get-banner?limit=all";

export function useBanners() {
  const [banners, setBanners] = useState<string[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(API_BANNERS)
      .then(r => r.json())
      .then(json => {
        if (mounted && Array.isArray(json.data)) {
          const sorted = json.data
            .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
            .map((i: any) => i.link);
          setBanners(sorted);
        }
      })
      .catch(() => setBanners([]));

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setBannerIndex(i => (i + 1) % banners.length);
    }, 6000);
    return () => clearInterval(intervalRef.current!);
  }, [banners]);

  return { banners, bannerIndex, setBannerIndex };
}