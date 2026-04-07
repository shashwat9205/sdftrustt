import { useEffect, useState } from "react";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom"; // 🔥 NEW

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 TAB STATE
  const [activeTab, setActiveTab] = useState("annual-reports");

  const location = useLocation(); // 🔥 NEW

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${ADMIN_BASE_URL}${path}`;
  };

  // 🔥 NEW: HANDLE HASH (MAIN FIX)
  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace("#", "");

      // Only allow valid tabs
      if (["annual-reports", "case-studies", "galleries"].includes(tab)) {
        setActiveTab(tab);
      }
    } else {
      setActiveTab("annual-reports"); // default
    }
  }, [location]);

  // FETCH DATA
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/publications.php?t=${Date.now()}`);
        const data = await response.json();

        if (data.status === "success") {
          setPublications(data.data);
        } else {
          throw new Error(data.message);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const reports = publications.filter((p) => p.type === "report");
  const caseStudies = publications.filter((p) => p.type === "case_study");
  const galleries = publications.filter((p) => p.type === "gallery");

  return (
    <div className="bg-bg-color min-h-screen">

      {/* HEADER */}
      <section className="bg-primary text-white py-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4"
        >
          Publications & Resources
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Explore our reports, case studies and gallery.
        </motion.p>
      </section>

      {/* TABS */}
      {/* TABS */}
<section className="border-b sticky top-20 bg-white z-40">
  {/* I recommend changing max-w-xl to max-w-7xl to match your other pages */}
  <div className="max-w-7xl mx-auto px-4"> 
    
    {/* ADD 'justify-center' HERE 👇 */}
    <div className="flex justify-center space-x-8 overflow-x-auto no-scrollbar">

      {[
        { id: "annual-reports", label: "Reports 📊" },
        { id: "case-studies", label: "Case Studies 📝" },
        { id: "galleries", label: "Gallery 🖼️" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            window.history.replaceState(null, "", `#${tab.id}`);
          }}
          className={`py-4 border-b-2 font-bold whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}

    </div>
  </div>
</section>
      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* REPORTS */}
        {activeTab === "annual-reports" && (
          <div className="grid md:grid-cols-3 gap-6">
            {reports.map((r) => (
              <a
                key={r.id}
                href={getFullUrl(r.file_url)}
                target="_blank"
                rel="noreferrer"
                className="bg-white p-6 rounded-xl shadow hover:shadow-md"
              >
                <h3 className="font-bold">{r.title}</h3>
              </a>
            ))}
          </div>
        )}

        {/* CASE STUDIES */}
        {activeTab === "case-studies" && (
          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((c) => (
              <div key={c.id} className="bg-white rounded-xl overflow-hidden shadow">
                <img
                  src={getFullUrl(c.image_url)}
                  alt={c.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{c.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GALLERY */}
        {activeTab === "galleries" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleries.map((g) => (
              <div key={g.id} className="overflow-hidden rounded-lg">
                <img
                  src={getFullUrl(g.image_url)}
                  alt="gallery"
                  className="w-full h-full object-cover hover:scale-110 transition"
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Publications;