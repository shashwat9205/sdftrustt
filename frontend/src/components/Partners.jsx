// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// 🔥 UPDATED: Now an array of objects holding the image and its specific link
const partners = [
  { img: "about/part3.png", link: "https://nerfmtti.nic.in/" },
  { img: "about/part2.png", link: "https://ilcs.co.in/" },
  { img: "about/part.png", link: "https://csauk.ac.in/en" },
  { img: "about/part3.png", link: "https://nerfmtti.nic.in/" },
  { img: "about/part4.png", link: "https://asci-india.com/" },
  { img: "about/part3.png", link: "https://nerfmtti.nic.in/" },
  { img: "about/part2.png", link: "https://ilcs.co.in/" },
  { img: "about/part.png", link: "https://csauk.ac.in/en" },
  { img: "about/part3.png", link: "https://nerfmtti.nic.in/" },
  { img: "about/part4.png", link: "https://asci-india.com/" },
  { img: "about/part.png", link: "https://csauk.ac.in/en" },
  { img: "about/part2.png", link: "https://ilcs.co.in/" },
];

// Split the 12 logos into 6 unique arrays (2 logos per column)
const splitIntoColumns = (arr, numCols) => {
  const cols = Array.from({ length: numCols }, () => []);
  arr.forEach((item, index) => {
    cols[index % numCols].push(item);
  });
  return cols;
};

const columnsData = splitIntoColumns(partners, 6);

const PartnersSection = () => {
  return (
    <section className="py-20 bg-[#F3EFE4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-serif mb-12 text-[#233520] relative z-10">
          Our Partners & Supporters
        </h2>

        {/* 🔥 INFINITE SCROLL MASONRY WRAPPER */}
        <div className="relative h-112.5 overflow-hidden">
          {/* Top/Bottom Fade Gradients (for smooth clipping) */}
          <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-[#F3EFE4] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#F3EFE4] to-transparent z-10 pointer-events-none"></div>

          {/* 6-Column CSS Grid (shrinks to 3 on md, 2 on sm) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 h-full absolute inset-0">
            {columnsData.map((colItems, colIndex) => {
              // Duplicate the initial 2 unique items into a massive 12-item loop array
              // so there is zero chance the container runs out of logos during scroll
              const loopItems = Array(6).fill(colItems).flat();

              // Alternating Scroll Logic
              const isEven = colIndex % 2 === 0;
              const yAnimation = isEven ? ["0%", "-50%"] : ["-50%", "0%"];

              return (
                <div key={colIndex} className="relative h-full overflow-visible">
                  <motion.div
                    animate={{ y: yAnimation }}
                    transition={{
                      repeat: Infinity,
                      ease: "linear",
                      // Adjust speed based on whether they go up/down to create chaos, or lock it uniformly?
                      // We'll lock it uniformly at 20s for elegant professional pacing
                      duration: 25,
                    }}
                    className="flex flex-col gap-10 absolute left-0 right-0 w-full"
                  >
                    {loopItems.map((partner, index) => (
                      <div
                        key={`${colIndex}-${index}`}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center shrink-0 w-full aspect-4/3 hover:shadow-md transition-shadow group"
                      >
                        {/* 🔥 UPDATED: Wrapped the image in an anchor tag */}
                        <a 
                          href={partner.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center h-full"
                        >
                          <img
                            src={partner.img}
                            alt="partner"
                            // Full color, vivid sizing! Added hover effect.
                            className="w-[80%] h-auto max-h-25 object-contain group-hover:scale-105 transition-transform"
                          />
                        </a>
                      </div>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;