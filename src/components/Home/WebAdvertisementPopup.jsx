import { useCallback, useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";

const WEB_ADVERTISEMENTS_URL =
  "https://api.cyberawareness.ngo/api/get-banner?limit=all";

const getAdvertisementPlatforms = (advertisement) => {
  if (Array.isArray(advertisement?.platforms)) {
    return advertisement.platforms.map((platform) =>
      String(platform).trim().toUpperCase(),
    );
  }

  const value = advertisement?.platforms || advertisement?.platform || "";
  return String(value)
    .split(",")
    .map((platform) => platform.trim().toUpperCase())
    .filter(Boolean);
};

const isWebAdvertisement = (advertisement) => {
  const platforms = getAdvertisementPlatforms(advertisement);
  return platforms.includes("WEB") || platforms.includes("ALL");
};

const dismissalKey = (advertisement) =>
  `web-advertisement-dismissed:${advertisement.id || advertisement.link}`;

export default function WebAdvertisementPopup() {
  const [advertisement, setAdvertisement] = useState(null);

  const dismiss = useCallback(() => {
    if (!advertisement) return;
    sessionStorage.setItem(dismissalKey(advertisement), "true");
    setAdvertisement(null);
  }, [advertisement]);

  useEffect(() => {
    const controller = new AbortController();

    const loadAdvertisement = async () => {
      try {
        const response = await fetch(WEB_ADVERTISEMENTS_URL, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Advertisement request failed");

        const payload = await response.json();
        const webAdvertisement = (Array.isArray(payload?.data) ? payload.data : [])
          .filter(
            (item) =>
              item?.link && isWebAdvertisement(item),
          )
          .sort(
            (first, second) =>
              Number(first?.display_order || 0) -
              Number(second?.display_order || 0),
          )
          .find((item) => !sessionStorage.getItem(dismissalKey(item)));

        if (webAdvertisement) setAdvertisement(webAdvertisement);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Unable to load web advertisement", error);
        }
      }
    };

    loadAdvertisement();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!advertisement) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [advertisement, dismiss]);

  if (!advertisement) return null;

  const image = (
    <img
      src={advertisement.link}
      alt="Advertisement"
      className="block max-h-[75vh] w-full object-contain"
    />
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/75 p-2 text-white transition hover:bg-black"
          aria-label="Close advertisement"
        >
          <X size={20} />
        </button>

        {advertisement.target_url ? (
          <a
            href={advertisement.target_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="block"
          >
            {image}
            <span className="flex items-center justify-center gap-2 bg-gray-950 px-4 py-3 text-sm font-semibold text-white">
              Visit advertiser <ExternalLink size={16} />
            </span>
          </a>
        ) : (
          image
        )}
      </div>
    </div>
  );
}
