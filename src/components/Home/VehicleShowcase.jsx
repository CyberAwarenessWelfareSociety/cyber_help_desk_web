import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VehicleShowcase = ({ images, index, setIndex }) => (
  <div className="relative">
    <div className="rounded-xl overflow-hidden h-72 bg-gray-100">
      <img src={images[index]} alt="Vehicle" className="w-full h-full object-cover" />

      <button
        onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => setIndex((i) => (i + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
      >
        <ChevronRight />
      </button>
    </div>
  </div>
);

export default VehicleShowcase;
