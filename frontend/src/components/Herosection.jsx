import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchHeroCard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hero.php?t=${Date.now()}`);
        const result = await res.json();

        if (result.status === "success" && Array.isArray(result.data)) {
          setHeroCards(result.data);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };

    fetchHeroCard();
  }, []);

  useEffect(() => {
    if (heroCards.length === 0) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroCards.length);
    }, 5000); // 🔥 smoother UX

    return () => clearInterval(intervalRef.current);
  }, [heroCards]);

  const handleMouseEnter = () => clearInterval(intervalRef.current);

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroCards.length);
    }, 5000);
  };

  const activeVideo = getYoutubeId(
    heroCards[activeIndex]?.youtube_link
  );

  return (
    <section className="relative bg-black overflow-hidden pb-32">

      {/* 🎥 VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {activeVideo ? (
          <iframe
            key={activeVideo} // 🔥 important for rerender
            className="absolute top-1/2 left-1/2 w-screen h-[56.25vw] min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&mute=1&controls=0&loop=1&playlist=${activeVideo}`}
            title="Banner Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 bg-gray-900"></div>
        )}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      
      <div className="relative z-10 w-[95%] mx-auto min-h-150 flex items-center">
        <div className="max-w-2xl text-white pl-6 md:pl-10">

          
          <div key={activeIndex} className="animate-fadeSlide">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              {heroCards[activeIndex]?.title || "Loading..."}
            </h1>

            <p className="mb-8 text-gray-200 drop-shadow-md text-lg leading-relaxed">
              {heroCards[activeIndex]?.description || ""}
            </p>
          </div>

          <Link
            to="/about"
            className="bg-green-600 hover:bg-green-500 transition-colors px-8 py-3.5 rounded-full font-bold shadow-lg inline-block"
          >
            Learn More →
          </Link>
        </div>
      </div>

      
      <div
        className="absolute bottom-24 left-0 w-full z-30 flex justify-center items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-center gap-8 md:gap-24 w-full px-4">

          {heroCards.length > 0 &&
            [-1, 0, 1].map((offset) => {

              const index = (activeIndex + offset + heroCards.length) % heroCards.length;
              const card = heroCards[index];

              let curveClasses = "";
              if (offset === 0) {
                curveClasses = "scale-110 md:scale-125 border-[3px] md:border-4 border-yellow-400 z-30 opacity-100 shadow-2xl translate-y-6 md:translate-y-8";
              } else if (offset === -1) {
                curveClasses = "scale-95 opacity-65 z-20 hover:opacity-100 shadow-lg translate-y-12 -rotate-6";
              } else if (offset === 1) {
                curveClasses = "scale-95 opacity-65 z-20 hover:opacity-100 shadow-lg translate-y-12 rotate-6";
              }

              return (
                <div
                  key={`${index}-${offset}`}
                  onClick={() => setActiveIndex(index)}
                  className={`cursor-pointer transition-all duration-500 ease-out rounded-xl overflow-hidden bg-black/20 ${curveClasses}`}
                >
                  <img
                    src={`${ADMIN_BASE_URL}${card?.image_url}`}
                    alt={card?.title || "Thumbnail"}
                    className="w-28 md:w-36 aspect-video object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150x100?text=No+Image";
                    }}
                  />
                </div>
              );
            })}
        </div>
      </div>

      {/* 🌊 SVG */}
      <div className="absolute -bottom-20 md:-bottom-12 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          className="w-full h-24 md:h-32 lg:h-40"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#F9F6EA"
            d="M0,160 L48,176 C96,192,192,224,288,218.7C384,213,480,171,576,149.3C672,128,768,128,864,149.3C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L0,320Z"
          />
        </svg>
      </div>

    </section>
  );
}

export default Herosection;