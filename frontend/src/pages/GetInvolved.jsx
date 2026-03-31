import { useEffect, useState } from "react";
import { useLocation , Link } from "react-router-dom";
import { API_BASE_URL, ADMIN_BASE_URL } from "../config";

const staticFunds = [
  {
    id: 1,
    title: "Community Development Fund",
    description: "Support our grassroots initiatives empowering local communities and restoring critical rural infrastructure.",
    location: "Pan-India",
    donate_link: "/donate"
  },
  {
    id: 2,
    title: "Emergency Water Relief Fund",
    description: "Provide immediate assistance to drought-affected regions by funding water pipelines and resources.",
    location: "Affected Regions",
    donate_link: "/donate"
  },
  {
    id: 3,
    title: "Women's Education Endowment",
    description: "Fund full-ride scholarships for girls in marginalized communities to pursue vocational and higher education.",
    location: "Urban & Rural Centers",
    donate_link: "/donate"
  }
];

const GetInvolved = () => {

  
  const location = useLocation(); // 2. Define location here
  const [careersList, setCareersList] = useState([]);
  const [careersLoading, setCareersLoading] = useState(true);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/careers.php`);
        const data = await response.json();
        if (data.status === 'success') {
          setCareersList(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch careers:", error);
      } finally {
        setCareersLoading(false);
      }
    };
    fetchCareers();
  }, []);

  return (
    <div className="bg-bg-color min-h-screen pb-24">
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get Involved</h1>
          <p className="text-xl max-w-2xl mx-auto">Be a part of our movement. There are many ways to contribute your time, skills, and passion.</p>
        </div>
     </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Volunteer */}
        <section id="volunteer" className="mb-24 scroll-mt-32">
           <div className="flex flex-col md:flex-row gap-12 items-center">
             <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-sm h-96 relative">
               <img src="about/vol.png" alt="Volunteer" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent flex items-end p-8">
                 <h2 className="text-4xl text-white font-serif font-bold tracking-wide">Volunteer With Us</h2>
               </div>
             </div>
             <div className="w-full md:w-1/2 space-y-6">
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  Volunteering is the ultimate exercise in democracy. You vote in elections once a year, but when you volunteer, you vote every day about the kind of community you want to live in. Join our grassroots programs and make a tangible difference on the ground.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                   <div className="bg-white p-4 rounded border border-gray-100 shadow-sm flex items-center gap-3">
                     <span className="text-2xl">🌱</span> <span className="font-bold text-text-primary">Field Volunteer</span>
                   </div>
                   <div className="bg-white p-4 rounded border border-gray-100 shadow-sm flex items-center gap-3">
                     <span className="text-2xl">💻</span> <span className="font-bold text-text-primary">Remote Skill-Based</span>
                   </div>
                </div>
                              <Link 
                to="/volunteerform" /* Change this to the exact path of your page */
                className="bg-primary hover:bg-[#5a6425] text-white px-8 py-4 rounded-full font-bold shadow-md hover:-translate-y-1 transition-all mt-6 inline-block"
              >
                Apply to Volunteer
              </Link>
             </div>
           </div>
        </section>

        {/* Careers */}
        <section id="careers" className="scroll-mt-32">
           <div className="text-center mb-12">
             <span className="text-4xl mb-4 block animate-float">💼</span>
             <h2 className="text-3xl font-serif text-text-primary mb-4">Careers</h2>
             <p className="text-gray-500 max-w-2xl mx-auto">Join our core team of passionate professionals dedicated to driving sustainable development across the country.</p>
           </div>
           
           <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-4xl mx-auto">
             {careersLoading ? (
               <div className="p-6 text-center text-gray-500">Loading career opportunities...</div>
             ) : careersList.length > 0 ? (
               careersList.map(career => (
                 <div key={career.id} className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                   <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{career.title}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-2"><span className="text-base">📍</span> {career.location}</p>
                      {career.pdf_url && (
                        <a href={`${ADMIN_BASE_URL}${career.pdf_url.startsWith('/') ? career.pdf_url : '/' + career.pdf_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium mt-1 inline-block"><span className="mr-1">📄</span> View Job Description</a>
                      )}
                   </div>
                   <a href={career.apply_link} target="_blank" rel="noopener noreferrer" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-full font-bold transition-colors">Apply Now</a>
                 </div>
               ))
             ) : (
               <div className="p-6 text-center text-gray-500">There are no open positions at this time.</div>
             )}
           </div>
        </section>

        {/* Funds */}
        <section id="funds" className="mt-32 scroll-mt-32">
           <div className="text-center mb-12">
             <span className="text-4xl mb-4 block animate-float">🌱</span>
             <h2 className="text-3xl font-serif text-text-primary mb-4">Active Funds</h2>
             <p className="text-gray-500 max-w-2xl mx-auto">Direct your contribution exactly where it matters. Choose a specific fund to support the causes you care about most.</p>
           </div>
           
           <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-4xl mx-auto">
             {staticFunds.map(fund => (
               <div key={fund.id} className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-gray-50 transition-colors">
                 <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-1">{fund.title}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-2 mb-2"><span className="text-base">📍</span> {fund.location}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{fund.description}</p>
                 </div>
                 <a href={fund.donate_link} className="shrink-0 border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-bold transition-all hover:shadow-md">Contribute</a>
               </div>
             ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default GetInvolved;
