import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Header from "@/components/Home/Header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import "@/styles/globals.css"; // Import your global CSS

/** Seminar/event images: prefer media_urls (new), fall back to photo (legacy). */
function getItemPhotos(item) {
  if (!item) return [];
  const normalize = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.filter((u) => typeof u === "string" && u.trim());
    }
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter((u) => typeof u === "string" && u.trim());
        }
      } catch {
        if (value.startsWith("http")) return [value];
      }
    }
    return [];
  };
  const fromMedia = normalize(item.media_urls);
  if (fromMedia.length) return fromMedia;
  return normalize(item.photo);
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 9;

  const photos = getItemPhotos(selectedItem);

  // Fetch gallery with pagination
  const fetchGallery = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.cyberawareness.ngo/api/get-gallery?limit=${limit}&page=${page}`
      );
      const result = await res.json();

      if ( result.data) {
        setGallery(result.data);
        setTotalPages(result.totalPages || Math.ceil((result.total || 0) / limit) || 1);
      }
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(currentPage);
  }, [currentPage]);

  // Auto-slide in modal
  useEffect(() => {
    if (!isOpen || !photos.length) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) =>
        prev + 1 < photos.length ? prev + 1 : 0
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [photos, isOpen]);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev + 1 < photos.length ? prev + 1 : 0
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : photos.length - 1
    );
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setCurrentPhotoIndex(0);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedItem(null);
      setCurrentPhotoIndex(0);
    }, 300);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  if (loading && gallery.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 bg-gray-50 min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Event Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our journey through impactful events and community initiatives
          </p>
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && gallery.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-block w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item, idx) => {
            const itemPhotos = getItemPhotos(item);
            const cover = itemPhotos[0];
            return (
            <motion.div
              key={item.id || item._id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => openModal(item)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-[420px]"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                {cover ? (
                  <img
                    src={cover}
                    alt={item.header || "Gallery"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {itemPhotos.length} Photos
                    </Badge>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-600 text-white">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    {itemPhotos.length}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 h-14">
                  {item.header}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (totalPages > 7) {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                  } else {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[95vh] w-full bg-white rounded-lg overflow-hidden p-0">
          {selectedItem && (
            <div className="flex flex-col h-full">
              <div className="relative bg-black">
                <div className="relative h-[60vh] flex items-center justify-center">
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-4 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-4 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-900" />
                      </button>
                    </>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={photos[currentPhotoIndex]}
                      src={photos[currentPhotoIndex]}
                      alt={selectedItem.header}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.4 }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </AnimatePresence>

                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </div>

                {photos.length > 1 && (
                  <div className="bg-black/50 backdrop-blur-sm px-4 py-3">
                    <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {photos.map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPhotoIndex(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentPhotoIndex
                              ? "border-emerald-500 scale-105"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white overflow-y-auto max-h-[35vh]">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedItem.header}
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">{selectedItem.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">
                      {new Date(selectedItem.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    {photos.length} Photos
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About This Event
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedItem.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}