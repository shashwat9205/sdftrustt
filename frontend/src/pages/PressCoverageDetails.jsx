import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const BASE_URL = ADMIN_BASE_URL;

const makeImageUrl = (path) => {
  if (!path) {
    return "https://via.placeholder.com/1200x800?text=No+Image";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
};

const PressCoverageDetails = () => {
  const { slug } = useParams();

  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/press_coverage.php?t=${Date.now()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch press coverage details");
        }

        const data = await response.json();

        if (data.status !== "success") {
          throw new Error(data.message || "Could not load coverage data");
        }

        const foundCoverage = data.data.find((item) => item.slug === slug);

        if (!foundCoverage) {
          throw new Error("Coverage not found");
        }

        const imageUrl = makeImageUrl(foundCoverage.image);

        setCoverage({
          ...foundCoverage,
          image: imageUrl,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-color">
        <div className="text-xl font-bold text-primary animate-pulse">
          Loading details...
        </div>
      </div>
    );
  }

  if (error || !coverage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-color px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3 text-red-500">
            Press Coverage not found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The press coverage you are looking for does not exist."}
          </p>
          <Link
            to="/media#press"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-[#5a6425] transition-colors"
          >
            Back to Media & Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      
      {/* Article Header & Content Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-12">
        
        {/* Editorial Header */}
        <header className="mb-10 lg:mb-14 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6">
            <span className="inline-block bg-gray-100 text-gray-700 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider self-center md:self-auto">
              {coverage.tag || "Press Release"}
            </span>
            <span className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {coverage.datee || "Recently Published"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-gray-900 leading-tight mb-6">
            {coverage.title}
          </h1>
          
          {/* Subtle separator */}
          <div className="w-24 h-1 bg-primary mx-auto md:mx-0 rounded-full mt-8"></div>
        </header>

        {/* Featured Image */}
        {coverage.image && (
          <figure className="mb-12">
            <div className="w-full h-64 md:h-96 lg:h-120 rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={coverage.image}
                alt={`${coverage.title} cover feature`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/1200x800?text=Image+Not+Found";
                }}
              />
            </div>
            <figcaption className="text-center text-sm text-gray-400 mt-3 italic">
              Image via {coverage.tag || "Press Coverage"}
            </figcaption>
          </figure>
        )}

        {/* Article Body */}
        <div className="prose prose-lg md:prose-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary mx-auto max-w-3xl">
          {(coverage.para || "")
            .split("\n")
            .map((paragraph, index) => (
              <p key={index} className="mb-6">
                {/* Drop cap for first paragraph */}
                {index === 0 && paragraph.length > 0 ? (
                  <span className="float-left text-6xl font-serif font-bold text-primary mr-3 mt-2 leading-none">
                    {paragraph.charAt(0)}
                  </span>
                ) : null}
                {index === 0 && paragraph.length > 0 ? paragraph.slice(1) : paragraph}
              </p>
            ))}
        </div>

      </article>

      {/* Back Navigation Footer */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            to="/media#press"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-primary transition-colors font-bold tracking-wide group"
          >
            <span className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-primary group-hover:shadow-md transition-all">
              ←
            </span>
            Return to Media & Stories
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PressCoverageDetails;
