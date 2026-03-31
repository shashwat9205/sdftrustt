import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/projects.php`;

// Handle image URL
// eslint-disable-next-line no-unused-vars
const makeImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/600x300?text=No+Image";

  if (typeof path !== "string") {
    return "https://via.placeholder.com/600x300?text=No+Image";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${ADMIN_BASE_URL}${path.replace(/^\/+/, "")}`;
};

// Extract YouTube Video ID
const getYoutubeId = (url) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    return null;
  } catch {
    return null;
  }
};

function Herosection() {
  const [videoId, setVideoId] = useState(null);

  // Fetch API for YouTube video
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const firstProject = Array.isArray(data)
          ? data[0]
          : data?.data?.[0];

        if (firstProject?.youtube) {
          const id = getYoutubeId(firstProject.youtube);
          setVideoId(id);
        }
      } catch (err) {
        console.error("Video fetch error:", err);
      }
    };

    fetchVideo();
  }, []);

  return (
    <section className="relative bg-[#F9F6EA] overflow-hidden pb-20 md:pb-28">

      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/banner/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-[95%] mx-auto min-h-150 md:min-h-175 flex items-center">

        {/* LEFT CONTENT */}
        <div className="max-w-2xl text-white pl-6 md:pl-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-yellow-400 to-green-500">
              Empowering
            </span>{" "}
            Communities, <br />
            Sustaining the Future
          </h1>

          <p className="mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <Link
            to="/about"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full shadow-lg"
          >
            Learn More →
          </Link>
        </div>

        {/* 🔥 RIGHT SIDE YOUTUBE VIDEO */}
        <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 w-100">
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-3 shadow-lg">

            <h3 className="text-white font-bold mb-3">Featured Video</h3>

            {/* VIDEO */}
            <div className="rounded-xl overflow-hidden">
              {videoId ? (
                <iframe
                  className="w-full h-55"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-white text-center py-10">
                  No video available
                </div>
              )}
            </div>

            {/* BUTTON */}
            {videoId && (
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                Watch on YouTube →
              </a>
            )}
          </div>
        </div>

      </div>

      {/* SVG */}
      <div className="absolute -bottom-6 md:-bottom-10 w-full overflow-hidden leading-none z-10">
        <svg
          className="w-full h-24 md:h-32 lg:h-40"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#F9F6EA"
            d="M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,149.3C672,128,768,128,864,149.3C960,171,1056,213,1152,229.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default Herosection;