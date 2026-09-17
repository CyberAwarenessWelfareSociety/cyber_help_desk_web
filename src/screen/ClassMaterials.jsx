import { useGetMaterialsByClassQuery } from '@/store/api/class-material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, FileText, ImageIcon, Video, Music, File } from 'lucide-react';
import Header from '@/components/Home/Header';
// npm install lucide-react    (recommended for clean icons)

const ClassMaterials = () => {
  const { id } = useParams();
  const { data: materials = [], isLoading, isError, error } = useGetMaterialsByClassQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-lg text-gray-600 animate-pulse">Loading class materials...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-red-600">
        <div className="text-center">
          <p className="text-lg font-medium">Failed to load materials</p>
          <p className="text-sm mt-2">{error?.data?.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        <p className="text-lg">No materials uploaded for this class yet.</p>
      </div>
    );
  }

  const getMaterialIcon = (type = '') => {
    const t = type.toUpperCase();
    if (t === 'IMAGE') return <ImageIcon size={32} className="text-blue-600" />;
    if (t === 'VIDEO') return <Video size={32} className="text-red-600" />;
    if (t === 'AUDIO') return <Music size={32} className="text-purple-600" />;
    if (t === 'PDF')   return <FileText size={32} className="text-orange-600" />;
    return <File size={32} className="text-gray-600" />;
  };

  const openInNewTab = (url, title) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    // Optional: you could also track analytics here
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
        Class Materials
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {materials?.data?.map((material) => {
          const isImage = material.material_type?.toUpperCase() === 'IMAGE';

          return (
            <>
      <Header/>
            <div
              key={material.id}
              onClick={() => openInNewTab(material.url, material.title)}
              className={`
                group bg-white rounded-xl shadow-sm border border-gray-200 
                overflow-hidden cursor-pointer transition-all duration-200
                hover:shadow-xl hover:border-blue-200 active:scale-[0.98]
                mt-25
              `}
            >
              {/* Preview Area */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative">
                {isImage ? (
                  <img
                    src={material.url}
                    alt={material.title || 'Class material'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    {getMaterialIcon(material.material_type)}
                    <span className="mt-3 text-sm font-medium px-4 text-center">
                      {material.material_type || 'File'}
                    </span>
                  </div>
                )}

                {/* Hover overlay for images */}
                {isImage && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink size={36} className="text-white drop-shadow-lg" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.8rem] group-hover:text-blue-700 transition-colors">
                  {material.title || 'Untitled Material'}
                </h3>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium uppercase tracking-wide">
                    {material.material_type || 'Unknown'}
                  </span>
                  <time dateTime={material.createdAt}>
                    {new Date(material.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
                  </>
          );
        })}
      </div>
    </div>
  );
};

export default ClassMaterials;