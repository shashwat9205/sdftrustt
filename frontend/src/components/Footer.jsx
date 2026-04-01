import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">

      {/* 🔥 FULL WIDTH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[35%_65%]">

        {/* 🤍 LEFT SIDE (MORE PADDING ADDED) */}
        <div className="bg-white text-black px-12 md:px-16 py-10">
          <div className="max-w-md mx-auto">

            <img
              className="mb-4 w-40"
              src="/logo/logo.png"
              alt="logo"
            />

            <p className="text-gray-700 mb-6 text-sm leading-relaxed">
              Empowering communities and sustaining the future through
              integrated development programs across health, education, and
              environment.
            </p>

            <div className="flex space-x-4">
              <a className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                f
              </a>
              <a className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                𝕏
              </a>
              <a className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                in
              </a>
            </div>

          </div>
        </div>

        {/* 🎨 RIGHT SIDE */}
        <div className="bg-primary px-8 py-10">
          <div className="max-w-5xl mx-auto">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/programs">Our Programs</Link></li>
                  <li><Link to="/projects">Ongoing Projects</Link></li>
                  <li><Link to="/impact">Impact & Evidence</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>

              {/* Programs */}
              <div>
                <h4 className="text-lg font-bold mb-4">Our Programs</h4>
                <ul className="space-y-3 text-sm">
                  <li>Health & Nutrition</li>
                  <li>Education & Child Care</li>
                  <li>Women Empowerment</li>
                  <li>Agriculture & Climate</li>
                  <li>Environment & WASH</li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-lg font-bold mb-4">Contact Information</h4>
                <ul className="space-y-4 text-sm">
                  <li>📍 123 Development Avenue</li>
                  <li>📞 +1 (555) 123-4567</li>
                  <li>✉️ contact@sdfoundation.org</li>
                </ul>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* 🔻 BOTTOM STRIP WITH LINK */}
      <div className="bg-primary border-t border-white/20 text-center text-xs text-gray-200 py-4">
        © {new Date().getFullYear()} Sustainable Development Foundation. All rights reserved ||{" "}
        
        <a
          href="https://hrntechsolutions.com"  // 👉 apna link yaha daalo
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline"
        >
          Digital Creators
        </a>

      </div>

    </footer>
  );
};

export default Footer;