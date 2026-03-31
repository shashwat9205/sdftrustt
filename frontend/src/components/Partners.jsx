import { useEffect, useRef, useState } from "react";

const partners = [
  "about/part3.png",
  "about/part2.png",
  "about/part.png",
  "about/part3.png",
  "about/part4.png",
  "about/part3.png",
  "about/part2.png",
  "about/part.png",
  "about/part3.png",
  "about/part4.png",
  "about/part.png",
  "about/part2.png",
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
                className="group flex items-center justify-center p-4 transition-all duration-500"
              >
                {/* IMAGE CONTAINED */}
                <img
                  src={logo}
                  alt="partner"
                  className="w-full h-32 object-contain transition-all duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
                />
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default PartnersSection;