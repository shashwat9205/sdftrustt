import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";
import { useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Publications = () => {
  const location = useLocation();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 NEW GALLERY MODAL STATES
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${ADMIN_BASE_URL}${path}`;
  };

  // 🔥 Gallery Navigation Handlers
  const handlePrevImage = useCallback((e) => {
    e?.stopPropagation();
    if (!selectedAlbum) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selectedAlbum.length - 1 : prev - 1));
  }, [selectedAlbum]);

  const handleNextImage = useCallback((e) => {
    e?.stopPropagation();
    if (!selectedAlbum) return;
    setCurrentImageIndex((prev) => (prev === selectedAlbum.length - 1 ? 0 : prev + 1));
  }, [selectedAlbum]);

  // Keyboard navigation for the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedAlbum) return;
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape') setSelectedAlbum(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlbum, handlePrevImage, handleNextImage]);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/publications.php?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch publications");
        }
        const data = await response.json();
        if (data.status === "success") {
          setPublications(data.data);
        } else {
          throw new Error(data.message || "Error fetching publications");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return (
      <div className="bg-bg-color min-h-screen py-20 flex items-center justify-center">
        <div className="text-xl text-primary font-bold animate-pulse">
          Loading Publications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-color min-h-screen py-20 flex items-center justify-center">
        <div className="text-red-500 font-bold px-4 text-center">
            <p className="text-2xl mb-4">Oops! Something went wrong.</p>
            <p>{error}</p>
        </div>
      </div>
    );
  }

  const reports = publications.filter(p => p.type === 'report');
  const caseStudies = publications.filter(p => p.type === 'case_study');
  const galleries = publications.filter(p => p.type === 'gallery');

  return (
    <div className="bg-bg-color min-h-screen relative">
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Publications & Resources</h1>
          <p className="text-xl max-w-2xl mx-auto text-primary-50">Explore our annual reports, case studies, and gallery of impact-driven work.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Annual Reports */}
        <section id="annual-reports" className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-8">
             <span className="text-3xl">📊</span>
             <h2 className="text-3xl font-serif text-text-primary">Annual Reports</h2>
          </div>
          {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reports.map((report) => (
              <a href={getFullUrl(report.file_url)} target="_blank" rel="noreferrer" key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-red-50 text-red-500 rounded flex items-center justify-center font-bold">PDF</div>
                   <div>
                     <h3 className="font-bold text-text-primary">{report.title}</h3>
                     {report.file_size && <p className="text-sm text-gray-500">{report.file_size}</p>}
                   </div>
                 </div>
                 <button className="text-primary hover:text-secondary font-bold text-xl">↓</button>
              </a>
            ))}
          </div>
          ) : (
             <p className="text-gray-500">No annual reports available.</p>
          )}
        </section>

        {/* Case Studies */}
        <section id="case-studies" className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-8">
             <span className="text-3xl">📝</span>
             <h2 className="text-3xl font-serif text-text-primary">Case Studies</h2>
          </div>
          {caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {caseStudies.map((study) => (
               <div key={study.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 transition-transform flex flex-col">
                  <div className="h-40 bg-gray-200">
                    <img src={getFullUrl(study.image_url) || 'https://images.unsplash.com/photo-1544027993-37dbddc92582?q=80&w=400&auto=format&fit=crop'} alt={study.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 block">{study.category}</span>
                    <h3 className="font-bold text-text-primary mb-4 flex-1">{study.title}</h3>
                    {study.file_url ? (
                        <a href={getFullUrl(study.file_url)} target="_blank" rel="noreferrer" className="text-primary hover:text-[#5a6425] text-sm font-bold flex items-center gap-1 mt-auto">Read Study <span className="text-lg">→</span></a>
                    ) : null}
                  </div>
               </div>
             ))}
          </div>
          ) : (
             <p className="text-gray-500">No case studies available.</p>
          )}
        </section>

        {/* Gallery */}
        <section id="galleries" className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-8">
             <span className="text-3xl">🖼️</span>
             <h2 className="text-3xl font-serif text-text-primary">Photo Galleries</h2>
          </div>
          {galleries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {galleries.map((gallery) => (
               <div 
                  key={gallery.id} 
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer relative"
                  onClick={() => {
                    // Extract all sub-images if available, otherwise use cover image
                    const allImages = gallery.images && gallery.images.length > 0 
                      ? gallery.images.map(img => getFullUrl(img)) 
                      : [getFullUrl(gallery.image_url)];
                    
                    setSelectedAlbum(allImages);
                    setCurrentImageIndex(0);
                  }}
               >
                 <img src={getFullUrl(gallery.image_url)} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 
                 {/* Optional: Show icon if it has multiple images */}
                 {gallery.images && gallery.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">
                      1/{gallery.images.length}
                    </div>
                 )}

                 <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-3xl transition-opacity">👁️</span>
                 </div>
               </div>
             ))}
          </div>
          ) : (
             <p className="text-gray-500">No photo galleries available.</p>
          )}
        </section>

      </div>

      {/* 🔥 ADVANCED GALLERY MODAL */}
      {selectedAlbum && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedAlbum(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white text-4xl font-light transition-colors z-50"
            onClick={() => setSelectedAlbum(null)}
          >
            &times;
          </button>

          {/* Main Image Container */}
          <div className="relative flex items-center justify-center w-full max-w-5xl flex-1 max-h-[80vh]">
            
            {/* Prev Button (Only show if multiple images) */}
            {selectedAlbum.length > 1 && (
              <button 
                onClick={handlePrevImage}
                className="absolute left-0 md:-left-12 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 p-4 rounded-full backdrop-blur-sm transition-all z-50"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
            )}

            <motion.img 
              key={currentImageIndex} // forces re-render/animation on change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={selectedAlbum[currentImageIndex]} 
              alt={`Gallery Image ${currentImageIndex + 1}`} 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()} // Keep modal open when clicking image
            />

            {/* Next Button (Only show if multiple images) */}
            {selectedAlbum.length > 1 && (
              <button 
                onClick={handleNextImage}
                className="absolute right-0 md:-right-12 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 p-4 rounded-full backdrop-blur-sm transition-all z-50"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            )}
          </div>

          {/* Thumbnails (Only show if multiple images) */}
          {selectedAlbum.length > 1 && (
            <div 
              className="w-full max-w-3xl mt-6 flex gap-2 overflow-x-auto py-2 custom-scrollbar justify-start md:justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedAlbum.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative shrink-0 h-16 md:h-20 aspect-video rounded-md overflow-hidden transition-all duration-300 ${
                    currentImageIndex === idx ? 'ring-2 ring-white scale-105 opacity-100' : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Counter text */}
          {selectedAlbum.length > 1 && (
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-widest">
               {currentImageIndex + 1} / {selectedAlbum.length}
             </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Publications;