import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

// Handle image URL
 
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

function Herosection() {
  const [heroCards, setHeroCards] = useState([]);

  // Fetch API for Hero Cards
  useEffect(() => {
    const fetchHeroCard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hero.php?t=${new Date().getTime()}`);
        const result = await res.json();

        if (result.status === "success" && result.data && Array.isArray(result.data)) {
          setHeroCards(result.data);
        }
      } catch (err) {
        console.error("Hero card fetch error:", err);
      }
    };

    fetchHeroCard();
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .animate-scroll-up {
            animation: scrollUp 20s linear infinite;
          }
          .animate-scroll-up:hover {
            animation-play-state: paused;
          }
        `}
      </style>
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
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg font-bold"
            >
              Learn More →
            </Link>
          </div>

          {/* 🔥 RIGHT SIDE YOUTUBE VIDEO */}
          <div className="hidden lg:flex absolute -right-2 lg:-right-4 xl:-right-6 top-1/2 -translate-y-1/2 w-[320px] lg:w-90 xl:w-95">
            <div className="w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-3 shadow-lg">

              <h3 className="text-white font-bold mb-3">Featured Video</h3>

              {/* FEATURES VIDEOS CARDS */}
              <div className="rounded-xl overflow-hidden relative group h-125 md:h-112.5 lg:h-125 w-full flex flex-col bg-black/10">
                {heroCards.length > 0 ? (
                  <div className="animate-scroll-up flex flex-col gap-4 w-full absolute top-0 left-0" style={{ padding: '0.75rem' }}>
                    {/* We duplicate the array to allow for a seamless infinite loop */}
                    {[...heroCards, ...heroCards].map((card, index) => (
                      <a
                        key={`${card.id}-${index}`}
                        href={card.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-40 shrink-0 relative rounded-xl overflow-hidden shadow-md group/card"
                      >
                        {/* Thumbnail Image */}
                        <img
                          src={makeImageUrl(card.image_url)}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                        />
                        {/* Overlay & Title */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                          <h4 className="text-white font-serif text-sm md:text-base font-bold leading-tight drop-shadow-md">
                            {card.title}
                          </h4>
                        </div>
                        {/* Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-xl transition-colors backdrop-blur-sm">
                            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-white text-center flex-1 w-full bg-black/20 flex items-center justify-center">
                    <span>No videos available</span>
                  </div>
                )}
              </div>
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
    </>
  );
}

export default Herosection;