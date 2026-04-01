import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

// 🔥 Added Video Checker Helper
const isVideoFile = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)$/i.test(url);
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects.php?t=${Date.now()}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setProjects(data.data);
        } else {
          setError(data.message || 'Failed to fetch projects');
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Could not connect to the database API. Check if your PHP server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-bg-color min-h-screen pb-20">
       {/* Hero / Ongoing Projects */}
       <section id="ongoing" className="bg-accent text-white py-20 relative overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Ongoing Projects</h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-50">Discover our active interventions and on-ground activities across various geographies.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Project Highlights */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🏢</span>
            <h2 className="text-3xl font-serif text-text-primary">Featured Active Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoading ? (
               <div className="col-span-2 py-12 text-center text-gray-500 flex flex-col items-center">
                 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                 Loading active projects from database...
               </div>
            ) : error ? (
               <div className="col-span-2 py-8 px-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                 ⚠️ {error}
               </div>
            ) : projects.length === 0 ? (
               <div className="col-span-2 py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                 No active projects found at the moment.
               </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                  
                  {/* 🔥 UPDATED MEDIA RENDERER */}
                  {isVideoFile(project.image_url) ? (
                    <video 
                      src={`${ADMIN_BASE_URL}${project.image_url.replace(/^\/+/, '')}`} 
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                      autoPlay loop muted playsInline
                    />
                  ) : (
                    <img 
                      src={`${ADMIN_BASE_URL}${project.image_url.replace(/^\/+/, '')}`} 
                      alt={project.title} 
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image" }}
                    />
                  )}

                  <div>
                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{project.category}</div>
                    <h3 className="text-2xl font-serif font-bold text-text-primary mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span className="text-base mr-1">📍</span> {project.location}
                    </div>
                    <Link to={`/projectdetails/${project.slug}`} className="inline-block bg-primary hover:bg-[#5a6425] text-white px-5 py-2 rounded font-medium text-sm transition-colors text-center">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Projects;