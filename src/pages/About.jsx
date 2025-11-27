import { useState, useEffect } from "react";
import { aboutAPI } from "../services/api";

// Import components
import AboutStats from "../components/AboutStats";
import CoreValues from "../components/CoreValues";
import Gallery from "../components/Gallery";
import InsightBlocks from "../components/InsightBlocks";
import OurStory from "../components/OurStory";
import Team from "../components/Team";
import Testimonials from "../components/Testimonials";
import EmpressNavbar from "../components/EmpressNavbar";
import Footer from "../components/Footer";
import CombinedAboutComponent from "../components/CombinedAboutComponent";

export default function About() {
  const [aboutData, setAboutData] = useState({
    galleryItems: [],
    teamMembers: [],
    stats: [],
    coreValues: [],
    testimonials: [],
    companyInfo: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const data = await aboutAPI.getAboutPageData();
      setAboutData(data.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching about data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading about page: {error}</p>
          <button 
            onClick={fetchAboutData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
        <EmpressNavbar />
      <OurStory companyInfo={aboutData.companyInfo} />
      <CombinedAboutComponent />
      {/* <AboutStats stats={aboutData.stats} /> */}
      {/* <InsightBlocks /> */}
      <CoreValues coreValues={aboutData.coreValues} />
      <Gallery galleryItems={aboutData.galleryItems} />
      <Testimonials testimonials={aboutData.testimonials} />
      <Team teamMembers={aboutData.teamMembers} />
      <Footer />
    </div>
  );
}