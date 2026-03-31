import { useEffect, useRef, useState } from "react";

const partners = [
  "about/news4.png",
  "about/news.png",
  "about/news1.png",
  "about/news3.png",
  "about/news1.png",
  "about/news3.png",
  "about/news.png",
  "about/news4.png",
  "about/news3.png",
  "about/news1.png",
  "about/news4.png",
  "about/news.png",
];

const PartnersSection = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-15 bg-[#F3EFE4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">

        <h2 className="text-4xl font-serif mb-12 text-[#233520]">
          Our Partners
        </h2>

        {/* 🔥 MAIN ANIMATION WRAPPER */}
        <div
          className={`transition-all duration-2000 ease-in ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-20 scale-90"
          }`}
        >

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {partners.map((logo, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-800"
              >
                {/* IMAGE FULL COVER */}
                <img
                  src={logo}
                  alt="partner"
                  className="w-full h-42 object-cover transition-all duration-500 group-hover:scale-110"
                />

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-500"></div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default PartnersSection;