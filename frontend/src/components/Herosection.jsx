import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

// 🎯 Extract YouTube ID
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
  const [heroCards, setHeroCards] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // 🔥 Fetch API
  useEffect(() => {
    const fetchHeroCard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hero.php?t=${Date.now()}`);
        const result = await res.json();

        if (result.status === "success" && Array.isArray(result.data)) {
          setHeroCards(result.data);

          // default video only once
          const firstVideo = getYoutubeId(result.data[0]?.youtube_link);
          if (firstVideo) setActiveVideo(firstVideo);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };

    fetchHeroCard();
  }, []);

  // 🔁 Auto Slide (ONLY slider move, video NOT change)
  useEffect(() => {
    if (heroCards.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroCards.length);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [heroCards]);

  // ⏸️ Hover Stop
  const handleMouseEnter = () => clearInterval(intervalRef.current);

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroCards.length);
    }, 3000);
  };

  return (
    <section className="relative bg-black overflow-hidden pb-32">

      {/* 🎥 FULL WIDTH VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeVideo && (
          <iframe
            className="w-full h-full absolute top-0 left-0 scale-125 pointer-events-none"
            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&mute=1&controls=0&loop=1&playlist=${activeVideo}`}
            title="Banner Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* 📝 CONTENT */}
      <div className="relative z-10 w-[95%] mx-auto min-h-150 flex items-center">
        <div className="max-w-2xl text-white pl-6 md:pl-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering Communities
          </h1>

          <p className="mb-6">
            Lorem ipsum dolor sit amet.
          </p>

          <Link
            to="/about"
            className="bg-green-600 px-6 py-3 rounded-full"
          >
            Learn More →
          </Link>
        </div>
      </div>

      {/* 🎯 3 ITEM SLIDER */}
      <div
        className="absolute bottom-24 left-0 w-full z-30 flex justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-6">

          {heroCards.length > 0 &&
            [-1, 0, 1].map((offset) => {
              const index =
                (currentIndex + offset + heroCards.length) %
                heroCards.length;

              const card = heroCards[index];
              const vid = getYoutubeId(card.youtube_link);

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (vid) {
                      setActiveVideo(vid); // ✅ ONLY HERE VIDEO CHANGE
                      setCurrentIndex(index);
                    }
                  }}
                  className={`cursor-pointer transition-all duration-500 rounded-xl overflow-hidden
                  ${
                    offset === 0
                      ? "scale-110 border-4 border-yellow-400 z-20"
                      : "scale-90 opacity-70"
                  }`}
                >
                  <img
                    src={`${ADMIN_BASE_URL}${card.image_url}`}
                    alt={card.title}
                    className="w-37.5 h-25 object-cover"
                  />
                </div>
              );
            })}

        </div>
      </div>

      {/* ✅ SVG */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none z-10">
        <svg
          className="w-full h-24 md:h-32 lg:h-40"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#F9F6EA"
            d="M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,149.3C672,128,768,128,864,149.3C960,171,1056,213,1152,229.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L0,320Z"
          />
        </svg>
      </div>

    </section>
  );
}

export default Herosection;