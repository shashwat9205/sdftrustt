const partners = [
  { img: "about/part3.png", title: "Trusted global business partner", link: "https://nerfmtti.nic.in/" },
  { img: "about/part2.png", title: "Leading innovation solutions provider", link: "https://ilcs.co.in/" },
  { img: "about/part.png", title: "Reliable enterprise technology support", link: "https://csauk.ac.in/en" },
  { img: "about/part4.png", title: "Top quality service collaboration team", link: "https://asci-india.com/" },
  { img: "about/part3.png", title: "Strategic growth and scaling partner", link: "https://nerfmtti.nic.in/" },
  { img: "about/part2.png", title: "Advanced digital transformation experts", link: "https://ilcs.co.in/" },
  { img: "about/part.png", title: "High performance product development", link: "https://csauk.ac.in/en" },
  { img: "about/part4.png", title: "Global network and support system", link: "https://asci-india.com/" },
  { img: "about/part.png", title: "Efficient and scalable solutions provider", link: "https://csauk.ac.in/en" },
  { img: "about/part2.png", title: "Future-ready technology innovations", link: "https://ilcs.co.in/" },
  { img: "about/part3.png", title: "Trusted by multiple industries worldwide", link: "https://nerfmtti.nic.in/" },
  { img: "about/part4.png", title: "Delivering excellence and quality services", link: "https://asci-india.com/" },
];

const PartnersSection = () => {
  return (
    <section className="py-20 bg-[#F3EFE4]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        {/* Heading */}
        <h2 className="text-4xl font-serif mb-12 text-[#233520]">
          Our Partners & Supporters
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          
          {partners.map((partner, index) => (
            
            <a
              key={index}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
              flex flex-col items-center justify-center 
              transition-all duration-300 ease-in-out 
              hover:scale-105 hover:shadow-lg group"
            >
              {/* Logo */}
              <img
                src={partner.img}
                alt="partner"
                className="w-[80%] h-auto max-h-20 object-contain mb-4 
                transition-transform duration-300 group-hover:scale-110"
              />

              {/* Title */}
              <p className="text-sm font-bold text-gray-600 text-center leading-snug">
                {partner.title}
              </p>

            </a>

          ))}

        </div>
      </div>
    </section>
  );
};

export default PartnersSection;