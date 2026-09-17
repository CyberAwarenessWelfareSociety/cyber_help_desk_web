import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BannerCarousel = ({ banners, bannerIndex, setBannerIndex }) => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative rounded-xl overflow-hidden h-56 md:h-80 bg-gray-200">
          {banners.length > 0 ? (
            <img
              src={banners[bannerIndex]}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No banners available
            </div>
          )}

          {banners.length > 1 && (
            <>
              <button
                onClick={() =>
                  setBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={() => setBannerIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BannerCarousel;
